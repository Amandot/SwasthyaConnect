import { supabase } from './config/supabase.js';

async function run() {
  console.log('Inserting mock patient...');
  const newPatient = {
    firebase_uid: 'mock-patient-uid-12345',
    name: 'Mock Patient',
    role: 'patient',
    email: 'patient@example.com'
  };
  
  let { data: patient, error: patientErr } = await supabase.from('users').insert(newPatient).select().single();
  
  if (patientErr && patientErr.code === '23505') {
    const { data: p } = await supabase.from('users').select('*').eq('firebase_uid', 'mock-patient-uid-12345').single();
    patient = p;
  } else if (patientErr) {
    console.error('Patient insert err:', patientErr);
    return;
  }
  
  const { data: doctor } = await supabase.from('users').select('*').eq('role', 'doctor').limit(1).single();
  
  console.log('Got Patient:', patient.id, 'Doctor:', doctor.id);
  
  const newAppt = {
    patient_id: patient.id,
    doctor_id: doctor.id,
    date: '2026-03-15',
    time: '10:00',
    type: 'video',
    status: 'scheduled',
    notes: 'Test note',
    room_id: 'test-room'
  };
  
  const { data: appt, error: apptErr } = await supabase.from('appointments').insert(newAppt).select().single();
  if (apptErr) {
    console.error('Appt insert err:', apptErr);
  } else {
    console.log('Success inserted appt:', appt.id);
  }
}

run();
