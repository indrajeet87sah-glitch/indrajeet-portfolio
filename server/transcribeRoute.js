
import express from 'express';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';

const transcriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too many voice requests. Please try again in 15 minutes.'
  }
});

const acceptAudio = express.raw({
  type: ['audio/*', 'application/octet-stream'],
  limit: '3mb'
});

const SUPPORTED_TYPES = new Set([
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
  'audio/wav',
  'audio/mpeg'
]);

export function registerTranscribeRoute(app) {
  app.post(
    '/api/transcribe',
    transcriptionLimiter,
    acceptAudio,
    async (req, res) => {
      res.set('Cache-Control', 'no-store');

      if (
        !process.env.GEMINI_API_KEY ||
        process.env.GEMINI_API_KEY.startsWith('YOUR_')
      ) {
        return res.status(503).json({
          error: 'AI key is not configured on the server.'
        });
      }

      const mimeType = String(
        req.headers['content-type'] || ''
      ).split(';')[0].toLowerCase().trim();

      const language =
        req.query.lang === 'hi-IN' ? 'Hindi' : 'English';

      const audio = req.body;

      if (
        !SUPPORTED_TYPES.has(mimeType) ||
        !Buffer.isBuffer(audio) ||
        audio.length < 900 ||
        audio.length > 3 * 1024 * 1024
      ) {
        return res.status(400).json({
          error: 'Invalid audio. Record a short voice question and try again.'
        });
      }

      try {
        const client = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY
        });

        const response = await client.models.generateContent({
          model: process.env.GEMINI_STT_MODEL || 'gemini-2.5-flash',
          contents: [{
            role: 'user',
            parts: [
              {
                text: `Transcribe the spoken audio faithfully into written text. The user may speak ${language}, Hindi-English Hinglish, or Indian-accented English. Preserve actual words and proper names. Return ONLY the transcript, without quotes, labels, explanations, or invented words. If there is no intelligible speech, return exactly NO_SPEECH.`
              },
              {
                inlineData: {
                  mimeType,
                  data: audio.toString('base64')
                }
              }
            ]
          }],
          config: {
            temperature: 0,
            maxOutputTokens: 250
          }
        });

        const transcript = String(response.text || '')
          .trim()
          .replace(/^["'“”]+|["'“”]+$/g, '')
          .trim();

        if (!transcript || transcript === 'NO_SPEECH') {
          return res.json({ transcript: '' });
        }

        return res.json({
          transcript: transcript.slice(0, 1000)
        });

      } catch (error) {
        console.error('Gemini transcription failed:', error?.message);

        const limited = /429|quota|rate limit/i.test(
          error?.message || ''
        );

        return res.status(limited ? 429 : 502).json({
          error: limited
            ? 'Speech recognition quota reached. Try again later.'
            : 'Speech recognition unavailable. Check Gemini model and backend logs.'
        });
      }
    }
  );
}
