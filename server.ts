import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return aiClient;
}

// Fallback intelligent responder when offline or without API key
function getFallbackResponse(message: string, lang: string): { reply: string; suggestedAction?: string } {
  const lower = message.toLowerCase();
  
  // Kannada queries (Natural, spoken agrarian cadence)
  if (lang === 'kn' || /[\u0C80-\u0CFF]/.test(message)) {
    if (lower.includes('ಟ್ರಕ್') || lower.includes('ಬುಕ್') || lower.includes('ಸಾರಿಗೆ') || lower.includes('truck')) {
      return {
        reply: 'ನಮಸ್ಕಾರ ಪಾಟೀಲ್ ಅವರೇ! ಕಿಸಾನ್ ಟ್ರಕ್ ಬುಕಿಂಗ್ ಮಾಡುವುದು ತುಂಬ ಸುಲಭ. ನಿಮ್ಮ ತೋಟದ ಲೈವ್ GPS ಆನ್ ಮಾಡಿ, ಬೊಲೆರೊ ಅಥವಾ ಐಶರ್ ಟ್ರಕ್ ಆಯ್ಕೆ ಮಾಡಿದರೆ ಸಾಕು, ಚಾಲಕರು ನೇರವಾಗಿ ನಿಮ್ಮ ತೋಟದ ಗೇಟ್‌ಗೆ ತಲುಪುತ್ತಾರೆ. ನಾನು ನಿಮಗಾಗಿ ಟ್ರಕ್ ಬುಕಿಂಗ್ ಸ್ಕ್ರೀನ್ ತೆರೆಯಲೇ?',
        suggestedAction: 'kisan-truck-transport'
      };
    }
    if (lower.includes('ಬೆಳೆ') || lower.includes('ಮಾರಾಟ') || lower.includes('sell')) {
      return {
        reply: 'ಖಂಡಿತ ರಮೇಶ್ ಅವರೇ! ನೀವು ಶೂನ್ಯ ಶೇಕಡಾ ದಳ್ಳಾಳಿಯಲ್ಲಿ ನೇರವಾಗಿ ನಗರದ ವರ್ತಕರಿಗೆ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಬಹುದು. ಕೇವಲ ಬೆಳೆ ತೂಕ ಮತ್ತು ನಿಮ್ಮ ದರ ಹಾಕಿ 5 ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ವ್ಯಾಪಾರಿಗಳು ತಕ್ಷಣ ಖರೀದಿ ಮಾಡುತ್ತಾರೆ. ನಾನು ಬೆಳೆ ಮಾರಾಟ ಸ್ಕ್ರೀನ್ ತೆರೆಯಲೇ?',
        suggestedAction: 'sell-crops-kisan'
      };
    }
    if (lower.includes('ಲೊಕೇಶನ್') || lower.includes('ಸ್ಥಳ') || lower.includes('location') || lower.includes('gps')) {
      return {
        reply: 'ನಿಮ್ಮ ತೋಟದ ನಿಖರ ಸ್ಥಳವನ್ನು ತಿಳಿಯಲು "ನನ್ನ ಲೈವ್ GPS ಲೊಕೇಶನ್ ಪತ್ತೆಹಚ್ಚಿ" ಬಟನ್ ಒತ್ತಿ ಸಾಕು. ನಿಮ್ಮ ಹತ್ತಿರದ ಮಂಡಿಯ ಅಂತರ ಮತ್ತು ಟ್ರಕ್ ಬಾಡಿಗೆ ತಕ್ಷಣ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.',
        suggestedAction: 'kisan-truck-transport'
      };
    }
    if (lower.includes('ಆರ್ಡರ್') || lower.includes('order') || lower.includes('sms')) {
      return {
        reply: 'ನಿಮ್ಮ ಆರ್ಡರ್ ಆದ ತಕ್ಷಣ ಬ್ಯಾಕೆಂಡ್‌ನಿಂದ ರೈತರಿಗೆ ಆರ್ಡರ್ ಕನ್ಫರ್ಮೇಶನ್ ಮತ್ತು ಪೋಸ್ಟ್-ಆರ್ಡರ್ ಟ್ರಕ್ ಡಿಸ್ಪ್ಯಾಚ್ SMS ತಕ್ಷಣ ಬರುತ್ತದೆ. ಇದರಲ್ಲಿ ಲೋಡಿಂಗ್ ಪಿನ್ ಮತ್ತು ಡ್ರೈವರ್ ವಿವರಗಳು ಇರುತ್ತವೆ.',
        suggestedAction: 'farmer-dashboard-orders'
      };
    }
    return {
      reply: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಫಾರ್ಮ್‌ಸಿಂಕ್ ಧ್ವನಿ ಸಹಾಯಕ. ನಾನು ನಿಮ್ಮ ಬೆಳೆ, ಮಂಡಿ ದರ, ಕಿಸಾನ್ ಟ್ರಕ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಪಾವತಿ ಬಗ್ಗೆ ಯಾವುದೇ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
      suggestedAction: 'welcome-hub'
    };
  }

  // Hindi queries (Warm, respectful, natural spoken agrarian cadence)
  if (lang === 'hi' || /[\u0900-\u097F]/.test(message)) {
    if (lower.includes('ट्रक') || lower.includes('बुकिंग') || lower.includes('गाड़ी') || lower.includes('truck')) {
      return {
        reply: 'राम राम रमेश जी! किसान ट्रक बुक करना बहुत ही आसान है। आप सीधे किसान ट्रक सेवा में जाकर अपने खेत का लाइव जीपीएस चुनिए, और बोलेरो या आयशर ट्रक चुनते ही ड्राइवर आपके खेत के गेट पर पहुँच जाएगा। क्या मैं आपके लिए ट्रक बुकिंग स्क्रीन खोल दूँ?',
        suggestedAction: 'kisan-truck-transport'
      };
    }
    if (lower.includes('बेच') || lower.includes('फसल') || lower.includes('sell')) {
      return {
        reply: 'बिल्कुल रमेश जी! आप अपनी प्याज या टमाटर की फसल बिना किसी बिचौलिए या दलाली के सीधे सुपरमार्केट और दुकानदारों को बेच सकते हैं। बस 5-फोटो प्रमाण अपलोड कीजिए, व्यापारी तुरंत एस्क्रो में पैसे जमा कर ऑर्डर देंगे। क्या फसल बिक्री स्क्रीन पर चलें?',
        suggestedAction: 'sell-crops-kisan'
      };
    }
    if (lower.includes('ऑर्डर') || lower.includes('order') || lower.includes('sms') || lower.includes('मैसेज')) {
      return {
        reply: 'हाँ जी! जब भी कोई खरीदार ऑर्डर करता है, हमारे सिस्टम से सीधे किसान के मोबाइल पर ऑर्डर कन्फर्मेशन और पोस्ट-ऑर्डर ट्रक अलर्ट SMS तुरंत पहुँचता है, जिसमें लोडिंग पिन 4821 और ड्राइवर का फोन नंबर रहता है।',
        suggestedAction: 'farmer-dashboard-orders'
      };
    }
    if (lower.includes('लोकेशन') || lower.includes('location') || lower.includes('जीपीएस')) {
      return {
        reply: 'रमेश जी, अपने खेत का सही स्थान दर्ज करने के लिए बस "मेरा लाइव GPS लोकेशन पहचानें" पर क्लिक कीजिए। वाशी या पिंपलगांव मंडी की दूरी और भाड़ा तुरंत निकल आएगा।',
        suggestedAction: 'kisan-truck-transport'
      };
    }
    if (lower.includes('भाव') || lower.includes('रेट') || lower.includes('price')) {
      return {
        reply: 'आज वाशी मंडी में आपकी नासिक गरवा प्याज ₹2,450 प्रति क्विंटल चल रही है और हिमसोना टमाटर ₹18.50 प्रति किलो पर मजबूत मांग में है। आप सीधे खेत के भाव पर बेच सकते हैं।',
        suggestedAction: 'buy-crops-mandi-retail'
      };
    }
    return {
      reply: 'राम राम भाई साहब! मैं आपका अपना फार्मसिंक वॉइस सहायक हूँ। आप मुझसे सीधे बोलकर फसल बेचने, ट्रक मंगाने, मंडी भाव जानने या ऑर्डर की स्थिति पूछ सकते हैं। बताइए, आज क्या काम है?',
      suggestedAction: 'welcome-hub'
    };
  }

  // Marathi queries
  if (lang === 'mr') {
    if (lower.includes('ट्रक') || lower.includes('बुकिंग') || lower.includes('गाडी')) {
      return {
        reply: 'राम राम रमेश भाऊ! शेतकरी ट्रक बुक करणं एकदम सोपं आहे. फक्त किसान ट्रक सेवेत जाऊन शेताचं लाइव्ह GPS निवडा, बोलेरो किंवा आयशर गाडी थेट तुमच्या शेताच्या बांधावर येईल. मी ट्रक बुकिंग स्क्रीन उघडू का?',
        suggestedAction: 'kisan-truck-transport'
      };
    }
    if (lower.includes('माल') || lower.includes('कांदा') || lower.includes('विक्री')) {
      return {
        reply: 'नक्कीच भाऊ! नाशिकचा गरवा कांदा थेट ०% दलालीमध्ये वाशीच्या व्यापाऱ्यांना विका. पैसे थेट सुरक्षित एस्क्रो खात्यात जमा होतात. काय मी पीक विक्री स्क्रीन उघडू?',
        suggestedAction: 'sell-crops-kisan'
      };
    }
    return {
      reply: 'नमस्कार! मी आपला फार्मसिंक व्हॉइस सहाय्यक आहे. मी आपल्याला कांदा भाव, ट्रक बुकिंग आणि ऑर्डर कन्फर्मेशन SMS बद्दल थेट मदत करू शकतो. काय माहिती हवी आहे?',
      suggestedAction: 'welcome-hub'
    };
  }

  // English (default) - Natural, conversational agrarian cadence
  if (lower.includes('truck') || lower.includes('transport') || lower.includes('logistics')) {
    return {
      reply: 'Ram Ram Ramesh ji! Booking a farm truck is very straightforward. Simply head over to Farm Trucks, tap Detect My Live GPS to pinpoint your farm gate, and pick a Bolero or Eicher truck. The driver navigates straight to your field with live Google Maps tracking. Shall I open the truck screen for you now?',
      suggestedAction: 'kisan-truck-transport'
    };
  }
  if (lower.includes('sell') || lower.includes('crop') || lower.includes('produce') || lower.includes('list')) {
    return {
      reply: 'Certainly Ramesh ji! You can sell your harvested onions or tomatoes directly to city buyers with zero brokerage. Just enter your quantity, set your rate, and upload 5 verified photos. Once ordered, full funds lock safely in RBI escrow before dispatch. Would you like to view the crop listing screen?',
      suggestedAction: 'sell-crops-kisan'
    };
  }
  if (lower.includes('order') || lower.includes('sms') || lower.includes('confirmation')) {
    return {
      reply: 'Yes indeed! The moment an order is confirmed, our backend automatically sends an official Order Confirmation SMS and a Post-Order Truck Dispatch SMS straight to your phone with your farm loading PIN and driver contact. Would you like to check your orders dashboard?',
      suggestedAction: 'farmer-dashboard-orders'
    };
  }
  if (lower.includes('location') || lower.includes('gps') || lower.includes('live')) {
    return {
      reply: 'To locate your farm, simply tap Detect My Live GPS Location. FarmSync automatically calculates the exact road distance to Vashi APMC or your local mandi, and provides instant transparent freight rates without hidden surcharges.',
      suggestedAction: 'kisan-truck-transport'
    };
  }
  if (lower.includes('rate') || lower.includes('price') || lower.includes('mandi')) {
    return {
      reply: 'Today at Vashi Wholesale APMC, Nashik Garwa Red Onions are trading around ₹2,450 per quintal, and Sharbati Wheat is at ₹2,880. Demand for high-grade produce is strong!',
      suggestedAction: 'buy-crops-mandi-retail'
    };
  }

  return {
    reply: 'Ram Ram Ramesh ji! I am your FarmSync Voice Sahayak. I remember your farm in Niphad and your Garwa onions. You can ask me to book a farm truck, check live mandi rates, inspect order SMS alerts, or track your escrow settlements. How can I help you right now?',
    suggestedAction: 'welcome-hub'
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Self-Learning Profile Memory for FarmSync Voice Sahayak
interface SahayakLearnerProfile {
  farmerId: string;
  farmerName: string;
  phone: string;
  primaryCrop: string;
  farmLocation: string;
  preferredLanguage: string;
  preferredDialect: string;
  preferredMandis: string[];
  preferredTruck: string;
  speechCadence: 'concise_conversational' | 'detailed_advisory';
  conversationCount: number;
  positiveRatings: number;
  negativeRatings: number;
  learnedNotes: string[];
  recentTopics: string[];
  lastLearnedAt: string;
  confidenceScore: number;
}

let sahayakProfile: SahayakLearnerProfile = {
  farmerId: 'kisan-patil-001',
  farmerName: 'Ramesh Patil',
  phone: '+91 98221 44910',
  primaryCrop: 'Nashik Garwa Red Onions (Export Grade A)',
  farmLocation: 'Patil Farms, Niphad Gate 2, Nashik',
  preferredLanguage: 'hi',
  preferredDialect: 'Agro-Marathi/Hindi blend (Nashik agricultural belt)',
  preferredMandis: ['Vashi Wholesale APMC (Navi Mumbai)', 'Pimpalgaon Baswant APMC'],
  preferredTruck: 'Bolero Maxi Truck Plus (2.5 Ton) & Eicher 14ft Open',
  speechCadence: 'concise_conversational',
  conversationCount: 16,
  positiveRatings: 14,
  negativeRatings: 1,
  learnedNotes: [
    'Speaks naturally like a village Kisan Mitra; never use robotic markdown asterisks or numbered lists in spoken replies',
    'Hauls 50 to 150 quintal onion and tomato lots regularly to Vashi APMC',
    'Values instant loading PIN 4821 verification before driver departs farm gate',
    'Prefers knowing exact net realization after 0% brokerage and upfront freight',
    'Prefers SMS notifications on phone +91 98221 44910 for all order milestones',
  ],
  recentTopics: ['Garwa onion prices', 'Vashi APMC arrivals', 'Bolero freight calculation', 'Escrow release'],
  lastLearnedAt: new Date().toISOString(),
  confidenceScore: 96,
};

// Multilingual AI Chatbot endpoint with Self-Learning Memory & Natural Conversational Voice
app.post('/api/chat', async (req, res) => {
  const { message, language = 'en', conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Quick self-learning topic detection
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('प्याज') || lowerMsg.includes('onion') || lowerMsg.includes('ಈರುಳ್ಳಿ')) {
    if (!sahayakProfile.recentTopics.includes('Onions')) sahayakProfile.recentTopics.unshift('Onions');
  } else if (lowerMsg.includes('टमाटर') || lowerMsg.includes('tomato') || lowerMsg.includes('ಟೊಮ್ಯಾಟೊ')) {
    if (!sahayakProfile.recentTopics.includes('Tomatoes')) sahayakProfile.recentTopics.unshift('Tomatoes');
  } else if (lowerMsg.includes('ट्रक') || lowerMsg.includes('truck') || lowerMsg.includes('ಬೊಲೆರೊ')) {
    if (!sahayakProfile.recentTopics.includes('Truck logistics')) sahayakProfile.recentTopics.unshift('Truck logistics');
  }
  if (sahayakProfile.recentTopics.length > 5) sahayakProfile.recentTopics.pop();
  sahayakProfile.conversationCount += 1;

  const ai = getAi();

  // If Gemini API is not configured or fails, use intelligent multilingual natural fallback
  if (!ai) {
    const fallback = getFallbackResponse(message, language);
    return res.json({
      reply: fallback.reply,
      suggestedAction: fallback.suggestedAction,
      source: 'fallback_knowledge_base',
      learnerProfile: sahayakProfile,
    });
  }

  try {
    const systemInstruction = `You are "FarmSync Voice Sahayak" (फार्मसिंक वॉइस सहायक / ಫಾರ್ಮ್‌ಸಿಂಕ್ ಧ್ವನಿ ಸಹಾಯಕ), a wise, warm, and highly experienced agrarian companion for Indian farmers.
You are speaking directly to farmer ${sahayakProfile.farmerName} from ${sahayakProfile.farmLocation}.

ACTIVE LEARNED FARMER CONTEXT (CONTINUOUS LEARNING IN EFFECT):
- Farmer Name: ${sahayakProfile.farmerName} (Phone: ${sahayakProfile.phone})
- Primary Harvest: ${sahayakProfile.primaryCrop}
- Farm Base: ${sahayakProfile.farmLocation}
- Frequent Mandis: ${sahayakProfile.preferredMandis.join(', ')}
- Preferred Truck: ${sahayakProfile.preferredTruck}
- Dialect Style: ${sahayakProfile.preferredDialect}
- Learned Habits & Preferences: ${sahayakProfile.learnedNotes.join('; ')}
- Confidence Score: ${sahayakProfile.confidenceScore}%

CRITICAL RULES FOR NATURAL SPOKEN VOICE (HUMAN-LIKE AUDIO SPEECH):
1. SPEAK NATURALLY, CONVERSATIONALLY, AND WARMLY like a trusted village agriculture elder or fellow farmer ("Kisan Mitra").
2. ABSOLUTELY NEVER USE MARKDOWN FORMATTING (no asterisks **, no pound signs #, no underscores, no bullet lists 1. 2. 3.)! When text-to-speech synthesizers read markdown symbols, it sounds broken and robotic.
3. Keep your answers brief (2 to 4 spoken sentences), rhythmic, and fluid.
4. Begin with warm cultural greetings when appropriate ("Ram Ram Ramesh ji!", "Namaskara Patil-avare!", "Pranam!").
5. In Hindi, use respectful, earthy, conversational Hindi ("राम राम रमेश जी!", "बिल्कुल", "आपकी नासिक प्याज", "चिंता की कोई बात नहीं").
6. In Kannada, use polite, spoken conversational Kannada ("ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ", "ಖಂಡಿತ").
7. In English, use warm Indian agrarian English ("Ram Ram Ramesh ji! Your order confirmation and post-order truck dispatch SMS have been sent straight to your phone...").
8. Always reassure about 0% dalali, RBI-escrow security, live GPS truck tracking, and SMS confirmations sent straight to his phone.`;

    const contents = [
      ...conversationHistory.map((item: { role: string; content: string }) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    let replyText = response.text || '';
    // Strip accidental asterisks or hashes to guarantee pure natural speech for audio synthesizers
    replyText = replyText.replace(/[*#_~`]/g, '').trim();

    // Detect if a navigation action is suggested
    let suggestedAction: string | undefined;
    const lowerReply = (replyText + ' ' + message).toLowerCase();
    if (lowerReply.includes('truck') || lowerReply.includes('ಟ್ರಕ್') || lowerReply.includes('ट्रक')) {
      suggestedAction = 'kisan-truck-transport';
    } else if (lowerReply.includes('driver') || lowerReply.includes('ಸಾರಥಿ') || lowerReply.includes('चालक')) {
      suggestedAction = 'truck-driver-portal';
    } else if (lowerReply.includes('sell') || lowerReply.includes('ಮಾರಾಟ') || lowerReply.includes('बेच')) {
      suggestedAction = 'sell-crops-kisan';
    } else if (lowerReply.includes('buy') || lowerReply.includes('ಖರೀದಿ') || lowerReply.includes('खरीद')) {
      suggestedAction = 'buy-crops-mandi-retail';
    } else if (lowerReply.includes('escrow') || lowerReply.includes('dashboard') || lowerReply.includes('खाता') || lowerReply.includes('order')) {
      suggestedAction = 'farmer-dashboard-orders';
    }

    return res.json({
      reply: replyText,
      suggestedAction,
      source: 'gemini-3.8-flash',
      learnerProfile: sahayakProfile,
    });
  } catch (error) {
    console.error('Gemini API error, falling back to local knowledge base:', error);
    const fallback = getFallbackResponse(message, language);
    return res.json({
      reply: fallback.reply,
      suggestedAction: fallback.suggestedAction,
      source: 'fallback_knowledge_base',
      learnerProfile: sahayakProfile,
    });
  }
});

// Self-Learning Profile Endpoints
app.get('/api/sahayak/profile', (req, res) => {
  res.json({
    success: true,
    profile: sahayakProfile,
  });
});

app.post('/api/sahayak/learn', (req, res) => {
  const { feedbackType, query, response, correctionNote, newPreference } = req.body;

  if (feedbackType === 'thumbs_up') {
    sahayakProfile.positiveRatings += 1;
    sahayakProfile.confidenceScore = Math.min(99, sahayakProfile.confidenceScore + 1);
    if (query && !sahayakProfile.learnedNotes.some(n => n.includes(query.slice(0, 15)))) {
      sahayakProfile.learnedNotes.push(`Farmer appreciated spoken answer on: "${query.slice(0, 35)}"`);
      if (sahayakProfile.learnedNotes.length > 8) sahayakProfile.learnedNotes.shift();
    }
  } else if (feedbackType === 'thumbs_down') {
    sahayakProfile.negativeRatings += 1;
    sahayakProfile.confidenceScore = Math.max(80, sahayakProfile.confidenceScore - 1);
    if (correctionNote) {
      sahayakProfile.learnedNotes.push(`Farmer correction: ${correctionNote}`);
      if (sahayakProfile.learnedNotes.length > 8) sahayakProfile.learnedNotes.shift();
    }
  } else if (feedbackType === 'preference_update' && newPreference) {
    sahayakProfile = {
      ...sahayakProfile,
      ...newPreference,
      lastLearnedAt: new Date().toISOString(),
    };
  }

  sahayakProfile.conversationCount += 1;
  sahayakProfile.lastLearnedAt = new Date().toISOString();

  console.log(`[SAHAYAK SELF-LEARNED] Feedback: ${feedbackType} | Notes count: ${sahayakProfile.learnedNotes.length} | Confidence: ${sahayakProfile.confidenceScore}%`);

  res.json({
    success: true,
    profile: sahayakProfile,
  });
});

// In-Memory SMS Outbox & Delivery Log
interface DispatchedSms {
  id: string;
  senderId: string;
  to: string;
  recipientName: string;
  type: string;
  message: string;
  sentAt: string;
  status: 'DELIVERED' | 'SENT';
  dltTemplateId: string;
}

const smsOutboxLog: DispatchedSms[] = [
  {
    id: 'SMS-INIT-001',
    senderId: 'VK-FARMSYNC',
    to: '+91 98221 44910',
    recipientName: 'Ramesh Patil (Kisan)',
    type: 'ORDER_CONFIRMED_FARMER',
    message: 'FarmSync Order Confirmed: Ram Ram Ramesh Patil! New order #ORD-MH-9941 received for 50 Qtl Nashik Red Onions from Shree Balaji Grocers. Total ₹1,22,500 locked in RBI Escrow (0% dalali). Loading PIN: 4821. Truck dispatch initiated to your farm gate.',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140720',
  },
  {
    id: 'SMS-INIT-002',
    senderId: 'VK-FARMSYNC',
    to: '+91 98221 44910',
    recipientName: 'Ramesh Patil (Kisan)',
    type: 'POST_ORDER_FARMER',
    message: 'FarmSync Post-Order Alert: Order #ORD-MH-9941 scheduled for pickup. Truck MH-15-EG-4412 (Driver: Suresh Kadam, Ph: +91 98230 45612) is en-route to Patil Farms, Niphad. Verify Loading PIN 4821 before releasing produce. Live GPS: farmsync.in/t/ORD-MH-9941',
    sentAt: new Date(Date.now() - 7100000).toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140721',
  },
  {
    id: 'SMS-INIT-003',
    senderId: 'VK-FARMSYNC',
    to: '+91 98221 44910',
    recipientName: 'Ramesh Patil (Kisan)',
    type: 'TRUCK_BOOKED',
    message: 'FarmSync Alert: Truck MH-15-EG-4412 booked! Driver: Suresh Kadam (+91 98230 45612). Pickup: Patil Farms Niphad Gate 2. Farm-Gate Loading OTP: 4821. Live GPS: farmsync.in/t/TRK-9841',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140716',
  },
];

// Backend Order Interface & State
interface BackendOrder {
  id: string;
  orderNumber: string;
  cropId?: string;
  cropName: string;
  variety: string;
  quantityQtl: number;
  pricePerQtl: number;
  totalAmount: number;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerName: string;
  buyerPhone: string;
  buyerStoreLocation: string;
  paymentMode: 'ESCROW' | 'DIRECT_UPI';
  paymentStatus: 'PAID' | 'ESCROW_LOCKED';
  farmOtp: string;
  deliveryOtp: string;
  truckRegNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'ORDER_PLACED' | 'TRUCK_ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED';
  createdAt: string;
  dispatchedSmsIds: string[];
}

const backendOrders: BackendOrder[] = [
  {
    id: 'ord-init-001',
    orderNumber: 'ORD-MH-9941',
    cropId: 'FS-NSK-8821',
    cropName: 'Nashik Red Onions (Garwa Variety)',
    variety: 'Garwa Winter Crop • Grade A Export Quality',
    quantityQtl: 50,
    pricePerQtl: 2450,
    totalAmount: 122500,
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98221 44910',
    farmerLocation: 'Patil Farms, Niphad Gate 2, Nashik',
    buyerName: 'Shree Balaji Grocers & Supermarket',
    buyerPhone: '+91 98201 44812',
    buyerStoreLocation: 'Vashi Sector 19 Wholesale APMC',
    paymentMode: 'ESCROW',
    paymentStatus: 'ESCROW_LOCKED',
    farmOtp: '4821',
    deliveryOtp: '7190',
    truckRegNumber: 'MH-15-EG-4412',
    driverName: 'Suresh Kadam',
    driverPhone: '+91 98230 45612',
    status: 'TRUCK_ASSIGNED',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    dispatchedSmsIds: ['SMS-INIT-001', 'SMS-INIT-002'],
  },
];

// Backend API: Place Order & Dispatch Order Confirmation SMS + Post-Order SMS to Farmer
app.post('/api/orders', (req, res) => {
  const {
    cropId = 'FS-NSK-8821',
    cropName = 'Nashik Red Onions (Garwa)',
    variety = 'Grade A Export Quality',
    quantityQtl = 50,
    pricePerQtl = 2450,
    totalAmount = Number(quantityQtl) * Number(pricePerQtl),
    farmerName = 'Ramesh Patil',
    farmerPhone = '+91 98221 44910',
    farmerLocation = 'Patil Farms, Niphad Gate 2, Nashik',
    buyerName = 'Shree Balaji Supermarket',
    buyerPhone = '+91 98201 44812',
    buyerStoreLocation = 'Vashi Sector 19 APMC',
    paymentMode = 'ESCROW',
    farmOtp = Math.floor(1000 + Math.random() * 9000).toString(),
    deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString(),
    truckRegNumber = 'MH-15-EG-4412',
    driverName = 'Suresh Kadam',
    driverPhone = '+91 98230 45612',
  } = req.body;

  const orderNumber = `ORD-MH-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `ord-${Date.now()}`;

  const newOrder: BackendOrder = {
    id: orderId,
    orderNumber,
    cropId,
    cropName,
    variety,
    quantityQtl: Number(quantityQtl),
    pricePerQtl: Number(pricePerQtl),
    totalAmount: Number(totalAmount),
    farmerName,
    farmerPhone,
    farmerLocation,
    buyerName,
    buyerPhone,
    buyerStoreLocation,
    paymentMode,
    paymentStatus: 'ESCROW_LOCKED',
    farmOtp,
    deliveryOtp,
    truckRegNumber,
    driverName,
    driverPhone,
    status: 'ORDER_PLACED',
    createdAt: new Date().toISOString(),
    dispatchedSmsIds: [],
  };

  // 1. Send Order Confirmation SMS directly to Farmer from backend
  const confirmationSmsToFarmer: DispatchedSms = {
    id: `SMS-ORD-${Date.now()}-1`,
    senderId: 'VK-FARMSYNC',
    to: farmerPhone,
    recipientName: `${farmerName} (Kisan)`,
    type: 'ORDER_CONFIRMED_FARMER',
    message: `FarmSync Order Confirmed: Ram Ram ${farmerName}! New order #${orderNumber} received for ${quantityQtl} Qtl ${cropName} from ${buyerName}. Total ₹${Number(totalAmount).toLocaleString('en-IN')} locked in RBI Escrow (0% dalali). Loading PIN: ${farmOtp}. Truck dispatch initiated to your farm gate.`,
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140720',
  };

  // 2. Send Post-Order Logistics SMS directly to Farmer from backend
  const postOrderSmsToFarmer: DispatchedSms = {
    id: `SMS-POST-${Date.now()}-2`,
    senderId: 'VK-FARMSYNC',
    to: farmerPhone,
    recipientName: `${farmerName} (Kisan)`,
    type: 'POST_ORDER_FARMER',
    message: `FarmSync Post-Order Alert: Order #${orderNumber} is scheduled for pickup. Truck ${truckRegNumber} (Driver: ${driverName}, Ph: ${driverPhone}) is en-route to ${farmerLocation}. Verify Loading PIN ${farmOtp} before releasing produce. Live GPS: farmsync.in/t/${orderNumber}`,
    sentAt: new Date(Date.now() + 500).toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140721',
  };

  // 3. Send Order Confirmation SMS to Buyer
  const buyerConfirmationSms: DispatchedSms = {
    id: `SMS-BUY-${Date.now()}-3`,
    senderId: 'VK-FARMSYNC',
    to: buyerPhone,
    recipientName: `${buyerName} (Retailer)`,
    type: 'ORDER_PLACED_BUYER',
    message: `FarmSync Order Placed: Order #${orderNumber} for ${quantityQtl} Qtl ${cropName} placed with farmer ${farmerName}. Delivery OTP: ${deliveryOtp}. Direct 0% dalali trade. Track farm pickup live: farmsync.in/t/${orderNumber}`,
    sentAt: new Date(Date.now() + 1000).toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140722',
  };

  newOrder.dispatchedSmsIds = [
    confirmationSmsToFarmer.id,
    postOrderSmsToFarmer.id,
    buyerConfirmationSms.id,
  ];

  backendOrders.unshift(newOrder);
  smsOutboxLog.unshift(confirmationSmsToFarmer, postOrderSmsToFarmer, buyerConfirmationSms);

  // Self-learning feedback update: Record recent transaction topic
  const topicLabel = `Order #${orderNumber} (${quantityQtl} Qtl ${cropName})`;
  if (!sahayakProfile.recentTopics.includes(topicLabel)) {
    sahayakProfile.recentTopics.unshift(topicLabel);
    if (sahayakProfile.recentTopics.length > 5) sahayakProfile.recentTopics.pop();
  }
  sahayakProfile.conversationCount += 1;
  sahayakProfile.lastLearnedAt = new Date().toISOString();

  console.log(`[ORDER CREATED & SMS SENT] Order #${orderNumber} | Confirmation & Post-Order SMS sent to farmer ${farmerPhone}`);

  return res.json({
    success: true,
    order: newOrder,
    dispatchedSms: [confirmationSmsToFarmer, postOrderSmsToFarmer, buyerConfirmationSms],
  });
});

// Backend API: Send Post-Order SMS updates to Farmer (e.g., Truck Arrived, Loading Done, In-Transit, Delivered)
app.post('/api/orders/:orderId/post-order-sms', (req, res) => {
  const { orderId } = req.params;
  const { status, customMessage, netWeightKg, utr } = req.body;

  const order = backendOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
  const farmerPhone = order?.farmerPhone || '+91 98221 44910';
  const farmerName = order?.farmerName || 'Ramesh Patil';
  const orderNum = order?.orderNumber || orderId;

  let messageText = customMessage;
  if (!messageText) {
    switch (status) {
      case 'TRUCK_ARRIVED':
        messageText = `FarmSync Post-Order: Truck ${order?.truckRegNumber || 'MH-15-EG-4412'} has arrived at your farm gate! Please verify driver ${order?.driverName || 'Suresh Kadam'} with Loading PIN ${order?.farmOtp || '4821'} before loading.`;
        break;
      case 'LOADING_COMPLETED':
        messageText = `FarmSync Post-Order: Loading verified for Order #${orderNum}! ${order?.quantityQtl || 50} Qtl loaded. Vehicle departed for Mandi. 35% fuel advance released to driver.`;
        break;
      case 'IN_TRANSIT':
        messageText = `FarmSync Post-Order: Shipment #${orderNum} is in transit on NH-60. Current ETA to Vashi APMC: 3 hrs 15 mins. Live GPS: farmsync.in/t/${orderNum}`;
        break;
      case 'DELIVERY_COMPLETED':
        messageText = `FarmSync Post-Order: Produce received and verified at Mandi! Delivery OTP confirmed by retailer. Direct payment disbursement initiated to ${farmerName}.`;
        break;
      case 'ESCROW_SETTLED':
        messageText = `FarmSync Post-Order: ₹${Number(order?.totalAmount || 122500).toLocaleString('en-IN')} directly credited to ${farmerName} bank account via DBT! NPCI UTR: ${utr || 'UTR' + Date.now()}. 0% commission deducted.`;
        break;
      default:
        messageText = `FarmSync Post-Order Update: Order #${orderNum} status is now ${status}. Logistics tracking active.`;
    }
  }

  const postOrderSms: DispatchedSms = {
    id: `SMS-POST-STATUS-${Date.now()}`,
    senderId: 'VK-FARMSYNC',
    to: farmerPhone,
    recipientName: `${farmerName} (Kisan)`,
    type: 'POST_ORDER_FARMER',
    message: messageText,
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-140723',
  };

  smsOutboxLog.unshift(postOrderSms);
  console.log(`[POST-ORDER SMS DISPATCHED TO FARMER] Order #${orderNum} -> ${farmerPhone} | Content: ${messageText}`);

  return res.json({
    success: true,
    sms: postOrderSms,
  });
});

// Backend API: Retrieve all orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    orders: backendOrders,
  });
});

// Send SMS Confirmation endpoint
app.post('/api/send-sms', (req, res) => {
  const { to, recipientName = 'User', type = 'CONFIRMATION', message, templateData = {} } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Phone number (to) is required' });
  }

  // Construct message if not provided
  let finalMessage = message;
  if (!finalMessage) {
    switch (type) {
      case 'ORDER_CONFIRMED_FARMER':
        finalMessage = `FarmSync Order Confirmed: Ram Ram ${templateData.farmerName || 'Ramesh Patil'}! New order #${templateData.orderId || 'ORD-9941'} received for ${templateData.quantityQtl || '50'} Qtl ${templateData.cropName || 'Produce'} from ${templateData.buyerName || 'Mandi Buyer'}. ₹${templateData.totalAmount || '0'} locked in Escrow. Loading PIN: ${templateData.farmOtp || '4821'}.`;
        break;
      case 'POST_ORDER_FARMER':
        finalMessage = `FarmSync Post-Order Alert: Order #${templateData.orderId || 'ORD-9941'} scheduled for pickup. Truck ${templateData.truckReg || 'MH-15-EG-4412'} (Driver: ${templateData.driverName || 'Suresh Kadam'}, Ph: ${templateData.driverPhone || '+91 98230 45612'}) is en-route. Check Loading PIN: ${templateData.farmOtp || '4821'}. Live GPS: farmsync.in/t/${templateData.orderId || 'ORD-9941'}`;
        break;
      case 'ORDER_PLACED_BUYER':
        finalMessage = `FarmSync Order Placed: Order #${templateData.orderId || 'ORD-9941'} for ${templateData.quantityQtl || '50'} Qtl ${templateData.cropName || 'Produce'} placed with farmer ${templateData.farmerName || 'Ramesh Patil'}. Delivery OTP: ${templateData.deliveryOtp || '7190'}. 0% dalali.`;
        break;
      case 'TRUCK_BOOKED':
        finalMessage = `FarmSync Alert: Truck booking confirmed! Vehicle: ${templateData.truckReg || 'MH-15-EG-4412'}, Driver: ${templateData.driverName || 'Suresh Kadam'} (${templateData.driverPhone || '+91 98230 45612'}). Loading PIN: ${templateData.farmOtp || '4821'}. Live GPS: farmsync.in/track`;
        break;
      case 'FARM_GATE_LOADING_OTP':
        finalMessage = `FarmSync Security: Your Farm-Gate Loading OTP is ${templateData.farmOtp || '4821'}. Share this ONLY with driver ${templateData.driverName || 'Suresh Kadam'} upon physical crop inspection at farm.`;
        break;
      case 'DELIVERY_OTP':
        finalMessage = `FarmSync Security: Your Mandi Delivery OTP is ${templateData.deliveryOtp || '7190'}. Provide this to driver upon receiving ${templateData.produce || 'produce'} at ${templateData.destination || 'store'}. 100% DBT will be released.`;
        break;
      case 'PAYMENT_RECEIVED':
        finalMessage = `FarmSync Alert: ₹${templateData.amount || '0'} directly credited to ${templateData.vpa || 'farmer bank'}. NPCI UTR: ${templateData.utr || 'UTR' + Date.now()}. 0% dalali commission direct settlement.`;
        break;
      case 'ESCROW_LOCKED':
        finalMessage = `FarmSync Alert: Escrow locked for ₹${templateData.amount || '0'} (Order #${templateData.orderId || 'ORD-9941'}). Truck dispatch initiated to farmer gate.`;
        break;
      default:
        finalMessage = `FarmSync Alert: Confirmation for transaction ${templateData.orderId || 'FS-' + Date.now()}. Direct trade verified.`;
    }
  }

  const dispatchedSms: DispatchedSms = {
    id: `SMS-IN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    senderId: 'VK-FARMSYNC',
    to,
    recipientName,
    type,
    message: finalMessage,
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
    dltTemplateId: 'DLT-FARMSYNC-' + Math.floor(100000 + Math.random() * 900000),
  };

  smsOutboxLog.unshift(dispatchedSms);

  // Keep last 50 SMS in memory
  if (smsOutboxLog.length > 50) {
    smsOutboxLog.pop();
  }

  console.log(`[SMS DISPATCHED] To: ${to} (${recipientName}) | Content: ${finalMessage}`);

  return res.json({
    success: true,
    sms: dispatchedSms,
  });
});

// Retrieve SMS History endpoint
app.get('/api/sms-history', (req, res) => {
  res.json({
    success: true,
    history: smsOutboxLog,
  });
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FarmSync Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
