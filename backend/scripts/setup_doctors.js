import dotenv from 'dotenv';
dotenv.config();

import { admin } from '../config/firebase.js';
import { supabase } from '../config/supabase.js';

const doctors = [
  { name: 'Dr. Smriti Pandey', email: 'dr.smriti@swasthyaconnect.com', password: 'Doctor@123', phone: '+919876543210' },
  { name: 'Dr. Priya Patel', email: 'dr.priya@swasthyaconnect.com', password: 'Doctor@123', phone: '+919876543211' },
  { name: 'Dr. Amit Kumar', email: 'dr.amit@swasthyaconnect.com', password: 'Doctor@123', phone: '+919876543212' },
  { name: 'Dr. Sunita Gupta', email: 'dr.sunita@swasthyaconnect.com', password: 'Doctor@123', phone: '+919876543213' }
];

async function setupDoctors() {
  console.log('--- Setting up Doctor Accounts ---');
  
  for (const doc of doctors) {
    let firebaseUid;
    
    try {
      // Check if user exists in Firebase
      try {
        const existingUser = await admin.auth().getUserByEmail(doc.email);
        console.log(`[Firebase] User ${doc.email} already exists. UID: ${existingUser.uid}`);
        firebaseUid = existingUser.uid;
        
        // Ensure password is correct
        await admin.auth().updateUser(existingUser.uid, { password: doc.password });
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          // Create new user in Firebase
          const newUser = await admin.auth().createUser({
            email: doc.email,
            password: doc.password,
            displayName: doc.name,
          });
          console.log(`[Firebase] Created new user ${doc.email}. UID: ${newUser.uid}`);
          firebaseUid = newUser.uid;
        } else {
          throw err;
        }
      }
      
      // Check if user exists in Supabase
      const { data: existingSupabaseUser, error: supaErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', doc.email)
        .single();
        
      if (existingSupabaseUser) {
        console.log(`[Supabase] User ${doc.email} already exists.`);
        
        // Update firebase_uid just in case it's mismatched
        if (existingSupabaseUser.firebase_uid !== firebaseUid) {
           await supabase.from('users').update({ firebase_uid: firebaseUid }).eq('id', existingSupabaseUser.id);
           console.log(`[Supabase] Updated firebase_uid for ${doc.email}.`);
        }
      } else {
        // Create in Supabase
        const { error: insertErr } = await supabase.from('users').insert({
          firebase_uid: firebaseUid,
          name: doc.name,
          role: 'doctor',
          email: doc.email,
          phone: doc.phone
        });
        
        if (insertErr) throw insertErr;
        console.log(`[Supabase] Created user ${doc.email}.`);
      }
      
      console.log(`✅ Setup complete for ${doc.name}\n`);
    } catch (error) {
      console.error(`❌ Error setting up ${doc.name}:`, error);
    }
  }
  
  console.log('--- Summary of Login Credentials ---');
  doctors.forEach(d => {
    console.log(`Name: ${d.name}`);
    console.log(`Email: ${d.email}`);
    console.log(`Password: ${d.password}`);
    console.log('------------------------------------');
  });
  
  process.exit(0);
}

setupDoctors();
