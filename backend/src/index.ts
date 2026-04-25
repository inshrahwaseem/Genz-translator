import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini client
// Note: Requires GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({});

app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, mode } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for translation' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    let systemPrompt = '';
    
    if (mode === 'to-genz') {
      systemPrompt = `You are an expert in Gen-Z and Gen-Alpha internet slang. 
Translate the user's formal or millennial text into authentic, natural-sounding Gen-Z/Gen-Alpha slang. 
Use modern terms like 'skibidi', 'rizz', 'gyat', 'sigma', 'bet', 'no cap', 'sus', 'bussin', 'fr fr', 'ong', etc., where appropriate, but don't overdo it to the point of being unreadable. 
Just give the translated text without any explanations or quotes.`;
    } else {
      systemPrompt = `You are a translator that converts Gen-Z and Gen-Alpha internet slang back into proper, formal, standard English. 
Translate the user's slang into clear and easy-to-understand plain English. 
Just give the translated text without any explanations or quotes.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nText to translate: ' + text }] }
      ]
    });

    const translatedText = response.text || 'Translation failed.';

    res.json({ translation: translatedText.trim() });
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate. Please try again later.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
