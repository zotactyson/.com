
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Your OpenRouter API Key
const OPENROUTER_API_KEY = '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';

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Make request to OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // You can change this to any model supported by OpenRouter
        messages: [
          {
            role: 'system',
            content: 'You are ZAIS.ai, a helpful AI assistant. Provide concise and helpful responses.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // Update with your actual URL
          'X-Title': 'ZAIS.ai Chatbot'
        }
      }
    );

    // Extract the AI response
    const aiResponse = response.data.choices[0].message.content;
    
    // Return the response
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});