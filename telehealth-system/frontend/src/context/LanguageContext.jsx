import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

const STORAGE_KEY = 'swasthya_language';

const TRANSLATIONS = {
  en: {
    // Home
    'home.hero.badge': 'Now serving thousands of villages',
    'home.hero.titleLine1': 'Healthcare for',
    'home.hero.titleLine2': 'Every Village',
    'home.hero.subtitle':
      'SwasthyaConnect bridges the gap between rural communities and premium healthcare. Get instant access to certified doctors, AI diagnostics, and digital prescriptions—even on low bandwidth networks.',
    'home.hero.ctaPrimary': 'Start Consultation',
    'home.hero.ctaSecondary': 'Check Symptoms',
    'home.stats.title': 'Real impact across rural communities',
    'home.stats.scroll': 'Scroll to explore',
    'home.how.title': 'How SwasthyaConnect Works',
    'home.how.subtitle':
      'A seamless, guided health experience tailored for both patients and healthcare providers.',
    'home.features.title': 'Comprehensive Care Ecosystem',
    'home.features.subtitle':
      'Everything you need to confidently manage local healthcare from a single dashboard.',
    'home.portals.title': 'Built for Patients & Healthcare Providers',
    'home.portals.subtitle':
      'Dedicated interfaces cater to unique workflows. Whether you\'re seeking care or providing it, SwasthyaConnect adapts to your needs seamlessly.',
    'home.portals.patientTitle': 'Patient Portal',
    'home.portals.patientDesc':
      'Schedule consultations, view your health records, use AI symptoms checker, and order medications securely.',
    'home.portals.doctorTitle': 'Doctor Portal',
    'home.portals.doctorDesc':
      'Manage your secure patient queue, update digital records immediately after calls, and handle e-prescriptions.',
    'home.cta.title': 'Ready to prioritize your health?',
    'home.cta.subtitle':
      'Join thousands of patients and doctors who are transforming the future of remote healthcare today.',
    'home.cta.primary': 'Get Started for Free',
    'home.cta.secondary': 'Try Features',

    // Home feature cards (also used in navbar-style labels)
    'nav.consultDoctor': 'Consult Doctor',
    'nav.aiSymptoms': 'AI Symptom Checker',
    'nav.healthRecords': 'Health Records',
    'nav.medicines': 'Medicine Finder',
    'nav.emergency': 'Emergency Help',
    'feature.consult.desc': 'Live video & audio calls with certified professionals.',
    'feature.ai.desc': 'Get instant AI-driven health assessments.',
    'feature.records.desc': 'Securely store and access your medical history.',
    'feature.medicines.desc': 'Locate prescribed medicines at nearby pharmacies.',
    'feature.nearby.title': 'Nearby Centers',
    'feature.nearby.desc': 'Find government approved rural health centers.',
    'feature.emergency.desc': 'One-tap access to ambulance and urgent care.',

    // Medicines
    'medicines.title': 'Medicine Finder',
    'medicines.subtitle': 'Locate prescribed medicines at nearby pharmacies instantly.',
    'medicines.inputPlaceholder': 'Search for a medicine (e.g., Paracetamol)...',
    'medicines.searchButton': 'Search',
    'medicines.freqSearched': 'Frequently Searched',
    'medicines.showingAvailability': 'Showing availability in nearby pharmacies',
    'medicines.inStock': 'In Stock',
    'medicines.outOfStock': 'Out of Stock',
    'medicines.noResultsTitle': 'No Results Found',
    'medicines.noResultsBody':
      'We couldn\'t find this medicine in our local database. Try searching for a different medicine or checking spelling.',
    'medicines.pharmaciesAreaTitle': 'Pharmacies in Your Area',
    'medicines.viewMap': 'View Map',
    'medicines.getDirections': 'Get Directions',

    // Symptom checker
    'symptom.title': 'AI Symptom Checker',
    'symptom.subtitle':
      'Describe how you are feeling, and our AI will provide instant health guidance.',
    'symptom.question': 'What symptoms are you experiencing?',
    'symptom.placeholder':
      'e.g., I have a mild fever, dry cough, and a headache since yesterday...',
    'symptom.commonSymptomsLabel': 'Common Symptoms',
    'symptom.buttonAnalyze': 'Analyze Symptoms',
    'symptom.loadingAnalyze': 'Analyzing Symptoms...',
    'symptom.clear': 'Clear',
    'symptom.howTitle': 'How it works',
    'symptom.howBody':
      'Our AI model analyzes your symptoms against a vast medical database to suggest potential causes and next steps. This tool is designed to help you prepare for a consultation, not to replace professional medical advice.',
    'symptom.resultTitle': 'Analysis complete',
    'symptom.resultSubtitle': 'Based on your reported symptoms.',
    'symptom.possibleConditions': 'Possible Conditions & Advice',
    'symptom.disclaimerTitle': 'Medical Disclaimer',
    'symptom.disclaimerFallback':
      'This is AI-generated advice and should not replace professional medical consultation. Please consult a doctor for accurate diagnosis and treatment.',
    'symptom.consultNow': 'Consult a Doctor Now',
    'symptom.startOver': 'Start Over',

    // Appointment / video / emergency
    'appointment.status.scheduled': 'Scheduled',
    'appointment.status.completed': 'Completed',
    'appointment.status.cancelled': 'Cancelled',
    'appointment.status.inProgress': 'In Progress',
    'appointment.prefix.doctor': 'Dr. ',
    'appointment.fallback.doctor': 'Doctor',
    'appointment.type.video': 'Video Call',
    'appointment.type.audio': 'Audio Call',
    'appointment.label.note': 'Note',
    'appointment.action.joinCall': 'Join Call',
    'appointment.action.cancel': 'Cancel',
    'appointment.action.viewSummary': 'View Summary',
    'video.error.load': 'Failed to load video call. Please try again.',
    'video.action.retry': 'Try Again',
    'video.status.connectingRoom': 'Connecting to consultation room...',
    'video.tooltip.mute': 'Mute microphone',
    'video.tooltip.unmute': 'Unmute microphone',
    'video.tooltip.cameraOff': 'Turn off camera',
    'video.tooltip.cameraOn': 'Turn on camera',
    'video.tooltip.leave': 'Leave call',
    'video.status.connected': 'Connected',
    'video.status.connecting': 'Connecting...',
    'emergency.title.main': 'Emergency',
    'emergency.title.services': 'Services',
    'emergency.subtitle': 'Immediate medical assistance when every second counts.',
    'emergency.sos.badge': 'Immediate Assistance',
    'emergency.sos.title': 'Need Help Right Now?',
    'emergency.sos.subtitle': 'Press the SOS button for instant emergency response',
    'emergency.actions.title': 'Emergency Actions',
  },
  hi: {
    // Home
    'home.hero.badge': 'अब हज़ारों गाँवों की सेवा में',
    'home.hero.titleLine1': 'हर गाँव के लिए',
    'home.hero.titleLine2': 'स्वास्थ्य सेवाएँ',
    'home.hero.subtitle':
      'स्वास्थ्यकनेक्ट ग्रामीण समुदायों और बेहतर स्वास्थ्य सेवाओं के बीच की दूरी को कम करता है। कम नेटवर्क पर भी प्रमाणित डॉक्टर, एआई डायग्नोस्टिक्स और डिजिटल प्रिस्क्रिप्शन तक तुरंत पहुँच पाएँ।',
    'home.hero.ctaPrimary': 'कंसल्टेशन शुरू करें',
    'home.hero.ctaSecondary': 'लक्षण जाँचें',
    'home.stats.title': 'ग्रामीण समुदायों पर वास्तविक असर',
    'home.stats.scroll': 'और देखें',
    'home.how.title': 'स्वास्थ्यकनेक्ट कैसे काम करता है',
    'home.how.subtitle':
      'मरीज़ों और स्वास्थ्यकर्मियों दोनों के लिए एक सरल और निर्देशित अनुभव।',
    'home.features.title': 'समग्र स्वास्थ्य सेवा इकोसिस्टम',
    'home.features.subtitle':
      'एक ही डैशबोर्ड से स्थानीय स्वास्थ्य सेवाओं को आत्मविश्वास के साथ प्रबंधित करें।',
    'home.portals.title': 'मरीज़ और डॉक्टर—दोनों के लिए बनाया गया',
    'home.portals.subtitle':
      'अलग-अलग इंटरफेस आपकी ज़रूरतों के अनुसार काम करते हैं, चाहे आप उपचार ले रहे हों या दे रहे हों।',
    'home.portals.patientTitle': 'मरीज़ पोर्टल',
    'home.portals.patientDesc':
      'कंसल्टेशन बुक करें, स्वास्थ्य रिकॉर्ड देखें, एआई लक्षण जाँचें और दवाइयाँ सुरक्षित रूप से मँगाएँ।',
    'home.portals.doctorTitle': 'डॉक्टर पोर्टल',
    'home.portals.doctorDesc':
      'सुरक्षित मरीज कतार प्रबंधित करें, कॉल के तुरंत बाद डिजिटल रिकॉर्ड अपडेट करें और ई-प्रिस्क्रिप्शन सँभालें।',
    'home.cta.title': 'क्या आप अपने स्वास्थ्य को प्राथमिकता देने के लिए तैयार हैं?',
    'home.cta.subtitle':
      'उन हज़ारों मरीज़ों और डॉक्टरों से जुड़ें जो रिमोट हेल्थकेयर का भविष्य बदल रहे हैं।',
    'home.cta.primary': 'मुफ़्त शुरू करें',
    'home.cta.secondary': 'फ़ीचर्स आज़माएँ',

    // Home feature cards
    'nav.consultDoctor': 'डॉक्टर से परामर्श',
    'nav.aiSymptoms': 'एआई लक्षण जाँच',
    'nav.healthRecords': 'स्वास्थ्य रिकॉर्ड',
    'nav.medicines': 'दवा खोज (Medicine Finder)',
    'nav.emergency': 'आपातकालीन सहायता',
    'feature.consult.desc': 'प्रमाणित डॉक्टरों से लाइव वीडियो और ऑडियो कॉल।',
    'feature.ai.desc': 'एआई आधारित त्वरित स्वास्थ्य आकलन प्राप्त करें।',
    'feature.records.desc': 'अपने मेडिकल इतिहास को सुरक्षित रूप से सहेजें और देखें।',
    'feature.medicines.desc': 'नज़दीकी मेडिकल दुकानों पर प्रिस्क्राइब्ड दवाइयाँ खोजें।',
    'feature.nearby.title': 'नज़दीकी केंद्र',
    'feature.nearby.desc': 'सरकार मान्यता प्राप्त ग्रामीण स्वास्थ्य केंद्र खोजें।',
    'feature.emergency.desc': 'एंबुलेंस और त्वरित सहायता के लिए एक ही टैप।',

    // Medicines
    'medicines.title': 'दवा खोज (Medicine Finder)',
    'medicines.subtitle': 'अपने आस-पास की मेडिकल दुकानों पर प्रिस्क्राइब्ड दवाइयाँ तुरंत खोजें।',
    'medicines.inputPlaceholder': 'दवा खोजें (जैसे, Paracetamol)...',
    'medicines.searchButton': 'खोजें',
    'medicines.freqSearched': 'अधिक खोजी जाने वाली दवाइयाँ',
    'medicines.showingAvailability': 'नज़दीकी मेडिकल स्टोर्स में उपलब्धता',
    'medicines.inStock': 'उपलब्ध',
    'medicines.outOfStock': 'उपलब्ध नहीं',
    'medicines.noResultsTitle': 'कोई परिणाम नहीं मिला',
    'medicines.noResultsBody':
      'यह दवा हमारे स्थानीय डाटाबेस में नहीं मिली। कोई दूसरी दवा खोजें या स्पेलिंग जाँचें।',
    'medicines.pharmaciesAreaTitle': 'आपके क्षेत्र की मेडिकल दुकानें',
    'medicines.viewMap': 'मैप देखें',
    'medicines.getDirections': 'दिशा-निर्देश',

    // Symptom checker
    'symptom.title': 'एआई लक्षण जाँच (Symptom Checker)',
    'symptom.subtitle':
      'आप कैसे महसूस कर रहे हैं, यह लिखें और हमारा एआई तुरंत मार्गदर्शन देगा।',
    'symptom.question': 'आपको कौन-कौन से लक्षण हो रहे हैं?',
    'symptom.placeholder':
      'जैसे, मुझे हल्का बुखार, सूखी खाँसी और कल से सिरदर्द हो रहा है...',
    'symptom.commonSymptomsLabel': 'सामान्य लक्षण',
    'symptom.buttonAnalyze': 'लक्षणों का विश्लेषण करें',
    'symptom.loadingAnalyze': 'लक्षणों का विश्लेषण हो रहा है...',
    'symptom.clear': 'साफ़ करें',
    'symptom.howTitle': 'कैसे काम करता है',
    'symptom.howBody':
      'हमारा एआई मॉडल आपके लक्षणों की तुलना बड़े मेडिकल डाटाबेस से करता है और संभावित कारण व अगले कदम सुझाता है। यह केवल जानकारी के लिए है, डॉक्टर की सलाह का विकल्प नहीं।',
    'symptom.resultTitle': 'विश्लेषण पूरा',
    'symptom.resultSubtitle': 'आपके बताए गए लक्षणों के आधार पर।',
    'symptom.possibleConditions': 'संभावित स्थिति और सलाह',
    'symptom.disclaimerTitle': 'चिकित्सीय अस्वीकरण',
    'symptom.disclaimerFallback':
      'यह एआई द्वारा जनरेटेड सलाह है। सही निदान और उपचार के लिए अपने डॉक्टर से परामर्श ज़रूर लें।',
    'symptom.consultNow': 'अभी डॉक्टर से परामर्श लें',
    'symptom.startOver': 'फिर से शुरू करें',

    'appointment.status.scheduled': 'निर्धारित',
    'appointment.status.completed': 'पूरा हुआ',
    'appointment.status.cancelled': 'रद्द किया गया',
    'appointment.status.inProgress': 'चालू है',
    'appointment.prefix.doctor': 'डॉ. ',
    'appointment.fallback.doctor': 'डॉक्टर',
    'appointment.type.video': 'वीडियो कॉल',
    'appointment.type.audio': 'ऑडियो कॉल',
    'appointment.label.note': 'नोट',
    'appointment.action.joinCall': 'कॉल जॉइन करें',
    'appointment.action.cancel': 'रद्द करें',
    'appointment.action.viewSummary': 'सारांश देखें',
    'video.error.load': 'वीडियो कॉल लोड करने में समस्या हुई। कृपया फिर कोशिश करें।',
    'video.action.retry': 'फिर कोशिश करें',
    'video.status.connectingRoom': 'कंसल्टेशन रूम से कनेक्ट हो रहा है...',
    'video.tooltip.mute': 'माइक बंद करें',
    'video.tooltip.unmute': 'माइक चालू करें',
    'video.tooltip.cameraOff': 'कैमरा बंद करें',
    'video.tooltip.cameraOn': 'कैमरा चालू करें',
    'video.tooltip.leave': 'कॉल छोड़ें',
    'video.status.connected': 'कनेक्टेड',
    'video.status.connecting': 'कनेक्ट हो रहा है...',
    'emergency.title.main': 'आपातकाल',
    'emergency.title.services': 'सेवाएँ',
    'emergency.subtitle': 'जब हर सेकंड ज़रूरी हो, तुरंत चिकित्सा सहायता प्राप्त करें।',
    'emergency.sos.badge': 'तुरंत सहायता',
    'emergency.sos.title': 'अभी मदद चाहिए?',
    'emergency.sos.subtitle': 'तुरंत इमरजेंसी रिस्पॉन्स के लिए SOS बटन दबाएँ।',
    'emergency.actions.title': 'आपातकालीन विकल्प',
  },
  mr: {
    // Home
    'home.hero.badge': 'आता हजारो गावांमध्ये सेवा',
    'home.hero.titleLine1': 'प्रत्येक गावासाठी',
    'home.hero.titleLine2': 'आरोग्य सेवा',
    'home.hero.subtitle':
      'SwasthyaConnect ग्रामीण समुदाय आणि दर्जेदार आरोग्य सेवा यांच्यातील अंतर कमी करते. कमी नेटवर्कवरही प्रमाणित डॉक्टर, एआय डायग्नॉस्टिक्स आणि डिजिटल प्रिस्क्रिप्शन त्वरित मिळवा.',
    'home.hero.ctaPrimary': 'कन्सल्टेशन सुरू करा',
    'home.hero.ctaSecondary': 'लक्षणे तपासा',
    'home.stats.title': 'ग्रामीण भागावर खरा परिणाम',
    'home.stats.scroll': 'पुढे पहा',
    'home.how.title': 'SwasthyaConnect कसे काम करते',
    'home.how.subtitle':
      'रुग्ण आणि डॉक्टर दोघांसाठीही सोपा आणि मार्गदर्शित अनुभव.',
    'home.features.title': 'सर्वसमावेशक केअर इकोसिस्टम',
    'home.features.subtitle':
      'एकाच डॅशबोर्डमधून स्थानिक आरोग्य सेवा आत्मविश्वासाने व्यवस्थापित करा.',
    'home.portals.title': 'रुग्ण आणि डॉक्टर—दोघांसाठी बनवलेले',
    'home.portals.subtitle':
      'वेगवेगळे इंटरफेस तुमच्या कामानुसार जुळवून घेतात, तुम्ही उपचार घेत असाल किंवा देत असाल.',
    'home.portals.patientTitle': 'रुग्ण पोर्टल',
    'home.portals.patientDesc':
      'कन्सल्टेशन बुक करा, आपली आरोग्य नोंद पहा, एआय लक्षण तपासणी वापरा आणि औषधे सुरक्षितरीत्या मागवा.',
    'home.portals.doctorTitle': 'डॉक्टर पोर्टल',
    'home.portals.doctorDesc':
      'सुरक्षित पेशंट क्यू व्यवस्थापित करा, कॉलनंतर लगेच डिजिटल रेकॉर्ड अपडेट करा आणि ई-प्रिस्क्रिप्शन हाताळा.',
    'home.cta.title': 'आपले आरोग्य प्राधान्य देण्यास तयार आहात?',
    'home.cta.subtitle':
      'दूरस्थ आरोग्य सेवांचे भवितव्य बदलणाऱ्या हजारो रुग्ण आणि डॉक्टरांमध्ये सामील व्हा.',
    'home.cta.primary': 'मोफत सुरू करा',
    'home.cta.secondary': 'फीचर्स वापरून पहा',

    // Home feature cards
    'nav.consultDoctor': 'डॉक्टरांचा सल्ला',
    'nav.aiSymptoms': 'एआय लक्षण तपासणी',
    'nav.healthRecords': 'आरोग्य नोंदी',
    'nav.medicines': 'औषध शोधक (Medicine Finder)',
    'nav.emergency': 'आपत्कालीन मदत',
    'feature.consult.desc': 'प्रमाणित डॉक्टरांसोबत लाईव्ह व्हिडिओ आणि ऑडिओ कॉल.',
    'feature.ai.desc': 'एआय आधारित त्वरित आरोग्य मूल्यांकन मिळवा.',
    'feature.records.desc': 'तुमचा वैद्यकीय इतिहास सुरक्षितरीत्या साठवा आणि पहा.',
    'feature.medicines.desc': 'जवळच्या मेडिकल स्टोअर्समध्ये प्रिस्क्राइब्ड औषधे शोधा.',
    'feature.nearby.title': 'जवळची केंद्रे',
    'feature.nearby.desc': 'सरकारमान्य ग्रामीण आरोग्य केंद्रे शोधा.',
    'feature.emergency.desc': 'ॲम्ब्युलन्स आणि तातडीच्या सेवेसाठी एकाच टॅपवर प्रवेश.',

    // Medicines
    'medicines.title': 'औषध शोधक (Medicine Finder)',
    'medicines.subtitle': 'तुमच्या जवळच्या मेडिकल स्टोअर्समध्ये प्रिस्क्राइब्ड औषधे शोधा.',
    'medicines.inputPlaceholder': 'औषध शोधा (उदा., Paracetamol)...',
    'medicines.searchButton': 'शोधा',
    'medicines.freqSearched': 'वारंवार शोधली जाणारी औषधे',
    'medicines.showingAvailability': 'जवळच्या मेडिकल स्टोअर्समधील उपलब्धता',
    'medicines.inStock': 'उपलब्ध',
    'medicines.outOfStock': 'उपलब्ध नाही',
    'medicines.noResultsTitle': 'कोणताही निकाल सापडला नाही',
    'medicines.noResultsBody':
      'ही औषध आमच्या स्थानिक डेटाबेसमध्ये सापडली नाही. दुसरे औषध शोधा किंवा स्पेलिंग तपासा.',
    'medicines.pharmaciesAreaTitle': 'तुमच्या परिसरातील मेडिकल दुकाने',
    'medicines.viewMap': 'नकाशा पहा',
    'medicines.getDirections': 'मार्गदर्शन',

    // Symptom checker
    'symptom.title': 'एआय लक्षण तपासणी (Symptom Checker)',
    'symptom.subtitle':
      'तुम्ही कसे वाटत आहात ते लिहा, आणि आमचा एआय त्वरित आरोग्य मार्गदर्शन देईल.',
    'symptom.question': 'तुम्हाला कोणती लक्षणे जाणवत आहेत?',
    'symptom.placeholder':
      'उदा., मला कालपासून सौम्य ताप, कोरडी खोकला आणि डोकेदुखी आहे...',
    'symptom.commonSymptomsLabel': 'सामान्य लक्षणे',
    'symptom.buttonAnalyze': 'लक्षणांचे विश्लेषण करा',
    'symptom.loadingAnalyze': 'लक्षणांचे विश्लेषण सुरू आहे...',
    'symptom.clear': 'क्लिअर करा',
    'symptom.howTitle': 'कसे काम करते',
    'symptom.howBody':
      'आमचा एआय मॉडेल तुमच्या लक्षणांची मोठ्या वैद्यकीय डेटाबेसशी तुलना करतो आणि संभाव्य कारणे व पुढील पावले सुचवतो. हे फक्त माहितीकरता आहे, डॉक्टरांच्या सल्ल्याचा पर्याय नाही.',
    'symptom.resultTitle': 'विश्लेषण पूर्ण',
    'symptom.resultSubtitle': 'तुम्ही सांगितलेल्या लक्षणांवर आधारित.',
    'symptom.possibleConditions': 'संभाव्य स्थिती आणि सल्ला',
    'symptom.disclaimerTitle': 'वैद्यकीय सूचनापत्र',
    'symptom.disclaimerFallback':
      'ही एआयने तयार केलेली माहिती आहे. अचूक निदान आणि उपचारांसाठी कृपया आपल्या डॉक्टरांचा सल्ला घ्या.',
    'symptom.consultNow': 'आता डॉक्टरांचा सल्ला घ्या',
    'symptom.startOver': 'पुन्हा सुरू करा',

    'appointment.status.scheduled': 'नियोजित',
    'appointment.status.completed': 'पूर्ण झाले',
    'appointment.status.cancelled': 'रद्द केले',
    'appointment.status.inProgress': 'सुरू आहे',
    'appointment.prefix.doctor': 'डॉ. ',
    'appointment.fallback.doctor': 'डॉक्टर',
    'appointment.type.video': 'व्हिडिओ कॉल',
    'appointment.type.audio': 'ऑडिओ कॉल',
    'appointment.label.note': 'नोंद',
    'appointment.action.joinCall': 'कॉल जॉइन करा',
    'appointment.action.cancel': 'रद्द करा',
    'appointment.action.viewSummary': 'सारांश पहा',
    'video.error.load': 'व्हिडिओ कॉल लोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.',
    'video.action.retry': 'पुन्हा प्रयत्न करा',
    'video.status.connectingRoom': 'कन्सल्टेशन रूमशी कनेक्ट होत आहे...',
    'video.tooltip.mute': 'माइक बंद करा',
    'video.tooltip.unmute': 'माइक सुरू करा',
    'video.tooltip.cameraOff': 'कॅमेरा बंद करा',
    'video.tooltip.cameraOn': 'कॅमेरा सुरू करा',
    'video.tooltip.leave': 'कॉल सोडा',
    'video.status.connected': 'जोडले गेले',
    'video.status.connecting': 'जोडले जात आहे...',
    'emergency.title.main': 'आपत्काल',
    'emergency.title.services': 'सेवा',
    'emergency.subtitle': 'जेव्हा प्रत्येक सेकंद महत्त्वाचा असतो तेव्हा त्वरित वैद्यकीय मदत मिळवा.',
    'emergency.sos.badge': 'त्वरित मदत',
    'emergency.sos.title': 'आत्ता मदत हवी आहे?',
    'emergency.sos.subtitle': 'तत्काळ आपत्कालीन प्रतिसादासाठी SOS बटण दाबा.',
    'emergency.actions.title': 'आपत्कालीन कृती',
  },
};

function translate(language, key, fallback) {
  const langPack = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (langPack && key in langPack) return langPack[key];
  if (TRANSLATIONS.en && key in TRANSLATIONS.en) return TRANSLATIONS.en[key];
  return fallback ?? key;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function useTranslation() {
  const { language } = useLanguage();
  return {
    t: (key, fallback) => translate(language, key, fallback),
  };
}


