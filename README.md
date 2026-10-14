# Human-like Voice v2 — Indrajeet Portfolio AI

Ye update **aapke pehle se working natural voice chatbot** ko refine karta hai. UI, Tailwind, Gemini key, proxy aur Start/Stop Voice ko nahi badalta.

## Kya sudhaara hai

- **Sah ≠ Shah:** Display par original **Indrajeet Kumar Sah**, Hindi mein **इंद्रजीत कुमार साह**. Sirf synthesized speech mein English name ko **Indrajeet Kumar Saah** bola jayega. Hindi speech mein **साह**, **शाह** nahi. Accent/voice-engine par result depend karta hai.
- **Human-style answers:** AI prompts conversational aur less robotic; questions ke context aur Hinglish ko samjhega.
- **Voice-specific answers:** Start Voice mode ke liye 1–2 concise spoken sentences; regular chat detail zaroorat ke mutabik.
- **Natural TTS style:** Pauses, tone, Indian Hindi/English delivery. Browser fallback bhi pronunciation fix apply karta hai.

## Install (simple steps)

1. Pehle backup lein: `src/components/AIChatBot.jsx`, `server/index.js`.
2. ZIP mein se **sirf yeh 2 updated files** apne existing project ke same path par paste/replace karein. Agar aapne backend mein apne custom changes kiye hain to unhe merge karein.
3. **server/.env, vite.config.js, portfolioKnowledge.js ya API key badalne ki zaroorat nahi.**
4. Backend terminal mein `Ctrl+C`, phir `npm run dev`.
5. Frontend terminal mein `Ctrl+C`, phir `npm run dev`.
6. Browser mein **hard refresh (Ctrl+Shift+R)**. Chatbot mein `✨ Natural AI` + `HI` chunein aur Start Voice bolkar test karein: **"इंद्रजीत कुमार साह के बारे में बताइए"**. Phir `EN` mein **"How do you pronounce Indrajeet Kumar Sah?"** ya **"Tell me about Indrajeet Kumar Sah"**.
7. Dekhein ki voice "साह" ko "शाह" jaisa to nahi bol rahi. Agar model phir bhi galat bole, neeche optional high-quality model try karein.

## Optional: Difficult pronunciation ke liye higher-quality voice

Google Gemini 3.8 Flash TTS difficult pronunciations mein Flash-Lite se behtar ho sakta hai; ismein extra cost lag sakti hai. `server/.env` mein existing `GEMINI_TTS_MODEL` line ko replace karein (duplicate lines mat rakhein):

```env
GEMINI_TTS_MODEL=gemini-3.8-flash-tts
```

Phir **backend restart** karein. Ye optional hai; default `gemini-3.8-flash-lite-tts` hi hai.

Natural model par hamesha exact accent/pronunciation guarantee nahi hoti. Gemini unavailable/quota limit par browser voice fallback ho sakti hai. Apni API key kabhi share na karein.

## Files

- `src/components/AIChatBot.jsx`: human voice + voice-mode requests
- `server/index.js`: smarter conversation prompt + TTS pronunciation
- `server/portfolioKnowledge.js`: reference only — apni original customized file ko na badlein
- `server/.env.example`: sample only — apni actual key ko na badlein

## Verification notes

Local static syntax tests performed. Gemini API (requires your key), browser speech and paid TTS model audio were **not live-tested** in this environment.

Official Gemini guide: https://ai.google.dev/gemini-api/docs/speech-generation
