const axios = require('axios');

const HF_API_KEY = process.env.HF_API_KEY; // Hugging Face API key from .env
const SENTIMENT_MODEL = process.env.SENTIMENT_MODEL; // e.g., distilbert-base-uncased-finetuned-sst-2-english
const HF_API_URL = `https://api-inference.huggingface.co/models/${SENTIMENT_MODEL}`;
const HF_HEADERS = { Authorization: `Bearer ${HF_API_KEY}` };

/**
 * Analyze sentiment of a given text.
 * Returns an object: { label: 'positive'|'negative'|'neutral', score: float }
 */
async function analyzeSentiment(text) {
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: text },
      { headers: HF_HEADERS, timeout: 5000 }
    );

    if (response.data && Array.isArray(response.data) && response.data[0]) {
      const result = response.data[0][0];
      const label = result.label.toLowerCase().includes('positive') ? 'positive' : 'negative';
      const score = result.score || 0;
      return { label, score };
    }

    // Fallback if API response unexpected
    return { label: 'neutral', score: 0 };
  } catch (err) {
    console.error('Sentiment API error, fallback used:', err.message);

    // Basic regex-based fallback
    if (text.match(/(sad|depressed|bad|angry|upset|tired)/i)) return { label: 'negative', score: 0.7 };
    if (text.match(/(happy|good|great|fine|okay|awesome)/i)) return { label: 'positive', score: 0.7 };
    return { label: 'neutral', score: 0 };
  }
}

module.exports = { analyzeSentiment };
