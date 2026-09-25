import { supabase } from './config/supabase.js';

async function run() {
  const { data, error } = await supabase.from('appointments').select('*');
  console.log(JSON.stringify(data, null, 2));
}
run();
