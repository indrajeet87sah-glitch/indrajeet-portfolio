// src/components/AIChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusNote, setStatusNote] = useState("");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const INITIAL_MSG = {
        role: "model",
        text: "Hi! I am Indrajeet's AI Agent. I have read his entire live portfolio—including Selected Works, Skills, and Qualifications. Ask me anything!",
        action: "quick_links"
    };

    const [messages, setMessages] = useState(() => {
        try {
            const saved = sessionStorage.getItem("indrajeet_chat_history");
            return saved ? JSON.parse(saved) : [INITIAL_MSG];
        } catch {
            return [INITIAL_MSG];
        }
    });

    const chatBottomRef = useRef(null);
    const chipsRef = useRef(null);
    const recognitionRef = useRef(null);
    const voicesRef = useRef([]);
    const speechQueueRef = useRef([]);
    const isCancelledRef = useRef(false);
    
    // CACHE for lightning fast DOM reading
    const cachedPortfolioData = useRef(null);

    const getApiKey = () => {
        return (
            import.meta.env.VITE_GEMINI_API_KEY ||
            localStorage.getItem("indrajeet_ai_key") ||
            ""
        ).trim();
    };

    // 1. LIVE DOM READER
    const readEntireWebpage = () => {
        try {
            const clone = document.body.cloneNode(true);
            const chatEl = clone.querySelector("#ai-chatbot-root");
            if (chatEl) chatEl.remove();

            const structuredData = [];
            const elements = clone.querySelectorAll("section, header, footer, article, [id]");

            elements.forEach((el) => {
                const sectionId = el.id ? `[Section: #${el.id}]` : "";
                const text = (el.innerText || "").replace(/\s+/g, " ").trim();
                if (text && text.length > 20) {
                    structuredData.push(`${sectionId}${text}`);
                }
            });

            let finalContent = structuredData.join("\n---\n");
            if (!finalContent || finalContent.length < 100) {
                finalContent = (clone.innerText || "").replace(/\s+/g, " ").trim();
            }

            return finalContent.slice(0, 12000); 
        } catch (err) {
            return "";
        }
    };

    // 2. ULTRA-SMART DYNAMIC SYSTEM INSTRUCTION
    const getDynamicSystemInstruction = () => {
        if (!cachedPortfolioData.current) {
            cachedPortfolioData.current = readEntireWebpage();
        }

        return `You are "Indrajeet AI Agent", an elite, highly intelligent, and professional executive assistant for Indrajeet Kumar Sah's portfolio website. 
You possess full context of his career, skills, and projects. Answer with extreme confidence, precision, and a warm professional tone.

LIVE WEBPAGE CONTENT:
"""
${cachedPortfolioData.current}
"""

COMPLETE RESUME & PROFILE KNOWLEDGE:
1. Full Name: Indrajeet Kumar Sah
2. Role: Front-End Developer & UI/UX Designer.
3. Location: Kolkata / West Bengal, India.
4. Qualifications & Experience:
   - Completed Web Development Internship at Clinchsoft Technologies.
   - Strong expertise in JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, React.js (Learning phase), UI/UX Design, Python, System Design, and Git/GitHub.
5. Contact Details:
   - Email: indrakumar2014.sah@gmail.com
   - Phone / WhatsApp: +91-7890330625
   - GitHub: github.com/indrajeet87sah-glitch

CRITICAL RULES FOR SMART RESPONSES:
1. NEVER say you don't have information about "Selected Works" or any portfolio section—extract the exact project names and details from the LIVE WEBPAGE CONTENT above!
2. Be brief but highly impactful. Use 1 to 2 concise, persuasive sentences max. Be a hype-man for Indrajeet's skills without sounding unnatural.
3. NEVER share any Figma link.
4. If asked in Hindi/Hinglish, reply in pure, conversational Hindi (Devanagari script) so the voice engine sounds like a real professional Indian assistant.`;
    };

    const SUGGESTIONS = [
        { label: "Selected Works 🚀", prompt: "Selected Works section mein Indrajeet ke kaun-kaun se projects hain?" },
        { label: "Top Skills 💻", prompt: "Indrajeet ke top technical skills kya hain?" },
        { label: "Qualifications 🎓", prompt: "Indrajeet ki qualifications aur internship experience kya hai?" },
        { label: "Location & Contact 📍", prompt: "Indrajeet kahan rehte hain aur unse contact kaise karein?" }
    ];

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
        try {
            sessionStorage.setItem("indrajeet_chat_history", JSON.stringify(messages));
        } catch {}
    }, [messages]);

    const stopAllAudio = () => {
        isCancelledRef.current = true;
        speechQueueRef.current = [];
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
    };

    useEffect(() => {
        window.dispatchEvent(new CustomEvent("chatStateChange", { detail: isOpen }));
        if (!isOpen) stopAllAudio();
    }, [isOpen]);

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

    const triggerPageNavigation = (queryText) => {
        const q = queryText.toLowerCase();
        const sectionMap = [
            { keywords: ["project", "selected work", "works", "portfolio", "प्रोजेक्ट"], ids: ["projects", "work", "selected-works", "portfolio"] },
            { keywords: ["skill", "tech", "stack", "स्किल"], ids: ["skills", "skill", "tech", "technologies"] },
            { keywords: ["contact", "hire", "email", "reach", "संपर्क"], ids: ["contact", "connect", "hire"] },
            { keywords: ["about", "experience", "intern", "बारे", "qualification"], ids: ["about", "experience"] }
        ];

        for (const group of sectionMap) {
            if (group.keywords.some((kw) => q.includes(kw))) {
                for (const id of group.ids) {
                    const el =
                        document.getElementById(id) ||
                        document.querySelector(`[data-section="${id}"]`) ||
                        document.querySelector(`section#${id}`);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                        break;
                    }
                }
            }
        }
    };

    const detectActionCard = (userQ) => {
        const q = userQ.toLowerCase();
        if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("call") || q.includes("संपर्क") || q.includes("hire")) {
            return "contact_card";
        }
        if (q.includes("project") || q.includes("selected work") || q.includes("github") || q.includes("प्रोजेक्ट")) {
            return "project_card";
        }
        return null;
    };

    const formatTextForHumanPronunciation = (rawText, isHindi) => {
        let text = rawText;

        const commonFixes = [
            [/UI\/UX/gi, isHindi ? "यूआई और यूएक्स" : "U I and U X"],
            [/React\.js/gi, isHindi ? "रिएक्ट जेएस" : "React J S"],
            [/HTML5/gi, isHindi ? "एचटीएमएल फाइव" : "H T M L 5"],
            [/CSS3/gi, isHindi ? "सीएसएस थ्री" : "C S S 3"],
            [/ES6\+/gi, isHindi ? "ईएस सिक्स प्लस" : "E S 6 plus"],
            [/indrakumar2014\.sah@gmail\.com/gi, isHindi ? "इंद्रकुमार दो हज़ार चौदह डॉट साह एट जीमेल डॉट कॉम" : "indrakumar 2014 dot sah at gmail dot com"],
            [/\+91-7890330625/g, isHindi ? "सात आठ नौ शून्य, तीन तीन शून्य, छः दो पांच" : "7 8 9 0, 3 3 0, 6 2 5"]
        ];

        commonFixes.forEach(([regex, replacement]) => {
            text = text.replace(regex, replacement);
        });

        if (isHindi) {
            const hindiPhonetics = [
                [/Indrajeet Kumar Sah/gi, "इंद्रजीत कुमार साह"],
                [/Indrajeet/gi, "इंद्रजीत"],
                [/Clinchsoft Technologies/gi, "क्लिंचसॉफ्ट टेक्नोलॉजीज"],
                [/HireReady AI/gi, "हायर रेडी एआई"],
                [/Tailwind CSS/gi, "टेलविंड सीएसएस"],
                [/GitHub/gi, "गिटहब"],
                [/Kolkata/gi, "कोलकाता"],
                [/\bmein\b/gi, "में"],
                [/\bhain\b/gi, "हैं"],
                [/\bhai\b/gi, "है"]
            ];
            hindiPhonetics.forEach(([regex, word]) => {
                text = text.replace(regex, word);
            });
        }

        return text
            .replace(/https?:\/\/[^\s]+/g, "")
            .replace(/[*#`_~•💻🚀💼📬🌟🎓📍🎙️🔊🔇✕⚠️✅]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    const pickBestHumanVoice = (isHindi) => {
        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;

        if (isHindi) {
            return voices.find((v) => v.name.includes("Google हिन्दी") || v.lang === "hi-IN" || v.lang.startsWith("hi"));
        } else {
            return voices.find((v) => v.name.includes("Google") && v.lang === "en-IN") || voices.find((v) => v.lang.startsWith("en"));
        }
    };

    const speakReply = (textToRead, forceSpeak = false) => {
        if ((!voiceEnabled && !forceSpeak) || !textToRead || !("speechSynthesis" in window)) return;

        stopAllAudio();
        isCancelledRef.current = false;

        const isHindi = /[\u0900-\u097F]/.test(textToRead) || /\b(mein|hain|hai|ke|ka|ki)\b/i.test(textToRead);
        const formattedText = formatTextForHumanPronunciation(textToRead, isHindi);
        if (!formattedText) return;

        const sentences = formattedText.split(/(?<=[।.!?])\s+/).map((s) => s.trim()).filter(Boolean);
        if (sentences.length === 0) return;

        speechQueueRef.current = sentences;
        const selectedVoice = pickBestHumanVoice(isHindi);

        const speakNextChunk = () => {
            if (isCancelledRef.current || speechQueueRef.current.length === 0) {
                setIsSpeaking(false);
                return;
            }
            const chunk = speechQueueRef.current.shift();
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = isHindi ? "hi-IN" : "en-IN";
            if (selectedVoice) utterance.voice = selectedVoice;
            utterance.rate = 0.95;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                if (!isCancelledRef.current && speechQueueRef.current.length > 0) {
                    setTimeout(speakNextChunk, 160);
                } else {
                    setIsSpeaking(false);
                }
            };
            window.speechSynthesis.speak(utterance);
        };
        setTimeout(() => { window.speechSynthesis.resume(); speakNextChunk(); }, 50);
    };

    // ⚡ 3. ULTRA-FAST DIRECT API CALL (No heavy fallback loops)
    const fetchFromGemini = async (apiKey, conversationMessages) => {
        const dynamicInstruction = getDynamicSystemInstruction();

        const contents = [
            { role: "user", parts: [{ text: dynamicInstruction }] },
            { role: "model", parts: [{ text: "Understood! I will reply smartly and super fast." }] },
            // Only send the last 4 messages instead of 8 to reduce payload and speed up response
            ...conversationMessages.slice(-4).map((m) => ({
                role: m.role === "user" ? "user" : "model",
                parts: [{ text: m.text }]
            }))
        ];

        // Hit the fastest available model directly
        const priorityModels = ["gemini-3.8-flash", "gemini-flash-latest"];
        let lastError = null;

        for (const model of priorityModels) {
            try {
                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ contents })
                    }
                );
                const data = await res.json();
                
                if (!data.error && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text.trim();
                } else if (data.error) {
                    lastError = data.error.message;
                }
            } catch (e) {
                lastError = e.message;
            }
        }

        throw new Error(lastError || "API Server is busy. Please try again.");
    };

    const handleSend = async (e, customPrompt = null) => {
        if (e) e.preventDefault();

        const textToSend = (customPrompt || input).trim();
        if (!textToSend || loading) return;

        stopAllAudio();

        if (textToSend.startsWith("AIzaSy")) {
            localStorage.setItem("indrajeet_ai_key", textToSend);
            setInput("");
            const confirmMsg = "API Key successfully updated! I am ready to assist.";
            setMessages((prev) => [...prev, { role: "model", text: confirmMsg }]);
            speakReply(confirmMsg);
            return;
        }

        triggerPageNavigation(textToSend);

        const updatedMessages = [...messages, { role: "user", text: textToSend }];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        setStatusNote("");

        const apiKey = getApiKey();

        if (!apiKey) {
            setLoading(false);
            const missingKeyMsg =
                "Live website par Gemini API Key set nahi hai! Apni 'AIzaSy...' wali key yahan chat box mein paste karke Send kar dein.";
            setMessages((prev) => [...prev, { role: "model", text: missingKeyMsg }]);
            return;
        }

        try {
            const aiReply = await fetchFromGemini(apiKey, updatedMessages);
            const actionType = detectActionCard(textToSend);
            setMessages((prev) => [...prev, { role: "model", text: aiReply, action: actionType }]);
            setLoading(false);

            try {
                speakReply(aiReply);
            } catch (voiceErr) {
                console.error("Voice playback error:", voiceErr);
            }
        } catch (err) {
            setLoading(false);
            const errMsg = `API Note: ${err.message}.`;
            setMessages((prev) => [...prev, { role: "model", text: errMsg }]);
        }
    };

    const startListening = async () => {
        setStatusNote("");
        stopAllAudio();

        if (isListening) {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
            }
            setIsListening(false);
            return;
        }

        if (!window.isSecureContext && window.location.hostname !== "localhost") {
            setStatusNote("Mobile par Mic sirf HTTPS par chalta hai.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatusNote("Kripya Chrome ya Edge browser use karein.");
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
                setStatusNote("Listening... 🎙️");
            };
            recognition.onresult = (event) => {
                const transcript = event.results[0]?.[0]?.transcript?.trim();
                if (transcript) {
                    setIsListening(false);
                    setStatusNote("");
                    handleSend(null, transcript);
                }
            };
            recognition.onerror = () => { setIsListening(false); setStatusNote(""); };
            recognition.onend = () => setIsListening(false);

            recognition.start();
        } catch (err) {
            setIsListening(false);
        }
    };

    const clearChat = () => {
        stopAllAudio();
        sessionStorage.removeItem("indrajeet_chat_history");
        setMessages([INITIAL_MSG]);
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
                        className="mb-4 w-[330px] sm:w-[385px] h-[500px] bg-[#121724] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
                    >
                        {/* Header */}
                        <div className="px-5 py-3.5 bg-[#1a2133] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full bg-[#72bbf6]/20 text-[#72bbf6] flex items-center justify-center font-bold text-sm">
                                    AI
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1a2133] rounded-full"></span>
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold leading-tight">Indrajeet's AI Assistant</h4>
                                    <div className="flex items-center gap-1.5">
                                        {isSpeaking ? (
                                            <span className="text-[#72bbf6] text-[11px] font-medium flex items-center gap-1 animate-pulse">
                                                Speaking with you...
                                            </span>
                                        ) : (
                                            <p className="text-slate-400 text-[11px]">Interactive Portfolio Guide • Online</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (voiceEnabled) {
                                            stopAllAudio();
                                            setVoiceEnabled(false);
                                        } else {
                                            setVoiceEnabled(true);
                                            const lastMsg = [...messages].reverse().find((m) => m.role === "model");
                                            if (lastMsg) speakReply(lastMsg.text, true);
                                        }
                                    }}
                                    className={`text-xs px-2 py-0.5 rounded-full border transition cursor-pointer ${
                                        voiceEnabled ? "border-[#72bbf6]/40 text-[#72bbf6] bg-[#72bbf6]/10" : "border-white/10 text-slate-400"
                                    }`}
                                    title="Toggle Voice"
                                >
                                    {voiceEnabled ? "🔊" : "🔇"}
                                </button>
                                <button type="button" onClick={clearChat} className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded border border-white/10 cursor-pointer" title="Clear Chat">↻</button>
                                <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><span className="material-symbols-outlined text-[18px]">close</span></button>
                            </div>
                        </div>

                        {statusNote && <div className="bg-[#72bbf6]/15 border-b border-[#72bbf6]/30 px-3.5 py-1.5 text-[11px] text-[#72bbf6] font-medium">{statusNote}</div>}

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 text-xs leading-relaxed">
                            {messages.map((m, idx) => (
                                <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${m.role === "user" ? "bg-[#72bbf6] text-[#090d16] font-medium rounded-br-none" : "bg-[#1e2538] text-slate-200 border border-white/5 rounded-bl-none"}`}>
                                        {m.text}
                                    </div>

                                    {m.role === "model" && m.action === "contact_card" && (
                                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                                            <a href="mailto:indrakumar2014.sah@gmail.com" className="bg-[#72bbf6]/15 hover:bg-[#72bbf6]/25 text-[#72bbf6] border border-[#72bbf6]/30 px-2.5 py-1 rounded-lg text-[11px] font-medium transition">Email Indrajeet</a>
                                            <a href="tel:+917890330625" className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px] font-medium transition">Call +91-7890330625</a>
                                        </div>
                                    )}

                                    {m.role === "model" && m.action === "project_card" && (
                                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                                            <a href="https://github.com/indrajeet87sah-glitch" target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-2.5 py-1 rounded-lg text-[11px] font-medium transition">View GitHub</a>
                                            <button type="button" onClick={() => triggerPageNavigation("projects")} className="bg-[#72bbf6]/15 hover:bg-[#72bbf6]/25 text-[#72bbf6] border border-[#72bbf6]/30 px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer">Scroll to Projects</button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#1e2538] text-slate-400 px-3 py-2 rounded-2xl rounded-bl-none border border-white/5 text-[11px] flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-[#72bbf6] rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-[#72bbf6] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-[#72bbf6] rounded-full animate-bounce [animation-delay:0.3s]"></span>
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
                                <button key={idx} type="button" disabled={loading} onClick={() => handleSend(null, item.prompt)} className="text-[11px] whitespace-nowrap bg-white/5 hover:bg-[#72bbf6]/20 hover:text-[#72bbf6] text-slate-300 px-2.5 py-1 rounded-full border border-white/10 transition-colors disabled:opacity-50 flex-shrink-0 cursor-pointer shadow-sm">
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={(e) => handleSend(e)} className="p-3 bg-[#1a2133] border-t border-white/5 flex items-center gap-2">
                            <div className="flex-1 relative flex items-center">
                                <input
                                    type="text"
                                    placeholder={isListening ? "Listening..." : "Ask about Selected Works, Skills..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className={`w-full bg-[#121724] text-white text-xs pl-3.5 pr-10 py-2.5 rounded-xl outline-none border transition-all ${isListening ? "border-red-400/70 placeholder-red-400" : "border-white/10 focus:border-[#72bbf6]/50 placeholder-slate-500"}`}
                                />
                                <button type="button" onClick={startListening} className={`absolute right-3 transition-colors cursor-pointer ${isListening ? "text-red-400 animate-pulse" : "text-slate-400 hover:text-[#72bbf6]"}`} title="Tap & Speak">
                                    <span className="material-symbols-outlined text-[18px]">mic</span>
                                </button>
                            </div>
                            <button type="submit" disabled={loading || !input.trim()} className="w-9 h-9 rounded-xl bg-[#72bbf6] hover:bg-[#5caeeb] disabled:opacity-50 text-[#090d16] flex items-center justify-center transition-all cursor-pointer shrink-0">
                                <span className="material-symbols-outlined text-[18px]">send</span>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative flex items-center">
                {!isOpen && (
                    <motion.div initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 }} className="absolute right-16 px-3.5 py-2 bg-[#1a2133] border border-[#72bbf6]/40 text-white text-xs font-medium rounded-2xl shadow-[0_0_20px_rgba(114,187,246,0.3)] whitespace-nowrap pointer-events-none flex items-center gap-2">
                        <span>👋 Ask Indrajeet's AI Assistant</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </motion.div>
                )}
                {!isOpen && <span className="absolute inset-0 rounded-full bg-[#72bbf6] opacity-75 animate-ping pointer-events-none"></span>}
                <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen((prev) => !prev)} className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#5caeeb] to-[#72bbf6] text-[#090d16] flex items-center justify-center shadow-[0_0_30px_rgba(114,187,246,0.6)] cursor-pointer focus:outline-none border-2 border-white/20" title="Talk with AI Assistant">
                    <span className="material-symbols-outlined text-[26px] font-bold">{isOpen ? "close" : "smart_toy"}</span>
                </motion.button>
            </div>
        </div>
    );
}