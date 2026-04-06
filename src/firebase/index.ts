'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes Firebase with the provided configuration.
 * Prevents multiple initializations and provides robust handling for environments like Vercel.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Return placeholder SDKs for SSR to avoid errors during build
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  // Validate configuration to prevent 'no-options' or 'invalid-api-key' errors
  if (!firebaseConfig.apiKey) {
    console.error('Firebase Error: Configuration is missing. Please check your .env.local file and NEXT_PUBLIC_ prefixes.');
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  let firebaseApp: FirebaseApp;

  if (!getApps().length) {
    // Manual initialization with config object is mandatory for non-Firebase hosting (Vercel)
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  // If app failed to initialize, return nulls to be handled by providers
  if (!firebaseApp) {
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
