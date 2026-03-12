import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// You need to download your service account key from Firebase Console
// and set FIREBASE_SERVICE_ACCOUNT_KEY environment variable
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  // For development without credentials
  console.warn('Firebase credentials not found. Running in demo mode.');
  admin.initializeApp({
    projectId: 'demo-telehealth'
  });
}

const db = admin.firestore();

export { admin, db };
