// utils/aiAssistant.js - ENHANCED VERSION
// AI assistant handles greetings and personal/HR issues intelligently
// Technical queries go to main model

const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const classifyIssueType = async (title, description) => {
  try {
    console.log(`\n=== CLASSIFYING: "${title}" ===`);
    console.log(`Description: ${description.substring(0, 100)}...`);
    
    const descriptionLower = description.toLowerCase().trim();
    const titleLower = title.toLowerCase().trim();
    const fullText = titleLower + ' ' + descriptionLower;
    
    // 1. Enhanced greeting detection with context
    const greetingPatterns = [
      /^hi\b.*/i, /^hello\b.*/i, /^hey\b.*/i, /^yo\b.*/i,
      /^good\s+(morning|afternoon|evening|night)\b.*/i,
      /^how\s+(are\s+you|is\s+it\s+going|are\s+things)\b.*/i,
      /^what's?\s+up\b.*/i, /^howdy\b.*/i, /^greetings\b.*/i,
      /^(thanks|thank\s+you)\b.*/i, /^good\s+to\s+see\s+you\b.*/i
    ];
    
    // Check if it's primarily a greeting
    let isGreeting = false;
    let greetingType = '';
    
    for (const pattern of greetingPatterns) {
      if (pattern.test(descriptionLower)) {
        isGreeting = true;
        if (/good morning/i.test(descriptionLower)) greetingType = 'morning';
        else if (/good afternoon/i.test(descriptionLower)) greetingType = 'afternoon';
        else if (/good evening/i.test(descriptionLower)) greetingType = 'evening';
        else if (/good night/i.test(descriptionLower)) greetingType = 'night';
        else if (/thank/i.test(descriptionLower)) greetingType = 'thanks';
        break;
      }
    }
    
    // 2. Comprehensive personal/HR issue detection
    const personalIssueKeywords = {
      // HR & Policies
      hr: ['hr department', 'human resources', 'hr policy', 'hr issue'],
      policies: ['vacation policy', 'leave policy', 'sick leave', 'maternity leave', 
                 'paternity leave', 'bereavement leave', 'company policy', 'work policy',
                 'attendance policy', 'late policy', 'absence policy', 'remote work policy',
                 'hybrid policy', 'dress code', 'code of conduct'],
      
      // Compensation & Benefits
      salary: ['salary slip', 'pay slip', 'salary query', 'paycheck', 'salary issue',
               'bonus', 'increment', 'raise', 'promotion', 'appraisal', 'performance review',
               'overtime pay', 'late payment'],
      benefits: ['health insurance', 'medical insurance', 'dental insurance', 'vision insurance',
                 '401k', 'retirement plan', 'provident fund', 'employee benefits', 'perks',
                 'allowance', 'travel allowance', 'food allowance', 'housing allowance'],
      
      // Administrative
      admin: ['stationery', 'office supplies', 'furniture', 'chair', 'desk', 'cabinet',
              'locker', 'keys', 'access card', 'id card', 'badge', 'visitor pass',
              'parking', 'parking spot', 'cafeteria', 'food', 'snacks'],
      
      // Personal Issues
      personal: ['personal issue', 'family issue', 'health issue', 'medical emergency',
                 'doctor appointment', 'hospital', 'sick', 'unwell', 'stress', 'anxiety',
                 'mental health', 'counseling', 'therapy', 'personal matter', 'private issue',
                 'confidential matter', 'sensitive issue'],
      
      // Interpersonal Issues
      interpersonal: ['colleague issue', 'team conflict', 'manager issue', 'boss problem',
                      'harassment', 'bullying', 'discrimination', 'unfair treatment',
                      'behavior issue', 'conduct issue', 'complaint', 'grievance',
                      'workplace conflict', 'argument', 'dispute', 'misunderstanding'],
      
      // Career & Development
      career: ['career growth', 'promotion process', 'advancement', 'next role',
               'skills development', 'training', 'certification', 'course', 'workshop',
               'conference', 'seminar', 'learning opportunity', 'mentorship'],
      
      // Work Environment
      environment: ['office temperature', 'ac issue', 'heating', 'lighting', 'noise',
                    'cleanliness', 'hygiene', 'safety', 'security', 'ergonomics',
                    'workstation setup', 'chair comfort', 'desk height'],
      
      // Events & Celebrations
      events: ['office party', 'team lunch', 'birthday celebration', 'festival',
               'holiday party', 'company event', 'team building', 'outing', 'picnic',
               'anniversary', 'retirement party', 'farewell'],
      
      // Travel & Expenses
      travel: ['travel request', 'business trip', 'flight booking', 'hotel booking',
               'car rental', 'per diem', 'travel expenses', 'expense claim',
               'reimbursement', 'advance payment', 'travel policy'],
    };
    
    // Check for technical keywords that should NOT be handled by AI
    const technicalKeywords = [
      // Hardware
      'computer', 'laptop', 'desktop', 'monitor', 'printer', 'scanner', 'keyboard', 
      'mouse', 'server', 'router', 'switch', 'firewall', 'nas', 'storage',
      
      // Software
      'outlook', 'email', 'microsoft', 'office', 'windows', 'macos', 'linux',
      'software', 'application', 'app', 'program', 'system', 'database',
      
      // Network
      'wifi', 'network', 'internet', 'vpn', 'lan', 'wan', 'ip address', 'dns',
      'firewall', 'proxy', 'bandwidth', 'connectivity',
      
      // Technical Issues
      'error', 'crash', 'freeze', 'hang', 'slow', 'performance', 'bug', 'glitch',
      'not working', 'broken', 'failed', 'down', 'offline', 'unavailable',
      
      // IT Actions
      'install', 'uninstall', 'update', 'upgrade', 'patch', 'configure', 'setup',
      'troubleshoot', 'diagnose', 'fix', 'repair', 'restore', 'backup', 'recovery',
      
      // Security
      'password', 'login', 'authentication', 'authorization', 'access', 'permission',
      'security', 'virus', 'malware', 'ransomware', 'phishing', 'hack', 'breach',
      
      // Development
      'code', 'programming', 'development', 'api', 'integration', 'deployment',
      'testing', 'debug', 'compile', 'build', 'deploy', 'git', 'repository',
      
      // Error Patterns
      /error\s+code\s+\d+/i, /exception\s+\w+/i, /fatal\s+error/i, /system\s+crash/i,
      /blue\s+screen/i, /kernel\s+panic/i, /segmentation\s+fault/i,
    ];
    
    // Analyze the query
    let hasTechnicalIssue = false;
    let hasPersonalIssue = false;
    let detectedPersonalCategory = '';
    
    // Check for technical keywords
    for (const keyword of technicalKeywords) {
      if (typeof keyword === 'string') {
        if (fullText.includes(keyword)) {
          hasTechnicalIssue = true;
          console.log(`Found technical keyword: ${keyword}`);
          break;
        }
      } else if (keyword.test && keyword.test(fullText)) {
        hasTechnicalIssue = true;
        console.log(`Found technical pattern: ${keyword}`);
        break;
      }
    }
    
    // Check for personal/HR keywords
    for (const [category, keywords] of Object.entries(personalIssueKeywords)) {
      for (const keyword of keywords) {
        if (fullText.includes(keyword)) {
          hasPersonalIssue = true;
          detectedPersonalCategory = category;
          console.log(`Found personal/HR keyword (${category}): ${keyword}`);
          break;
        }
      }
      if (hasPersonalIssue) break;
    }
    
    console.log(`Analysis: isGreeting=${isGreeting}, hasTechnicalIssue=${hasTechnicalIssue}, hasPersonalIssue=${hasPersonalIssue}`);
    
    // DECISION LOGIC
    
    // CASE 1: Pure greetings with NO technical content
    if (isGreeting && !hasTechnicalIssue && description.length < 50) {
      const timeBasedGreeting = getTimeBasedGreeting(greetingType);
      console.log("Handling: Pure greeting");
      return {
        category: "Greeting",
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.95,
        priority: "low",
        aiResponse: timeBasedGreeting,
        reason: "Pure greeting without technical content",
        useMainModel: false,
        greetingType: greetingType
      };
    }
    
    // CASE 2: Personal/HR issues WITHOUT technical components
    if (hasPersonalIssue && !hasTechnicalIssue) {
      console.log(`Handling: Personal/HR issue (${detectedPersonalCategory})`);
      
      // Generate appropriate response based on category
      let aiResponse = '';
      switch(detectedPersonalCategory) {
        case 'hr':
        case 'policies':
          aiResponse = "This appears to be an HR/policy related matter. Please contact the Human Resources department directly for assistance with policies, leaves, or HR-related queries.";
          break;
        case 'salary':
        case 'benefits':
          aiResponse = "This is related to compensation or benefits. Please reach out to the HR or Finance department for salary slips, benefits enrollment, or compensation-related queries.";
          break;
        case 'personal':
          aiResponse = "For personal or confidential matters, please contact HR directly or speak with your manager. They can provide appropriate guidance and support.";
          break;
        case 'interpersonal':
          aiResponse = "For interpersonal issues or workplace conflicts, please contact HR or speak with your manager. They can help mediate and resolve such matters confidentially.";
          break;
        case 'career':
          aiResponse = "For career growth and development queries, please contact HR or your manager. They can guide you on training opportunities and career advancement paths.";
          break;
        default:
          aiResponse = "This appears to be a non-technical administrative matter. Please contact the relevant department (HR, Admin, or your manager) for assistance.";
      }
      
      return {
        category: `Personal/${detectedPersonalCategory}`,
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.9,
        priority: "low",
        aiResponse: aiResponse,
        reason: `Personal/HR issue detected: ${detectedPersonalCategory}`,
        useMainModel: false,
        personalCategory: detectedPersonalCategory
      };
    }
    
    // CASE 3: Mixed query - has both personal AND technical elements
    if (hasPersonalIssue && hasTechnicalIssue) {
      console.log("Handling: Mixed query (both personal and technical)");
      
      // Extract the technical parts for ticket creation
      const technicalParts = [];
      for (const keyword of technicalKeywords.slice(0, 20)) { // Check first 20 keywords
        if (typeof keyword === 'string' && fullText.includes(keyword)) {
          technicalParts.push(keyword);
        }
      }
      
      return {
        category: "Mixed Query",
        isTechnical: true, // Default to technical for ticket creation
        shouldHandleByAI: false,
        confidence: 0.7,
        priority: "medium",
        mixedQuery: true,
        technicalParts: technicalParts,
        personalCategory: detectedPersonalCategory,
        aiResponse: "I see this contains both technical and non-technical elements. I'll create a ticket for the technical issue. For the personal/HR aspects, please contact the relevant department separately.",
        reason: "Mixed personal and technical query",
        useMainModel: true // Use main model for technical classification
      };
    }
    
    // CASE 4: Very short ambiguous queries
    if (description.length < 15 && !hasTechnicalIssue && !isGreeting) {
      console.log("Handling: Very short ambiguous query");
      return {
        category: "General",
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.8,
        priority: "low",
        aiResponse: "Could you please provide more details about what you need help with? I can assist with technical issues or direct you to the right department for other matters.",
        reason: "Very short ambiguous query",
        useMainModel: false
      };
    }
    
    // CASE 5: Thank you messages
    if (/^thanks|thank you|thank you so much|appreciate it|great help/i.test(descriptionLower)) {
      console.log("Handling: Thank you message");
      return {
        category: "Feedback",
        isTechnical: false,
        shouldHandleByAI: true,
        confidence: 0.9,
        priority: "low",
        aiResponse: "You're welcome! I'm glad I could help. If you have any other questions, feel free to ask.",
        reason: "Thank you message",
        useMainModel: false
      };
    }
    
    // EVERYTHING ELSE: Technical or unclear - send to main AI model
    console.log("Sending to main AI model: Technical or unclear query");
    return {
      category: "General IT",
      isTechnical: true,
      shouldHandleByAI: false,
      confidence: 0.5,
      priority: "medium",
      reason: "Technical or ambiguous query - using main model",
      useMainModel: true
    };
    
  } catch (error) {
    console.error("Error in classifyIssueType:", error);
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

// Helper function for time-based greetings
const getTimeBasedGreeting = (greetingType = '') => {
  const hour = new Date().getHours();
  let timeOfDay = '';
  
  if (greetingType) {
    timeOfDay = greetingType;
  } else if (hour < 12) {
    timeOfDay = 'morning';
  } else if (hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour < 21) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  
  const responses = {
    morning: [
      "Good morning! 🌞 I'm here to help with your technical support needs. How can I assist you today?",
      "Morning! ☀️ Welcome to the IT support system. Please describe your technical issue when you're ready.",
      "Good morning! Ready to help with any IT problems you're facing. What seems to be the issue?"
    ],
    afternoon: [
      "Good afternoon! 🌤️ I'm your AI support assistant. How can I help you today?",
      "Afternoon! The IT support team is here to assist. Please tell me about your technical issue.",
      "Good afternoon! What technical problem can I help you solve today?"
    ],
    evening: [
      "Good evening! 🌙 Still here to help with IT support. What's the issue you're facing?",
      "Evening! The support system is active. Please describe your technical problem.",
      "Good evening! How can I assist with your IT concerns tonight?"
    ],
    night: [
      "Good night! 🌃 I'm available for urgent technical issues. What do you need help with?",
      "Late night support here! ⭐ What technical problem are you experiencing?",
      "Good night! For urgent IT matters, please describe your issue."
    ],
    thanks: [
      "You're welcome! 😊 Happy to help. Let me know if you need anything else.",
      "Glad I could assist! 👍 Feel free to reach out again if you have more questions.",
      "Thank you! 🙏 I'm here whenever you need technical support."
    ]
  };
  
  const greetings = responses[greetingType] || responses[timeOfDay] || responses.morning;
  return greetings[Math.floor(Math.random() * greetings.length)];
};

// Enhanced AI response generation for personal issues
const generateAIResponse = async (issue, isNonTechnical = false, category = '') => {
  if (!isNonTechnical) {
    return "I understand you're facing a technical issue. Let me help you create a support ticket for this.";
  }
  
  // Generate specific responses based on category
  switch(category) {
    case 'hr':
    case 'policies':
      return "This appears to be an HR or policy-related matter. Please contact:\n\n📞 HR Department: hr@company.com\n📱 Phone: Ext. 1234\n📍 Location: 3rd Floor, Building A\n\nThey can assist you with policies, leaves, and HR-related queries.";
    
    case 'salary':
    case 'benefits':
      return "For salary and benefits inquiries, please contact:\n\n💰 Finance/HR Department: finance@company.com\n📱 Phone: Ext. 5678\n⏰ Office Hours: 9 AM - 6 PM\n\nInclude your employee ID for faster processing.";
    
    case 'personal':
      return "For personal or confidential matters:\n\n🤝 HR Confidential Desk: confidential@company.com\n📱 Hotline: Ext. 9999 (24/7)\n👥 Employee Assistance Program: Available for counseling and support\n\nYour privacy will be respected.";
    
    case 'interpersonal':
      return "For workplace conflicts or interpersonal issues:\n\n⚖️ HR Relations Team: relations@company.com\n📱 Phone: Ext. 4321\n👤 Your Manager: Can provide initial guidance\n\nAll matters are handled confidentially.";
    
    case 'career':
      return "For career growth and development:\n\n📈 Learning & Development: LnD@company.com\n🎯 Career Counseling: Available every Wednesday\n📚 Training Portal: portal.company.com/learning\n\nBook a session with HR to discuss your growth path.";
    
    case 'admin':
      return "For administrative requests:\n\n🏢 Admin Department: admin@company.com\n📱 Phone: Ext. 1111\n📋 Request Portal: portal.company.com/admin\n\nPlease specify your requirement details.";
    
    default:
      return "This appears to be a non-technical matter. Please contact the relevant department:\n\n• HR for policies, leaves, personal matters\n• Finance for salary, expenses\n• Admin for supplies, facilities\n• Your Manager for team-related issues";
  }
};

module.exports = {
  classifyIssueType,
  generateAIResponse,
  getTimeBasedGreeting
};