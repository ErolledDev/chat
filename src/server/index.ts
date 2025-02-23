import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateApiKey, logChat } from '../lib/supabase';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyAQH7FY6vNYNNUCnb31_PPH-ldDfw6G0xI');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(express.json());
app.use(limiter);

// Serve static chat.js file
app.get('/chat.js', (req, res) => {
  res.sendFile('chat.js', { root: './public' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const apiKey = req.headers.authorization?.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Validate API key and get user data
    const userData = await validateApiKey(apiKey);
    if (!userData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get the model and start chat
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Log the chat
    await logChat({
      user_id: userData.user_id,
      session_id: sessionId,
      message: message,
      response: text,
      tokens_used: text.length // Approximate token count
    });

    res.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});