// src/components/AIChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusNote, setStatusNote] = useState(""); // Shows exact Mic/Voice status inside chat
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: "Hi! I am Indrajeet's Portfolio AI Assistant. Feel free to ask about his skills, projects, or anything you like!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const chatBottomRef = useRef(null);
    const chipsRef = useRef(null);
    const recognitionRef = useRef(null);
    const voicesRef = useRef([]);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("indrajeet_ai_key") || "";

    const SYSTEM_INSTRUCTION =
        "You are a friendly, fast, and helpful AI assistant on Indrajeet Kumar Sah's portfolio website. " +
        "Indrajeet is a Front-End Developer & UI/UX Designer skilled in React, Tailwind CSS, JavaScript, Figma, and UI engineering. " +
        "Guidelines: " +
        "1. Answer user queries politely, smartly, and concisely in 2 to 3 sentences max. " +
        "2. Reply in the exact same language used by the user (Hindi, Hinglish, English, etc.). " +
        "3. Answer any question asked (coding, tech, casual talk, portfolio).";

    const SUGGESTIONS = [
        { label: "Top Skills 💻", prompt: "Indrajeet ke top technical skills kya hain?" },
        { label: "Best Projects 🚀", prompt: "Indrajeet ke best projects ke baare mein batao." },
        { label: "Experience 💼", prompt: "Indrajeet ka web development background kaisa hai?" },
        { label: "Contact Info 📬", prompt: "Indrajeet se connect ya contact kaise karein?" }
    ];

    // Pre-load Browser Voices (Fixes Chrome empty voice list bug!)
    useEffect(() => {
        if (!("speechSynthesis" in window)) return;

        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length > 0) {
                voicesRef.current = available;
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent("chatStateChange", { detail: isOpen }));
        if (!isOpen && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
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

    // 🔓 UNLOCK CHROME AUDIO ON USER CLICK (Crucial fix for async API calls!)
    const unlockAudioEngine = () => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const silentUnlock = new SpeechSynthesisUtterance("");
        silentUnlock.volume = 0;
        window.speechSynthesis.speak(silentUnlock);
    };

    // 🔊 GUARANTEED AI TEXT-TO-SPEECH
    const speakReply = (text, forceSpeak = false) => {
        if ((!voiceEnabled && !forceSpeak) || !("speechSynthesis" in window)) return;

        try {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();

            const hasHindiScript = /[\u0900-\u097F]/.test(text);
            let speechString = text;

            const phonetics = [
                [/Indrajeet Kumar Sah/gi, hasHindiScript ? "इंद्रजीत कुमार साह" : "Indrajeet Kumar Sah"],
                [/Indrajeet/gi, hasHindiScript ? "इंद्रजीत" : "Indrajeet"],
                [/UI\/UX/gi, hasHindiScript ? "यूआई यूएक्स" : "UI UX"],
                [/Figma/gi, hasHindiScript ? "फ़िग्मा" : "Figma"],
                [/React\.js/gi, hasHindiScript ? "रिएक्ट जेएस" : "React JS"],
                [/Tailwind CSS/gi, hasHindiScript ? "टेलविंड सीएसएस" : "Tailwind CSS"],
                [/JavaScript/gi, hasHindiScript ? "जावास्क्रिप्ट" : "JavaScript"],
                [/Front-End/gi, hasHindiScript ? "फ्रंटएंड" : "Frontend"]
            ];

            phonetics.forEach(([regex, word]) => {
                speechString = speechString.replace(regex, word);
            });

            const cleanSpeech = speechString
                .replace(/[*#`_~•💻🚀💼📬🎙️]/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            if (!cleanSpeech) return;

            const utterance = new SpeechSynthesisUtterance(cleanSpeech);
            utterance.lang = hasHindiScript ? "hi-IN" : "en-IN";
            utterance.rate = 1.0;
            utterance.volume = 1.0;

            const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
            if (hasHindiScript) {
                const hindiVoice =
                    voices.find((v) => v.name.includes("Google हिन्दी") || v.name.includes("Swara") || v.name.includes("Madhur")) ||
                    voices.find((v) => v.lang.includes("hi"));
                if (hindiVoice) utterance.voice = hindiVoice;
            } else {
                const engVoice =
                    voices.find((v) => v.lang === "en-IN" || v.name.includes("India")) ||
                    voices.find((v) => v.lang.includes("en"));
                if (engVoice) utterance.voice = engVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 80);
        } catch (err) {
            console.error("TTS Error:", err);
            setIsSpeaking(false);
        }
    };

    // 🎙️ GUARANTEED VOICE TYPING (MIC)
    const startListening = () => {
        setStatusNote("");
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setStatusNote("⚠️ Voice typing sirf Google Chrome ya Microsoft Edge mein chalta hai.");
            return;
        }

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        if (isListening) {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {}
            }
            setIsListening(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.lang = "en-IN";
            recognition.continuous = false;
            recognition.interimResults = true;

            const baseInput = input.trim();

            recognition.onstart = () => {
                setIsListening(true);
                setStatusNote("🎙️ Mic ON hai... Ab boliye!");
            };

            recognition.onresult = (event) => {
                let transcript = "";
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setInput(baseInput ? `${baseInput} ${transcript}` : transcript);
            };

            recognition.onerror = (event) => {
                setIsListening(false);
                if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                    setStatusNote("🔒 Mic Permission Blocked! URL bar ke paas Lock icon daba kar Microphone 'Allow' karein.");
                } else if (event.error === "no-speech") {
                    setStatusNote("🎙️ Koi aawaz nahi sunai di. Dobara mic daba kar bolein.");
                } else {
                    setStatusNote(`⚠️ Mic Error (${event.error}): Kripya Google Chrome use karein.`);
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                setTimeout(() => setStatusNote(""), 2500);
            };

            recognition.start();
        } catch (err) {
            setIsListening(false);
            setStatusNote("⚠️ Mic start nahi ho paya. Browser permission check karein.");
        }
    };

    // 🧠 Smart Portfolio Fallback
    const getPortfolioFallbackReply = (query) => {
        const q = query.toLowerCase();
        if (q.includes("skill") || q.includes("tech")) {
            return "Indrajeet ke top skills mein React.js, JavaScript (ES6+), Tailwind CSS, HTML5/CSS3, Figma (UI/UX Design), Python, aur System Design shamil hain.";
        }
        if (q.includes("project")) {
            return "Indrajeet ke best projects mein HireReady AI (ATS Resume Analyzer & Voice Interviewer), AI-Powered Portfolio Website, aur Modern Responsive Figma UI/UX Design Systems shamil hain.";
        }
        if (q.includes("experience") || q.includes("background") || q.includes("intern")) {
            return "Indrajeet ne Clinchsoft Technologies mein Web Development Internship poori ki hai aur unhe modern Front-End React applications aur UI/UX interfaces banane ka strong practical experience hai.";
        }
        if (q.includes("contact") || q.includes("connect") || q.includes("hire") || q.includes("email")) {
            return "Aap Indrajeet Kumar Sah se seedha Email (indrakumar2014.sah@gmail.com) ya Phone (+91-7890330625) par sampark kar sakte hain!";
        }
        return "Hello! Main Indrajeet Kumar Sah ka Portfolio AI Assistant hoon. Aap mujhse unke React & UI/UX skills, projects, internship experience, ya contact details ke baare mein kuch bhi pooch sakte hain!";
    };

    // 💬 Handle Send + Instant Audio Unlock
    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();

        const textToSend = customPrompt || input.trim();
        if (!textToSend || loading) return;

        // Unlock browser speech engine immediately on click!
        if (voiceEnabled) {
            unlockAudioEngine();
        }

        setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
        if (!customPrompt) setInput("");
        setLoading(true);
        setStatusNote("");

        const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${textToSend}`;
        let responseText = "";

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
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        responseText = text.trim();
                        break;
                    }
                } catch (err) {}
            }
        }

        if (!responseText) {
            responseText = getPortfolioFallbackReply(textToSend);
        }

        setMessages((prev) => [...prev, { role: "model", text: responseText }]);
        setLoading(false);

        // Speak the AI reply out loud
        speakReply(responseText);
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
                        className="mb-4 w-[330px] sm:w-[380px] h-[490px] bg-[#121724] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="px-5 py-3.5 bg-[#1a2133] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#72bbf6]/20 text-[#72bbf6] flex items-center justify-center font-bold text-sm">
                                    AI
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold leading-tight">Indrajeet Assistant</h4>
                                    <p className="text-slate-400 text-[11px]">
                                        {isSpeaking ? "🔊 Speaking..." : "Powered by Gemini • Voice AI"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Direct SVG Speaker Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (voiceEnabled) {
                                            window.speechSynthesis?.cancel();
                                            setIsSpeaking(false);
                                            setVoiceEnabled(false);
                                        } else {
                                            setVoiceEnabled(true);
                                            const lastModelMsg = [...messages].reverse().find((m) => m.role === "model");
                                            if (lastModelMsg) speakReply(lastModelMsg.text, true);
                                        }
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition-colors cursor-pointer ${
                                        voiceEnabled
                                            ? "bg-[#72bbf6]/15 text-[#72bbf6] border-[#72bbf6]/30"
                                            : "bg-white/5 text-slate-400 border-white/10"
                                    }`}
                                    title="Toggle Voice Output"
                                >
                                    {voiceEnabled ? "🔊 ON" : "🔇 OFF"}
                                </button>

                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-white p-1 cursor-pointer text-base font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Status Notification Bar (If Mic Blocked or Listening) */}
                        {statusNote && (
                            <div className="bg-amber-500/15 border-b border-amber-500/30 px-3.5 py-1.5 text-[11px] text-amber-300 font-medium">
                                {statusNote}
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 text-xs leading-relaxed">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`max-w-[84%] px-3.5 py-2.5 rounded-2xl ${
                                            m.role === "user"
                                                ? "bg-[#72bbf6] text-[#090d16] font-medium rounded-br-none"
                                                : "bg-[#1e2538] text-slate-200 border border-white/5 rounded-bl-none"
                                        }`}
                                    >
                                        {m.text}
                                    </div>

                                    {/* Manual "🔊 Listen" button under every AI message */}
                                    {m.role === "model" && (
                                        <button
                                            type="button"
                                            onClick={() => speakReply(m.text, true)}
                                            className="mt-1 text-[10px] text-slate-400 hover:text-[#72bbf6] flex items-center gap-1 px-1 cursor-pointer"
                                        >
                                            🔊 Listen
                                        </button>
                                    )}
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

                        {/* Input Form with Direct SVG Mic & Send Icons */}
                        <form onSubmit={(e) => handleSend(e)} className="p-3 bg-[#1a2133] border-t border-white/5 flex items-center gap-2">
                            <div className="flex-1 relative flex items-center">
                                <input
                                    type="text"
                                    placeholder={isListening ? "Listening... Speak now 🎙️" : "Ask anything..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className={`w-full bg-[#121724] text-white text-xs pl-3.5 pr-10 py-2.5 rounded-xl outline-none border transition-all ${
                                        isListening
                                            ? "border-red-400 placeholder-red-400"
                                            : "border-white/10 focus:border-[#72bbf6]/50 placeholder-slate-500"
                                    }`}
                                />
                                {/* Direct SVG Mic Button */}
                                <button
                                    type="button"
                                    onClick={startListening}
                                    className={`absolute right-2.5 p-1.5 rounded-full transition-colors cursor-pointer ${
                                        isListening ? "text-red-400 bg-red-500/20 animate-pulse" : "text-slate-400 hover:text-[#72bbf6]"
                                    }`}
                                    title="Click to Speak"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                        <line x1="12" x2="12" y1="19" y2="22" />
                                    </svg>
                                </button>
                            </div>

                            {/* Direct SVG Send Button */}
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-9 h-9 rounded-xl bg-[#72bbf6] hover:bg-[#5caeeb] disabled:opacity-50 text-[#090d16] flex items-center justify-center transition-all cursor-pointer shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" x2="11" y1="2" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
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
                className="w-14 h-14 rounded-full bg-[#72bbf6] text-[#090d16] flex items-center justify-center shadow-[0_0_25px_rgba(114,187,246,0.4)] cursor-pointer focus:outline-none font-bold text-lg"
            >
                {isOpen ? "✕" : "AI"}
            </motion.button>
        </div>
    );
}