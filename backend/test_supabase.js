import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('KEY starts with:', supabaseServiceKey ? supabaseServiceKey.substring(0, 10) : 'MISSING');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' }).limit(1);
    
    if (error) {
      console.error('Supabase connection ERROR:', error.message);
      return;
    }
    
    console.log('Supabase connection SUCCESSFUL! Found data:', data);
    
  } catch (err) {
    console.error('Exception during test:', err);
  }
}

testConnection();
