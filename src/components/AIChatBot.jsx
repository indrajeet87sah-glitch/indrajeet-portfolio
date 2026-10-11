// src/components/AIChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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
        "Indrajeet is a Front-End Developer skilled in React, Tailwind CSS, JavaScript, and UI engineering. " +
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

    // Custom event jab chat open/close ho
    useEffect(() => {
        window.dispatchEvent(new CustomEvent("chatStateChange", { detail: isOpen }));
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

    // 1. IMPROVED Voice Typing Function (Live Typing + Mobile/Desktop Fix)
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Aapke browser mein Voice Typing support nahi hai. Kripya Google Chrome ya Edge browser use karein.");
            return;
        }

        // Agar mic pehle se on hai, toh click karne par band karein
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.lang = "en-IN"; // Hindi + English (Hinglish) dono samjhega
            recognition.continuous = false;
            recognition.interimResults = true; // Bolte waqt live type karega!

            // Pehle se input box mein jo text hai usko save rakhein
            const previousInput = input.trim();

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                // Live text update in input box
                setInput(previousInput ? `${previousInput} ${currentTranscript}` : currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error("Mic Error:", event.error);
                setIsListening(false);

                if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                    alert("Mic permission block hai! Browser ke address bar mein URL ke paas (🔒) par click karke Microphone ko 'Allow' karein.");
                } else if (event.error === "network") {
                    alert("Browser voice service block kar raha hai (Brave browser mein yeh issue aata hai, kripya Chrome use karein).");
                }
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } catch (err) {
            console.error("Mic start crash:", err);
            setIsListening(false);
        }
    };

    // 2. Message Send Function (With Auto-Fallback so it never fails)
    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();

        const textToSend = customPrompt || input.trim();
        if (!textToSend || loading) return;

        setMessages((prev) => [...prev, { role: "user", text: textToSend }]);
        if (!customPrompt) setInput("");
        setLoading(true);

        try {
            if (!API_KEY) {
                throw new Error("API_KEY_MISSING");
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${textToSend}`;

            let responseText = "";
            // Models list: agar pehla na chale toh dusra try karega
            const modelsToTry = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3-flash-preview"];
            let lastError = null;

            for (const modelName of modelsToTry) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(fullPrompt);
                    responseText = result.response.text();
                    if (responseText) break; // Agar jawab mil gaya toh loop rok do
                } catch (err) {
                    lastError = err;
                }
            }

            if (!responseText && lastError) {
                throw lastError;
            }

            setMessages((prev) => [...prev, { role: "model", text: responseText }]);
        } catch (error) {
            console.error("Gemini Exact Error:", error);

            let errorMsg = "Sorry, abhi network ya API key mein kuch issue aa raha hai.";
            if (error.message === "API_KEY_MISSING") {
                errorMsg = "Error: .env file mein VITE_GEMINI_API_KEY nahi mili! File check karke server restart karein.";
            } else if (error.message) {
                errorMsg = `API Error: ${error.message}`;
            }

            setMessages((prev) => [
                ...prev,
                { role: "model", text: errorMsg }
            ]);
        } finally {
            setLoading(false);
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
                                    <p className="text-slate-400 text-[11px]">Powered by Gemini</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
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
                                    className="absolute right-3 text-slate-400 hover:text-[#72bbf6] transition-colors cursor-pointer"
                                    title="Voice Type"
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${isListening ? "text-red-400 animate-pulse" : ""}`}>
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