import { NextResponse } from 'next/server';
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin for server-side
function initializeFirebaseAdmin() {
  if (!getApps().length) {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    return app;
  }
  return getApps()[0];
}

const adminApp = initializeFirebaseAdmin();
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);
const adminStorage = getStorage(adminApp);

export async function GET(request: Request) {
  try {
    // Example endpoint for server-side Firebase operations
    const docs = await adminDb.collection('users').get();
    const users = docs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Firebase Admin error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { adminApp, adminAuth, adminDb, adminStorage };