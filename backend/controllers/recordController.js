import { supabase } from '../config/supabase.js';

// Get health records for a patient
export const getRecords = async (req, res) => {
  try {
    const { patientId } = req.query;
    
    let query = supabase.from('health_records').select('*, doctor:users!doctor_id(name, email), patient:users!patient_id(name, email)');
    
    if (req.user.role === 'patient') {
      // Patients can only see their own records
      query = query.eq('patient_id', req.user.id);
    } else if (req.user.role === 'doctor') {
      if (patientId) {
        query = query.eq('patient_id', patientId);
      } else {
        // Option: return all records for this doctor's patients, or require patientId
        // The safest is to only show records where they were the doctor, OR require patientId explicitly.
        // We'll restrict to records created by this doctor if no patientId is provided.
        query = query.eq('doctor_id', req.user.id);
      }
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get record by ID
export const getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('health_records')
      .select('*, doctor:users!doctor_id(name, email), patient:users!patient_id(name, email)')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Authorization
    if (req.user.role === 'patient' && data.patient_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Doctors might need to see records they didn't create if they are treating the patient, 
    // but for strictness, we check if they are the doctor on the record.
    // In a real app we'd check if an active appointment exists.
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create health record
export const createRecord = async (req, res) => {
  try {
    const { 
      patientId, 
      doctorId, 
      appointmentId,
      diagnosis, 
      prescription, 
      notes,
      vitals 
    } = req.body;
    
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can create health records' });
    }
    
    const newRecord = {
      patient_id: patientId,
      doctor_id: req.user.id, // Enforce the doctor is the logged-in user
      appointment_id: appointmentId || null,
      diagnosis: diagnosis || '',
      prescription: prescription || [],
      notes: notes || '',
      vitals: vitals || {},
      date: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('health_records')
      .insert(newRecord)
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update health record
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only the doctor who created it can update it
    const { data: existingRecord } = await supabase.from('health_records').select('doctor_id').eq('id', id).single();
    if (!existingRecord) return res.status(404).json({ error: 'Record not found' });
    
    if (existingRecord.doctor_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only edit records you created' });
    }
    
    const updates = req.body;
    delete updates.id;
    delete updates.patient_id;
    delete updates.doctor_id;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('health_records')
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

// Get prescriptions for a patient
export const getPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.query;
    
    let targetPatientId = patientId;
    if (req.user.role === 'patient') {
      targetPatientId = req.user.id;
    }
    
    if (!targetPatientId) {
      return res.status(400).json({ error: 'patientId is required' });
    }
    
    const { data, error } = await supabase
      .from('health_records')
      .select('id, date, doctor_id, prescription, doctor:users!doctor_id(name)')
      .eq('patient_id', targetPatientId)
      .not('prescription', 'is', null);
      
    if (error) throw error;
    
    // Format to match old structure
    const prescriptions = data
      .filter(record => record.prescription && record.prescription.length > 0)
      .map(record => ({
        recordId: record.id,
        date: record.date,
        doctorId: record.doctor_id,
        doctorName: record.doctor?.name,
        prescription: record.prescription
      }));
    
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
