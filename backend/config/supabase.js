import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. Supabase will not function correctly.');
}

// We use the service role key to bypass RLS and act as admin since we verify identity securely via Firebase.
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseServiceKey || 'demo-key'
);
