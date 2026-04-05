'use client';

import { collection, query, where, getCountFromServer, Timestamp } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

/**
 * Checks if a user has exceeded their daily AI generation limit.
 * Free tier: 3 generations per 24 hours.
 */
export async function checkAILimit(db: Firestore, userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const logsRef = collection(db, 'userProfiles', userId, 'aiGenerationLogs');
  const q = query(
    logsRef,
    where('generatedAt', '>=', Timestamp.fromDate(twentyFourHoursAgo))
  );

  const snapshot = await getCountFromServer(q);
  const count = snapshot.data().count;
  const limit = 3; // Hardcoded for prototype; in production, fetch from user's active Plan

  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count)
  };
}
