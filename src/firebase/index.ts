'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes Firebase with the provided configuration.
 * Prevents multiple initializations by checking existing apps.
 * Explicitly provides the config object for compatibility with Vercel and non-Firebase hosting.
 */
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Return placeholder SDKs for SSR to avoid "no-options" errors during build
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any
    };
  }

  let firebaseApp: FirebaseApp;

  if (!getApps().length) {
    // Manual initialization with config object is required for Vercel
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
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
