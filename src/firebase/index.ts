'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes Firebase with the provided configuration.
 * Prevents initialization during SSR/Prerender and handles missing config gracefully.
 */
export function initializeFirebase() {
  // Guard against server-side execution
  if (typeof window === 'undefined') {
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  // Validate configuration before initialization
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase Warning: NEXT_PUBLIC_FIREBASE_API_KEY is missing. Check your environment variables.');
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  let firebaseApp: FirebaseApp;

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp)
    };
  } catch (error) {
    console.error('Firebase Initialization Error:', error);
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
