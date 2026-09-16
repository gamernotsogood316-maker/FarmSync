import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { getLiveDevicePosition, reverseGeocodeLiveCoords, getMandisRankedByDistance } from '../services/geolocationService';
import { sendSmsConfirmation } from '../services/smsService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: string;
  actionLabel?: string;
  liveCoords?: { lat: number; lng: number };
}

interface AiChatbotProps {
  onNavigate: (screen: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  initialVoiceMode?: boolean;
}

export const AiChatbotModal: React.FC<AiChatbotProps> = ({
  onNavigate,
  isOpen,
  onToggle,
  initialVoiceMode = false,
}) => {
  const { language: selectedLanguage } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [voiceNotification, setVoiceNotification] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Multilingual Initial Greeting & Prompts
  const getInitialGreeting = (lang: string): string => {
    switch (lang) {
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನಾನು ಫಾರ್ಮ್‌ಸಿಂಕ್ ಧ್ವನಿ ಮತ್ತು AI ಸಹಾಯಕ. ನೀವು ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ ಕಿಸಾನ್ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಬಹುದು, ಬೆಳೆ ಮಾರಾಟ ಮಾಡಬಹುದು, OTP ತಿಳಿಯಬಹುದು ಅಥವಾ SMS ಕಳುಹಿಸಬಹುದು. "ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ" ಅಥವಾ "ಬೆಳೆ ಮಾರಿ" ಎಂದು ಹೇಳಿ!';
      case 'hi':
        return 'नमस्ते! मैं फार्मसिंक वॉइस व AI सहायक हूँ। आप बोलकर या लिखकर किसान ट्रक बुक कर सकते हैं, फसल बेच सकते हैं, मंडी भाव व OTP जान सकते हैं। "ट्रक बुक करो" या "फसल बेचो" बोलें!';
      case 'mr':
        return 'नमस्कार! मी फार्मसिंक व्हॉइस व AI सहाय्यक आहे. आपण बोलून शेतकरी ट्रक बुक करू शकता, शेतमाल विकू शकता, किंवा OTP व SMS अलर्ट मिळवू शकता. बोला, मी ऐकत आहे!';
      case 'pa':
        return 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਫਾਰਮਸਿੰਕ ਵੌਇਸ ਅਤੇ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਬੋਲ ਕੇ ਟਰੱਕ ਬੁਕਿੰਗ, ਫਸਲ ਵਿਕਰੀ ਜਾਂ ਓਟੀਪੀ ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ ਹੋ।';
      case 'gu':
        return 'નમસ્તે! હું ફાર્મસિંક વૉઇસ અને AI સહાયક છું. તમે બોલીને ખેડૂત ટ્રક બુકિંગ અથવા પાક વેચાણ કરી શકો છો.';
      case 'te':
        return 'నమస్కారం! నేను ఫార్మ్‌సింక్ వాయిస్ మరియు AI సహాయకుడిని. మాట్లాడి కిసాన్ ట్రక్ బుకింగ్ లేదా పంట విక్రయం చేయవచ్చు.';
      case 'ta':
        return 'வணக்கம்! நான் ஃபார்ம்சின்க் குரல் மற்றும் AI உதவியாளர். பேசி விவசாயி லாரி முன்பதிவு அல்லது பயிர் விற்பனை செய்யலாம்.';
      case 'bn':
        return 'নমস্কার! আমি ফার্মসিঙ্ক ভয়েস ও এআই সহায়ক। কথা বলে ট্রাক বুকিং বা ফসল বিক্রি করতে পারেন।';
      default:
        return 'Hello! I am FarmSync Voice & AI Assistant. You can speak or type to book farm trucks, sell crops with 0% dalali, check OTPs, or send SMS confirmations. Try saying "Book a truck" or "Sell crops"!';
    }
  };

  const getQuickChips = (lang: string): { label: string; query: string }[] => {
    switch (lang) {
      case 'kn':
        return [
          { label: '🎙️ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ (Voice)', query: 'ಕಿಸಾನ್ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ' },
          { label: '🌾 ಬೆಳೆ ಮಾರಿ (0% ದಳ್ಳಾಳಿ)', query: 'ನನ್ನ ಬೆಳೆಯನ್ನು 0% ದಳ್ಳಾಳಿಯಲ್ಲಿ ಹೇಗೆ ಮಾರಾಟ ಮಾಡುವುದು?' },
          { label: '🔒 ಲೋಡಿಂಗ್ OTP ತೋರಿಸಿ', query: 'ಫಾರ್ಮ್ ಗೇಟ್ ಲೋಡಿಂಗ್ OTP ಏನು?' },
          { label: '📱 ಕನ್ಫರ್ಮೇಶನ್ SMS ಕಳುಹಿಸಿ', query: 'ಟ್ರಕ್ ಬುಕಿಂಗ್ ಕನ್ಫರ್ಮೇಶನ್ SMS ಕಳುಹಿಸಿ' },
        ];
      case 'hi':
        return [
          { label: '🎙️ किसान ट्रक बुक करें (Voice)', query: 'किसान ट्रक बुक करो' },
          { label: '🌾 फसल बेचें (0% दलाली)', query: 'फसल बेचें' },
          { label: '🔒 लोडिंग OTP क्या है?', query: 'मेरा लोडिंग OTP क्या है?' },
          { label: '📱 कन्फर्मेशन SMS भेजो', query: 'कन्फर्मेशन SMS भेजो' },
        ];
      case 'mr':
        return [
          { label: '🎙️ शेतकरी ट्रक बुक करा', query: 'शेतकरी ट्रक बुक करा' },
          { label: '🌾 थेट माल विका', query: 'थेट व्यापाऱ्यांना माल कसा विकावा?' },
          { label: '🔒 डिलिव्हरी OTP', query: 'डिलिव्हरी OTP काय आहे?' },
        ];
      default:
        return [
          { label: '🎙️ "Book a farm truck"', query: 'Book a farm truck' },
          { label: '🌾 "Sell crops at 0% dalali"', query: 'Sell crops' },
          { label: '🔒 "What is my OTP?"', query: 'What is my loading OTP?' },
          { label: '📱 "Send confirmation SMS"', query: 'Send confirmation SMS' },
          { label: '📍 "Find nearest mandi"', query: 'Detect my live GPS and find nearest mandi' },
        ];
    }
  };

  // Initialize or reset initial message when language changes if no conversation exists
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: getInitialGreeting(selectedLanguage),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [selectedLanguage]);

  // If opened in voice mode, trigger listening
  useEffect(() => {
    if (isOpen && initialVoiceMode) {
      startSpeechRecognition();
    }
  }, [isOpen, initialVoiceMode]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Synthesis (TTS)
  const speakText = (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    // Clean text of markdown/asterisks before speaking
    const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap: Record<string, string> = {
      kn: 'kn-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      pa: 'pa-IN',
      gu: 'gu-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      bn: 'bn-IN',
      en: 'en-IN',
    };
    utterance.lang = langMap[selectedLanguage] || 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    if (msgId) setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Voice Command Execution
  const processVoiceCommand = async (transcript: string): Promise<boolean> => {
    const lower = transcript.toLowerCase();

    // 1. Truck Booking Command
    if (
      lower.includes('truck') ||
      lower.includes('ट्रक') ||
      lower.includes('गाड़ी') ||
      lower.includes('ಟ್ರಕ್') ||
      lower.includes('transport')
    ) {
      const reply =
        selectedLanguage === 'hi'
          ? 'जरूर! किसान फार्म ट्रक बुकिंग स्क्रीन खोली जा रही है।'
          : selectedLanguage === 'kn'
          ? 'ಖಂಡಿತ! ಕಿಸಾನ್ ಟ್ರಕ್ ಬುಕಿಂಗ್ ಸ್ಕ್ರೀನ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ.'
          : 'Opening Kisan Farm Truck Booking for you right away!';
      
      setVoiceNotification('🚚 Executing: Open Farm Truck Booking');
      if (isAutoSpeak) speakText(reply);
      setTimeout(() => {
        onNavigate('kisan-truck-transport');
        setVoiceNotification(null);
      }, 1200);
      return true;
    }

    // 2. Sell Crops Command
    if (
      lower.includes('sell') ||
      lower.includes('फसल बेच') ||
      lower.includes('बेचना') ||
      lower.includes('ಮಾರಾಟ') ||
      lower.includes('शेतमाल')
    ) {
      const reply =
        selectedLanguage === 'hi'
          ? 'फसल बिक्री स्क्रीन (0% दलाली) खोली जा रही है।'
          : 'Navigating to 0% brokerage crop listing!';
      setVoiceNotification('🌾 Executing: Open Sell Crops Screen');
      if (isAutoSpeak) speakText(reply);
      setTimeout(() => {
        onNavigate('sell-crops-kisan');
        setVoiceNotification(null);
      }, 1200);
      return true;
    }

    // 3. Buy Produce / Mandi Command
    if (
      lower.includes('buy') ||
      lower.includes('mandi') ||
      lower.includes('खरीद') ||
      lower.includes('ಮಂಡಿ') ||
      lower.includes('बाजार')
    ) {
      const reply = 'Opening Direct Mandi Wholesale Marketplace!';
      setVoiceNotification('🛒 Executing: Open Produce Marketplace');
      if (isAutoSpeak) speakText(reply);
      setTimeout(() => {
        onNavigate('buy-crops-mandi-retail');
        setVoiceNotification(null);
      }, 1200);
      return true;
    }

    // 4. Driver Portal Command
    if (
      lower.includes('driver') ||
      lower.includes('सारथी') ||
      lower.includes('चालक') ||
      lower.includes('ಚಾಲಕ')
    ) {
      const reply = 'Opening Driver Partner Desk with instant loads!';
      setVoiceNotification('🚛 Executing: Open Driver Desk');
      if (isAutoSpeak) speakText(reply);
      setTimeout(() => {
        onNavigate('truck-driver-portal');
        setVoiceNotification(null);
      }, 1200);
      return true;
    }

    // 5. Orders Dashboard Command
    if (
      lower.includes('dashboard') ||
      lower.includes('orders') ||
      lower.includes('खाता') ||
      lower.includes('ಆರ್ಡರ್') ||
      lower.includes('डैशबोर्ड')
    ) {
      const reply = 'Opening Kisan Orders & Bids Dashboard!';
      setVoiceNotification('📊 Executing: Open Orders Dashboard');
      if (isAutoSpeak) speakText(reply);
      setTimeout(() => {
        onNavigate('farmer-dashboard-orders');
        setVoiceNotification(null);
      }, 1200);
      return true;
    }

    // 6. OTP Query Command
    if (
      lower.includes('otp') ||
      lower.includes('ओटीपी') ||
      lower.includes('pin') ||
      lower.includes('पिन')
    ) {
      const reply =
        'FarmSync uses a 2-factor OTP system: 1. Farm-Gate Loading OTP (4821) shared with driver when loading crops. 2. Mandi Delivery OTP (7190) shared by retailer when receiving crops. Both trigger automated DBT escrow releases!';
      setVoiceNotification('🔒 OTP Security Details Explained');
      if (isAutoSpeak) speakText(reply);
      return false; // Let normal message render
    }

    // 7. SMS Dispatch Command
    if (
      lower.includes('sms') ||
      lower.includes('message') ||
      lower.includes('संदेश') ||
      lower.includes('ಮೆಸೇಜ್')
    ) {
      await sendSmsConfirmation({
        to: '+91 98221 44910',
        recipientName: 'Ramesh Patil (Kisan)',
        type: 'TRUCK_BOOKED',
        templateData: {
          truckReg: 'MH-15-EG-4412',
          driverName: 'Suresh Kadam',
          driverPhone: '+91 98230 45612',
          farmOtp: '4821',
        },
      });
      const reply = 'Confirmation SMS with OTP 4821 and driver details has been dispatched to +91 98221 44910 via DLT gateway!';
      setVoiceNotification('📱 Official SMS Dispatched!');
      if (isAutoSpeak) speakText(reply);
      return false;
    }

    return false;
  };

  // Handle GPS location query directly
  const handleLiveLocationQuery = async () => {
    setIsDetectingGps(true);
    try {
      const pos = await getLiveDevicePosition();
      const coords = { lat: pos.lat, lng: pos.lng };
      const locationName = await reverseGeocodeLiveCoords(coords.lat, coords.lng);
      const nearestMandis = getMandisRankedByDistance(coords);

      const topMandi = nearestMandis[0];
      const secondMandi = nearestMandis[1];

      const locationSummary =
        selectedLanguage === 'kn'
          ? `📍 ಲೈವ್ GPS ಪತ್ತೆಯಾಗಿದೆ!\nನಿಮ್ಮ ಸ್ಥಳ: ${locationName} (ಅಕ್ಷಾಂಶ: ${coords.lat.toFixed(4)}, ರೇಖಾಂಶ: ${coords.lng.toFixed(4)})\n\nಹತ್ತಿರದ APMC ಮಂಡಿಗಳು:\n1. ${topMandi.name} - ${topMandi.distanceKm} ಕಿ.ಮೀ\n2. ${secondMandi.name} - ${secondMandi.distanceKm} ಕಿ.ಮೀ\n\nನೀವು ಈ ಸ್ಥಳದಿಂದ ಕಿಸಾನ್ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಬಹುದು.`
          : selectedLanguage === 'hi'
          ? `📍 लाइव GPS सफलतापूर्वक ट्रैक हुआ!\nआपकी लोकेशन: ${locationName}\n(अक्षांश: ${coords.lat.toFixed(4)}, देशांतर: ${coords.lng.toFixed(4)})\n\nनजदीकी APMC मंडियां:\n1. ${topMandi.name} - ${topMandi.distanceKm} किमी\n2. ${secondMandi.name} - ${secondMandi.distanceKm} किमी\n\nआप सीधे इस फार्म गेट से किसान ट्रक बुक कर सकते हैं।`
          : `📍 Live Device GPS Acquired!\nYour Location: ${locationName}\n(Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)})\n\nTop APMC Mandis by Proximity:\n1. ${topMandi.name} (${topMandi.state}) - ${topMandi.distanceKm} km\n2. ${secondMandi.name} (${secondMandi.state}) - ${secondMandi.distanceKm} km\n\nYou can book on-demand farm trucks directly from this farm gate.`;

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: locationSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: 'kisan-truck-transport',
        actionLabel: selectedLanguage === 'kn' ? '🚚 ಈ ಸ್ಥಳದಿಂದ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ' : '🚚 Book Farm Truck from this Location',
        liveCoords: coords,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (isAutoSpeak) speakText(locationSummary, assistantMsg.id);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `⚠️ ${err.message || 'Could not fetch device location. Please enable GPS and allow location permission in your browser.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    // Check voice commands first
    const isCommandHandled = await processVoiceCommand(query);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: selectedLanguage,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Here is the requested information.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction,
        actionLabel: getActionLabel(data.suggestedAction, selectedLanguage),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak response aloud if auto-speak is enabled
      if (isAutoSpeak && !isCommandHandled) {
        speakText(assistantMsg.text, assistantMsg.id);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackReply = selectedLanguage === 'kn'
        ? 'ಕ್ಷಮಿಸಿ, ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ಮೆನುವಿನಲ್ಲಿರುವ ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಿ.'
        : 'FarmSync is ready to help! You can book farm trucks, sell harvest, verify OTPs, or track shipments directly from the menu.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      if (isAutoSpeak) speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = (action?: string, lang?: string): string => {
    if (!action) return 'View Screen';
    if (lang === 'kn') {
      if (action === 'kisan-truck-transport') return '🚚 ರೈತ ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ';
      if (action === 'truck-driver-portal') return '🚛 ಚಾಲಕರ ಡೆಸ್ಕ್ ತೆರೆಯಿರಿ';
      if (action === 'sell-crops-kisan') return '🌾 ಬೆಳೆ ಮಾರಾಟಕ್ಕೆ ಹೋಗಿ';
      if (action === 'buy-crops-mandi-retail') return '🛒 ಮಂಡಿ ಖರೀದಿಗೆ ಹೋಗಿ';
      if (action === 'farmer-dashboard-orders') return '📊 ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ';
    }
    if (lang === 'hi') {
      if (action === 'kisan-truck-transport') return '🚚 किसान ट्रक बुक करें';
      if (action === 'truck-driver-portal') return '🚛 सारथी डेस्क खोलें';
      if (action === 'sell-crops-kisan') return '🌾 फसल बेचें (0% दलाली)';
      if (action === 'buy-crops-mandi-retail') return '🛒 मंडी बाजार देखें';
      if (action === 'farmer-dashboard-orders') return '📊 किसान डैशबोर्ड देखें';
    }
    if (action === 'kisan-truck-transport') return '🚚 Open Farm Truck Booking';
    if (action === 'truck-driver-portal') return '🚛 Open Driver Partner Desk';
    if (action === 'sell-crops-kisan') return '🌾 Go to Sell Crops Screen';
    if (action === 'buy-crops-mandi-retail') return '🛒 Browse Produce Marketplace';
    if (action === 'farmer-dashboard-orders') return '📊 View Kisan Orders & Escrow';
    return '🚀 Go to Section';
  };

  // Web Speech Recognition (Microphone Voice Input)
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please type your message.');
      return;
    }

    try {
      window.speechSynthesis?.cancel();
      const recognition = new SpeechRecognition();
      const langMap: Record<string, string> = {
        kn: 'kn-IN',
        hi: 'hi-IN',
        mr: 'mr-IN',
        pa: 'pa-IN',
        gu: 'gu-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        bn: 'bn-IN',
        en: 'en-IN',
      };
      recognition.lang = langMap[selectedLanguage] || 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
    } else {
      startSpeechRecognition();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {/* Prominent Voice Assistant Quick-Trigger Button */}
        <button
          onClick={() => {
            onToggle();
            setTimeout(() => startSpeechRecognition(), 300);
          }}
          className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20 group"
          id="quick-voice-assistant-launcher-btn"
          title="Speak to FarmSync Voice Assistant"
        >
          <span className="material-symbols-outlined text-[20px] animate-pulse">mic</span>
          <span className="hidden md:inline">बोलकर बताएं (Voice)</span>
        </button>

        {/* Regular AI Chatbot Launcher */}
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-on-primary font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20 group"
          id="ai-chatbot-launcher-btn"
          aria-label="Open FarmSync AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
          </span>
          <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          <span className="hidden sm:inline">FarmSync Sahayak</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-mono tracking-wider">
            {selectedLanguage}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[430px] max-h-[660px] h-[85vh] rounded-3xl bg-surface-container-lowest border-2 border-primary/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
      id="ai-chatbot-window"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary to-primary/90 text-on-primary flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-sm font-bold leading-none">
                FarmSync Voice Sahayak
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-mono tracking-wider font-bold">
                {selectedLanguage}
              </span>
            </div>
            <p className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1">
              <span>Voice</span> • <span>SMS</span> • <span>OTP</span> • <span>GPS</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice Auto-Speak Toggle */}
          <button
            onClick={() => {
              setIsAutoSpeak(!isAutoSpeak);
              if (isAutoSpeak) window.speechSynthesis?.cancel();
            }}
            title={isAutoSpeak ? 'Voice output ON (click to mute)' : 'Voice output OFF (click to unmute)'}
            className={`p-2 rounded-xl text-white/90 hover:bg-white/20 transition-colors cursor-pointer ${
              isAutoSpeak ? 'bg-white/20' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAutoSpeak ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* GPS Detector */}
          <button
            onClick={handleLiveLocationQuery}
            disabled={isDetectingGps}
            title="Detect Live Device GPS"
            className="p-2 rounded-xl text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[20px] ${isDetectingGps ? 'animate-spin text-amber-300' : ''}`}>
              my_location
            </span>
          </button>

          {/* Close */}
          <button
            onClick={onToggle}
            className="p-2 rounded-xl text-white/90 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
      </div>

      {/* Voice Notification / Action Banner */}
      {voiceNotification && (
        <div className="px-4 py-2 bg-secondary text-on-secondary text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>{voiceNotification}</span>
        </div>
      )}

      {/* Active Voice Listening Wave Banner */}
      {isListening && (
        <div className="p-3 bg-error-container/20 border-b border-error/30 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-error animate-ping" />
            <span className="text-xs font-bold text-error">
              Listening... Speak now (सुन रहा हूँ...)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-1 h-4 bg-error animate-pulse" />
            <span className="w-1 h-6 bg-error animate-pulse [animation-delay:0.1s]" />
            <span className="w-1 h-5 bg-error animate-pulse [animation-delay:0.2s]" />
            <span className="w-1 h-3 bg-error animate-pulse [animation-delay:0.3s]" />
            <button
              onClick={toggleSpeechRecognition}
              className="ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-error text-on-error cursor-pointer"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-surface/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-primary text-on-primary rounded-br-none'
                  : 'bg-surface-container-lowest text-on-surface border border-surface-container-high rounded-bl-none'
              }`}
            >
              {msg.text}

              {/* Action Button inside AI response */}
              {msg.suggestedAction && (
                <div className="mt-3 pt-2 border-t border-surface-container/60">
                  <button
                    onClick={() => {
                      onNavigate(msg.suggestedAction!);
                      onToggle();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-secondary text-on-secondary font-label-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-secondary/90 transition-all cursor-pointer text-xs"
                  >
                    <span>{msg.actionLabel || 'Go to Feature →'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Message Meta & Audio Playback */}
            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-on-surface-variant">
              <span>{msg.timestamp}</span>
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => speakText(msg.text, msg.id)}
                  className="hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
                  title="Read message aloud"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {speakingMessageId === msg.id ? 'volume_off' : 'volume_up'}
                  </span>
                  <span>{speakingMessageId === msg.id ? 'Stop' : 'Speak Voice'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container-lowest border border-surface-container max-w-[70%]">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-xs text-on-surface-variant font-medium ml-1">
              FarmSync Assistant thinking...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="p-2.5 bg-surface-container-low border-t border-surface-container overflow-x-auto flex items-center gap-2 no-scrollbar">
        {getQuickChips(selectedLanguage).map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-surface-container text-[11px] font-semibold text-on-surface hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box with Voice & Send */}
      <div className="p-3 bg-surface-container-lowest border-t border-surface-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isListening ? 'Stop listening' : 'Voice Input in your language'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-error text-on-error border-error animate-pulse'
                : 'bg-primary text-on-primary border-primary shadow-xs hover:bg-primary/90'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isListening ? 'mic' : 'mic'}
            </span>
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              selectedLanguage === 'kn'
                ? 'ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ...'
                : selectedLanguage === 'hi'
                ? 'बोलें या टाइप करें...'
                : 'Speak or type command (e.g. Book truck)...'
            }
            className="flex-1 p-2.5 rounded-xl bg-surface-container border border-surface-container-high text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/70"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:bg-primary/90 disabled:opacity-40 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
