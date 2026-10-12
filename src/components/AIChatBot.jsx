// src/components/AIChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusNote, setStatusNote] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: "Hi! I am Indrajeet's Portfolio AI Assistant. Feel free to ask about his skills, projects, or anything you like!",
            speech: "Hi! I am Indrajeet's Portfolio AI Assistant. Feel free to ask about his skills, projects, or anything you like!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const chatBottomRef = useRef(null);
    const chipsRef = useRef(null);
    const recognitionRef = useRef(null);
    const audioPlayerRef = useRef(null);
    const voicesRef = useRef([]);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("indrajeet_ai_key") || "";

    // System Prompt: Generates a clean screen text AND a 100% phonetic spoken script!
    const SYSTEM_INSTRUCTION = `You are a friendly, smart AI assistant on Indrajeet Kumar Sah's portfolio website.
Indrajeet is a Front-End Developer & UI/UX Designer skilled in React.js, Tailwind CSS, JavaScript, Figma, and UI engineering.

IMPORTANT: Respond ONLY in valid JSON format with two keys:
{
  "display": "Clean 2-sentence reply for the chat screen (can use English, Hinglish, or Hindi with emojis).",
  "speech": "100% natural spoken version for voice reading. NO emojis, NO slashes (/), NO dots in tech names. If replying in Hindi/Hinglish, write the ENTIRE 'speech' string in pure Devanagari script (including English words like रिएक्ट जेएस, टेलविंड सीएसएस, यूआई और यूएक्स डिज़ाइन, फ़िग्मा, इंद्रजीत कुमार साह) so the Hindi voice reads it smoothly like a human!"
}`;

    const SUGGESTIONS = [
        { label: "Top Skills 💻", prompt: "Indrajeet ke top technical skills kya hain?" },
        { label: "Best Projects 🚀", prompt: "Indrajeet ke best projects ke baare mein batao." },
        { label: "Experience 💼", prompt: "Indrajeet ka web development background kaisa hai?" },
        { label: "Contact Info 📬", prompt: "Indrajeet se connect ya contact kaise karein?" }
    ];

    // Load voices
    useEffect(() => {
        if (!("speechSynthesis" in window)) return;
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length > 0) voicesRef.current = available;
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    // Stop audio when chat closes
    const stopAllAudio = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }
        setIsSpeaking(false);
    };

    useEffect(() => {
        window.dispatchEvent(new CustomEvent("chatStateChange", { detail: isOpen }));
        if (!isOpen) stopAllAudio();
    }, [isOpen]);

    // Smooth auto-scrolling chips
    useEffect(() => {
        const el = chipsRef.current;
        if (!el || !isOpen) return;

        let direction = 1;
        const interval = setInterval(() => {
            if (!isHovered && el) {
                el.scrollLeft += direction * 0.8;
                if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                    direction = -1;
                } else if (el.scrollLeft <= 0) {
                    direction = 1;
                }
            }
        }, 30);

        return () => clearInterval(interval);
    }, [isOpen, isHovered]);

    const handleChipsWheel = (e) => {
        if (chipsRef.current) chipsRef.current.scrollLeft += e.deltaY;
    };

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Convert any remaining English tech words into pure Devanagari phonetics
    const toPureSpokenText = (rawText) => {
        const isHindi = /[\u0900-\u097F]/.test(rawText) || /\b(mein|hain|hai|ke|ka|ki|aur|kya|kaise)\b/i.test(rawText);
        let text = rawText;

        if (isHindi) {
            const map = [
                [/indrakumar2014\.sah@gmail\.com/gi, "इंद्रकुमार दो हज़ार चौदह डॉट साह ऐट जीमेल डॉट कॉम"],
                [/\+91-7890330625/g, "प्लस नाइन वन, सेवन एट नाइन ज़ीरो, डबल थ्री ज़ीरो, सिक्स टू फाइव"],
                [/Indrajeet Kumar Sah/gi, "इंद्रजीत कुमार साह"],
                [/Indrajeet/gi, "इंद्रजीत"],
                [/Clinchsoft Technologies/gi, "क्लिंचसॉफ्ट टेक्नोलॉजीज"],
                [/HireReady AI/gi, "हायर रेडी एआई"],
                [/UI\/UX/gi, "यूआई और यूएक्स"],
                [/\bUI\b/g, "यूआई"],
                [/\bUX\b/g, "यूएक्स"],
                [/HTML5\/CSS3/gi, "एचटीएमएल फाइव और सीएसएस थ्री"],
                [/HTML5/gi, "एचटीएमएल फाइव"],
                [/CSS3/gi, "सीएसएस थ्री"],
                [/HTML/gi, "एचटीएमएल"],
                [/CSS/gi, "सीएसएस"],
                [/React\.js/gi, "रिएक्ट जेएस"],
                [/React/gi, "रिएक्ट"],
                [/JavaScript \(ES6\+\)/gi, "जावास्क्रिप्ट ईएस सिक्स"],
                [/JavaScript/gi, "जावास्क्रिप्ट"],
                [/Tailwind CSS/gi, "टेलविंड सीएसएस"],
                [/Tailwind/gi, "टेलविंड"],
                [/Figma/gi, "फ़िग्मा"],
                [/Python/gi, "पायथन"],
                [/System Design/gi, "सिस्टम डिज़ाइन"],
                [/Front-End/gi, "फ्रंटएंड"],
                [/Frontend/gi, "फ्रंटएंड"],
                [/Developer/gi, "डेवलपर"],
                [/Designer/gi, "डिज़ाइनर"],
                [/Portfolio/gi, "पोर्टफोलियो"],
                [/Assistant/gi, "असिस्टेंट"],
                [/Projects/gi, "प्रोजेक्ट्स"],
                [/Skills/gi, "स्किल्स"],
                [/Experience/gi, "एक्सपीरियंस"],
                [/Internship/gi, "इंटर्नशिप"],
                [/\bAI\b/g, "एआई"]
            ];
            map.forEach(([regex, val]) => {
                text = text.replace(regex, val);
            });
        } else {
            text = text
                .replace(/UI\/UX/gi, "UI and UX")
                .replace(/React\.js/gi, "React JS")
                .replace(/HTML5\/CSS3/gi, "HTML 5 and CSS 3")
                .replace(/ES6\+/gi, "ES 6 plus");
        }

        return {
            cleanText: text
                .replace(/[*#`_~•💻🚀💼📬🎙️🔊🔇✕]/g, " ")
                .replace(/\s+/g, " ")
                .trim(),
            lang: isHindi ? "hi-IN" : "en-IN"
        };
    };

    // 🔊 NATURAL SENTENCE-BY-SENTENCE VOICE ENGINE
    const speakReply = (speechText, forceSpeak = false) => {
        if ((!voiceEnabled && !forceSpeak) || !("speechSynthesis" in window)) return;

        stopAllAudio();

        const { cleanText, lang } = toPureSpokenText(speechText);
        if (!cleanText) return;

        // Split by sentences (।, ., !, ?) so mobile & desktop voices read smoothly with natural pauses
        const sentences = cleanText
            .split(/(?<=[।.!?])\s+/)
            .map((s) => s.trim())
            .filter(Boolean);

        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

        // Pick the highest quality Neural/Natural voice available on device
        let selectedVoice = null;
        if (lang === "hi-IN") {
            selectedVoice =
                voices.find((v) => v.name.includes("Google हिन्दी")) ||
                voices.find((v) => v.name.includes("Natural") && v.lang.includes("hi")) ||
                voices.find((v) => v.name.includes("Swara") || v.name.includes("Lekha")) ||
                voices.find((v) => v.lang.includes("hi"));
        } else {
            selectedVoice =
                voices.find((v) => v.name.includes("Google") && v.lang === "en-IN") ||
                voices.find((v) => v.name.includes("Natural") && v.lang === "en-IN") ||
                voices.find((v) => v.name.includes("Neerja") || v.name.includes("Rishi")) ||
                voices.find((v) => v.lang === "en-IN") ||
                voices.find((v) => v.name.includes("Google") && v.lang.includes("en"));
        }

        setIsSpeaking(true);

        sentences.forEach((sentence, idx) => {
            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.lang = lang;
            if (selectedVoice) utterance.voice = selectedVoice;

            // Natural human pacing & warm pitch
            utterance.rate = lang === "hi-IN" ? 0.98 : 0.96;
            utterance.pitch = 1.02;
            utterance.volume = 1.0;

            if (idx === sentences.length - 1) {
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => setIsSpeaking(false);
            }

            window.speechSynthesis.speak(utterance);
        });
    };

    // 🧠 Pre-built Dual-Format Fallbacks (Display Text + Pure Spoken Script!)
    const getPortfolioFallback = (query) => {
        const q = query.toLowerCase();
        if (q.includes("skill") || q.includes("tech")) {
            return {
                display: "Indrajeet's top skills include React.js, JavaScript (ES6+), Tailwind CSS, HTML5/CSS3, Figma (UI/UX Design), Python, and System Design. 💻",
                speech: "इंद्रजीत के मुख्य टेक्निकल स्किल्स में रिएक्ट जेएस, जावास्क्रिप्ट, टेलविंड सीएसएस, एचटीएमएल, सीएसएस, फ़िग्मा यूआई और यूएक्स डिज़ाइन, और पायथन शामिल हैं।"
            };
        }
        if (q.includes("project")) {
            return {
                display: "Indrajeet's best projects include HireReady AI (ATS Resume Analyzer & Voice Interviewer), this AI-Powered Portfolio Website, and responsive Figma UI/UX Design Systems. 🚀",
                speech: "इंद्रजीत के बेस्ट प्रोजेक्ट्स में हायर रेडी एआई रेज़्यूमे एनालाइज़र, यह एआई पावर्ड पोर्टफोलियो वेबसाइट, और आधुनिक रिस्पॉन्सिव फ़िग्मा डिज़ाइन शामिल हैं।"
            };
        }
        if (q.includes("experience") || q.includes("background") || q.includes("intern")) {
            return {
                display: "Indrajeet completed a Web Development Internship at Clinchsoft Technologies and has strong hands-on experience building modern React and UI/UX web applications. 💼",
                speech: "इंद्रजीत ने क्लिंचसॉफ्ट टेक्नोलॉजीज में वेब डेवलपमेंट इंटर्नशिप पूरी की है, और उन्हें रिएक्ट और यूआई यूएक्स में आधुनिक वेब एप्लिकेशन बनाने का शानदार अनुभव है।"
            };
        }
        if (q.includes("contact") || q.includes("connect") || q.includes("hire") || q.includes("email")) {
            return {
                display: "You can reach Indrajeet Kumar Sah via Email at indrakumar2014.sah@gmail.com or Phone at +91-7890330625. 📬",
                speech: "आप इंद्रजीत कुमार साह से उनके ईमेल या फ़ोन नंबर के ज़रिए सीधा संपर्क कर सकते हैं, जिसकी जानकारी स्क्रीन पर दी गई है।"
            };
        }
        return {
            display: "Hello! Main Indrajeet Kumar Sah ka Portfolio AI Assistant hoon. Aap mujhse unke React & UI/UX skills, projects, ya experience ke baare mein kuch bhi pooch sakte hain!",
            speech: "नमस्ते! मैं इंद्रजीत कुमार साह का पोर्टफोलियो एआई असिस्टेंट हूँ। आप मुझसे उनके रिएक्ट और यूआई यूएक्स स्किल्स, प्रोजेक्ट्स, या एक्सपीरियंस के बारे में कुछ भी पूछ सकते हैं।"
        };
    };

    // 💬 Send Message Function
    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();

        const textToSend = (customPrompt || input).trim();
        if (!textToSend || loading) return;

        stopAllAudio();

        setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
        setInput("");
        setLoading(true);
        setStatusNote("");

        const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${textToSend}`;
        let displayReply = "";
        let speechReply = "";

        if (API_KEY && API_KEY.trim()) {
            const cleanKey = API_KEY.trim();
            const candidateModels = [
                "gemini-3.8-flash",
                "gemini-2.5-flash",
                "gemini-2.0-flash",
                "gemini-1.5-flash"
            ];

            for (const modelName of candidateModels) {
                try {
                    const res = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: fullPrompt }] }]
                            })
                        }
                    );
                    const data = await res.json();
                    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (rawText) {
                        try {
                            const cleanedJson = rawText.replace(/```json|```/g, "").trim();
                            const parsed = JSON.parse(cleanedJson);
                            displayReply = parsed.display || rawText;
                            speechReply = parsed.speech || parsed.display || rawText;
                        } catch {
                            displayReply = rawText.trim();
                            speechReply = rawText.trim();
                        }
                        break;
                    }
                } catch (err) {}
            }
        }

        if (!displayReply) {
            const fb = getPortfolioFallback(textToSend);
            displayReply = fb.display;
            speechReply = fb.speech;
        }

        setMessages((prev) => [...prev, { role: "model", text: displayReply, speech: speechReply }]);
        setLoading(false);
        speakReply(speechReply);
    };

    // 🎙️ CHATGPT-STYLE MOBILE & DESKTOP MIC
    const startListening = async () => {
        setStatusNote("");
        stopAllAudio();

        if (isListening) {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {}
            }
            setIsListening(false);
            return;
        }

        if (!window.isSecureContext && window.location.hostname !== "localhost") {
            setStatusNote("⚠️ Mobile par Mic sirf HTTPS (Live Link) par chalta hai.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatusNote("⚠️ Kripya Chrome ya Safari browser use karein.");
            return;
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                stream.getTracks().forEach((track) => track.stop());
            } catch (permErr) {
                setStatusNote("⚠️ Browser Settings > Site Settings > Microphone mein Allow karein.");
                return;
            }
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.lang = "en-IN";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                setStatusNote("🎙️ Boliye... (Bolna rukte hi message apne aap chala jayega)");
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0]?.[0]?.transcript?.trim();
                if (transcript) {
                    setIsListening(false);
                    setStatusNote("");
                    handleSend(null, transcript);
                }
            };

            recognition.onerror = (event) => {
                setIsListening(false);
                if (event.error === "no-speech") {
                    setStatusNote("🎙️ Aawaz nahi aayi. Mic daba kar turant bolein.");
                } else {
                    setStatusNote("");
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } catch (err) {
            setIsListening(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="mb-4 w-[330px] sm:w-[380px] h-[480px] bg-[#121724] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 bg-[#1a2133] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#72bbf6]/20 text-[#72bbf6] flex items-center justify-center font-bold text-sm">
                                    AI
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold leading-tight">Indrajeet Assistant</h4>
                                    <p className="text-slate-400 text-[11px]">
                                        {isSpeaking ? "🔊 Speaking..." : "Powered by Gemini"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (voiceEnabled) {
                                            stopAllAudio();
                                            setVoiceEnabled(false);
                                        } else {
                                            setVoiceEnabled(true);
                                            const lastMsg = [...messages].reverse().find((m) => m.role === "model");
                                            if (lastMsg) speakReply(lastMsg.speech || lastMsg.text, true);
                                        }
                                    }}
                                    className={`text-xs px-2 py-0.5 rounded-full border transition cursor-pointer ${
                                        voiceEnabled
                                            ? "border-[#72bbf6]/40 text-[#72bbf6] bg-[#72bbf6]/10"
                                            : "border-white/10 text-slate-400"
                                    }`}
                                >
                                    {voiceEnabled ? "🔊" : "🔇"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-white cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        </div>

                        {statusNote && (
                            <div className="bg-[#72bbf6]/15 border-b border-[#72bbf6]/30 px-3.5 py-1.5 text-[11px] text-[#72bbf6] font-medium">
                                {statusNote}
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 text-xs leading-relaxed">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                                            m.role === "user"
                                                ? "bg-[#72bbf6] text-[#090d16] font-medium rounded-br-none"
                                                : "bg-[#1e2538] text-slate-200 border border-white/5 rounded-bl-none"
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#1e2538] text-slate-400 px-3 py-2 rounded-2xl rounded-bl-none border border-white/5 text-[11px]">
                                        Typing...
                                    </div>
                                </div>
                            )}
                            <div ref={chatBottomRef} />
                        </div>

                        {/* Suggestion Chips */}
                        <div
                            ref={chipsRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onTouchStart={() => setIsHovered(true)}
                            onTouchEnd={() => setIsHovered(false)}
                            onWheel={handleChipsWheel}
                            className="px-3 py-2 bg-[#161d2d] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
                        >
                            {SUGGESTIONS.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => handleSend(null, item.prompt)}
                                    className="text-[11px] whitespace-nowrap bg-white/5 hover:bg-[#72bbf6]/20 hover:text-[#72bbf6] text-slate-300 px-2.5 py-1 rounded-full border border-white/10 transition-colors disabled:opacity-50 flex-shrink-0 cursor-pointer shadow-sm"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={(e) => handleSend(e)} className="p-3 bg-[#1a2133] border-t border-white/5 flex items-center gap-2">
                            <div className="flex-1 relative flex items-center">
                                <input
                                    type="text"
                                    placeholder={isListening ? "Listening... Boliye 🎙️" : "Ask anything..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className={`w-full bg-[#121724] text-white text-xs pl-3.5 pr-10 py-2.5 rounded-xl outline-none border transition-all ${
                                        isListening
                                            ? "border-red-400/70 placeholder-red-400"
                                            : "border-white/10 focus:border-[#72bbf6]/50 placeholder-slate-500"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={startListening}
                                    className={`absolute right-3 transition-colors cursor-pointer ${
                                        isListening ? "text-red-400 animate-pulse" : "text-slate-400 hover:text-[#72bbf6]"
                                    }`}
                                    title="Tap & Speak"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        mic
                                    </span>
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-9 h-9 rounded-xl bg-[#72bbf6] hover:bg-[#5caeeb] disabled:opacity-50 text-[#090d16] flex items-center justify-center transition-all cursor-pointer shrink-0"
                            >
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-14 h-14 rounded-full bg-[#72bbf6] text-[#090d16] flex items-center justify-center shadow-[0_0_25px_rgba(114,187,246,0.4)] cursor-pointer focus:outline-none"
            >
                <span className="material-symbols-outlined text-[26px]">
                    {isOpen ? "close" : "smart_toy"}
                </span>
            </motion.button>
        </div>
    );
}