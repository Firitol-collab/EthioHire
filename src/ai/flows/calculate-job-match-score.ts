'use server';
/**
 * @fileOverview This file defines a Genkit flow to calculate a job match score.
 *
 * - calculateJobMatchScore - A function that calculates a percentage match score between a user's profile and a job description.
 * - CalculateJobMatchScoreInput - The input type for the calculateJobMatchScore function.
 * - CalculateJobMatchScoreOutput - The return type for the calculateJobMatchScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateJobMatchScoreInputSchema = z.object({
  userSkills: z.array(z.string()).describe('A list of the job seeker\'s skills.'),
  userExperienceEducation: z.string().describe('A summary of the job seeker\'s experience and education, typically extracted from their profile or CV.'),
  userCvContent: z.string().describe('The full text content of the job seeker\'s CV, if available.'),
  jobDescription: z.string().describe('The full job description for the role.'),
});
export type CalculateJobMatchScoreInput = z.infer<typeof CalculateJobMatchScoreInputSchema>;

const CalculateJobMatchScoreOutputSchema = z.object({
  matchScore: z.number().int().min(0).max(100).describe('A percentage score (0-100) indicating how well the job seeker\'s profile matches the job description.'),
  explanation: z.string().describe('A brief explanation of why the match score was given, highlighting key areas of alignment and divergence.'),
});
export type CalculateJobMatchScoreOutput = z.infer<typeof CalculateJobMatchScoreOutputSchema>;

export async function calculateJobMatchScore(input: CalculateJobMatchScoreInput): Promise<CalculateJobMatchScoreOutput> {
  return calculateJobMatchScoreFlow(input);
}

const calculateJobMatchScorePrompt = ai.definePrompt({
  name: 'calculateJobMatchScorePrompt',
  input: { schema: CalculateJobMatchScoreInputSchema },
  output: { schema: CalculateJobMatchScoreOutputSchema },
  prompt: `You are an expert career advisor specializing in job matching.
Your task is to analyze a job seeker's profile (skills, experience, education, and CV content) against a given job description and determine a percentage match score (0-100).

Consider the following information about the job seeker:
Skills: {{{userSkills}}}
Experience and Education: {{{userExperienceEducation}}}
CV Content: {{{userCvContent}}}

Now, consider the following job description:
Job Description: {{{jobDescription}}}

Based on the job seeker's profile and the job description, provide a match score from 0 to 100, where 100 is a perfect match.
Also, provide a brief explanation of your scoring, highlighting the key strengths of the match and any notable gaps.
The output MUST be a JSON object with the following structure:
{{jsonSchema output}}`,
});

const calculateJobMatchScoreFlow = ai.defineFlow(
  {
    name: 'calculateJobMatchScoreFlow',
    inputSchema: CalculateJobMatchScoreInputSchema,
    outputSchema: CalculateJobMatchScoreOutputSchema,
  },
  async (input) => {
    const { output } = await calculateJobMatchScorePrompt(input);
    return output!;
  }
);
