import { admin } from '../config/firebase.js';
import { supabase } from '../config/supabase.js';
import logger from '../config/logger.js';

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

    let firebaseUid;
    let email;

    if (isDemoMode && (token === 'demo-patient-token' || token === 'demo-doctor-token')) {
      firebaseUid = token === 'demo-patient-token' ? 'demo-patient' : 'demo-doctor';
      email = token === 'demo-patient-token' ? 'demo.patient@telehealth.com' : 'demo.doctor@telehealth.com';
      logger.warn(`Demo mode: bypassing token verification for ${firebaseUid}`);
    } else {
      // Production: Firebase verification
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        firebaseUid = decoded.uid;
        email = decoded.email;
      } catch (verifyErr) {
        if (isDemoMode) {
          logger.warn('Demo mode: accepting unverified token fallback');
          firebaseUid = token.substring(0, 28) || 'unknown-demo-uid';
          email = 'demo@telehealth.com';
        } else {
          const err = new Error('Invalid or expired authentication token');
          err.status = 401;
          throw err;
        }
      }
    }

    // Look up the user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (error || !user) {
      // User authenticated in Firebase but not yet created in Supabase database.
      // This happens right after signup before they call POST /api/users.
      req.user = { firebase_uid: firebaseUid, email, isNew: true };
      return next();
    }

    // Attach full Supabase user object to req.user (contains .id, .role, etc.)
    req.user = user; 
    return next();
  } catch (err) {
    err.status = err.status || 401;
    err.message = err.message || 'Authentication failed';
    return next(err);
  }
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || req.user.isNew) {
      return next(Object.assign(new Error('Profile not completed or not authenticated'), { status: 403 }));
    }
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(Object.assign(new Error('Not authorized'), { status: 403 }));
    }
    return next();
  };
}
