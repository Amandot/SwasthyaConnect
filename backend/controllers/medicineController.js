import { supabase } from '../config/supabase.js';

// Get all medicines
export const getMedicines = async (req, res) => {
  try {
    const { name, pharmacy, available } = req.query;
    
    let query = supabase.from('medicines').select('*');
    
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    if (pharmacy) {
      query = query.ilike('pharmacy', `%${pharmacy}%`);
    }
    if (available !== undefined) {
      query = query.eq('available', available === 'true');
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search medicines by name
export const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .ilike('name', `%${query}%`);
      
    if (error) throw error;
    
    // Group by medicine name
    const grouped = data.reduce((acc, med) => {
      if (!acc[med.name]) {
        acc[med.name] = [];
      }
      acc[med.name].push({
        pharmacy: med.pharmacy,
        available: med.available,
        price: med.price || null
      });
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add medicine
export const addMedicine = async (req, res) => {
  try {
    // Basic authorization check (e.g. only admins or specific roles can add meds)
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Forbidden: Cannot add medicines' });
    }

    const { name, pharmacy, available, price, quantity } = req.body;
    
    const newMedicine = {
      name,
      pharmacy,
      available: available !== false,
      price: price || null,
      quantity: quantity || 0
    };
    
    const { data, error } = await supabase
      .from('medicines')
      .insert(newMedicine)
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update medicine availability
export const updateMedicine = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Forbidden: Cannot update medicines' });
    }

    const { id } = req.params;
    const updates = req.body;
    
    delete updates.id;
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('medicines')
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

// Get pharmacies
export const getPharmacies = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('pharmacy');
      
    if (error) throw error;
    
    const pharmacies = new Set();
    data.forEach(med => {
      if (med.pharmacy) {
        pharmacies.add(med.pharmacy);
      }
    });
    
    res.json(Array.from(pharmacies));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
