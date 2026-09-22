import { supabase } from '../config/supabase.js';

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    
    let query = supabase.from('appointments').select('*, patient:users!patient_id(name, email), doctor:users!doctor_id(name, email)');
    
    // User Isolation Enforcement
    if (req.user.role === 'patient') {
      // Patient can only see their own appointments
      query = query.eq('patient_id', req.user.id);
    } else if (req.user.role === 'doctor') {
      // Doctor can only see their own appointments
      query = query.eq('doctor_id', req.user.id);
    }

    // Additional filters if they don't violate isolation
    if (patientId && req.user.role === 'doctor') {
      query = query.eq('patient_id', patientId);
    }
    if (doctorId && req.user.role === 'patient') {
      query = query.eq('doctor_id', doctorId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('date', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patient:users!patient_id(name, email, phone), doctor:users!doctor_id(name, email)')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Authorization check
    if (req.user.role === 'patient' && data.patient_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (req.user.role === 'doctor' && data.doctor_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, type, notes } = req.body;
    
    // A patient can only create an appointment for themselves
    let patientId = req.body.patientId;
    if (req.user.role === 'patient') {
      patientId = req.user.id;
    }
    
    // Generate a unique room ID for video consultation
    const roomId = `telehealth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newAppointment = {
      patient_id: patientId,
      doctor_id: doctorId,
      date,
      time: time || '10:00',
      type: type || 'video',
      status: 'scheduled',
      notes: notes || '',
      room_id: roomId
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(newAppointment)
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment status
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check authorization first
    const { data: existingAppt } = await supabase.from('appointments').select('patient_id, doctor_id').eq('id', id).single();
    if (!existingAppt) return res.status(404).json({ error: 'Appointment not found' });
    
    if (req.user.role === 'patient' && existingAppt.patient_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (req.user.role === 'doctor' && existingAppt.doctor_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const updates = req.body;
    // Prevent changing IDs
    delete updates.id;
    delete updates.patient_id;
    delete updates.doctor_id;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('appointments')
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

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check authorization
    const { data: existingAppt } = await supabase.from('appointments').select('patient_id, doctor_id').eq('id', id).single();
    if (!existingAppt) return res.status(404).json({ error: 'Appointment not found' });
    
    if (req.user.role === 'patient' && existingAppt.patient_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (req.user.role === 'doctor' && existingAppt.doctor_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
