// utils/aiAssistant.js - AI-POWERED VERSION
// Uses Groq for intelligent classification and response generation
// Trained model used only for high-confidence technical issues

const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

/**
 * Main classification function - uses Groq for intelligent analysis
 * Determines if query is technical, personal, greeting, or irrelevant
 * Returns structured response with confidence scores
 */
const classifyIssueType = async (title, description) => {
  try {
    console.log(`\n=== AI CLASSIFYING: "${title}" ===`);
    console.log(`Description: ${description.substring(0, 100)}...`);
    
    const fullText = `${title}\n${description}`.trim();
    
    // Use Groq to analyze the query intelligently
    const prompt = `
You are an intelligent IT support ticket classifier. Analyze this user query and determine:

1. Is this a technical issue? (true/false)
2. Category: Choose one [Hardware, Software, Network, Email, Access/Login, Database, Security, Other Technical, HR/Personal, General Inquiry, Greeting, Thank You, Feedback]
3. Priority: [critical, high, medium, low]
4. Confidence score: 0.0 to 1.0 (how confident are you in this classification)
5. Should we create a ticket? (true for technical issues, false for greetings/HR/non-technical)
6. Does this need clarification? (true if query is too vague/ambiguous)
7. Generate a helpful AI response for the user
8. Extract any technical parts from mixed queries

User Query:
Title: ${title}
Description: ${description}

Return a JSON object with these exact fields:
{
  "isTechnical": boolean,
  "category": string,
  "priority": string,
  "confidence": number (0.0-1.0),
  "createTicket": boolean,
  "needsClarification": boolean,
  "aiResponse": string (friendly, helpful response),
  "technicalParts": array of strings (if mixed query),
  "reason": string (brief explanation),
  "useTrainedModel": boolean (true if technical and confidence < 0.5)
}

Rules:
- For greetings: isTechnical=false, createTicket=false, confidence=0.95, aiResponse=appropriate greeting
- For HR/personal: isTechnical=false, createTicket=false, confidence=0.9, aiResponse=direct to HR
- For vague queries: needsClarification=true, aiResponse=ask for more details
- For technical issues: isTechnical=true, createTicket=true
- For mixed queries: extract technicalParts and set isTechnical=true
- If confidence < 0.5 AND isTechnical=true, set useTrainedModel=true

Be intelligent and helpful in your responses.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an intelligent IT support assistant that classifies queries and provides helpful responses. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    console.log("Groq Classification Response:", response);

    let classification;
    try {
      classification = JSON.parse(response);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", parseError);
      // Fallback to default classification
      classification = getDefaultClassification(title, description);
    }

    // Validate and sanitize response
    classification = sanitizeClassification(classification, title, description);
    
    console.log("Final Classification:", JSON.stringify(classification, null, 2));
    return classification;

  } catch (error) {
    console.error("Error in AI classification:", error);
    // Return intelligent fallback using Groq directly
    return await fallbackAIAnalysis(title, description);
  }
};

/**
 * Generate AI response for low confidence or ambiguous queries
 */
const generateAIResponse = async (ticketData) => {
  try {
    const { title, description, category, priority } = ticketData;
    
    const prompt = `
You are an intelligent IT support assistant. Generate a helpful response for this ticket:

Ticket Details:
Title: ${title}
Description: ${description}
Category: ${category || 'General IT'}
Priority: ${priority || 'medium'}

Provide:
1. Acknowledgment of the issue
2. Initial troubleshooting steps (if applicable)
3. What the user can expect next
4. Any relevant information or resources

Keep the response friendly, professional, and helpful. Max 200 words.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful IT support assistant. Provide clear, actionable responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.5,
      max_tokens: 500
    });

    return completion.choices[0]?.message?.content || 
           "Thank you for your ticket. Our support team will review it and get back to you soon.";

  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Thank you for your ticket. Our support team will review it and get back to you soon.";
  }
};

/**
 * Handle greeting messages intelligently
 */
const handleGreeting = async (text) => {
  try {
    const prompt = `
The user sent this greeting/message: "${text}"

Generate a friendly, appropriate response that:
- Acknowledges their greeting
- Offers help with technical issues
- Directs them to appropriate resources if not technical

Return JSON with:
{
  "response": string,
  "sentiment": string,
  "intent": string
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a friendly IT support assistant. Respond to greetings warmly and professionally."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return response.response || "Hello! How can I help you with technical issues today?";

  } catch (error) {
    console.error("Error handling greeting:", error);
    return "Hello! I'm your IT support assistant. How can I help you today?";
  }
};

/**
 * Handle personal/HR queries
 */
const handlePersonalQuery = async (text) => {
  try {
    const prompt = `
The user has a personal/HR query: "${text}"

Generate a helpful response that:
- Acknowledges it's not a technical issue
- Provides appropriate HR contact information
- Is supportive and professional

Company Contacts:
- HR Department: hr@company.com, Ext. 1234
- Employee Relations: relations@company.com, Ext. 5678
- Confidential Helpline: Ext. 9999

Return JSON with:
{
  "response": string,
  "department": string,
  "contactInfo": string
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a supportive assistant helping with HR-related queries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return response.response || "This appears to be an HR-related matter. Please contact the HR department at hr@company.com or extension 1234 for assistance.";

  } catch (error) {
    console.error("Error handling personal query:", error);
    return "This appears to be a non-technical matter. Please contact the HR department for assistance.";
  }
};

/**
 * Handle ambiguous or low-confidence queries
 */
const handleAmbiguousQuery = async (title, description) => {
  try {
    const prompt = `
The user submitted an ambiguous or unclear query:

Title: ${title}
Description: ${description}

Generate a helpful response that:
- Politely asks for clarification
- Suggests what kind of information would be helpful
- Offers examples of clear technical issues
- Reassures them that we want to help

Return a friendly, encouraging response (max 150 words).
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that guides users to provide clear information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || 
           "Could you please provide more details about your issue? For example: What specific problem are you facing? What error messages do you see? What have you tried so far?";

  } catch (error) {
    console.error("Error handling ambiguous query:", error);
    return "I want to help you, but I need more information. Could you please describe your technical issue in more detail?";
  }
};

/**
 * Fallback analysis when primary AI fails
 */
const fallbackAIAnalysis = async (title, description) => {
  try {
    const prompt = `
Quickly analyze this query and return JSON:

Title: ${title}
Description: ${description}

Return:
{
  "isTechnical": boolean,
  "category": string,
  "priority": string,
  "confidence": number,
  "createTicket": boolean,
  "aiResponse": string,
  "reason": string
}
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a quick classifier. Return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return sanitizeClassification(response, title, description);

  } catch (error) {
    console.error("Fallback analysis failed:", error);
    return getDefaultClassification(title, description);
  }
};

/**
 * Sanitize and validate classification response
 */
const sanitizeClassification = (classification, title, description) => {
  const defaults = getDefaultClassification(title, description);
  
  return {
    isTechnical: classification.isTechnical !== undefined ? classification.isTechnical : defaults.isTechnical,
    category: classification.category || defaults.category,
    priority: classification.priority || defaults.priority,
    confidence: Math.min(1, Math.max(0, classification.confidence || defaults.confidence)),
    createTicket: classification.createTicket !== undefined ? classification.createTicket : defaults.createTicket,
    needsClarification: classification.needsClarification || false,
    aiResponse: classification.aiResponse || defaults.aiResponse,
    technicalParts: classification.technicalParts || [],
    reason: classification.reason || "Classified by AI",
    useTrainedModel: classification.useTrainedModel || (classification.isTechnical && (classification.confidence || 0) < 0.5),
    handledByAI: !classification.createTicket && classification.aiResponse ? true : false,
    allowTicketCreation: classification.createTicket || false
  };
};

/**
 * Default classification when AI fails
 */
const getDefaultClassification = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  // Check for common technical keywords
  const technicalKeywords = ['computer', 'laptop', 'email', 'outlook', 'wifi', 'network', 
                            'password', 'login', 'error', 'crash', 'software', 'hardware'];
  
  const isTechnical = technicalKeywords.some(keyword => text.includes(keyword));
  
  return {
    isTechnical: isTechnical,
    category: isTechnical ? "General IT" : "General Inquiry",
    priority: "medium",
    confidence: 0.5,
    createTicket: isTechnical,
    needsClarification: text.length < 20,
    aiResponse: isTechnical ? 
      "Thank you for reporting this issue. Our IT team will investigate and get back to you soon." :
      "How can I help you with technical issues today? Please describe your IT problem.",
    technicalParts: [],
    reason: "Default classification",
    useTrainedModel: isTechnical,
    handledByAI: !isTechnical,
    allowTicketCreation: isTechnical
  };
};

module.exports = {
  classifyIssueType,
  generateAIResponse,
  handleGreeting,
  handlePersonalQuery,
  handleAmbiguousQuery
};