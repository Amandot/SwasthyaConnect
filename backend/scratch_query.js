import { supabase } from './config/supabase.js';

async function run() {
  const { data: users, error: usersErr } = await supabase.from('users').select('*');
  console.log('USERS:', users);

  const { data: appointments, error: apptErr } = await supabase.from('appointments').select('*');
  console.log('APPOINTMENTS:', appointments);
}

run();
