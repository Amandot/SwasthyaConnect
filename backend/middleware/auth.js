import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase.js';
import logger from '../config/logger.js';

const { JWT_SECRET } = process.env;

// Demo mode when no real Firebase credentials are present
const isDemoMode = !process.env.FIREBASE_PROJECT_ID && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      const err = new Error('Authentication token missing');
      err.status = 401;
      throw err;
    }

    if (isDemoMode) {
      if (token === 'demo-patient-token') {
        req.user = { uid: 'demo-patient', role: 'patient', email: 'demo.patient@telehealth.com' };
        return next();
      }
      if (token === 'demo-doctor-token') {
        req.user = { uid: 'demo-doctor', role: 'doctor', email: 'demo.doctor@telehealth.com' };
        return next();
      }
      if (JWT_SECRET) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          req.user = { uid: decoded.sub || decoded.uid, role: decoded.role || 'patient', email: decoded.email };
          return next();
        } catch (_) {}
      }
      // Accept any token in demo mode
      logger.warn('Demo mode: accepting unverified token');
      req.user = { uid: token.substring(0, 28), role: 'patient', email: 'demo@telehealth.com' };
      return next();
    }

    // Production: Firebase first, JWT fallback
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        role: decoded.role || decoded.customClaims?.role || 'patient',
        email: decoded.email,
      };
      return next();
    } catch (_) {
      if (!JWT_SECRET) {
        const err = new Error('Invalid authentication token');
        err.status = 401;
        throw err;
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { uid: decoded.sub || decoded.uid, role: decoded.role || 'patient', email: decoded.email };
      return next();
    }
  } catch (err) {
    err.status = err.status || 401;
    err.message = err.message || 'Invalid or expired authentication token';
    return next(err);
  }
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(Object.assign(new Error('Not authenticated'), { status: 401 }));
    }
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(Object.assign(new Error('Not authorized'), { status: 403 }));
    }
    return next();
  };
}
