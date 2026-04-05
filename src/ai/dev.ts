import { config } from 'dotenv';
config();

import '@/ai/flows/generate-tailored-cv.ts';
import '@/ai/flows/calculate-job-match-score.ts';
import '@/ai/flows/generate-personalized-cover-letter.ts';