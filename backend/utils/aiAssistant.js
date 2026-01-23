// utils/aiAssistant.js - FIXED VERSION with better technical detection
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

// utils/aiAssistant.js - SIMPLIFIED VERSION
// AI assistant ONLY handles greetings and pure non-technical queries
// All technical queries go directly to main model WITHOUT interference

const classifyIssueType = async (title, description) => {
  try {
    console.log(`\n=== CLASSIFYING: "${title}" ===`);
    
    const descriptionLower = description.toLowerCase().trim();
    const titleLower = title.toLowerCase().trim();
    const fullText = titleLower + ' ' + descriptionLower;
    
    // 1. STRICTLY define what is NON-TECHNICAL
    const pureNonTechnicalPhrases = [
      'vacation policy', 'leave policy', 'hr policy', 'company policy',
      'salary slip', 'pay slip', 'holiday schedule', 'office timing',
      'attendance policy', 'work from home policy', 'dress code',
      'complaint about colleague', 'personal issue', 'behavior issue',
      'when is holiday', 'when is next holiday', 'when is office party',
      'who is my manager', 'where is hr department',
      'benefits enrollment', 'insurance query', 'reimbursement process',
      'expense claim form', 'training schedule', 'career growth path',
      'promotion process', 'appraisal cycle', 'team lunch arrangement',
      'office event date', 'birthday celebration', 'stationery request',
      'office supplies order', 'furniture request', 'travel approval',
      'flight booking process', 'hotel booking policy', 'reporting structure',
      'organization chart', 'company culture', 'values document',
      'mission statement', 'vision statement'
    ];
    
    // 2. Simple greeting detection
    const isJustGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|how are you|what\'?s up)$/i.test(descriptionLower);
    
    // 3. VERY short ambiguous messages (less than 10 chars)
    const isTooShort = description.length < 10;
    
    console.log(`Is pure greeting: ${isJustGreeting}`);
    console.log(`Is too short: ${isTooShort}`);
    console.log(`Full query length: ${description.length}`);
    
    // DECISION LOGIC - VERY SIMPLE
    
    // CASE 1: Pure greetings ONLY (no other content)
    if (isJustGreeting && description.length < 30) {
      console.log("Handled by AI: Pure greeting");
      return {
        category: "General",
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.95,
        priority: "low",
        aiResponse: "Hello! I'm here to help with technical support. Please describe your technical issue.",
        reason: "Pure greeting",
        useMainModel: false
      };
    }
    
    // CASE 2: Check for PURE non-technical (must contain ONLY non-technical phrases)
    let isPureNonTechnical = false;
    for (const phrase of pureNonTechnicalPhrases) {
      if (fullText.includes(phrase)) {
        // Check if it contains any technical keywords (if yes, it's mixed)
        const hasTechnicalKeywords = /(outlook|email|wifi|network|printer|computer|laptop|software|hardware|error|crash|not working|broken|fix|install|update|password|login|vpn|server)/i.test(fullText);
        if (!hasTechnicalKeywords) {
          isPureNonTechnical = true;
          break;
        }
      }
    }
    
    if (isPureNonTechnical) {
      console.log("Handled by AI: Pure non-technical query");
      return {
        category: "Non-Technical",
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.9,
        priority: "low",
        aiResponse: "This appears to be a non-technical query. For HR, policies, administrative, or personal matters, please contact the relevant department directly.",
        reason: "Pure non-technical query",
        useMainModel: false
      };
    }
    
    // CASE 3: VERY short ambiguous (less than 10 chars, not greeting)
    if (isTooShort && !isJustGreeting && description.length > 0) {
      console.log("Handled by AI: Very short ambiguous query");
      return {
        category: "General",
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.8,
        priority: "low",
        aiResponse: "Could you please provide more details about what you need help with?",
        reason: "Very short ambiguous query",
        useMainModel: false
      };
    }
    
    // EVERYTHING ELSE: Send to main AI model WITHOUT interference
    console.log("Sending to main AI model: Technical or ambiguous query");
    return {
      category: "General IT", // Temporary - main model will override
      isTechnical: true,
      shouldHandleByAI: false, // CRITICAL: Don't handle with AI
      confidence: 0.5, // Let main model determine confidence
      priority: "medium", // Temporary - main model will override
      reason: "Technical or ambiguous query - using main model",
      useMainModel: true // CRITICAL: Use main model
    };
    
  } catch (error) {
    console.error("Error in classifyIssueType:", error);
    // On error, default to main model
    return {
      category: "General IT Support",
      isTechnical: true,
      shouldHandleByAI: false,
      confidence: 0.5,
      priority: "medium",
      reason: "Error - defaulting to main model",
      useMainModel: true
    };
  }
};

const generateAIResponse = async (issue, isNonTechnical = false) => {
  // Simple responses for AI-handled cases only
  if (isNonTechnical) {
    return "This appears to be a non-technical matter. Please contact the relevant department for assistance.";
  } else {
    return "Please provide more details about the technical issue.";
  }
};

module.exports = {
  classifyIssueType,
  generateAIResponse
};
