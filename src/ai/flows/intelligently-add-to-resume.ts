'use server';

/**
 * @fileOverview A flow that intelligently adds user data or AI-generated content to a resume to make it more compelling.
 *
 * - intelligentlyAddToResume - A function that handles the process of intelligently adding content to a resume.
 * - IntelligentlyAddToResumeInput - The input type for the intelligentlyAddToResume function.
 * - IntelligentlyAddToResumeOutput - The return type for the intelligentlyAddToResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentlyAddToResumeInputSchema = z.object({
  jobVacancy: z
    .string()
    .describe('The job vacancy details for which the resume is being created.'),
  aboutMe: z
    .string()
    .describe('A brief self-description provided by the user.'),
  userSkills: z
    .array(z.string())
    .optional()
    .describe('A list of skills provided by the user.'),
  userExperience: z
    .string()
    .optional()
    .describe('A description of the user experience.'),
});
export type IntelligentlyAddToResumeInput = z.infer<typeof IntelligentlyAddToResumeInputSchema>;

const IntelligentlyAddToResumeOutputSchema = z.object({
  aboutMe: z.string().describe('The About Me section for the resume.'),
  skills: z.array(z.string()).describe('A list of skills for the resume.'),
  experience: z.string().describe('The work experience section for the resume.'),
});
export type IntelligentlyAddToResumeOutput = z.infer<typeof IntelligentlyAddToResumeOutputSchema>;

export async function intelligentlyAddToResume(input: IntelligentlyAddToResumeInput): Promise<IntelligentlyAddToResumeOutput> {
  return intelligentlyAddToResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentlyAddToResumePrompt',
  input: {schema: IntelligentlyAddToResumeInputSchema},
  output: {schema: IntelligentlyAddToResumeOutputSchema},
  prompt: `You are an expert resume writer. Your goal is to create a compelling resume based on the job vacancy and the user's self-description.

Job Vacancy: {{{jobVacancy}}}
About Me: {{{aboutMe}}}
User Skills: {{#if userSkills}}{{#each userSkills}}{{{this}}}, {{/each}}{{else}}None provided{{/if}}
User Experience: {{{userExperience}}}

Based on the job vacancy and the user's information, create the following sections for the resume:

1.  About Me: A 100-150 word paragraph summarizing the user’s strengths, tailored to the job.
2.  Skills: A list of 5-10 relevant skills based on the job description and user-provided skills. If the user provided skills, incorporate them where appropriate and supplement with additional skills as needed.
3.  Work Experience: Create a work experience section, using the provided experience if available. If not, generate 1-3 fictional but plausible entries with duties matching the job requirements.

Ensure that the generated content is professional, concise, and aligned with standard resume conventions.

Output in JSON format:
{
  "aboutMe": "",
  "skills": ["", "", ""],
  "experience": ""
}
`,
});

const intelligentlyAddToResumeFlow = ai.defineFlow(
  {
    name: 'intelligentlyAddToResumeFlow',
    inputSchema: IntelligentlyAddToResumeInputSchema,
    outputSchema: IntelligentlyAddToResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
