import express from 'express';
import {
  checkSymptoms,
  getHealthTips,
  voiceChat
} from '../controllers/aiController.js';

const router = express.Router();

// POST /api/symptom-check - AI symptom checker
router.post('/symptom-check', checkSymptoms);

// POST /api/voice-chat - Voice conversational AI
router.post('/voice-chat', voiceChat);

// GET /api/health-tips - Get health tips
router.get('/health-tips', getHealthTips);

export default router;
