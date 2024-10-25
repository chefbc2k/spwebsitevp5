import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin only on the server side
const initializeFirebaseAdmin = () => {
  if (typeof window === 'undefined' && !getApps().length) {
    try {
      const app = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });

      const auth = getAuth(app);
      const db = getFirestore(app);
      const storage = getStorage(app);

      return { app, auth, db, storage };
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw error;
    }
  }
  return null;
};

// Initialize Firebase Client only on the client side
const initializeFirebaseClient = () => {
  if (typeof window !== 'undefined') {
    const { initializeApp: initializeClientApp } = require('firebase/app');
    const { getAuth: getClientAuth } = require('firebase/auth');
    const { getFirestore: getClientFirestore } = require('firebase/firestore');
    const { getStorage: getClientStorage } = require('firebase/storage');

    try {
      const clientApp = initializeClientApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });

      const auth = getClientAuth(clientApp);
      const db = getClientFirestore(clientApp);
      const storage = getClientStorage(clientApp);

      return { app: clientApp, auth, db, storage };
    } catch (error) {
      console.error('Error initializing Firebase Client:', error);
      throw error;
    }
  }
  return null;
};

// Export the appropriate Firebase instance based on environment
const firebase = typeof window === 'undefined' 
  ? initializeFirebaseAdmin() 
  : initializeFirebaseClient();

if (!firebase) {
  throw new Error('Failed to initialize Firebase');
}

export const { app, auth, db, storage } = firebase;