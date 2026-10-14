# Changes from previous Natural Voice

1. Preserved React UI and existing browser voice fallback.
2. Separate pronunciation just for *spoken* version of name: Sah/साह instead of Shah/शाह. Visible name remains Sah.
3. Natural TTS speech metadata: gentle pace, natural conversational tone, specific name pronunciation.
4. Gemini chat system instructions: less repetition, shorter responses in voice mode, realistic professional human tone, trustworthy skill descriptions, context for follow-up questions.
5. Frontend adds `voiceMode` boolean to chat API request without breaking old endpoints.
6. Optional switch to `gemini-3.8-flash-tts` if user wants to test a higher fidelity model (cost/access dependent).
