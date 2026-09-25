import {
  isParseMedicineSearchConfigured,
  searchMedicinesNearby
} from '../services/parseMedicineService.js';

const INDIAN_PIN_PATTERN = /^[1-9][0-9]{5}$/;

function validationError(res, field, message) {
  return res.status(400).json({
    error: 'Invalid medicine search request',
    field,
    message
  });
}

export async function searchNearbyMedicines(req, res) {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const medicine = typeof body.medicine === 'string' ? body.medicine.trim() : '';
  const pin = typeof body.pin === 'string' ? body.pin.trim() : '';

  if (medicine.length < 2 || medicine.length > 100) {
    return validationError(res, 'medicine', 'medicine must be between 2 and 100 characters after trimming');
  }

  if (!INDIAN_PIN_PATTERN.test(pin)) {
    return validationError(res, 'pin', 'pin must be a valid 6-digit Indian PIN');
  }

  if (!isParseMedicineSearchConfigured()) {
    return res.status(503).json({
      error: 'Medicine search is temporarily unavailable.'
    });
  }

  try {
    const response = await searchMedicinesNearby(medicine, pin);
    return res.status(200).json(response);
  } catch {
    return res.status(503).json({
      error: 'Medicine search is temporarily unavailable.'
    });
  }
}

export default searchNearbyMedicines;
