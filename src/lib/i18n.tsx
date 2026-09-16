import React, { createContext, useContext, useState, useEffect } from 'react';
import { setGoogleTranslateLanguage } from './translateHelper';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'pa' | 'gu' | 'te' | 'ta' | 'bn' | 'kn';

export interface Translations {
  // Navigation & Common
  home: string;
  sellCrops: string;
  buyMandi: string;
  farmTrucks: string;
  driverDesk: string;
  dashboard: string;
  quickScreens: string;
  helpline: string;
  escrowProtected: string;
  selectLanguage: string;
  chooseLanguage: string;
  allIndianLanguages: string;
  close: string;
  
  // Hero & Welcome
  heroTagline: string;
  heroHeadline1: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  heroDescription: string;
  enterAsKisan: string;
  enterAsRetailer: string;
  farmerIncomeUplift: string;
  directFarmGateTrade: string;
  bhashaTitle: string;
  bhashaSubtitle: string;
  playingVoiceGuidance: string;
  
  // Roles
  selectRole: string;
  tailoredWorkflows: string;
  kisanTrackTitle: string;
  kisanTrackSubtitle: string;
  kisanTrackDesc: string;
  retailerTrackTitle: string;
  retailerTrackSubtitle: string;
  retailerTrackDesc: string;
  zeroBrokerage: string;
  dbtEscrow: string;
  
  // Transport & Logistics
  farmTrucksLogisticsTitle: string;
  farmTrucksLogisticsSubtitle: string;
  kisanTruckBooking: string;
  kisanTruckBookingDesc: string;
  bookFarmTruckBtn: string;
  driverDeskTitle: string;
  driverDeskDesc: string;
  openDriverDeskBtn: string;
  activeTrips: string;
  tripStatusSearching: string;
  tripStatusAssigned: string;
  tripStatusEnRoute: string;
  tripStatusLoading: string;
  tripStatusInTransit: string;
  tripStatusDelivered: string;
  
  // Status & Actions
  pickupLocation: string;
  dropLocation: string;
  estimatedFreight: string;
  advanceFuelFastag: string;
  confirmBooking: string;
  liveGpsTracking: string;
  onlineDuty: string;
  offlineDuty: string;
  acceptLoad: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    home: 'Home',
    sellCrops: 'Sell Crops',
    buyMandi: 'Buy Mandi',
    farmTrucks: 'Farm Trucks',
    driverDesk: 'Driver Desk',
    dashboard: 'Dashboard',
    quickScreens: 'Quick Screens:',
    helpline: 'Helpline: 1800-FARMSYNC',
    escrowProtected: '24x7 Escrow Protected',
    selectLanguage: 'Choose Language',
    chooseLanguage: 'Choose Your Language (भाषा चुनें)',
    allIndianLanguages: 'All Indian Languages',
    close: 'Close',
    
    heroTagline: 'Tiranga Direct Trade • 0% Dalali • 100% Kisan Empowerment',
    heroHeadline1: 'Direct from Kisan',
    heroHeadlineHighlight: 'To Shopkeeper.',
    heroSubheadline: 'Direct Mandi, Direct Profit.',
    heroDescription: "India's direct agrarian marketplace bypassing predatory intermediaries. Connecting hardworking Annadatas directly to city wholesale retailers with verified 5-photo quality testing, farm-gate pickup, and guaranteed T+1 DBT Escrow.",
    enterAsKisan: 'Enter as Kisan / Sell Produce',
    enterAsRetailer: 'Enter as Retailer / Procure Bulk',
    farmerIncomeUplift: 'Farmer Income Uplift',
    directFarmGateTrade: 'Direct Farm Gate Trade',
    bhashaTitle: 'Choose Your Regional Bhasha / भाषा चुनें',
    bhashaSubtitle: 'FarmSync speaks your language with voice support for all regional agricultural mandis.',
    playingVoiceGuidance: 'Playing voice guidance...',
    
    selectRole: 'Select Your Role',
    tailoredWorkflows: 'Tailored Workflows for Growers & Buyers',
    kisanTrackTitle: 'Annadata / Kisan Track',
    kisanTrackSubtitle: 'Sell Produce Directly at Real MSP Value',
    kisanTrackDesc: 'List your harvested crop with verified 5-photo proof. Set your fair price with live APMC market intelligence. Never sell in distress.',
    retailerTrackTitle: 'Dukandar / Retailer Track',
    retailerTrackSubtitle: 'Procure Verified Lots Directly from Nearby Farms',
    retailerTrackDesc: 'Browse fresh harvest within 5–50 km radius. Review high-resolution moisture and cross-section tests before releasing funds to escrow.',
    zeroBrokerage: '0% Brokerage Dalali',
    dbtEscrow: 'T+1 DBT Escrow Protected',
    
    farmTrucksLogisticsTitle: 'FarmSync Sarathi • On-Demand Indian Agri-Logistics',
    farmTrucksLogisticsSubtitle: 'Farm Trucks for Farmers & Dedicated Driver Desk',
    kisanTruckBooking: 'Kisan Truck Booking (किसान ट्रक सेवा)',
    kisanTruckBookingDesc: 'Book on-demand farm trucks (Tata Ace, Bolero Pickup, Eicher 14ft/19ft, 10-Wheeler, Cold-Chain). Track live vehicle location on Google Maps with PIN-based pickup and delivery security.',
    bookFarmTruckBtn: 'Book Farm Truck / Track Ride →',
    driverDeskTitle: 'Truck Driver Section (सारथी डेस्क)',
    driverDeskDesc: 'Dedicated portal for commercial truck drivers to get high-paying bulk agri loads directly from farmers dispatched to city retailers. No dry empty runs!',
    openDriverDeskBtn: 'Open Driver Partner Desk →',
    activeTrips: 'Active Transport Trips',
    tripStatusSearching: 'Searching Nearby Truck',
    tripStatusAssigned: 'Driver Assigned',
    tripStatusEnRoute: 'En Route to Farm Gate',
    tripStatusLoading: 'Loading & Weighbridge',
    tripStatusInTransit: 'In Transit on Highway',
    tripStatusDelivered: 'Delivered at Mandi / Retailer',
    
    pickupLocation: 'Farm Pickup Location',
    dropLocation: 'Destination Mandi / Shop',
    estimatedFreight: 'Estimated Total Freight',
    advanceFuelFastag: 'FASTag & Fuel Advance',
    confirmBooking: 'Confirm Farm Truck Booking',
    liveGpsTracking: 'Live Google Maps GPS Tracking',
    onlineDuty: 'Online - Ready for Loads',
    offlineDuty: 'Offline',
    acceptLoad: 'Accept This Load & Start Trip',
  },

  hi: {
    home: 'होम',
    sellCrops: 'फसल बेचें (किसान)',
    buyMandi: 'मंडी खरीद (दुकानदार)',
    farmTrucks: 'किसान ट्रक सेवा (सारथी)',
    driverDesk: 'सारथी / ड्राइवर डेस्क',
    dashboard: 'किसान डैशबोर्ड',
    quickScreens: 'त्वरित स्क्रीन:',
    helpline: 'हेल्पलाइन: 1800-FARMSYNC',
    escrowProtected: '24x7 एस्क्रो सुरक्षित भुगतान',
    selectLanguage: 'भाषा चुनें',
    chooseLanguage: 'अपनी भाषा चुनें (Choose Language)',
    allIndianLanguages: 'सभी भारतीय भाषाएं',
    close: 'बंद करें',
    
    heroTagline: 'तिरंगा प्रत्यक्ष व्यापार • 0% दलाली • 100% किसान सशक्तिकरण',
    heroHeadline1: 'किसान से सीधे',
    heroHeadlineHighlight: 'दुकानदार तक।',
    heroSubheadline: 'सीधी मंडी, सीधा मुनाफा।',
    heroDescription: 'बिचौलियों और आढ़तियों से मुक्त भारत का पहला सीधा कृषि मंच। हमारे अन्नदाता भाइयों को 5-फोटो गुणवत्ता जांच, खेत से सीधा उठान और 24 घंटे में सीधा बैंक खाते में भुगतान की गारंटी।',
    enterAsKisan: 'किसान के रूप में प्रवेश करें / फसल बेचें',
    enterAsRetailer: 'दुकानदार के रूप में प्रवेश / थोक खरीद',
    farmerIncomeUplift: 'किसान आय में वृद्धि',
    directFarmGateTrade: 'सीधा खेत से व्यापार',
    bhashaTitle: 'अपनी भाषा चुनें / Choose Regional Bhasha',
    bhashaSubtitle: 'फार्मसिंक आपकी अपनी मातृभाषा में आवाज और सहायता के साथ उपलब्ध है।',
    playingVoiceGuidance: 'ध्वनि मार्गदर्शन चल रहा है...',
    
    selectRole: 'अपनी भूमिका चुनें',
    tailoredWorkflows: 'अन्नदाता और व्यापारी दोनों के लिए समर्पित व्यवस्था',
    kisanTrackTitle: 'अन्नदाता / किसान विभाग',
    kisanTrackSubtitle: 'अपनी फसल सही मूल्य पर सीधे बेचें',
    kisanTrackDesc: '5-फोटो प्रमाण के साथ अपनी उपज सूचीबद्ध करें। बिना किसी दलाली के सीधे खुदरा दुकानदारों से संपर्क करें।',
    retailerTrackTitle: 'दुकानदार / खुदरा व्यापारी विभाग',
    retailerTrackSubtitle: 'खेत से सीधे ताज़ा माल मंगवाएं',
    retailerTrackDesc: 'अपने नजदीकी 5 से 50 किमी के खेतों से बिना बिचौलियों के ताज़ा और सत्यापित गुणवत्ता वाली फसल खरीदें।',
    zeroBrokerage: '0% दलाली / आढ़त',
    dbtEscrow: 'T+1 सुरक्षित बैंक एस्क्रो',
    
    farmTrucksLogisticsTitle: 'फार्मसिंक सारथी • कृषि के लिए ऑन-डिमांड ट्रक सेवा',
    farmTrucksLogisticsSubtitle: 'किसानों के लिए ऑन-डिमांड ट्रक और चालकों के लिए लोड डेस्क',
    kisanTruckBooking: 'किसान ट्रक बुकिंग (सारथी सेवा)',
    kisanTruckBookingDesc: 'खेत से मंडी या दुकान तक माल भेजने के लिए तुरंत ट्रक बुक करें (छोटा हाथी, बोलेरो, 14-फुट, 10-चक्का)। गूगल मैप्स पर लाइव जीपीएस से ट्रैक करें।',
    bookFarmTruckBtn: 'ट्रक बुक करें / लाइव ट्रैक करें →',
    driverDeskTitle: 'ट्रक चालक अनुभाग (सारथी डेस्क)',
    driverDeskDesc: 'ट्रक चालकों के लिए किसानों से सीधे थोक माल के फेरे (Rides)। डीजल खर्च का तुरंत अग्रिम और सुरक्षित भुगतान।',
    openDriverDeskBtn: 'ड्राइवर डेस्क खोलें →',
    activeTrips: 'सक्रिय परिवहन यात्राएं',
    tripStatusSearching: 'नजदीकी ट्रक खोज रहे हैं...',
    tripStatusAssigned: 'चालक आवंटित हो गया',
    tripStatusEnRoute: 'खेत की तरफ रवाना',
    tripStatusLoading: 'लोडिंग व धर्मकांटा तौल जारी',
    tripStatusInTransit: 'हाईवे पर यात्रा जारी (Google Maps)',
    tripStatusDelivered: 'मंडी / दुकान पर माल पहुंच गया',
    
    pickupLocation: 'खेत से उठान का पता',
    dropLocation: 'गंतव्य मंडी या दुकान',
    estimatedFreight: 'अनुमानित कुल भाड़ा',
    advanceFuelFastag: 'डीजल व FASTag अग्रिम राशि',
    confirmBooking: 'ट्रक बुकिंग की पुष्टि करें',
    liveGpsTracking: 'लाइव गूगल मैप्स जीपीएस ट्रैकिंग',
    onlineDuty: 'ड्यूटी चालू - नए फेरे प्राप्त करें',
    offlineDuty: 'ड्यूटी बंद',
    acceptLoad: 'यह लोड स्वीकार करें और शुरू करें',
  },

  mr: {
    home: 'मुख्यपृष्ठ',
    sellCrops: 'पीक विका (शेतकरी)',
    buyMandi: 'खरेदी करा (व्यापारी)',
    farmTrucks: 'शेतकरी ट्रक वाहतूक',
    driverDesk: 'सारथी / चालक कक्ष',
    dashboard: 'शेतकरी डॅशबोर्ड',
    quickScreens: 'जलद पर्याय:',
    helpline: 'हेल्पलाइन: 1800-FARMSYNC',
    escrowProtected: '२४x७ सुरक्षित बँक एस्क्रो',
    selectLanguage: 'भाषा निवडा',
    chooseLanguage: 'आपली भाषा निवडा',
    allIndianLanguages: 'सर्व भारतीय भाषा',
    close: 'बंद करा',
    
    heroTagline: 'तिरंगा थेट व्यापार • ०% दलाली • १००% शेतकरी सक्षमीकरण',
    heroHeadline1: 'शेतकऱ्यांकडून थेट',
    heroHeadlineHighlight: 'दुकानदारांपर्यंत.',
    heroSubheadline: 'थेट बाजार, थेट नफा.',
    heroDescription: 'दलालांशिवाय भारताचे थेट कृषी व्यासपीठ. कष्टकरी बळीराजाला ५-फोटो गुणवत्ता चाचणी, शेतातून थेट वाहतूक आणि २४ तासांत खात्यात थेट रक्कम.',
    enterAsKisan: 'शेतकरी म्हणून प्रवेश / माल विका',
    enterAsRetailer: 'व्यापारी म्हणून प्रवेश / घाऊक खरेदी',
    farmerIncomeUplift: 'शेतकरी उत्पन्नात भरघोस वाढ',
    directFarmGateTrade: 'थेट शेतातील व्यवहार',
    bhashaTitle: 'आपली मातृभाषा निवडा',
    bhashaSubtitle: 'फार्मसिंक आपल्या भाषेत आणि आवाज मार्गदर्शनासह उपलब्ध आहे.',
    playingVoiceGuidance: 'ध्वनी मार्गदर्शन सुरू आहे...',
    
    selectRole: 'आपली भूमिका निवडा',
    tailoredWorkflows: 'शेतकरी आणि खरेदीदार दोघांसाठी स्वतंत्र व्यवस्था',
    kisanTrackTitle: 'बळीराजा / शेतकरी विभाग',
    kisanTrackSubtitle: 'आपला शेतमाल योग्य हमीभावाने थेट विका',
    kisanTrackDesc: '५-फोटो पुराव्यासह पिकाची नोंदणी करा. थेट किरकोळ दुकानदारांशी व्यवहार करा, कोणतीही कपात नाही.',
    retailerTrackTitle: 'दुकानदार / किरकोळ व्यापारी विभाग',
    retailerTrackSubtitle: 'शेतातून थेट ताजी पिके मिळवा',
    retailerTrackDesc: 'जवळच्या ५ ते ५० किमी अंतरावरील थेट शेतातून दर्जेदार भाजीपाला व धान्य खरेदी करा.',
    zeroBrokerage: '०% दलाली / आडत',
    dbtEscrow: 'T+1 थेट बँक एस्क्रो सुरक्षा',
    
    farmTrucksLogisticsTitle: 'फार्मसिंक सारथी • कृषी क्षेत्रासाठी ऑन-डिमांड ट्रक सेवा',
    farmTrucksLogisticsSubtitle: 'शेतकऱ्यांसाठी ऑन-डिमांड ट्रक आणि चालकांसाठी लोड डेस्क',
    kisanTruckBooking: 'शेतकरी ट्रक बुकिंग (सारथी सेवा)',
    kisanTruckBookingDesc: 'शेतातून थेट बाजार समिती किंवा दुकानापर्यंत माल पाठवण्यासाठी ट्रक बुक करा. Google Maps वर थेट ट्रॅकिंग.',
    bookFarmTruckBtn: 'ट्रक बुक करा / थेट ट्रॅक करा →',
    driverDeskTitle: 'ट्रक चालक कक्ष (सारथी डेस्क)',
    driverDeskDesc: 'व्यावसायिक ट्रक चालकांसाठी थेट शेतकऱ्यांचे फेरे. डिझेलचे आगाऊ पैसे आणि खात्रीशीर भाडे.',
    openDriverDeskBtn: 'चालक कक्ष उघडा →',
    activeTrips: 'सक्रिय वाहतूक फेरे',
    tripStatusSearching: 'जवळचा ट्रक शोधत आहे...',
    tripStatusAssigned: 'चालक निश्चित झाला',
    tripStatusEnRoute: 'शेताकडे रवाना',
    tripStatusLoading: 'लोडिंग व वजन काटा सुरू',
    tripStatusInTransit: 'महामार्गावर प्रवास सुरू (Google Maps)',
    tripStatusDelivered: 'माल दुकानात / मंडईत पोहोचला',
    
    pickupLocation: 'शेतातील उचल पत्ता',
    dropLocation: 'मंडी किंवा दुकानाचे ठिकाण',
    estimatedFreight: 'अंदाजे एकूण भाडे',
    advanceFuelFastag: 'FASTag आणि डिझेल ॲडव्हान्स',
    confirmBooking: 'ट्रक बुकिंग निश्चित करा',
    liveGpsTracking: 'थेट Google Maps GPS ट्रॅकिंग',
    onlineDuty: 'ड्युटी सुरू - नवीन फेरे मिळवा',
    offlineDuty: 'ड्युटी बंद',
    acceptLoad: 'हा लोड स्वीकारा आणि प्रवास सुरू करा',
  },

  pa: {
    home: 'ਮੁੱਖ ਪੰਨਾ',
    sellCrops: 'ਫ਼ਸਲ ਵੇਚੋ (ਕਿਸਾਨ)',
    buyMandi: 'ਮੰਡੀ ਖ਼ਰੀਦ (ਦੁਕਾਨਦਾਰ)',
    farmTrucks: 'ਕਿਸਾਨ ਟਰੱਕ ਸੇਵਾ (ਸਾਰਥੀ)',
    driverDesk: 'ਸਾਰਥੀ / ਡਰਾਈਵਰ ਡੈਸਕ',
    dashboard: 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ',
    quickScreens: 'ਤੇਜ਼ ਸਕ੍ਰੀਨ:',
    helpline: 'ਹੈਲਪਲਾਈਨ: 1800-FARMSYNC',
    escrowProtected: '੨੪x੭ ਐਸਕਰੋ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    chooseLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    allIndianLanguages: 'ਸਾਰੀਆਂ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ',
    close: 'ਬੰਦ ਕਰੋ',
    
    heroTagline: 'ਤਿਰੰਗਾ ਸਿੱਧਾ ਵਪਾਰ • 0% ਦਲਾਲੀ • 100% ਕਿਸਾਨ ਸ਼ਕਤੀਕਰਨ',
    heroHeadline1: 'ਕਿਸਾਨ ਤੋਂ ਸਿੱਧਾ',
    heroHeadlineHighlight: 'ਦੁਕਾਨਦਾਰ ਤੱਕ।',
    heroSubheadline: 'ਸਿੱਧੀ ਮੰਡੀ, ਸਿੱਧਾ ਮੁਨਾਫ਼ਾ।',
    heroDescription: 'ਵਿਚੋਲਿਆਂ ਤੋਂ ਮੁਕਤ ਭਾਰਤ ਦਾ ਸਿੱਧਾ ਖੇਤੀਬਾੜੀ ਮੰਚ। ਮਿਹਨਤੀ ਅੰਨਦਾਤਿਆਂ ਨੂੰ 5-ਫੋਟੋ ਗੁਣਵੱਤਾ ਜਾਂਚ ਅਤੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਭੁਗਤਾਨ।',
    enterAsKisan: 'ਕਿਸਾਨ ਵਜੋਂ ਦਾਖਲ ਹੋਵੋ / ਫ਼ਸਲ ਵੇਚੋ',
    enterAsRetailer: 'ਦੁਕਾਨਦਾਰ ਵਜੋਂ ਦਾਖਲ ਹੋਵੋ / ਥੋਕ ਖ਼ਰੀਦ',
    farmerIncomeUplift: 'ਕਿਸਾਨ ਆਮਦਨ ਵਿੱਚ ਵਾਧਾ',
    directFarmGateTrade: 'ਸਿੱਧਾ ਖੇਤ ਤੋਂ ਵਪਾਰ',
    bhashaTitle: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    bhashaSubtitle: 'ਫਾਰਮਸਿੰਕ ਤੁਹਾਡੀ ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਅਵਾਜ਼ ਸਹਾਇਤਾ ਨਾਲ ਉਪਲਬਧ ਹੈ।',
    playingVoiceGuidance: 'ਅਵਾਜ਼ ਮਾਰਗਦਰਸ਼ਨ ਚੱਲ ਰਿਹਾ ਹੈ...',
    
    selectRole: 'ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
    tailoredWorkflows: 'ਕਿਸਾਨਾਂ ਅਤੇ ਵਪਾਰੀਆਂ ਦੋਵਾਂ ਲਈ ਸਮਰਪਿਤ ਪ੍ਰਣਾਲੀ',
    kisanTrackTitle: 'ਅੰਨਦਾਤਾ / ਕਿਸਾਨ ਵਿਭਾਗ',
    kisanTrackSubtitle: 'ਸਹੀ ਮੁੱਲ ਤੇ ਆਪਣੀ ਫ਼ਸਲ ਸਿੱਧੀ ਵੇਚੋ',
    kisanTrackDesc: 'ਬਿਨਾਂ ਕਿਸੇ ਕਮਿਸ਼ਨ ਦੇ ਸਿੱਧਾ ਸ਼ਹਿਰੀ ਦੁਕਾਨਦਾਰਾਂ ਨਾਲ ਜੁੜੋ।',
    retailerTrackTitle: 'ਦੁਕਾਨਦਾਰ ਵਿਭਾਗ',
    retailerTrackSubtitle: 'ਖੇਤਾਂ ਤੋਂ ਸਿੱਧਾ ਤਾਜ਼ਾ ਮਾਲ ਮੰਗਵਾਓ',
    retailerTrackDesc: 'ਨੇੜਲੇ ਖੇਤਾਂ ਤੋਂ ਸਿੱਧੀ ਥੋਕ ਖ਼ਰੀਦਦਾਰੀ ਕਰੋ।',
    zeroBrokerage: '0% ਦਲਾਲੀ / ਕਮਿਸ਼ਨ',
    dbtEscrow: 'T+1 ਸੁਰੱਖਿਅਤ ਬੈਂਕ ਭੁਗਤਾਨ',
    
    farmTrucksLogisticsTitle: 'ਫਾਰਮਸਿੰਕ ਸਾਰਥੀ • ਖੇਤੀਬਾੜੀ ਲਈ ਆਨ-ਡਿਮਾਂਡ ਟਰੱਕ ਸੇਵਾ',
    farmTrucksLogisticsSubtitle: 'ਕਿਸਾਨਾਂ ਲਈ ਟਰੱਕ ਬੁਕਿੰਗ ਅਤੇ ਡਰਾਈਵਰਾਂ ਲਈ ਲੋਡ ਡੈਸਕ',
    kisanTruckBooking: 'ਕਿਸਾਨ ਟਰੱਕ ਬੁਕਿੰਗ (ਸਾਰਥੀ ਸੇਵਾ)',
    kisanTruckBookingDesc: 'ਖੇਤ ਤੋਂ ਮੰਡੀ ਜਾਂ ਦੁਕਾਨ ਤੱਕ ਮਾਲ ਭੇਜਣ ਲਈ ਤੁਰੰਤ ਟਰੱਕ ਬੁੱਕ ਕਰੋ। ਗੂਗਲ ਮੈਪਸ ਤੇ ਲਾਈਵ ਟ੍ਰੈਕ ਕਰੋ।',
    bookFarmTruckBtn: 'ਟਰੱਕ ਬੁੱਕ ਕਰੋ / ਲਾਈਵ ਟ੍ਰੈਕ ਕਰੋ →',
    driverDeskTitle: 'ਟਰੱਕ ਡਰਾਈਵਰ ਡੈਸਕ',
    driverDeskDesc: 'ਟਰੱਕ ਡਰਾਈਵਰਾਂ ਲਈ ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧੇ ਫੇਰੇ। ਡੀਜ਼ਲ ਐਡਵਾਂਸ ਅਤੇ ਤੁਰੰਤ ਭੁਗਤਾਨ।',
    openDriverDeskBtn: 'ਡਰਾਈਵਰ ਡੈਸਕ ਖੋਲ੍ਹੋ →',
    activeTrips: 'ਸਰਗਰਮ ਯਾਤਰਾਵਾਂ',
    tripStatusSearching: 'ਨੇੜਲਾ ਟਰੱਕ ਲੱਭ ਰਿਹਾ ਹੈ...',
    tripStatusAssigned: 'ਡਰਾਈਵਰ ਮਿਲ ਗਿਆ',
    tripStatusEnRoute: 'ਖੇਤ ਵੱਲ ਰਵਾਨਾ',
    tripStatusLoading: 'ਲੋਡਿੰਗ ਅਤੇ ਕੰਡਾ ਤੋਲ ਜਾਰੀ',
    tripStatusInTransit: 'ਹਾਈਵੇ ਤੇ ਸਫ਼ਰ ਜਾਰੀ (Google Maps)',
    tripStatusDelivered: 'ਮੰਡੀ ਵਿੱਚ ਮਾਲ ਪਹੁੰਚ ਗਿਆ',
    
    pickupLocation: 'ਖੇਤ ਤੋਂ ਚੁੱਕਣ ਦਾ ਪਤਾ',
    dropLocation: 'ਮੰਜ਼ਿਲ ਮੰਡੀ ਜਾਂ ਦੁਕਾਨ',
    estimatedFreight: 'ਅੰਦਾਜ਼ਨ ਕੁੱਲ ਭਾੜਾ',
    advanceFuelFastag: 'ਡੀਜ਼ਲ ਅਤੇ FASTag ਐਡਵਾਂਸ',
    confirmBooking: 'ਟਰੱਕ ਬੁਕਿੰਗ ਪੱਕੀ ਕਰੋ',
    liveGpsTracking: 'ਲਾਈਵ ਗੂਗਲ ਮੈਪਸ GPS ਟ੍ਰੈਕਿੰਗ',
    onlineDuty: 'ਡਿਊਟੀ ਚਾਲੂ',
    offlineDuty: 'ਡਿਊਟੀ ਬੰਦ',
    acceptLoad: 'ਇਹ ਲੋਡ ਸਵੀਕਾਰ ਕਰੋ ਅਤੇ ਸ਼ੁਰੂ ਕਰੋ',
  },

  gu: {
    home: 'મુખ્ય પૃષ્ઠ',
    sellCrops: 'પાક વેચો (ખેડૂત)',
    buyMandi: 'માર્કેટ ખરીદી (વેપારી)',
    farmTrucks: 'ખેડૂત ટ્રક સેવા (સારથી)',
    driverDesk: 'સારથી / ડ્રાઈવર ડેસ્ક',
    dashboard: 'ખેડૂત ડેશબોર્ડ',
    quickScreens: 'ઝડપી સ્ક્રીન:',
    helpline: 'હેલ્પલાઇન: 1800-FARMSYNC',
    escrowProtected: '૨૪x૭ એસ્ક્રો સુરક્ષિત ચુકવણી',
    selectLanguage: 'ભાષા પસંદ કરો',
    chooseLanguage: 'તમારી ભાષા પસંદ કરો',
    allIndianLanguages: 'બધી ભારતીય ભાષાઓ',
    close: 'બંધ કરો',
    
    heroTagline: 'તિરંગા સીધો વેપાર • 0% દલાલી • 100% ખેડૂત સશક્તિકરણ',
    heroHeadline1: 'ખેડૂત પાસેથી સીધું',
    heroHeadlineHighlight: 'દુકાનદાર સુધી.',
    heroSubheadline: 'સીધી મંડી, સીધો નફો.',
    heroDescription: 'દલાલો અને વચેટિયાઓ મુક્ત ભારતનું સીધું કૃષિ પ્લેટફોર્મ. 5-ફોટો ગુણવત્તા ચકાસણી અને 24 કલાકમાં સીધા બેંક ખાતામાં નાણાં.',
    enterAsKisan: 'ખેડૂત તરીકે પ્રવેશ / પાક વેચો',
    enterAsRetailer: 'વેપારી તરીકે પ્રવેશ / જથ્થાબંધ ખરીદી',
    farmerIncomeUplift: 'ખેડૂત આવકમાં વધારો',
    directFarmGateTrade: 'સીધો ખેતરથી વેપાર',
    bhashaTitle: 'તમારી પ્રાદેશિક ભાષા પસંદ કરો',
    bhashaSubtitle: 'ફાર્મસિંક તમારી પોતાની માતૃભાષામાં અવાજ માર્ગદર્શન સાથે ઉપલબ્ધ છે.',
    playingVoiceGuidance: 'અવાજ માર્ગદર્શન ચાલુ છે...',
    
    selectRole: 'તમારી ભૂમિકા પસંદ કરો',
    tailoredWorkflows: 'ખેડૂત અને વેપારી બંને માટે સમર્પિત વ્યવસ્થા',
    kisanTrackTitle: 'અન્નદાતા / ખેડૂત વિભાગ',
    kisanTrackSubtitle: 'સાચા ભાવે તમારો પાક સીધો વેચો',
    kisanTrackDesc: 'કોઈપણ દલાલી વિના સીધા છૂટક વેપારીઓ સાથે વેપાર કરો.',
    retailerTrackTitle: 'દુકાનદાર / વેપારી વિભાગ',
    retailerTrackSubtitle: 'ખેતરમાંથી સીધો તાજો માલ મેળવો',
    retailerTrackDesc: 'નજીકના 5 થી 50 કિમીના ખેતરોમાંથી ગુણવત્તાયુક્ત પાક ખરીદો.',
    zeroBrokerage: '0% દલાલી / કમિશન',
    dbtEscrow: 'T+1 સુરક્ષિત બેંક ચુકવણી',
    
    farmTrucksLogisticsTitle: 'ફાર્મસિંક સારથી • કૃષિ માટે ઓન-ડિમાન્ડ ટ્રક સેવા',
    farmTrucksLogisticsSubtitle: 'ખેડૂતો માટે ટ્રક બુકિંગ અને ડ્રાઇવરો માટે લોડ ડેસ્ક',
    kisanTruckBooking: 'ખેડૂત ટ્રક બુકિંગ (સારથી સેવા)',
    kisanTruckBookingDesc: 'ખેતરથી મંડી કે દુકાન સુધી માલ મોકલવા માટે તરત જ ટ્રક બુક કરો. Google Maps પર લાઇવ ટ્રૅક કરો.',
    bookFarmTruckBtn: 'ટ્રક બુક કરો / લાઇવ ટ્રૅક કરો →',
    driverDeskTitle: 'ટ્રક ડ્રાઇવર વિભાગ (સારથી ડેસ્ક)',
    driverDeskDesc: 'વાણિજ્યિક ટ્રક ચાલકો માટે સીધા ખેડૂતોના ફેરા. ડીઝલ એડવાન્સ અને ખાતરીપૂર્વક ભાડું.',
    openDriverDeskBtn: 'ડ્રાઇવર ડેસ્ક ખોલો →',
    activeTrips: 'સક્રિય પરિવહન સફર',
    tripStatusSearching: 'નજીકનો ટ્રક શોધી રહ્યા છીએ...',
    tripStatusAssigned: 'ડ્રાઇવર ફાળવવામાં આવ્યો',
    tripStatusEnRoute: 'ખેતર તરફ રવાના',
    tripStatusLoading: 'લોડિંગ અને વજન કાંટો ચાલુ',
    tripStatusInTransit: 'હાઇવે પર સફર ચાલુ (Google Maps)',
    tripStatusDelivered: 'માલ મંડી કે દુકાને પહોંચી ગયો',
    
    pickupLocation: 'ખેતરમાંથી માલ ઉપાડવાનું સરનામું',
    dropLocation: 'મંઝિલ મંડી કે દુકાન',
    estimatedFreight: 'અંદાજિત કુલ ભાડું',
    advanceFuelFastag: 'ડીઝલ અને FASTag એડવાન્સ',
    confirmBooking: 'ટ્રક બુકિંગ કન્ફર્મ કરો',
    liveGpsTracking: 'લાઇવ Google Maps GPS ટ્રેકિંગ',
    onlineDuty: 'ડ્યુટી ચાલુ',
    offlineDuty: 'ડ્યુટી બંધ',
    acceptLoad: 'આ લોડ સ્વીકારો અને સફર શરૂ કરો',
  },

  te: {
    home: 'హోమ్',
    sellCrops: 'పంట అమ్మకం (రైతు)',
    buyMandi: 'మార్కెట్ కొనుగోలు',
    farmTrucks: 'రైతు ట్రక్ రవాణా (సారథి)',
    driverDesk: 'డ్రైవర్ డెస్క్',
    dashboard: 'రైతు డాష్‌బోర్డ్',
    quickScreens: 'త్వరిత స్క్రీన్లు:',
    helpline: 'హెల్ప్‌లైన్: 1800-FARMSYNC',
    escrowProtected: 'ఎల్లవేళలా ఎస్క్రో రక్షణ',
    selectLanguage: 'భాషను ఎంచుకోండి',
    chooseLanguage: 'మీ భాషను ఎంచుకోండి',
    allIndianLanguages: 'అన్ని భారతీయ భాషలు',
    close: 'మూసివేయి',
    
    heroTagline: 'త్రివర్ణ ప్రత్యక్ష వాణిజ్యం • 0% దళారీ • 100% రైతు సాధికారత',
    heroHeadline1: 'రైతు నుండి నేరుగా',
    heroHeadlineHighlight: 'దుకాణదారునికి.',
    heroSubheadline: 'నేరుగా మండి, నేరుగా లాభం.',
    heroDescription: 'మధ్యవర్తులు లేని భారతదేశపు మొదటి ప్రత్యక్ష వ్యవసాయ మార్కెట్. నాణ్యత పరీక్షలతో 24 గంటల్లో నేరుగా బ్యాంకు ఖాతాలో చెల్లింపు.',
    enterAsKisan: 'రైతుగా ప్రవేశించండి / పంట అమ్మండి',
    enterAsRetailer: 'వ్యాపారిగా ప్రవేశించండి / టోకు కొనుగోలు',
    farmerIncomeUplift: 'రైతు ఆదాయంలో పెరుగుదల',
    directFarmGateTrade: 'నేరుగా పొలం వద్దే కొనుగోలు',
    bhashaTitle: 'మీ ప్రాంతీయ భాషను ఎంచుకోండి',
    bhashaSubtitle: 'ఫార్మ్‌సింక్ మీ సొంత భాషలో వాయిస్ సదుపాయంతో అందుబాటులో ఉంది.',
    playingVoiceGuidance: 'వాయిస్ ప్లే అవుతోంది...',
    
    selectRole: 'మీ పాత్రను ఎంచుకోండి',
    tailoredWorkflows: 'రైతులు మరియు కొనుగోలుదారుల కోసం ప్రత్యేక వ్యవస్థ',
    kisanTrackTitle: 'అన్నదాత / రైతు విభాగం',
    kisanTrackSubtitle: 'మద్దతు ధరకు నేరుగా మీ పంటను అమ్మండి',
    kisanTrackDesc: 'ఎటువంటి దళారీ లేకుండా నేరుగా పట్టణ వ్యాపారులకు అమ్మండి.',
    retailerTrackTitle: 'దుకాణదారు / వ్యాపారి విభాగం',
    retailerTrackSubtitle: 'పొలాల నుండి తాజా పంటను నేరుగా పొందండి',
    retailerTrackDesc: 'సమీప పొలాల నుండి నేరుగా నాణ్యమైన పంటలను కొనుగోలు చేయండి.',
    zeroBrokerage: '0% దళారీ కమీషన్',
    dbtEscrow: 'T+1 సురక్షిత బ్యాంకు చెల్లింపు',
    
    farmTrucksLogisticsTitle: 'వ్యవసాయం కోసం ఆన్-డిమాండ్ ట్రక్ సేవ',
    farmTrucksLogisticsSubtitle: 'రైతుల కోసం ఆన్-డిమాండ్ ట్రక్కులు మరియు డ్రైవర్ల కోసం లోడ్ డెస్క్',
    kisanTruckBooking: 'రైతు ట్రక్ బుకింగ్ (సారథి సేవ)',
    kisanTruckBookingDesc: 'పొలం నుండి మార్కెట్‌కు సరుకును తరలించడానికి వెంటనే ట్రక్కును బుక్ చేయండి. Google Maps లో లైవ్ ట్రాకింగ్.',
    bookFarmTruckBtn: 'ట్రక్ బుక్ చేయండి / ట్రాక్ చేయండి →',
    driverDeskTitle: 'ట్రక్ డ్రైవర్ డెస్క్',
    driverDeskDesc: 'వాణిజ్య ట్రక్ డ్రైవర్లకు రైతుల నుండి నేరుగా భారీ ఆర్డర్లు. డీజిల్ అడ్వాన్స్ మరియు హామీ చెల్లింపు.',
    openDriverDeskBtn: 'డ్రైవర్ డెస్క్ తెరవండి →',
    activeTrips: 'ప్రస్తుత ప్రయాణాలు',
    tripStatusSearching: 'సమీప ట్రక్కును వెతుకుతోంది...',
    tripStatusAssigned: 'డ్రైవర్ కేటాయించబడ్డారు',
    tripStatusEnRoute: 'పొలం వైపు బయలుదేరారు',
    tripStatusLoading: 'లోడింగ్ మరియు బరువు తూకం జరుగుతోంది',
    tripStatusInTransit: 'హైవేలో ప్రయాణం కొనసాగుతోంది (Google Maps)',
    tripStatusDelivered: 'మండి / దుకాణానికి సరుకు చేరింది',
    
    pickupLocation: 'పొలం పికప్ చిరునామా',
    dropLocation: 'చేరవలసిన దుకాణం లేదా మండి',
    estimatedFreight: 'అంచనా మొత్తం ఛార్జీ',
    advanceFuelFastag: 'డీజిల్ & FASTag అడ్వాన్స్',
    confirmBooking: 'ట్రక్ బుకింగ్ నిర్ధారించండి',
    liveGpsTracking: 'లైవ్ Google Maps GPS ట్రాకింగ్',
    onlineDuty: 'డ్యూటీలో ఉన్నారు',
    offlineDuty: 'ఆఫ్‌లైన్',
    acceptLoad: 'ఈ లోడ్‌ను అంగీకరించి ప్రారంభించండి',
  },

  ta: {
    home: 'முகப்பு',
    sellCrops: 'பயிர் விற்பனை (விவசாயி)',
    buyMandi: 'மண்டி கொள்முதல் (வணிகர்)',
    farmTrucks: 'விவசாய லாரி சேவை (சாரதி)',
    driverDesk: 'சாரதி / ஓட்டுநர் தளம்',
    dashboard: 'விவசாயி டாஷ்போர்டு',
    quickScreens: 'விரைவுத் திரை:',
    helpline: 'உதவி எண்: 1800-FARMSYNC',
    escrowProtected: 'பாதுகாப்பான எஸ்க்ரோ வங்கிப் பணம்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    chooseLanguage: 'உங்கள் மொழியைத் தேர்வு செய்யவும்',
    allIndianLanguages: 'அனைத்து இந்திய மொழிகள்',
    close: 'மூடு',
    
    heroTagline: 'மூவர்ண நேரடி வர்த்தகம் • 0% தரகு • 100% விவசாயி அதிகாரம்',
    heroHeadline1: 'விவசாயியிடம் இருந்து நேரடியாக',
    heroHeadlineHighlight: 'கடைக்காரருக்கு.',
    heroSubheadline: 'நேரடி சந்தை, நேரடி லாபம்.',
    heroDescription: 'இடைத்தரகர்கள் இல்லாத இந்தியாவின் நேரடி விவசாய தளம். 5-கோண புகைப்பட தரச் சரிபார்ப்பு மற்றும் 24 மணி நேர நேரடி வங்கிப் பரிமாற்றம்.',
    enterAsKisan: 'விவசாயியாக நுழைய / பயிர் விற்க',
    enterAsRetailer: 'வணிகராக நுழைய / மொத்தக் கொள்முதல்',
    farmerIncomeUplift: 'விவசாய வருமான உயர்வு',
    directFarmGateTrade: 'நேரடி பண்ணை விற்பனை',
    bhashaTitle: 'உங்கள் பிராந்திய மொழியைத் தேர்வு செய்யவும்',
    bhashaSubtitle: 'ஃபார்ம்சின்க் உங்கள் சொந்த மொழியில் குரல் வழிகாட்டுதலுடன் உள்ளது.',
    playingVoiceGuidance: 'குரல் வழிகாட்டல் இயங்குகிறது...',
    
    selectRole: 'உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்',
    tailoredWorkflows: 'விவசாயிகள் மற்றும் வர்த்தகர்களுக்கான சிறப்பு அமைப்பு',
    kisanTrackTitle: 'அன்னதாதா / விவசாயி பிரிவு',
    kisanTrackSubtitle: 'சரியான விலையில் உங்கள் பயிரை நேரடியாக விற்கவும்',
    kisanTrackDesc: 'எந்தவொரு தரகும் இன்றி நேரடியாக சில்லறை வணிகர்களிடம் விற்கலாம்.',
    retailerTrackTitle: 'கடைக்காரர் / சில்லறை வர்த்தகர் பிரிவு',
    retailerTrackSubtitle: 'பண்ணைகளில் இருந்து நேரடியாக புதிய விளைபொருட்களைப் பெறுங்கள்',
    retailerTrackDesc: 'அருகிலுள்ள 5 முதல் 50 கி.மீ தொலைவிலுள்ள பண்ணைகளில் இருந்து நேரடி கொள்முதல்.',
    zeroBrokerage: '0% இடைத்தரகு கமிஷன்',
    dbtEscrow: 'T+1 நேரடி வங்கி எஸ்க்ரோ பாதுகாப்பு',
    
    farmTrucksLogisticsTitle: 'ஃபார்ம்சின்க் சாரதி • விவசாயத்திற்கான தேவைக்கேற்ற லாரி சேவை',
    farmTrucksLogisticsSubtitle: 'விவசாயிகளுக்கான லாரிகள் மற்றும் ஓட்டுநர்களுக்கான லோடு தளம்',
    kisanTruckBooking: 'விவசாய லாரி முன்பதிவு (சாரதி சேவை)',
    kisanTruckBookingDesc: 'பண்ணையிலிருந்து கடை அல்லது மண்டிக்கு சரக்குகளை அனுப்ப லாரிகளை உடனே முன்பதிவு செய்யவும். Google Maps இல் நேரடி கண்காணிப்பு.',
    bookFarmTruckBtn: 'லாரி புக் செய்ய / கண்காணிக்க →',
    driverDeskTitle: 'லாரி ஓட்டுநர் பிரிவு (சாரதி தளம்)',
    driverDeskDesc: 'லாரி ஓட்டுநர்களுக்கு விவசாயிகளிடம் இருந்து நேரடி சவாரிகள். உடனடி டீசல் முன்பணம்.',
    openDriverDeskBtn: 'ஓட்டுநர் தளத்தை திறக்க →',
    activeTrips: 'செயலில் உள்ள பயணங்கள்',
    tripStatusSearching: 'அருகிலுள்ள லாரியைத் தேடுகிறது...',
    tripStatusAssigned: 'ஓட்டுநர் நியமிக்கப்பட்டார்',
    tripStatusEnRoute: 'பண்ணையை நோக்கி செல்கிறார்',
    tripStatusLoading: 'ஏற்றுதல் மற்றும் எடை சரிபார்ப்பு நடைபெறுகிறது',
    tripStatusInTransit: 'நெடுஞ்சாலையில் பயணம் தொடர்கிறது (Google Maps)',
    tripStatusDelivered: 'மண்டியில் சரக்கு ஒப்படைக்கப்பட்டது',
    
    pickupLocation: 'பண்ணை எடுக்கும் முகவரி',
    dropLocation: 'இலக்கு மண்டி அல்லது கடை',
    estimatedFreight: 'மதிப்பிடப்பட்ட மொத்த வாடகை',
    advanceFuelFastag: 'டீசல் மற்றும் FASTag முன்பணம்',
    confirmBooking: 'லாரி முன்பதிவை உறுதிப்படுத்தவும்',
    liveGpsTracking: 'நேரடி Google Maps GPS கண்காணிப்பு',
    onlineDuty: 'பணியில் உள்ளார்',
    offlineDuty: 'பணி நிறைவு',
    acceptLoad: 'இந்த லோடை ஏற்றுக்கொண்டு தொடங்கவும்',
  },

  bn: {
    home: 'হোম',
    sellCrops: 'ফসল বিক্রি (কৃষক)',
    buyMandi: 'মন্ডি পাইকারি ক্রয়',
    farmTrucks: 'কৃষক ট্রাক পরিবহন (সারথি)',
    driverDesk: 'চালক ডেক্স',
    dashboard: 'কৃষক ড্যাশবোর্ড',
    quickScreens: 'দ্রুত স্ক্রিন:',
    helpline: 'হেল্পলাইন: 1800-FARMSYNC',
    escrowProtected: '২৪x৭ সুরক্ষিত ব্যাংক এসক্রো',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    chooseLanguage: 'আপনার ভাষা বেছে নিন',
    allIndianLanguages: 'সমস্ত ভারতীয় ভাষা',
    close: 'বন্ধ করুন',
    
    heroTagline: 'তেরঙ্গা প্রত্যক্ষ বাণিজ্য • ০% দালালি • ১০০% কৃষক ক্ষমতায়ন',
    heroHeadline1: 'কৃষকের কাছ থেকে সরাসরি',
    heroHeadlineHighlight: 'দোকানদারের কাছে।',
    heroSubheadline: 'সরাসরি মান্ডি, সরাসরি লাভ।',
    heroDescription: 'দালাল ও ফড়িয়া মুক্ত ভারতের প্রত্যক্ষ কৃষি বাজার। ৫-পয়েন্ট ফটো মান যাচাই এবং ২৪ ঘণ্টায় ব্যাংক অ্যাকাউন্টে সরাসরি টাকা।',
    enterAsKisan: 'কৃষক হিসেবে প্রবেশ করুন / ফসল বিক্রি',
    enterAsRetailer: 'দোকানদার হিসেবে প্রবেশ / পাইকারি ক্রয়',
    farmerIncomeUplift: 'কৃষক আয়ে নিশ্চিত বৃদ্ধি',
    directFarmGateTrade: 'সরাসরি জমি থেকে বাণিজ্য',
    bhashaTitle: 'আপনার ভাষা বেছে নিন',
    bhashaSubtitle: 'ফার্মসিঙ্ক আপনার নিজের ভাষায় ভয়েস সহায়তা সহ উপলব্ধ।',
    playingVoiceGuidance: 'ভয়েস গাইডেন্স চলছে...',
    
    selectRole: 'আপনার ভূমিকা বেছে নিন',
    tailoredWorkflows: 'কৃষক এবং পাইকার উভয়ের জন্য বিশেষ ব্যবস্থা',
    kisanTrackTitle: 'অন্নদাতা / কৃষক বিভাগ',
    kisanTrackSubtitle: 'ন্যায্য মূল্যে আপনার ফসল সরাসরি বিক্রি করুন',
    kisanTrackDesc: 'কোনো দালালি ছাড়াই সরাসরি শহরের খুচরা ব্যবসায়ীদের কাছে বিক্রি করুন।',
    retailerTrackTitle: 'দোকানদার / ব্যবসায়ী বিভাগ',
    retailerTrackSubtitle: 'জমি থেকে সরাসরি তাজা ফসল সংগ্রহ করুন',
    retailerTrackDesc: 'নিকটবর্তী জমি থেকে সরাসরি পাইকারি তাজা ফসল কিনুন।',
    zeroBrokerage: '০% দালালি / কমিশন',
    dbtEscrow: 'T+1 সুরক্ষিত ব্যাংক পেমেন্ট',
    
    farmTrucksLogisticsTitle: 'ফার্মসিঙ্ক সারথি • কৃষির জন্য অন-ডিমান্ড ট্রাক পরিষেবা',
    farmTrucksLogisticsSubtitle: 'কৃষকদের জন্য ট্রাক বুকিং এবং চালকদের জন্য লোড ডেক্স',
    kisanTruckBooking: 'কৃষক ট্রাক বুকিং (সারথি পরিষেবা)',
    kisanTruckBookingDesc: 'জমি থেকে মান্ডি বা দোকানে মাল পাঠাতে তৎক্ষণাৎ ট্রাক বুক করুন। Google Maps-এ লাইভ ট্র্যাক করুন।',
    bookFarmTruckBtn: 'ট্রাক বুক করুন / ট্র্যাক করুন →',
    driverDeskTitle: 'ট্রাক ড্রাইভার ডেক্স',
    driverDeskDesc: 'ট্রাক চালকদের জন্য সরাসরি কৃষকদের লোড। ডিজেল অগ্রিম এবং নিশ্চিত ভাড়া।',
    openDriverDeskBtn: 'ড্রাইভার ডেক্স খুলুন →',
    activeTrips: 'সক্রিয় পরিবহন ট্রিপ',
    tripStatusSearching: 'নিকটবর্তী ট্রাক খোঁজা হচ্ছে...',
    tripStatusAssigned: 'চালক বরাদ্দ হয়েছে',
    tripStatusEnRoute: 'জমির উদ্দেশ্যে রওনা হয়েছে',
    tripStatusLoading: 'লোডিং ও ওজন পরিমাপ চলছে',
    tripStatusInTransit: 'হাইওয়েতে যাত্রা চলছে (Google Maps)',
    tripStatusDelivered: 'মাল গন্তব্যে পৌঁছে গেছে',
    
    pickupLocation: 'জমি থেকে পিকআপের ঠিকানা',
    dropLocation: 'গন্তব্য মান্ডি বা দোকান',
    estimatedFreight: 'আনুমানিক মোট ভাড়া',
    advanceFuelFastag: 'ডিজেল ও FASTag অগ্রিম',
    confirmBooking: 'ট্রাক বুকিং নিশ্চিত করুন',
    liveGpsTracking: 'লাইভ Google Maps GPS ট্র্যাকিং',
    onlineDuty: 'ডিউটি চালু',
    offlineDuty: 'ডিউটি বন্ধ',
    acceptLoad: 'এই লোড গ্রহণ করুন ও যাত্রা শুরু করুন',
  },

  kn: {
    home: 'ಮುಖಪುಟ',
    sellCrops: 'ಬೆಳೆ ಮಾರಿ (ರೈತರು)',
    buyMandi: 'ಮಂಡಿ ಖರೀದಿ (ವರ್ತಕರು)',
    farmTrucks: 'ರೈತ ಟ್ರಕ್ ಸೇವೆ (ಸಾರಥಿ)',
    driverDesk: 'ಚಾಲಕರ ಡೆಸ್ಕ್ (ಸಾರಥಿ)',
    dashboard: 'ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    quickScreens: 'ತ್ವರಿತ ಪರದೆಗಳು:',
    helpline: 'ಸಹಾಯವಾಣಿ: 1800-FARMSYNC',
    escrowProtected: '24x7 ಎಸ್ಕ್ರೋ ಸುರಕ್ಷಿತ ಪಾವತಿ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    chooseLanguage: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ (Choose Language)',
    allIndianLanguages: 'ಎಲ್ಲಾ ಭಾರತೀಯ ಭಾಷೆಗಳು',
    close: 'ಮುಚ್ಚಿ',
    
    heroTagline: 'ತಿರಂಗಾ ನೇರ ವ್ಯಾಪಾರ • 0% ದಳ್ಳಾಳಿ • 100% ರೈತ ಸಶಕ್ತೀಕರಣ',
    heroHeadline1: 'ರೈತರಿಂದ ನೇರವಾಗಿ',
    heroHeadlineHighlight: 'ಅಂಗಡಿಯವರಿಗೆ.',
    heroSubheadline: 'ನೇರ ಮಂಡಿ, ನೇರ ಲಾಭ.',
    heroDescription: 'ಮಧ್ಯವರ್ತಿಗಳ ಸುಲಿಗೆಯಿಲ್ಲದೆ ಅನ್ನದಾತರನ್ನು ನೇರವಾಗಿ ನಗರದ ಸಗಟು ವರ್ತಕರಿಗೆ ಸಂಪರ್ಕಿಸುವ ಭಾರತದ ನೇರ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ. 5-ಕೋನಗಳ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ, ತೋಟದ ಬಾಗಿಲಲ್ಲೇ ಪಿಕಪ್ ಮತ್ತು ಗ್ಯಾರಂಟಿ T+1 DBT ಎಸ್ಕ್ರೋ ಪಾವತಿ.',
    enterAsKisan: 'ರೈತರಾಗಿ ಪ್ರವೇಶಿಸಿ / ಬೆಳೆ ಮಾರಿ',
    enterAsRetailer: 'ವರ್ತಕರಾಗಿ ಪ್ರವೇಶಿಸಿ / ಸಗಟು ಖರೀದಿ',
    farmerIncomeUplift: 'ರೈತರ ಆದಾಯ ಏರಿಕೆ',
    directFarmGateTrade: 'ತೋಟದ ಬಾಗಿಲಲ್ಲೇ ನೇರ ವ್ಯಾಪಾರ',
    bhashaTitle: 'ನಿಮ್ಮ ಪ್ರಾದೇಶಿಕ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ / ಭಾಷೆ',
    bhashaSubtitle: 'ಫಾರ್ಮ್‌ಸಿಂಕ್ ಎಲ್ಲಾ ಕೃಷಿ ಮಂಡಿಗಳಿಗೆ ಧ್ವನಿ ಬೆಂಬಲದೊಂದಿಗೆ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುತ್ತದೆ.',
    playingVoiceGuidance: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ಚಾಲನೆಯಲ್ಲಿದೆ...',
    
    selectRole: 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    tailoredWorkflows: 'ಬೆಳೆಗಾರರು ಮತ್ತು ಖರೀದಿದಾರರಿಗೆ ಸೂಕ್ತ ವ್ಯವಸ್ಥೆ',
    kisanTrackTitle: 'ಅನ್ನದಾತ / ರೈತರ ವಿಭಾಗ',
    kisanTrackSubtitle: 'ನೈಜ MSP ಮೌಲ್ಯಕ್ಕೆ ಬೆಳೆಗಳನ್ನು ನೇರವಾಗಿ ಮಾರಿ',
    kisanTrackDesc: 'ದೃಢೀಕೃತ 5-ಫೋಟೋ ಪುರಾವೆಯೊಂದಿಗೆ ಕೊಯ್ಲು ಮಾಡಿದ ಬೆಳೆಯನ್ನು ಪಟ್ಟಿ ಮಾಡಿ. ಲೈವ್ APMC ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯೊಂದಿಗೆ ನ್ಯಾಯಯುತ ದರ ಪಡೆಯಿರಿ. ಎಂದಿಗೂ ಆತಂಕದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಡಿ.',
    retailerTrackTitle: 'ಅಂಗಡಿಕಾರರು / ವರ್ತಕರ ವಿಭಾಗ',
    retailerTrackSubtitle: 'ಹತ್ತಿರದ ತೋಟಗಳಿಂದ ನೇರವಾಗಿ ಪರಿಶೀಲಿಸಿದ ಬೆಳೆ ಪಡೆಯಿರಿ',
    retailerTrackDesc: '5-50 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ತಾಜಾ ಕೊಯ್ಲನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ. ಎಸ್ಕ್ರೋಗೆ ಹಣ ಬಿಡುಗಡೆ ಮಾಡುವ ಮೊದಲು ತೇವಾಂಶ ಮತ್ತು ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    zeroBrokerage: '0% ದಳ್ಳಾಳಿ ಕಮಿಷನ್',
    dbtEscrow: 'T+1 DBT ಎಸ್ಕ್ರೋ ಸುರಕ್ಷಿತ',
    
    farmTrucksLogisticsTitle: 'ಫಾರ್ಮ್‌ಸಿಂಕ್ ಸಾರಥಿ • ಕೃಷಿ ಸಾರಿಗೆಗಾಗಿ ಆನ್-ಡಿಮ್ಯಾಂಡ್ ಸೇವೆ',
    farmTrucksLogisticsSubtitle: 'ರೈತರಿಗಾಗಿ ಟ್ರಕ್ ಬುಕಿಂಗ್ ಮತ್ತು ಚಾಲಕರಿಗಾಗಿ ಮೀಸಲಾದ ಡೆಸ್ಕ್',
    kisanTruckBooking: 'ರೈತ ಟ್ರಕ್ ಬುಕಿಂಗ್ (ಕಿಸಾನ್ ಸಾರಿಗೆ)',
    kisanTruckBookingDesc: 'ಟಾಟಾ ಏಸ್, ಬೊಲೆರೊ ಪಿಕಪ್, ಐಶರ್ 14/19 ಅಡಿ ಟ್ರಕ್‌ಗಳನ್ನು ಆನ್-ಡಿಮ್ಯಾಂಡ್ ಬುಕ್ ಮಾಡಿ. Google Maps ನಲ್ಲಿ ಲೈವ್ ಲೊಕೇಶನ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
    bookFarmTruckBtn: 'ಟ್ರಕ್ ಬುಕ್ ಮಾಡಿ / ಟ್ರ್ಯಾಕ್ ಮಾಡಿ →',
    driverDeskTitle: 'ಟ್ರಕ್ ಚಾಲಕರ ವಿಭಾಗ (ಸಾರಥಿ ಡೆಸ್ಕ್)',
    driverDeskDesc: 'ರೈತರಿಂದ ನೇರವಾಗಿ ನಗರ ಮಂಡಿಗಳಿಗೆ ಸಾಗಿಸಲು ವಾಣಿಜ್ಯ ಟ್ರಕ್ ಚಾಲಕರಿಗೆ ಬೃಹತ್ ಲೋಡ್‌ಗಳು. ಖಾಲಿ ಟ್ರಿಪ್ ಇಲ್ಲ!',
    openDriverDeskBtn: 'ಚಾಲಕರ ಡೆಸ್ಕ್ ತೆರೆಯಿರಿ →',
    activeTrips: 'ಸಕ್ರಿಯ ಸಾರಿಗೆ ಟ್ರಿಪ್‌ಗಳು',
    tripStatusSearching: 'ಹತ್ತಿರದ ಟ್ರಕ್‌ಗಾಗಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    tripStatusAssigned: 'ಚಾಲಕರನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ',
    tripStatusEnRoute: 'ತೋಟದ ಬಾಗಿಲಿಗೆ ಹೊರಟಿದೆ',
    tripStatusLoading: 'ಲೋಡಿಂಗ್ ಮತ್ತು ತೂಕ ಪರೀಕ್ಷೆ',
    tripStatusInTransit: 'ಹೆದ್ದಾರಿಯಲ್ಲಿ ಸಾಗುತ್ತಿದೆ (Google Maps)',
    tripStatusDelivered: 'ಮಂಡಿ / ಅಂಗಡಿಗೆ ತಲುಪಿಸಲಾಗಿದೆ',
    
    pickupLocation: 'ತೋಟದ ಪಿಕಪ್ ಸ್ಥಳ',
    dropLocation: 'ಗಮ್ಯಸ್ಥಾನ ಮಂಡಿ / ಅಂಗಡಿ',
    estimatedFreight: 'ಅಂದಾಜು ಒಟ್ಟು ಬಾಡಿಗೆ',
    advanceFuelFastag: 'ಡೀಸೆಲ್ ಮತ್ತು FASTag ಮುಂಗಡ',
    confirmBooking: 'ಟ್ರಕ್ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ',
    liveGpsTracking: 'ಲೈವ್ Google Maps GPS ಟ್ರ್ಯಾಕಿಂಗ್',
    onlineDuty: 'ಡ್ಯೂಟಿ ಆನ್ - ಲೋಡ್‌ಗೆ ಸಿದ್ಧ',
    offlineDuty: 'ಡ್ಯೂಟಿ ಆಫ್',
    acceptLoad: 'ಈ ಲೋಡ್ ಸ್ವೀಕರಿಸಿ ಮತ್ತು ಟ್ರಿಪ್ ಪ್ರಾರಂಭಿಸಿ',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode | string) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  setLanguage: () => {},
  t: translations.hi,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('farmsync_lang');
    if (saved && (saved in translations)) {
      return saved as LanguageCode;
    }
    return 'hi'; // Default to Hindi
  });

  const setLanguage = (lang: LanguageCode | string) => {
    const code = (lang in translations ? lang : 'en') as LanguageCode;
    setLanguageState(code);
    localStorage.setItem('farmsync_lang', code);

    // Also trigger Google Translate cookie & combo selector
    try {
      setGoogleTranslateLanguage(lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Sync Google Translate with initial language
    try {
      setGoogleTranslateLanguage(language);
    } catch {
      // ignore
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.en,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => useContext(LanguageContext);
