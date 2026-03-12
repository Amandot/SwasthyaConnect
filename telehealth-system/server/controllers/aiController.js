import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI Symptom Checker
export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || symptoms.trim() === '') {
      return res.status(400).json({ error: 'Symptoms are required' });
    }
    
    // If OpenAI API key is not set, return demo response
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        symptoms: symptoms,
        analysis: getDemoAnalysis(symptoms),
        disclaimer: 'This is a demo response. For actual AI analysis, please configure OpenAI API key.'
      });
    }
    
    const prompt = `You are a medical assistant AI helping rural patients understand their symptoms. 
    Based on the following symptoms, provide:
    1. Possible conditions (list 2-3 most likely)
    2. Severity assessment (mild, moderate, or seek immediate care)
    3. General advice
    4. When to see a doctor
    
    Important: Always recommend consulting a healthcare professional for accurate diagnosis.
    
    Patient symptoms: ${symptoms}
    
    Respond in a simple, easy-to-understand format suitable for rural patients with limited medical knowledge.`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant providing preliminary health guidance.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const analysis = completion.choices[0].message.content;
    
    res.json({
      symptoms: symptoms,
      analysis: analysis,
      disclaimer: 'This is AI-generated advice and should not replace professional medical consultation. Please consult a doctor for accurate diagnosis and treatment.'
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze symptoms',
      details: error.message 
    });
  }
};

// Demo analysis for when API key is not available
function getDemoAnalysis(symptoms) {
  const symptomLower = symptoms.toLowerCase();
  
  if (symptomLower.includes('fever') || symptomLower.includes('cough')) {
    return `
**Possible Conditions:**
- Viral Fever
- Common Cold
- Flu (Influenza)

**Severity:** Mild to Moderate

**Advice:**
- Rest well and drink plenty of fluids
- Take paracetamol for fever (as directed)
- Keep yourself warm
- Eat light, nutritious food

**When to See a Doctor:**
- If fever persists for more than 3 days
- If you have difficulty breathing
- If symptoms worsen significantly
    `;
  }
  
  if (symptomLower.includes('headache')) {
    return `
**Possible Conditions:**
- Tension Headache
- Migraine
- Dehydration

**Severity:** Usually Mild

**Advice:**
- Rest in a quiet, dark room
- Drink plenty of water
- Apply cold compress to forehead
- Avoid screens and bright lights

**When to See a Doctor:**
- If headache is severe or sudden
- If accompanied by vision changes
- If headaches are frequent
    `;
  }
  
  if (symptomLower.includes('stomach') || symptomLower.includes('pain')) {
    return `
**Possible Conditions:**
- Gastritis
- Indigestion
- Food-related issues

**Severity:** Usually Mild to Moderate

**Advice:**
- Eat light, bland foods
- Avoid spicy and oily food
- Stay hydrated with water and ORS
- Rest adequately

**When to See a Doctor:**
- If pain is severe
- If there is blood in stool
- If symptoms persist beyond 2 days
    `;
  }
  
  return `
**Based on your symptoms: ${symptoms}**

**General Advice:**
- Rest adequately
- Stay hydrated
- Monitor your symptoms
- Maintain good hygiene

**Recommendation:**
We recommend consulting with a doctor for a proper diagnosis. You can book a video consultation through our app.

**When to Seek Immediate Care:**
- Severe pain
- Difficulty breathing
- High fever (above 103°F)
- Persistent symptoms
  `;
}

// Health tips endpoint
export const getHealthTips = async (req, res) => {
  try {
    const tips = [
      'Drink at least 8 glasses of water daily',
      'Wash hands frequently with soap',
      'Eat fresh fruits and vegetables',
      'Get 7-8 hours of sleep',
      'Exercise for at least 30 minutes daily',
      'Avoid smoking and excessive alcohol',
      'Keep your surroundings clean',
      'Get regular health check-ups'
    ];
    
    res.json({
      tips: tips,
      dailyTip: tips[new Date().getDay()]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
