'use server';
/**
 * @fileOverview A Genkit flow for generating personalized cover letters.
 *
 * - generatePersonalizedCoverLetter - A function that handles the cover letter generation process.
 * - GenerateCoverLetterInput - The input type for the generatePersonalizedCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generatePersonalizedCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The full job description for which the cover letter is being written.'),
  userProfileSummary: z.string().describe('A summary of the user\'s relevant professional profile, including skills, experience, and education, used to tailor the cover letter.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

// Output Schema
const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The personalized cover letter generated based on the job description and user profile.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

// Wrapper function to call the flow
export async function generatePersonalizedCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generatePersonalLetterFlow(input);
}

// Prompt Definition
const coverLetterPrompt = ai.definePrompt({
  name: 'personalizedCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert career coach specializing in writing compelling and personalized cover letters.
Your goal is to write a cover letter that effectively highlights the job seeker's qualifications and enthusiasm for the role, directly addressing the requirements mentioned in the job description.

---
Job Description:
{{{jobDescription}}}
---

---
Job Seeker's Profile Summary:
{{{userProfileSummary}}}
---

Based on the provided Job Description and Job Seeker's Profile Summary, craft a professional and persuasive cover letter.
Ensure the cover letter:
1. Is tailored specifically to the job description.
2. Clearly connects the job seeker's experience and skills (from their profile) to the job requirements.
3. Expresses genuine interest in the company and the role.
4. Is concise and impactful, suitable for a professional application.

The cover letter should be formatted as a standard professional letter. Do not include any salutation (e.g., "Dear Hiring Manager,") or closing (e.g., "Sincerely, [Your Name]") as this will be added by the user. Just provide the main body of the letter.`,
});

// Flow Definition
const generatePersonalLetterFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const {output} = await coverLetterPrompt(input);
    return output!;
  }
);
