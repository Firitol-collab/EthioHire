'use server';
/**
 * @fileOverview A Genkit flow for generating a tailored CV based on a job description and user's profile.
 *
 * - generateTailoredCv - A function that handles the CV generation process.
 * - GenerateTailoredCvInput - The input type for the generateTailoredCv function.
 * - GenerateTailoredCvOutput - The return type for the generateTailoredCv function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  title: z.string().describe('Job title'),
  company: z.string().describe('Company name'),
  startDate: z.string().describe('Start date of employment (e.g., "January 2020")'),
  endDate: z.string().optional().describe('End date of employment (e.g., "December 2022" or "Present")'),
  description: z.string().describe('Key responsibilities and achievements in bullet points.'),
});

const EducationSchema = z.object({
  degree: z.string().describe('Degree or qualification (e.g., "B.Sc. in Computer Science")'),
  institution: z.string().describe('Name of the educational institution'),
  startDate: z.string().describe('Start date of education'),
  endDate: z.string().optional().describe('End date of education or "Present"'),
  description: z.string().optional().describe('Relevant coursework, projects, or honors.'),
});

const UserProfileSchema = z.object({
  name: z.string().describe('The user\'s full name.'),
  email: z.string().email().describe('The user\'s email address.'),
  phone: z.string().optional().describe('The user\'s phone number.'),
  linkedin: z.string().url().optional().describe('The user\'s LinkedIn profile URL.'),
  skills: z.array(z.string()).describe('A list of the user\'s key skills.'),
  experience: z.array(ExperienceSchema).describe('A list of the user\'s work experiences.'),
  education: z.array(EducationSchema).describe('A list of the user\'s educational background.'),
  summary: z.string().optional().describe('A professional summary or objective for the CV.'),
});

const GenerateTailoredCvInputSchema = z.object({
  jobDescription: z.string().describe('The full job description for which the CV needs to be tailored.'),
  userProfile: UserProfileSchema.describe('The job seeker\'s profile information, including skills, experience, and education.'),
});
export type GenerateTailoredCvInput = z.infer<typeof GenerateTailoredCvInputSchema>;

const GenerateTailoredCvOutputSchema = z.object({
  tailoredCvContent: z.string().describe('The generated CV content, tailored for the given job description, in markdown format.'),
});
export type GenerateTailoredCvOutput = z.infer<typeof GenerateTailoredCvOutputSchema>;

export async function generateTailoredCv(input: GenerateTailoredCvInput): Promise<GenerateTailoredCvOutput> {
  return generateTailoredCvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTailoredCvPrompt',
  input: {schema: GenerateTailoredCvInputSchema},
  output: {schema: GenerateTailoredCvOutputSchema},
  prompt: `You are an expert CV writer. Your task is to create a professional and highly tailored CV for a job seeker based on their profile and a specific job description.

Focus on highlighting the most relevant skills, experiences, and education that align with the job description. Emphasize keywords from the job description.

Format the output as a professional CV using markdown. Include the following sections:
1.  Contact Information (Name, Email, Phone, LinkedIn - if available)
2.  Summary/Objective (tailored to the job)
3.  Skills (categorize if appropriate, highlight job-relevant ones)
4.  Experience (Company, Title, Dates, Key Responsibilities/Achievements - use bullet points and action verbs, quantifying results where possible, and tailoring to job description)
5.  Education (Degree, Institution, Dates, Relevant coursework/projects - if applicable and relevant to the job)

Do not include any introductory or concluding remarks outside of the CV content itself.

--- Job Description ---
{{{jobDescription}}}

--- User Profile ---
Name: {{{userProfile.name}}}
Email: {{{userProfile.email}}}
{{#if userProfile.phone}}Phone: {{{userProfile.phone}}}{{/if}}
{{#if userProfile.linkedin}}LinkedIn: {{{userProfile.linkedin}}}{{/if}}

{{#if userProfile.summary}}Summary: {{{userProfile.summary}}}{{/if}}

Skills:
{{#each userProfile.skills}}- {{{this}}}
{{/each}}

Experience:
{{#each userProfile.experience}}
Title: {{{this.title}}}
Company: {{{this.company}}}
Dates: {{{this.startDate}}}{{#if this.endDate}} - {{{this.endDate}}}{{else}} - Present{{/if}}
Responsibilities and Achievements:
{{{this.description}}}
{{/each}}

Education:
{{#each userProfile.education}}
Degree: {{{this.degree}}}
Institution: {{{this.institution}}}
Dates: {{{this.startDate}}}{{#if this.endDate}} - {{{this.endDate}}}{{else}} - Present{{/if}}
{{#if this.description}}Relevant Details: {{{this.description}}}{{/if}}
{{/each}}
`,
});

const generateTailoredCvFlow = ai.defineFlow(
  {
    name: 'generateTailoredCvFlow',
    inputSchema: GenerateTailoredCvInputSchema,
    outputSchema: GenerateTailoredCvOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
