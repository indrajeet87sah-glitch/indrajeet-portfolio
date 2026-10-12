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

    // Load available voices for mobile & desktop
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

    // Unlock Mobile & Chrome Audio Engine on tap
    const unlockAudioEngine = () => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        window.speechSynthesis.speak(silent);
    };

    // 🔊 AI Voice Output (Mobile + Desktop)
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
            }, 60);
        } catch (err) {
            setIsSpeaking(false);
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

    // 💬 Send Message Function
    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();

        const textToSend = (customPrompt || input).trim();
        if (!textToSend || loading) return;

        if (voiceEnabled) {
            unlockAudioEngine();
        }

        setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
        setInput("");
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
        speakReply(responseText);
    };

    // 🎙️ CHATGPT-STYLE MOBILE & DESKTOP MIC (Auto Permission Popup + Auto Send!)
    const startListening = async () => {
        setStatusNote("");

        // Stop AI speaking if user taps mic
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        // Unlock audio so AI can speak back automatically after user finishes speaking
        if (voiceEnabled) {
            unlockAudioEngine();
        }

        // If already listening, stop it
        if (isListening) {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {}
            }
            setIsListening(false);
            return;
        }

        // Check if user opened via insecure HTTP IP on mobile (e.g. 192.168.x.x)
        if (!window.isSecureContext && window.location.hostname !== "localhost") {
            setStatusNote("⚠️ Mobile par Mic sirf HTTPS (Live Vercel/GitHub Link) par chalta hai, IP address par nahi.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatusNote("⚠️ Kripya Mobile par Chrome ya Safari browser use karein.");
            return;
        }

        // Step 1: Trigger Native Mobile "Allow Microphone?" Popup (Like ChatGPT!)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // Release hardware stream immediately so SpeechRecognition can use the mic on Android
                stream.getTracks().forEach((track) => track.stop());
            } catch (permErr) {
                setStatusNote("⚠️ Mic Allow nahi hua. Browser ke 3-dots (⋮) > Settings > Site Settings > Microphone mein Allow karein.");
                return;
            }
        }

        // Step 2: Start Speech Recognition & Auto-Send when done speaking
        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.lang = "en-IN"; // Supports Hindi, Hinglish & English
            recognition.continuous = false;
            recognition.interimResults = false; // MUST be false for Android Chrome reliability!

            recognition.onstart = () => {
                setIsListening(true);
                setStatusNote("🎙️ Boliye... (Bolna rukte hi message apne aap chala jayega)");
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0]?.[0]?.transcript?.trim();
                if (transcript) {
                    setIsListening(false);
                    setStatusNote("");
                    // 🚀 ChatGPT Style: Auto-send message immediately after speaking!
                    handleSend(null, transcript);
                }
            };

            recognition.onerror = (event) => {
                setIsListening(false);
                if (event.error === "no-speech") {
                    setStatusNote("🎙️ Aawaz nahi aayi. Mic daba kar turant bolein.");
                } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                    setStatusNote("⚠️ Browser mein Mic permission Off hai. Site settings se Allow karein.");
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
            {/* Chat Window */}
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
                                {/* Voice Mute/Unmute Toggle */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (voiceEnabled) {
                                            window.speechSynthesis?.cancel();
                                            setIsSpeaking(false);
                                            setVoiceEnabled(false);
                                        } else {
                                            setVoiceEnabled(true);
                                            const lastMsg = [...messages].reverse().find((m) => m.role === "model");
                                            if (lastMsg) speakReply(lastMsg.text, true);
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

                        {/* Helpful Status Bar */}
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