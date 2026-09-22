import { supabase } from '../config/supabase.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user (called after Firebase signup)
export const createUser = async (req, res) => {
  try {
    // Requires that the user is authenticated (firebase_uid is in req.user)
    if (!req.user || !req.user.firebase_uid) {
      return res.status(401).json({ error: 'Unauthorized: Firebase token required' });
    }

    const { name, role, age, email, phone } = req.body;
    
    // Ensure we use the authenticated user's firebase uid and email
    const firebase_uid = req.user.firebase_uid;
    const userEmail = email || req.user.email || null;
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebase_uid)
      .single();

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = {
      firebase_uid,
      name,
      role: role || 'patient',
      age: age || null,
      email: userEmail,
      phone: phone || null
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Authorization: User can only update their own profile, unless admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Cannot update other user profiles' });
    }

    const updates = req.body;
    // Prevent changing firebase_uid and role
    delete updates.firebase_uid;
    delete updates.role;
    delete updates.id;
    
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctors
export const getDoctors = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'doctor');
      
    if (error) throw error;

    // Augment with UI mock data since schema doesn't have these yet
    const enhancedData = data.map((doc, index) => {
      const specialties = ['General Physician', 'Pediatrician', 'Cardiologist', 'Dermatologist'];
      const experiences = ['15+ yrs', '12 yrs', '20+ yrs', '8 yrs'];
      
      // Determine specialty based on name if possible, or fallback
      let specialty = specialties[index % specialties.length];
      if (doc.name.includes('Smriti')) specialty = 'General Physician';
      if (doc.name.includes('Priya')) specialty = 'Pediatrician';
      if (doc.name.includes('Amit')) specialty = 'Cardiologist';
      if (doc.name.includes('Sunita')) specialty = 'Dermatologist';

      return {
        ...doc,
        specialty: specialty,
        experience: experiences[index % experiences.length],
        rating: 4.5 + (index % 5) * 0.1,
        available: true // Essential for the frontend to allow booking
      };
    });

    res.json(enhancedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
