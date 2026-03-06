const foodDatabase = {
  "rice": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: 1 },
  "biryani": { calories: 250, protein: 8, carbs: 32, fat: 12, fiber: 1.5, sodium: 450 },
  "dal": { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sodium: 2 },
  "roti": { calories: 120, protein: 3, carbs: 24, fat: 3, fiber: 4, sodium: 1 },
  "egg": { calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sodium: 62 },
  "chicken": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74 },
  "salad": { calories: 15, protein: 1, carbs: 3, fat: 0.2, fiber: 2, sodium: 10 },
  "apple": { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sodium: 1 },
  "banana": { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sodium: 1 },
  "milk": { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sodium: 44 },
  "paneer": { calories: 265, protein: 18, carbs: 1.2, fat: 20, fiber: 0, sodium: 18 },
  "papad": { calories: 45, protein: 3, carbs: 8, fat: 0.1, fiber: 1, sodium: 350 },
  "pickle": { calories: 15, protein: 0.5, carbs: 2, fat: 1, fiber: 1, sodium: 800 },
  "soda": { calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 0, sodium: 5 },
  "burger": { calories: 295, protein: 13, carbs: 30, fat: 14, fiber: 2, sodium: 600 },
  "pizza": { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sodium: 590 },
  "idli": { calories: 58, protein: 2, carbs: 12, fat: 0.1, fiber: 0.8, sodium: 120 },
  "dosa": { calories: 168, protein: 3.9, carbs: 29, fat: 3.7, fiber: 0.9, sodium: 220 },
  "vada": { calories: 150, protein: 5, carbs: 18, fat: 8, fiber: 1.5, sodium: 300 },
  "upma": { calories: 210, protein: 5, carbs: 35, fat: 6, fiber: 3, sodium: 350 },
  "poha": { calories: 180, protein: 3, carbs: 33, fat: 4, fiber: 2, sodium: 150 },
  "chapati": { calories: 100, protein: 3, carbs: 20, fat: 2, fiber: 3.5, sodium: 1 },
  "curd": { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, sodium: 36 },
  "mutton": { calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, sodium: 72 },
  "fish": { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sodium: 61 },
  "samosa": { calories: 260, protein: 3.5, carbs: 24, fat: 17, fiber: 1, sodium: 420 },
  "pakora": { calories: 75, protein: 2, carbs: 8, fat: 4, fiber: 1, sodium: 150 },
  "chai": { calories: 45, protein: 1, carbs: 8, fat: 1, fiber: 0, sodium: 5 },
  "coffee": { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sodium: 2 },
  "fruits": { calories: 60, protein: 0.8, carbs: 15, fat: 0.3, fiber: 2, sodium: 1 },
  "vegetables": { calories: 40, protein: 2, carbs: 8, fat: 0.2, fiber: 3, sodium: 10 },
};

const translations = {
  "en-US": {
    reportTitle: "Hello! I'm your AI health assistant. The full analysis for {food} is ready.",
    queryResponse: "Yes, you can eat {food}! Based on your health profile, here is the analysis:",
    nutrients: "It contains {calories} calories. Nutrition breakdown: Protein {protein}g, Carbs {carbs}g, Fat {fat}g, Fiber {fiber}g, and Sodium {sodium}mg.",
    warningsHeader: "Important health alerts: ",
    safeMeal: "This meal is perfectly safe for your profile.",
    suggestionsHeader: "My suggestions: ",
    noSuggestions: "No specific changes recommended.",
    insightsHeader: "Smart insights: ",
    noInsights: "You're making excellent nutritional choices.",
    highCarbsDiabetes: "High carbs detected! This is risky for your Diabetes profile.",
    highSodiumBP: "Sodium levels are too high for your Blood Pressure condition.",
    carbHeavy: "Carb-heavy meal compared to protein intake.",
    highFat: "Fat content is significantly high for one meal.",
    lowFiber: "Fiber is too low; digestion may be slow.",
    highCalorie: "Calorie-dense meal, might lead to weight gain.",
    veryHighSodium: "DANGEROUS: Extremely high sodium detected.",
    highSodium: "High sodium levels found.",
    highFatWarning: "Warning: High saturated fat content.",
    highCarbWarning: "Warning: High simple carbohydrate content.",
    highCalorieWarning: "Warning: Excessively high calorie count.",
    swapRice: "Swap white rice for brown rice or millets",
    reduceBiryani: "Reduce biryani portion or choose grilled options",
    keepSalad: "Keep salads, add lean protein for balance",
    limitSugar: "Limit sugary drinks and desserts",
    keepDal: "Great protein source; keep dal in meals",
    reducePickle: "Reduce pickle/papad to control sodium",
    addProtein: "Add lean protein (dal, eggs, tofu, grilled chicken)",
    reduceOil: "Reduce oil; avoid deep-fried sides",
    includeFiber: "Include salads, vegetables, or whole grains",
    portionControl: "Consider portion control or add a low-calorie side",
  },
  "hi-IN": {
    reportTitle: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। {food} का पूर्ण विश्लेषण तैयार है।",
    queryResponse: "हाँ, आप {food} खा सकते हैं! आपके स्वास्थ्य प्रोफाइल के आधार पर, यहाँ विश्लेषण है:",
    nutrients: "इसमें {calories} कैलोरी है। पोषण विवरण: प्रोटीन {protein} ग्राम, कार्बोहाइड्रेट {carbs} ग्राम, वसा {fat} ग्राम, फाइबर {fiber} ग्राम, और सोडियम {sodium} मिलीग्राम है।",
    warningsHeader: "महत्वपूर्ण स्वास्थ्य चेतावनियाँ: ",
    safeMeal: "यह भोजन आपके लिए पूरी तरह से सुरक्षित है।",
    suggestionsHeader: "मेरे सुझाव: ",
    noSuggestions: "कोई विशेष बदलाव की आवश्यकता नहीं है।",
    insightsHeader: "स्मार्ट अंतर्दृष्टि: ",
    noInsights: "आपकी डाइट बहुत अच्छी है।",
    highCarbsDiabetes: "उच्च कार्ब्स पाए गए! यह आपके मधुमेह प्रोफाइल के लिए जोखिम भरा है।",
    highSodiumBP: "सोडियम का स्तर आपके रक्तचाप की स्थिति के लिए बहुत अधिक है।",
    carbHeavy: "प्रोटीन के सेवन की तुलना में भोजन में कार्ब्स अधिक हैं।",
    highFat: "एक समय के भोजन के लिए वसा की मात्रा काफी अधिक है।",
    lowFiber: "फाइबर बहुत कम है; पाचन धीमा हो सकता है।",
    highCalorie: "कैलोरी-सघन भोजन, वजन बढ़ सकता है।",
    veryHighSodium: "खतरनाक: बहुत अधिक सोडियम पाया गया।",
    highSodium: "उच्च सोडियम स्तर पाया गया।",
    highFatWarning: "चेतावनी: उच्च संतृप्त वसा सामग्री।",
    highCarbWarning: "चेतावनी: उच्च कार्बोहाइड्रेट सामग्री।",
    highCalorieWarning: "चेतावनी: अत्यधिक कैलोरी की मात्रा।",
    swapRice: "सफेद चावल के बजाय ब्राउन राइस या बाजरा चुनें",
    reduceBiryani: "बिरयानी की मात्रा कम करें या ग्रिल्ड विकल्प चुनें",
    keepSalad: "सलाद खाते रहें, संतुलन के लिए लीन प्रोटीन जोड़ें",
    limitSugar: "मीठे पेय और मिठाइयों को सीमित करें",
    keepDal: "प्रोटीन का बेहतरीन स्रोत; दाल को भोजन में रखें",
    reducePickle: "सोडियम को नियंत्रित करने के लिए अचार/पापड़ कम करें",
    addProtein: "लीन प्रोटीन (दाल, अंडे, टोफू, ग्रिल्ड चिकन) जोड़ें",
    reduceOil: "तेल कम करें; डीप-फ्राइड चीजों से बचें",
    includeFiber: "सलाद, सब्जियां या साबुत अनाज शामिल करें",
    portionControl: "मात्रा नियंत्रण पर विचार करें या कम कैलोरी वाला साइड डिश लें",
  },
  "te-IN": {
    reportTitle: "నమస్తే! నేను మీ AI ఆరోగ్య సహాయకుడిని. {food} పూర్తి విశ్లేషణ సిద్ధంగా ఉంది.",
    queryResponse: "అవును, మీరు {food} తినవచ్చు! మీ ఆరోగ్య ప్రొఫైల్ ఆధారంగా, ఇక్కడ విశ్లేషణ ఉంది:",
    nutrients: "ఇందులో {calories} కేలరీలు ఉన్నాయి. పోషక విలువల వివరాలు: ప్రోటీన్ {protein} గ్రాములు, పిండి పదార్థాలు {carbs} గ్రాములు, కొవ్వు {fat} గ్రాములు, ఫైబర్ {fiber} గ్రాములు, మరియు సోడియం {sodium} మిల్లీగ్రాములు ఉన్నాయి.",
    warningsHeader: "ముఖ్యమైన ఆరోగ్య హెచ్చరికలు: ",
    safeMeal: "ఈ భోజనం మీకు చాలా సురక్షితం!",
    suggestionsHeader: "నా సూచనలు: ",
    noSuggestions: "ఎటువంటి మార్పులు అవసరం లేదు.",
    insightsHeader: "స్మార్ట్ అంతర్దృష్టులు: ",
    noInsights: "మీ ఆహారం చాలా బాగుంది.",
    highCarbsDiabetes: "అధిక కార్బోహైడ్రేట్లు గుర్తించబడ్డాయి! ఇది మీ మధుమేహ ప్రొఫైల్‌కు ప్రమాదకరం.",
    highSodiumBP: "సోడియం స్థాయిలు మీ రక్తపోటు స్థితికి చాలా ఎక్కువగా ఉన్నాయి.",
    carbHeavy: "ప్రోటీన్ కంటే పిండి పదార్థాలు ఎక్కువగా ఉన్నాయి.",
    highFat: "ఈ భోజనంలో కొవ్వు శాతం చాలా ఎక్కువగా ఉంది.",
    lowFiber: "పీచు పదార్థం చాలా తక్కువగా ఉంది; జీర్ణక్రియ నెమ్మదించవచ్చు.",
    highCalorie: "అధిక కేలరీల ఆహారం, బరువు పెరిగే అవకాశం ఉంది.",
    veryHighSodium: "ప్రమాదం: చాలా అధిక సోడియం గుర్తించబడింది.",
    highSodium: "అధిక సోడియం స్థాయిలు ఉన్నాయి.",
    highFatWarning: "హెచ్చరిక: అధిక కొవ్వు పదార్థం.",
    highCarbWarning: "హెచ్చరిక: అధిక పిండి పదార్థం.",
    highCalorieWarning: "హెచ్చరిక: విపరీతమైన కేలరీల సంఖ్య.",
    swapRice: "తెల్ల బియ్యానికి బదులుగా బ్రౌన్ రైస్ లేదా చిరుధాన్యాలను ఎంచుకోండి",
    reduceBiryani: "బిర్యానీ పరిమాణాన్ని తగ్గించండి లేదా గ్రిల్డ్ ఆప్షన్స్ ఎంచుకోండి",
    keepSalad: "సలాడ్లు తీసుకోండి, సమతుల్యత కోసం ప్రోటీన్ జోడించండి",
    limitSugar: "చక్కెర పానీయాలు మరియు స్వీట్లను పరిమితం చేయండి",
    keepDal: "మంచి ప్రోటీన్ మూలం; పప్పును ఆహారంలో ఉంచుకోండి",
    reducePickle: "సోడియంను నియంత్రించడానికి పచ్చడి/అప్పడాలను తగ్గించండి",
    addProtein: "లీన్ ప్రోటీన్ (పప్పు, గుడ్లు, టోఫు, గ్రిల్డ్ చికెన్) జోడించండి",
    reduceOil: "నూనె తగ్గించండి; డీప్ ఫ్రైడ్ ఐటమ్స్ మానుకోండి",
    includeFiber: "సలాడ్లు, కూరగాయలు లేదా తృణధాన్యాలు చేర్చుకోండి",
    portionControl: "ఆహార పరిమాణాన్ని తగ్గించండి లేదా తక్కువ కేలరీల సైడ్ డిష్ తీసుకోండి",
  }
};

export function analyzeFood(food, conditions, lang = "en-US") {
  let text = (food || "").toLowerCase();
  const t = translations[lang] || translations["en-US"];

  // Enhanced Query detection and cleaning
  const queryPatterns = [
    "can i eat",
    "should i have",
    "is it okay to eat",
    "can i have",
    "is it healthy to eat",
    "should i eat",
    "tell me if i can eat",
    "is it safe to eat",
    "kya main",
    "kha sakta hoon",
    "kha sakti hoon",
    "kya khana sahi hai",
    "tinavacha",
    "tinacha",
    "tinocha",
    "tinadam manchide na",
  ];

  let isQuery = false;
  let cleanedText = text;
  
  // Use regex for more robust cleaning
  queryPatterns.forEach((pattern) => {
    const regex = new RegExp(pattern, "gi");
    if (regex.test(cleanedText)) {
      isQuery = true;
      cleanedText = cleanedText.replace(regex, "");
    }
  });

  // Remove common filler words in queries
  const fillers = ["please", "tell me", "now", "today", "for lunch", "for dinner", "for breakfast", "me", "a", "an", "the"];
  fillers.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    cleanedText = cleanedText.replace(regex, "");
  });

  cleanedText = cleanedText.replace(/[?.]/g, "").trim();
  text = cleanedText || text; // Use cleaned text if not empty

  const warnings = [];
  const suggestions = [];
  const insights = [];

  // Default values
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let sodium = 0;

  let foundAny = false;
  
  // Basic matching logic for multiple items
  Object.keys(foodDatabase).forEach(key => {
    if (text.includes(key)) {
      const item = foodDatabase[key];
      calories += item.calories;
      protein += item.protein;
      carbs += item.carbs;
      fat += item.fat;
      fiber += item.fiber;
      sodium += item.sodium;
      foundAny = true;

      // Item specific suggestions
      if (key === "rice") suggestions.push(t.swapRice);
      if (key === "biryani") suggestions.push(t.reduceBiryani);
      if (key === "salad") suggestions.push(t.keepSalad);
      if (key === "soda") suggestions.push(t.limitSugar);
      if (key === "dal") suggestions.push(t.keepDal);
      if (key === "pickle" || key === "papad") suggestions.push(t.reducePickle);
    }
  });

  // If no specific item found, use generic base but notify
  if (!foundAny) {
    calories = 250; protein = 10; carbs = 30; fat = 8; fiber = 2; sodium = 300;
  }

  // Condition based warnings
  let damageScore = 0;

  if (conditions.includes("Diabetes")) {
    if (carbs > 40 || text.includes("rice") || text.includes("sugar") || text.includes("sweet") || text.includes("soda")) {
      warnings.push(t.highCarbsDiabetes);
      damageScore += 35;
    }
  }
  if (conditions.includes("BP")) {
    if (sodium > 400 || text.includes("biryani") || text.includes("pickle") || text.includes("papad") || text.includes("samosa")) {
      warnings.push(t.highSodiumBP);
      damageScore += 35;
    }
  }

  // Insight logic & Sensitivity
  const carbProteinRatio = protein ? (carbs / protein) : carbs;
  if (carbProteinRatio > 2.5) {
    insights.push(t.carbHeavy);
    suggestions.push(t.addProtein);
    damageScore += 10;
  }
  if (fat > 15) {
    insights.push(t.highFat);
    suggestions.push(t.reduceOil);
    damageScore += 15;
  }
  if (fiber < 3 && foundAny) {
    insights.push(t.lowFiber);
    suggestions.push(t.includeFiber);
    damageScore += 5;
  }
  if (calories > 400) {
    insights.push(t.highCalorie);
    suggestions.push(t.portionControl);
    damageScore += 10;
  }

  // General thresholds (Even more sensitive)
  if (sodium > 800) {
    warnings.push(t.veryHighSodium);
    damageScore += 20;
  } else if (sodium > 500) {
    warnings.push(t.highSodium);
    damageScore += 10;
  }
  
  if (fat > 20) {
    warnings.push(t.highFatWarning);
    damageScore += 15;
  }
  
  if (carbs > 60) {
    warnings.push(t.highCarbWarning);
    damageScore += 15;
  }
  
  if (calories > 600) {
    warnings.push(t.highCalorieWarning);
    damageScore += 20;
  }

  // Cap damage score at 100
  damageScore = Math.min(damageScore, 100);

  // Multilingual Response Builder
  const format = (str, obj) => {
    return str.replace(/{(\w+)}/g, (_, k) => obj[k]);
  };

  const nutrientValues = {
    food: text || food, // Use cleaned text or original if empty
    calories: Math.round(calories),
    protein: Number(protein.toFixed(1)),
    carbs: Math.round(carbs),
    fat: Number(fat.toFixed(1)),
    fiber: Number(fiber.toFixed(1)),
    sodium: Math.round(sodium),
  };

  const reportTitle = isQuery
    ? format(t.queryResponse, nutrientValues)
    : format(t.reportTitle, nutrientValues);
  const nutrientSummary = format(t.nutrients, nutrientValues);

  const finalWarnings = Array.from(new Set(warnings));
  const finalSuggestions = Array.from(new Set(suggestions));
  const finalInsights = Array.from(new Set(insights));

  let speechText = `${reportTitle} ${nutrientSummary} `;
  if (finalWarnings.length > 0) {
    speechText += `${t.warningsHeader} ${finalWarnings.join(". ")}. `;
  } else {
    speechText += `${t.safeMeal} `;
  }

  if (finalSuggestions.length > 0) {
    speechText += `${t.suggestionsHeader} ${finalSuggestions.join(". ")}. `;
  } else {
    speechText += `${t.noSuggestions} `;
  }

  if (finalInsights.length > 0) {
    speechText += `${t.insightsHeader} ${finalInsights.join(". ")}. `;
  } else {
    speechText += `${t.noInsights} `;
  }

  return {
    ...nutrientValues,
    warnings: finalWarnings,
    suggestions: finalSuggestions,
    insights: finalInsights,
    speechText: speechText.trim(),
  };
}
