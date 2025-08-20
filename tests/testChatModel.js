const { generateReply } = require('../src/services/chatbotService');

const testCases = [
  { input: "Who are you?", sentiment: "neutral" },
  { input: "Hi", sentiment: "neutral" },
  { input: "I am stressed about exams", sentiment: "neutral" },
  { input: "I feel good today", sentiment: "positive" },
  { input: "My family is supportive", sentiment: "neutral" },
  { input: "I need help with assignments", sentiment: "neutral" },
  { input: "I feel sad and alone", sentiment: "negative" },
  { input: "Thank you", sentiment: "neutral" },
  { input: "Can you tell me about depression?", sentiment: "neutral" },
  { input: "I'm excited about the holidays", sentiment: "positive" },
  { input: "Life is hard", sentiment: "negative" },
  { input: "I am failing  to reach out to my roommate", sentiment: "negative" },
];

console.log("===== Rule-based Chatbot Test Run =====");

testCases.forEach(({ input, sentiment }, idx) => {
  const response = generateReply(input, sentiment);
  console.log(`Test ${idx + 1}:`);
  console.log(`User: "${input}" (sentiment: ${sentiment})`);
  console.log(`Bot:  "${response}"`);
  console.log("---------------------------------------");
});
