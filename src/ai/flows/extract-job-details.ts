'use server';
/**
 * @fileOverview A Genkit flow to extract job details from a simulated LinkedIn URL or text content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractJobInputSchema = z.object({
  url: z.string().url().describe('The LinkedIn job posting URL.'),
  rawContent: z.string().optional().describe('Optional raw text content if URL scraping is bypassed.'),
});
export type ExtractJobInput = z.infer<typeof ExtractJobInputSchema>;

const ExtractJobOutputSchema = z.object({
  title: z.string().describe('The job title.'),
  companyName: z.string().describe('The company name.'),
  location: z.string().describe('The job location.'),
  description: z.string().describe('The full job description extracted.'),
  skillsRequired: z.array(z.string()).describe('List of key skills found.'),
  employmentType: z.string().describe('e.g., Full-time, Contract.'),
  salaryRange: z.string().optional().describe('Extracted salary info if present.'),
});
export type ExtractJobOutput = z.infer<typeof ExtractJobOutputSchema>;

export async function extractJobDetails(input: ExtractJobInput): Promise<ExtractJobOutput> {
  return extractJobFlow(input);
}

const extractPrompt = ai.definePrompt({
  name: 'extractJobPrompt',
  input: { schema: ExtractJobInputSchema },
  output: { schema: ExtractJobOutputSchema },
  prompt: `You are an AI specialized in recruitment data extraction. 
I am providing a simulated LinkedIn Job URL or raw text content from a job posting.

URL: {{{url}}}
{{#if rawContent}}Raw Content: {{{rawContent}}}{{/if}}

Extract the following details accurately. If information is missing, use your best judgment to provide a logical placeholder based on the context of the company or title.

The output MUST be a JSON object matching this schema:
{{jsonSchema output}}`,
});

const extractJobFlow = ai.defineFlow(
  {
    name: 'extractJobFlow',
    inputSchema: ExtractJobInputSchema,
    outputSchema: ExtractJobOutputSchema,
  },
  async (input) => {
    // In a real production app, you might use a scraping service tool here
    // For this prototype, the LLM will simulate the extraction from the URL context
    const { output } = await extractPrompt(input);
    return output!;
  }
);
