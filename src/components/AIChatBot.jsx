import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS_DATA } from "../data/projectsData";

// Drop-in replacement for your original AIChatBot.jsx.
// Your existing Tailwind classes and material-symbols icons are retained.
// IMPORTANT: Gemini credentials are NEVER stored or requested in the browser.
const INITIAL_MSG = {
  role: "model",
  text: "Hi! I'm Indrajeet's AI Assistant. Ask me about his experience, skills, selected work or how to get in touch.",
};
const SUGGESTIONS = [
  { label: "Selected Works 🚀", prompt: "Which projects are listed in Indrajeet's Selected Works?" },
  { label: "Top Skills 💻", prompt: "What are Indrajeet's strongest front-end skills?" },
  { label: "Experience 🎓", prompt: "Tell me about Indrajeet's experience and qualifications." },
  { label: "Contact 📍", prompt: "How can I get in touch with Indrajeet?" },
];

const isChatMessage = (m) =>
  m && (m.role === "user" || m.role === "model") &&
  typeof m.text === "string" && m.text.length <= 4000;

function getPublicPortfolioSummary() {
  // Read visible content only. The backend treats this as unverified page context.
  if (typeof document === "undefined") return "";
  const root = document.body.cloneNode(true);
  root.querySelector("#ai-chatbot-root")?.remove();
  root.querySelectorAll("script,style,nav,form,button,input,textarea").forEach((el) => el.remove());
  const sections = [...root.querySelectorAll("main section, section, main article")];
  const seen = new Set();
  const chunks = [];
  for (const section of sections) {
    const text = (section.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length < 25 || seen.has(text)) continue;
    seen.add(text);
    chunks.push(`${section.id ? `[Section: ${section.id}] ` : ""}${text.slice(0, 1300)}`);
  }
  return (chunks.join("\n---\n") || (root.querySelector("main")?.textContent || "").replace(/\s+/g, " "))
    .slice(0, 8500);
}

function findPortfolioSection(query) {
  const q = query.toLowerCase();
  const groups = [
    { words: ["project", "selected work", "portfolio", "प्रोजेक्ट"], ids: ["projects", "work", "selected-works", "portfolio"] },
    { words: ["skill", "tech", "stack", "स्किल"], ids: ["skills", "skill", "technologies"] },
    { words: ["contact", "hire", "email", "संपर्क"], ids: ["contact", "connect", "hire"] },
    { words: ["about", "experience", "qualification", "अनुभव"], ids: ["about", "experience"] },
  ];
  for (const group of groups) {
    if (!group.words.some((word) => q.includes(word))) continue;
    for (const id of group.ids) {
      const el = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
      if (el) return el;
    }
  }
  return null;
}

function getActionType(query) {
  const q = query.toLowerCase();
  if (["contact", "email", "phone", "call", "hire", "संपर्क"].some((x) => q.includes(x))) return "contact_card";
  if (["project", "selected work", "github", "प्रोजेक्ट"].some((x) => q.includes(x))) return "project_card";
  return null;
}

function sanitizeSpeech(text) {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\*_`#~•]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Browser SpeechSynthesis fallback should pronounce the name the same way
// as natural Gemini voice. The visible chat text remains correctly spelled Sah.
function browserSpeechPronunciation(text, useHindi) {
  return sanitizeSpeech(text)
    .replace(/इंद्रजीत\s+कुमार\s+(?:शाह|सह|साह)/g, "इंद्रजीत कुमार साह")
    .replace(/\bIndrajeet\s+Kumar\s+(?:Sah|Shah)\b/gi,
      useHindi ? "इंद्रजीत कुमार साह" : "Indrajeet Kumar Saah")
    .replace(/\bIndrajeet\s+(?:Sah|Shah)\b/gi,
      useHindi ? "इंद्रजीत साह" : "Indrajeet Saah")
    .replace(/\bSah\b/gi, useHindi ? "साह" : "Saah");
}


// Find a featured project only when the visitor asks to navigate to that project.
function detectProjectNavigation(message) {
  const normalize = (value) => value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const query = normalize(message);
  const navigationVerbs = [
    'show', 'open', 'find', 'scroll', 'highlight', 'take me',
    'go to', 'navigate', 'dikhao', 'dikha', 'kholo',
    'दिखाओ', 'दिखाइए', 'खोलो', 'दिखाएं', 'दिखा दो'
  ];
  if (!navigationVerbs.some((word) => query.includes(normalize(word)))) return null;

  return PROJECTS_DATA.find((project) =>
    query.includes(normalize(project.title))
  ) || null;
}

function navigateToRequestedProject(message) {
  const project = detectProjectNavigation(message);
  if (!project) return false;
  window.dispatchEvent(new CustomEvent('portfolio:focus-project', {
    detail: { projectId: project.id }
  }));
  return true;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // opt-in: no surprise speech
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceConversation, setVoiceConversation] = useState(false); // opt-in turn-based voice conversation
  const [speechLanguage, setSpeechLanguage] = useState("en-IN");
  const [voiceEngine, setVoiceEngine] = useState("natural"); // opt-in voice output uses Gemini TTS; browser voice is fallback
  const [statusNote, setStatusNote] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const parsed = JSON.parse(sessionStorage.getItem("indrajeet_chat_history") || "null");
      return Array.isArray(parsed) && parsed.length <= 40 && parsed.every(isChatMessage) && parsed.length
        ? parsed : [INITIAL_MSG];
    } catch { return [INITIAL_MSG]; }
  });

  const chatBottomRef = useRef(null);
  const chipsRef = useRef(null);
  const recognitionRef = useRef(null);
  const busyRef = useRef(false);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);
  const activeRequestRef = useRef(null);
  const voicesRef = useRef([]);
  const voiceEnabledRef = useRef(voiceEnabled);
  const languageRef = useRef(speechLanguage);
  const voiceEngineRef = useRef(voiceEngine);
  const naturalAudioRef = useRef(null);
  const naturalUrlRef = useRef(null);
  const ttsRequestRef = useRef(null);
  const voiceConversationRef = useRef(false);
  const voicePlaybackIdRef = useRef(0);
  const recognitionSessionRef = useRef(0);
  const voiceCycleTimerRef = useRef(null);
  const startListeningRef = useRef(null);
  const handleSendRef = useRef(null);
  const stopVoiceConversationRef = useRef(null);
  const isOpenRef = useRef(isOpen);
  const utteranceRef = useRef(null);

  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { languageRef.current = speechLanguage; }, [speechLanguage]);
  useEffect(() => { voiceEngineRef.current = voiceEngine; }, [voiceEngine]);

  useEffect(() => {
    mountedRef.current = true;
    if (!("speechSynthesis" in window)) return () => { mountedRef.current = false; };
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      mountedRef.current = false;
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      voiceConversationRef.current = false;
      clearTimeout(voiceCycleTimerRef.current);
      window.speechSynthesis.cancel();
      ttsRequestRef.current?.abort();
      naturalAudioRef.current?.pause();
      if (naturalUrlRef.current) URL.revokeObjectURL(naturalUrlRef.current);
      recognitionRef.current?.abort?.();
      activeRequestRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem("indrajeet_chat_history", JSON.stringify(messages.slice(-40))); } catch {}
  }, [messages]);

  const stopAllAudio = () => {
    // Abort any in-flight TTS request, release audio, invalidate prior onended events.
    voicePlaybackIdRef.current += 1;
    ttsRequestRef.current?.abort();
    ttsRequestRef.current = null;
    if (naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      naturalAudioRef.current.onended = null;
      naturalAudioRef.current.onerror = null;
      naturalAudioRef.current = null;
    }
    if (naturalUrlRef.current) URL.revokeObjectURL(naturalUrlRef.current);
    naturalUrlRef.current = null;
    utteranceRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (mountedRef.current) setIsSpeaking(false);
  };

  const stopVoiceConversation = (message = "") => {
    voiceConversationRef.current = false;
    setVoiceConversation(false);
    clearTimeout(voiceCycleTimerRef.current);
    recognitionSessionRef.current += 1;
    try { recognitionRef.current?.abort?.(); } catch {}
    recognitionRef.current = null;
    setIsListening(false);
    stopAllAudio();
    if (message) setStatusNote(message);
  };
  stopVoiceConversationRef.current = stopVoiceConversation;

  useEffect(() => {
    isOpenRef.current = isOpen;
    window.dispatchEvent(new CustomEvent("chatStateChange", { detail: isOpen }));
    if (!isOpen) {
      voiceConversationRef.current = false;
      clearTimeout(voiceCycleTimerRef.current);
      recognitionSessionRef.current += 1;
      try { recognitionRef.current?.abort?.(); } catch {}
      stopAllAudio();
    }
  }, [isOpen]);

  useEffect(() => {
    const el = chipsRef.current;
    if (!el || !isOpen || isHovered) return;
    let direction = 1;
    const timer = setInterval(() => {
      if (el.scrollWidth <= el.clientWidth + 2) return;
      el.scrollLeft += direction * 0.8;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) direction = -1;
      else if (el.scrollLeft <= 0) direction = 1;
    }, 30);
    return () => clearInterval(timer);
  }, [isOpen, isHovered]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, loading]);

  // Voice turn completes only when the *audio playback* ends, never when
  // Gemini finishes producing the text. That avoids mic feedback/echo.
  const finishSpokenTurn = (playbackId) => {
    if (!mountedRef.current || playbackId !== voicePlaybackIdRef.current) return;
    setIsSpeaking(false);
    if (voiceConversationRef.current && isOpenRef.current) {
      setStatusNote("Ab aap boliye... / Your turn!");
      clearTimeout(voiceCycleTimerRef.current);
      voiceCycleTimerRef.current = setTimeout(() => {
        if (voiceConversationRef.current && isOpenRef.current && !busyRef.current) {
          startListeningRef.current?.(true);
        }
      }, 550);
    }
  };

  const speakBrowser = (text, playbackId) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setStatusNote('Browser voice is not supported.');
      stopVoiceConversationRef.current?.();
      return;
    }
    const useHindi = /[\u0900-\u097F]/.test(text) || languageRef.current === 'hi-IN';
    const speechText = browserSpeechPronunciation(text, useHindi);
    if (!speechText) return finishSpokenTurn(playbackId);

    const voices = synth.getVoices();
    const preferredVoice = voices.find((v) => v.lang.toLowerCase().startsWith(useHindi ? 'hi' : 'en-in'))
      || voices.find((v) => v.lang.toLowerCase().startsWith('en'));

    const chunks = [];
    let chunk = '';
    speechText.split(/\s+/).forEach((word) => {
      if ((chunk + ' ' + word).length > 150 && chunk) {
        chunks.push(chunk);
        chunk = word;
      } else chunk += (chunk ? ' ' : '') + word;
    });
    if (chunk) chunks.push(chunk);
    let index = 0;

    const speakNext = () => {
      if (playbackId !== voicePlaybackIdRef.current) return;
      if (index >= chunks.length) {
        utteranceRef.current = null;
        finishSpokenTurn(playbackId);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index++]);
      utteranceRef.current = utterance;
      utterance.lang = preferredVoice?.lang || (useHindi ? 'hi-IN' : 'en-IN');
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => {
        if (playbackId !== voicePlaybackIdRef.current) return;
        setIsSpeaking(true);
        setStatusNote('Browser voice speaking...');
      };
      utterance.onend = () => {
        if (playbackId !== voicePlaybackIdRef.current) return;
        speakNext();
      };
      utterance.onerror = (event) => {
        if (playbackId !== voicePlaybackIdRef.current) return;
        console.error('Browser voice error:', event.error);
        stopVoiceConversationRef.current?.('Browser voice failed. Please check browser voices.');
      };
      synth.speak(utterance);
    };
    synth.cancel();
    synth.resume();
    speakNext();
  };

  const speakReply = async (text, force = false) => {
    if ((!voiceEnabledRef.current && !force) || !text) return;
    stopAllAudio();
    const playbackId = voicePlaybackIdRef.current;
    const speechText = sanitizeSpeech(text);
    if (!speechText) return;

    if (voiceEngineRef.current === 'browser') {
      speakBrowser(speechText, playbackId);
      return;
    }

    const controller = new AbortController();
    ttsRequestRef.current = controller;
    const deadline = setTimeout(() => controller.abort(), 22000);
    try {
      setStatusNote('Creating natural AI voice...');
      const base = (import.meta.env.VITE_CHAT_API_BASE_URL || '').replace(/\/$/, '');
      const response = await fetch(`${base}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: speechText.slice(0, 1600),
          language: /[\u0900-\u097f]/.test(speechText) ? "hi-IN" : languageRef.current,
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Natural voice unavailable (${response.status})`);
      const wav = await response.blob();
      if (!wav.size || playbackId !== voicePlaybackIdRef.current) return;
      const url = URL.createObjectURL(wav);
      naturalUrlRef.current = url;
      const audio = new Audio(url);
      naturalAudioRef.current = audio;
      audio.onplaying = () => {
        if (playbackId !== voicePlaybackIdRef.current) return;
        setIsSpeaking(true);
        setStatusNote('Natural AI voice speaking...');
      };
      audio.onended = () => {
        if (playbackId !== voicePlaybackIdRef.current) return;
        naturalAudioRef.current = null;
        if (naturalUrlRef.current) URL.revokeObjectURL(naturalUrlRef.current);
        naturalUrlRef.current = null;
        finishSpokenTurn(playbackId);
      };
      audio.onerror = () => {
        if (playbackId !== voicePlaybackIdRef.current) return;
        stopAllAudio();
        const nextId = voicePlaybackIdRef.current;
        setStatusNote('Audio could not play; using browser voice instead.');
        speakBrowser(speechText, nextId);
      };
      await audio.play();
    } catch (error) {
      if (playbackId !== voicePlaybackIdRef.current) return; // user clicked Stop/Close
      console.warn('Natural AI voice failed:', error.message);
      voiceEngineRef.current = 'browser';
      setVoiceEngine('browser');
      setStatusNote('Natural AI voice unavailable. Browser Voice activated.');
      speakBrowser(speechText, playbackId);
    } finally {
      clearTimeout(deadline);
      if (ttsRequestRef.current === controller) ttsRequestRef.current = null;
    }
  };

  const handleSend = async (event, customPrompt = null) => {
    event?.preventDefault?.();
    const text = (customPrompt ?? input).trim();
    if (!text || busyRef.current) return;
    if (text.length > 1000) { setStatusNote("Please keep your question under 1000 characters."); return; }
    busyRef.current = true;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setStatusNote("");
    // Never listen while we are processing a spoken question or playing a reply.
    recognitionSessionRef.current += 1;
    try { recognitionRef.current?.abort?.(); } catch {}
    setIsListening(false);
    stopAllAudio();
    const updated = [...messages, { role: "user", text }].slice(-40);
    setMessages(updated);
    setInput("");
    // Match the original portfolio's scroll-to-section feature.
    // Keep this behavior on question, without redirecting from the site.
    if (!navigateToRequestedProject(text)) {
      findPortfolioSection(text)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const base = (import.meta.env.VITE_CHAT_API_BASE_URL || "").replace(/\/$/, "");
      const response = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.filter((m) => m !== INITIAL_MSG && !(m.role === "model" && m.text === INITIAL_MSG.text)).slice(-12),
          pageContent: getPublicPortfolioSummary(),
          voiceMode: voiceConversationRef.current,
        }),
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (requestId !== requestIdRef.current) return;
      if (!response.ok) throw new Error(payload.error || `Server error (${response.status})`);
      if (!payload.reply || typeof payload.reply !== "string") throw new Error("AI did not return a reply.");
      const answer = payload.reply.trim();
      setMessages((prev) => [...prev, { role: "model", text: answer, action: getActionType(text) }].slice(-40));
      speakReply(answer);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      if (voiceConversationRef.current) {
        stopVoiceConversationRef.current?.("AI reply failed. Tap Start Voice to try again.");
      }
      setMessages((prev) => [...prev, {
        role: "model",
        text: error.name === "AbortError"
          ? "The AI request timed out. Please try again."
          : error.message === "Failed to fetch"
            ? "Cannot reach the AI server. Please check that your backend is running."
            : `Sorry, I couldn't answer right now. ${error.message}`,
      }].slice(-40));
    } finally {
      clearTimeout(timeout);
      activeRequestRef.current = null;
      if (requestId === requestIdRef.current) {
        busyRef.current = false;
        if (mountedRef.current) setLoading(false);
      }
    }
  };

  handleSendRef.current = handleSend;

  const startListening = (auto = false) => {
    if (busyRef.current) return;
    if (isListening) {
      if (voiceConversationRef.current) stopVoiceConversation("Voice conversation stopped.");
      else {
        recognitionSessionRef.current += 1;
        recognitionRef.current?.stop?.();
        setIsListening(false);
      }
      return;
    }
    setStatusNote("");
    stopAllAudio();
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      if (auto) stopVoiceConversation();
      setStatusNote("Microphone needs HTTPS (or localhost)."); return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      if (auto) stopVoiceConversation();
      setStatusNote("Please use Chrome or Edge for voice chat."); return;
    }
    try {
      const recognition = new Recognition();
      recognitionRef.current = recognition;
      const sessionId = ++recognitionSessionRef.current;
      let receivedTranscript = false;
      recognition.lang = languageRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => {
        if (sessionId !== recognitionSessionRef.current) return;
        setIsListening(true);
        setStatusNote(languageRef.current === "hi-IN" ? "सुन रहा हूँ... बोलिए 🎙️" : "Listening... please speak 🎙️");
      };
      recognition.onresult = (ev) => {
        if (sessionId !== recognitionSessionRef.current) return;
        const transcript = ev.results?.[0]?.[0]?.transcript?.trim();
        if (!transcript) return;
        receivedTranscript = true;
        setIsListening(false);
        setStatusNote("");
        handleSendRef.current?.(null, transcript);
      };
      recognition.onerror = (ev) => {
        if (sessionId !== recognitionSessionRef.current) return;
        const reason = ev.error === "not-allowed"
          ? "Please allow microphone permission in your browser."
          : ev.error === "no-speech"
            ? "No speech detected. Tap Start Voice to try again."
            : "Voice input failed. Tap Start Voice to retry.";
        if (voiceConversationRef.current) stopVoiceConversationRef.current?.();
        setIsListening(false);
        setStatusNote(reason);
      };
      recognition.onend = () => {
        if (sessionId !== recognitionSessionRef.current) return;
        recognitionRef.current = null;
        setIsListening(false);
        // No automatic infinite re-listening when the user stays silent.
        if (!receivedTranscript && voiceConversationRef.current) {
          stopVoiceConversationRef.current?.("No speech heard. Tap Start Voice to try again.");
        }
      };
      recognition.start();
    } catch {
      if (voiceConversationRef.current) stopVoiceConversation();
      setIsListening(false);
      setStatusNote("Could not start mic. Please tap Start Voice again.");
    }
  };
  startListeningRef.current = startListening;

  const startVoiceConversation = () => {
    // Always allow Stop, even while waiting for Gemini to answer or synthesize speech.
    if (busyRef.current && !voiceConversationRef.current) return;
    if (!voiceConversationRef.current && voiceEngineRef.current === "browser" && !("speechSynthesis" in window)) {
      setStatusNote("This browser does not support speaking replies. Please try Chrome or Edge.");
      return;
    }
    if (voiceConversationRef.current) {
      stopVoiceConversation("Voice conversation stopped.");
      voiceEnabledRef.current = false;
      setVoiceEnabled(false);
      return;
    }
    // The first recognition request is in the user's button click handler.
    // Some browsers block automatic restart later; user can re-tap Start Voice.
    voiceConversationRef.current = true;
    setVoiceConversation(true);
    voiceEnabledRef.current = true;
    setVoiceEnabled(true);
    startListeningRef.current?.(true);
  };

  const clearChat = () => {
    stopVoiceConversation();
    voiceEnabledRef.current = false;
    setVoiceEnabled(false);
    requestIdRef.current += 1;
    busyRef.current = false;
    setLoading(false);
    stopAllAudio();
    activeRequestRef.current?.abort();
    recognitionRef.current?.abort?.();
    sessionStorage.removeItem("indrajeet_chat_history");
    setMessages([INITIAL_MSG]);
    setStatusNote("");
  };

  return (
    <div id="ai-chatbot-root" className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role="dialog" aria-label="Indrajeet's AI Assistant"
            className="mb-4 w-[calc(100vw-2rem)] max-w-[385px] h-[min(560px,calc(100dvh-7rem))] bg-[#121724] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Original dark header styling preserved */}
            <div className="px-5 py-3.5 bg-[#1a2133] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-8 h-8 shrink-0 rounded-full bg-[#72bbf6]/20 text-[#72bbf6] flex items-center justify-center font-bold text-sm">
                  AI <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1a2133] rounded-full" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-semibold leading-tight truncate">Indrajeet's AI Assistant</h4>
                  <p className="text-slate-400 text-[11px]">{isListening ? "Listening to you..." : isSpeaking ? "Speaking with you..." : "Interactive Portfolio Guide • Online"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button type="button" onClick={() => {
                  if (voiceEnabled) {
                    stopVoiceConversation();
                    voiceEnabledRef.current = false;
                    setVoiceEnabled(false);
                  } else {
                    voiceEnabledRef.current = true;
                    setVoiceEnabled(true);
                    const last = [...messages].reverse().find((m) => m.role === "model");
                    if (last) speakReply(last.text, true);
                  }
                }} className={`text-xs px-2 py-1 rounded-full border cursor-pointer ${voiceEnabled ? "border-[#72bbf6]/40 text-[#72bbf6] bg-[#72bbf6]/10" : "border-white/10 text-slate-400"}`}
                title={voiceEnabled ? "Turn voice off" : "Turn voice on"} aria-label="Toggle voice replies">
                  {voiceEnabled ? "🔊" : "🔇"}
                </button>
                <button type="button" onClick={clearChat} className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded border border-white/10" title="Clear chat" aria-label="Clear conversation">↻</button>
                <button type="button" onClick={() => { stopVoiceConversation(); setIsOpen(false); }} className="text-slate-400 hover:text-white" title="Close chat" aria-label="Close chat">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {statusNote && <div role="status" className="bg-[#72bbf6]/15 border-b border-[#72bbf6]/30 px-3.5 py-1.5 text-[11px] text-[#72bbf6] font-medium">{statusNote}</div>}

            <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 text-xs leading-relaxed" role="log" aria-live="polite" aria-relevant="additions">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap break-words ${m.role === "user" ? "bg-[#72bbf6] text-[#090d16] font-medium rounded-br-none" : "bg-[#1e2538] text-slate-200 border border-white/5 rounded-bl-none"}`}>
                    {m.text}
                  </div>
                  {m.role === "model" && m.action === "contact_card" && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                      <a href="mailto:indrakumar2014.sah@gmail.com" className="bg-[#72bbf6]/15 hover:bg-[#72bbf6]/25 text-[#72bbf6] border border-[#72bbf6]/30 px-2.5 py-1 rounded-lg text-[11px]">Email Indrajeet</a>
                      <a href="tel:+917890330625" className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px]">Call Indrajeet</a>
                    </div>
                  )}
                  {m.role === "model" && m.action === "project_card" && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                      <a href="https://github.com/indrajeet87sah-glitch" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-2.5 py-1 rounded-lg text-[11px]">View GitHub</a>
                      <button type="button" onClick={() => findPortfolioSection("projects")?.scrollIntoView({ behavior: "smooth" })} className="bg-[#72bbf6]/15 hover:bg-[#72bbf6]/25 text-[#72bbf6] border border-[#72bbf6]/30 px-2.5 py-1 rounded-lg text-[11px]">Scroll to Projects</button>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1e2538] px-3 py-2 rounded-2xl rounded-bl-none border border-white/5 flex gap-1.5" aria-label="Assistant is typing">
                    {[0, 1, 2].map((n) => <span key={n} className="w-1.5 h-1.5 bg-[#72bbf6] rounded-full animate-bounce" style={{ animationDelay: `${n * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Switch between natural Gemini speech and the existing browser voice. */}
            <div className="px-3 py-2 bg-[#121724] border-t border-white/10 flex gap-2 items-center justify-between">
              <span className="text-[11px] text-slate-300 font-medium">Voice quality</span>
              <div className="flex gap-1.5" aria-label="Voice quality selection">
                <button type="button" onClick={() => {
                  if (voiceConversationRef.current) stopVoiceConversation();
                  stopAllAudio();
                  voiceEngineRef.current = 'natural';
                  setVoiceEngine('natural');
                }} aria-pressed={voiceEngine === 'natural'}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border ${voiceEngine === 'natural' ? 'bg-[#72bbf6]/20 text-[#72bbf6] border-[#72bbf6]/40' : 'text-slate-400 border-white/10'}`}>
                  ✨ Natural AI
                </button>
                <button type="button" onClick={() => {
                  if (voiceConversationRef.current) stopVoiceConversation();
                  stopAllAudio();
                  voiceEngineRef.current = 'browser';
                  setVoiceEngine('browser');
                }} aria-pressed={voiceEngine === 'browser'}
                  className={`px-2.5 py-1 rounded-lg text-[11px] border ${voiceEngine === 'browser' ? 'bg-[#72bbf6]/20 text-[#72bbf6] border-[#72bbf6]/40' : 'text-slate-400 border-white/10'}`}>
                  Browser
                </button>
              </div>
            </div>

            {/* Optional voice-to-voice mode: one user turn, one spoken AI turn, then listen again. */}
            <div className="px-3 py-2 bg-[#151e2d] border-t border-white/10 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-100">🎙️ Voice Conversation</p>
                <p className="text-[10px] text-slate-400">
                  {isListening ? "Listening to your question..."
                    : loading && voiceConversation ? "AI is thinking..."
                    : isSpeaking && voiceConversation ? "AI is answering..."
                    : voiceConversation ? "Voice mode active"
                    : "Speak → AI replies → speak again"}
                </p>
              </div>
              <button type="button" onClick={startVoiceConversation} disabled={loading && !voiceConversation}
                aria-pressed={voiceConversation}
                className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-semibold border transition disabled:opacity-50 ${voiceConversation
                  ? "bg-rose-500/15 border-rose-400/40 text-rose-300 hover:bg-rose-500/25"
                  : "bg-[#72bbf6] border-[#72bbf6] text-[#090d16] hover:bg-[#5caeeb]"}`}>
                {voiceConversation ? "■ Stop Voice" : "▶ Start Voice"}
              </button>
            </div>

            <div ref={chipsRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)} onTouchEnd={() => setIsHovered(false)}
              onWheel={(e) => { if (chipsRef.current) chipsRef.current.scrollLeft += e.deltaY; }}
              className="px-3 py-2 bg-[#161d2d] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar cursor-grab select-none">
              {SUGGESTIONS.map((item) => (
                <button key={item.label} type="button" disabled={loading} onClick={() => handleSend(null, item.prompt)}
                  className="text-[11px] whitespace-nowrap bg-white/5 hover:bg-[#72bbf6]/20 hover:text-[#72bbf6] text-slate-300 px-2.5 py-1 rounded-full border border-white/10 disabled:opacity-50 shrink-0 shadow-sm">
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-3 bg-[#1a2133] border-t border-white/5 flex items-center gap-2">
              <div className="flex-1 relative flex items-center min-w-0">
                <input type="text" maxLength={1000} placeholder={isListening ? "Listening..." : "Ask about works, skills..."}
                  value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask the portfolio assistant"
                  className={`w-full bg-[#121724] text-white text-xs pl-3.5 pr-10 py-2.5 rounded-xl outline-none border ${isListening ? "border-red-400/70 placeholder-red-400" : "border-white/10 focus:border-[#72bbf6]/50 placeholder-slate-500"}`} />
                <button type="button" onClick={() => startListening(false)} className={`absolute right-3 ${isListening ? "text-red-400 animate-pulse" : "text-slate-400 hover:text-[#72bbf6]"}`}
                  title="Tap and speak" aria-label="Speak your question"><span className="material-symbols-outlined text-[18px]">mic</span></button>
              </div>
              <button type="button" onClick={() => setSpeechLanguage((v) => v === "hi-IN" ? "en-IN" : "hi-IN")}
                className="text-[11px] text-[#72bbf6] border border-[#72bbf6]/30 px-2 py-2 rounded-lg" title="Change microphone language">
                {speechLanguage === "hi-IN" ? "HI" : "EN"}
              </button>
              <button type="submit" disabled={loading || !input.trim()} className="w-9 h-9 rounded-xl bg-[#72bbf6] hover:bg-[#5caeeb] disabled:opacity-50 text-[#090d16] flex items-center justify-center shrink-0" aria-label="Send question">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center">
        {!isOpen && (
          <motion.div initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 }}
            className="absolute right-16 px-3.5 py-2 bg-[#1a2133] border border-[#72bbf6]/40 text-white text-xs font-medium rounded-2xl shadow-[0_0_20px_rgba(114,187,246,0.3)] whitespace-nowrap pointer-events-none flex items-center gap-2">
            <span>👋 Ask Indrajeet's AI Assistant</span><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </motion.div>
        )}
        {!isOpen && <span className="absolute inset-0 rounded-full bg-[#72bbf6] opacity-75 animate-ping pointer-events-none" />}
        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => { if (isOpen) stopVoiceConversation(); setIsOpen((prev) => !prev); }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#5caeeb] to-[#72bbf6] text-[#090d16] flex items-center justify-center shadow-[0_0_30px_rgba(114,187,246,0.6)] border-2 border-white/20" aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}>
          <span className="material-symbols-outlined text-[26px] font-bold">{isOpen ? "close" : "smart_toy"}</span>
        </motion.button>
      </div>
    </div>
  );
}
