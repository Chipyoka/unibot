const fs = require('fs');
const path = require('path');

// Load JSON file with predefined Q&A
const qaFilePath = path.join(__dirname, '../data/chatbotQA.json');
let qaData = {};
try {
  qaData = JSON.parse(fs.readFileSync(qaFilePath, 'utf-8'));
} catch (err) {
  console.error('Failed to load chatbot QA file:', err.message);
}

// Fallback responses
const neutralFallbacks = [
  "I understand. Can you tell me more?",
  "Interesting, please go on.",
  "Hmm, what do you feel about that?",
  "Could you explain that a bit more?"
];
const positiveFallbacks = [
  "That's great to hear! What else is going on?",
  "I'm glad things are going well. Tell me more.",
  "Wonderful! Is there more to that story?"
];
const negativeFallbacks = [
  "I'm sorry to hear that. Would you like to talk about it?",
  "That sounds difficult. How has that been for you?",
  "I see. It's okay to feel that way. Can you elaborate?"
];

/**
 * Generate a conversational reply by finding the BEST keyword match, not just the first one.
 * Sentiment is used to choose a fallback, not to override a good keyword match.
 * @param {string} userMessage
 * @param {string} sentiment - 'positive', 'negative', 'neutral'
 * @returns {string}
 */
function generateReply(userMessage, sentiment = 'neutral') {
  if (!userMessage || !userMessage.trim()) {
    return "Can you tell me a bit more about that?";
  }

  const lowerMsg = userMessage.toLowerCase();
  let bestMatchKey = null;
  let maxKeywordCount = 0;

  // 1. Find the BEST matching key in the dataset.
  // Instead of returning the first match, we find the key with the most matching keywords.
  // This handles cases where a message touches on multiple topics (e.g., "stressed about school and family").
  for (const key in qaData) {
    const keywords = key.split('|');
    let matchCount = 0;

    for (const kw of keywords) {
      // Check if the keyword exists as a whole word for better accuracy
      // This prevents matching "class" in "classic", for example.
      const regex = new RegExp(`\\b${kw.trim()}\\b`, 'i');
      if (regex.test(lowerMsg)) {
        matchCount++;
      }
    }

    // If this key has more matches than our current best, it becomes the new best match.
    if (matchCount > 0 && matchCount > maxKeywordCount) {
      maxKeywordCount = matchCount;
      bestMatchKey = key;
    }
  }

  // 2. If we found a strong keyword match, use it regardless of the general sentiment.
  // The sentiment analysis is often based on the keywords anyway.
  if (bestMatchKey) {
    const responses = qaData[bestMatchKey];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 3. Only if NO keywords are found, use a sentiment-specific fallback.
  // This allows the sentiment to guide the conversation when the topic is new/unrecognized.
  const fallbackArray = sentiment === 'positive' ? positiveFallbacks :
                        sentiment === 'negative' ? negativeFallbacks :
                        neutralFallbacks;

  return fallbackArray[Math.floor(Math.random() * fallbackArray.length)];
}

module.exports = { generateReply };