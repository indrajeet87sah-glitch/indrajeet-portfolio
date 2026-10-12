// src/components/AIChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
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

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

    useEffect(() => {
        window.dispatchEvent(new CustomEvent("chatStateChange", { detail: isOpen }));
        if (!isOpen && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
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

    // 🔊 AI Text-to-Speech Function (Bolkar Jawab Sunane Wala Feature)
    const speakReply = (text) => {
        if (!voiceEnabled || !("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();

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

        const utterance = new SpeechSynthesisUtterance(cleanSpeech);
        utterance.lang = hasHindiScript ? "hi-IN" : "en-IN";
        utterance.rate = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (hasHindiScript) {
            const hindiVoice =
                voices.find((v) => v.name.includes("Google हिन्दी") || v.name.includes("Swara") || v.name.includes("Madhur")) ||
                voices.find((v) => v.lang.includes("hi"));
            if (hindiVoice) utterance.voice = hindiVoice;
        } else {
            const indianEngVoice = voices.find((v) => v.lang === "en-IN") || voices.find((v) => v.lang.includes("en"));
            if (indianEngVoice) utterance.voice = indianEngVoice;
        }

        window.speechSynthesis.speak(utterance);
    };

    // 🎙️ Working Voice Typing Function
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Please use Google Chrome or Microsoft Edge for Voice Input support!");
            return;
        }

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        if (isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.lang = "en-IN";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript));
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error("Mic Error:", event.error);
                setIsListening(false);
                if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                    alert("Mic permission blocked! Address bar mein Lock (🔒) icon par click karke Microphone Allow karein.");
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } catch (err) {
            console.error("Mic start error:", err);
            setIsListening(false);
        }
    };

    // 🧠 Smart Portfolio Fallback (Agar API key ya internet mein koi bhi issue aaye toh bhi 100% sahi jawab dega)
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
            return "Aap Indrajeet Kumar Sah se seedha Email (indrakumar2014.sah@gmail.com) ya Phone (+91-7890330625) par sampark kar sakte hain, ya portfolio ke Contact form se message bhej sakte hain!";
        }
        return "Hello! Main Indrajeet Kumar Sah ka Portfolio AI Assistant hoon. Aap mujhse unke React & UI/UX skills, projects, internship experience, ya contact details ke baare mein kuch bhi pooch sakte hain!";
    };

    // 💬 Direct REST Fetch with Auto-Model Detection (Bypasses @google/generative-ai bugs!)
    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();

        const textToSend = customPrompt || input.trim();
        if (!textToSend || loading) return;

        setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
        if (!customPrompt) setInput("");
        setLoading(true);

        const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${textToSend}`;
        let responseText = "";

        if (API_KEY && API_KEY.trim()) {
            const cleanKey = API_KEY.trim();
            const candidateModels = [
                "gemini-3.8-flash",
                "gemini-3.8-flash-preview",
                "gemini-3-flash",
                "gemini-3.0-flash",
                "gemini-2.5-flash"
            ];

            // 1. Try direct fetch on latest models
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
                } catch (err) {
                    // Continue to next model
                }
            }

            // 2. If still empty, dynamically fetch available flash model from Google API
            if (!responseText) {
                try {
                    const listRes = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`
                    );
                    const listData = await listRes.json();
                    const validModel = listData?.models?.find(
                        (m) =>
                            m.name.includes("flash") &&
                            m.supportedGenerationMethods?.includes("generateContent")
                    );

                    if (validModel) {
                        const genRes = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/${validModel.name}:generateContent?key=${cleanKey}`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    contents: [{ parts: [{ text: fullPrompt }] }]
                                })
                            }
                        );
                        const genData = await genRes.json();
                        const text = genData?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) responseText = text.trim();
                    }
                } catch (err) {
                    console.warn("Dynamic model lookup fallback triggered.");
                }
            }
        }

        // 3. If API key is missing or quota/model fails, use Smart Portfolio Fallback (Never shows ugly error!)
        if (!responseText) {
            responseText = getPortfolioFallbackReply(textToSend);
        }

        setMessages((prev) => [...prev, { role: "model", text: responseText }]);
        speakReply(responseText);
        setLoading(false);
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
                                    <p className="text-slate-400 text-[11px]">Powered by Gemini • Voice AI</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Voice Mute / Unmute Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                                        setVoiceEnabled((prev) => !prev);
                                    }}
                                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                        voiceEnabled ? "text-[#72bbf6] hover:text-white" : "text-slate-500 hover:text-slate-300"
                                    }`}
                                    title={voiceEnabled ? "Mute AI Voice" : "Unmute AI Voice"}
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {voiceEnabled ? "volume_up" : "volume_off"}
                                    </span>
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

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 text-xs leading-relaxed">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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
                                    placeholder={isListening ? "Listening... Speak now 🎙️" : "Ask anything..."}
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
                                    className={`absolute right-2.5 p-1 rounded-full transition-colors cursor-pointer ${
                                        isListening ? "text-red-400 bg-red-500/10 animate-pulse" : "text-slate-400 hover:text-[#72bbf6]"
                                    }`}
                                    title="Voice Type"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {isListening ? "mic_off" : "mic"}
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