
'use server';
/**
 * @fileOverview Generates tailored resume content based on a job description and user self-description.
 *
 * - generateResumeContent - A function that generates resume content.
 * - GenerateResumeContentInput - The input type for the generateResumeContent function.
 * - GenerateResumeContentOutput - The return type for the generateResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeContentInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for which the resume is being tailored.'),
  selfDescription: z
    .string()
    .describe('A brief self-description of the user, potentially including name and contact details.'),
  hasExperience: z
    .boolean()
    .describe('Whether the user has prior work experience.'),
});
export type GenerateResumeContentInput = z.infer<typeof GenerateResumeContentInputSchema>;

const GenerateResumeContentOutputSchema = z.object({
  name: z.string().describe("The full name of the candidate. Extract from self-description or use 'Candidate Name' if not found."),
  contact: z.object({
    email: z.string().describe("The candidate's email address. Extract or use 'candidate@email.com'."),
    phone: z.string().optional().describe("The candidate's phone number. Extract if available."),
    linkedin: z.string().optional().describe("The candidate's LinkedIn profile URL. Extract if available."),
  }).describe("The candidate's contact information."),
  aboutMe: z.string().describe('A tailored "About Me" section (100-150 words, approx. 5-6 lines).'),
  skills: z.array(z.string()).describe('A list of 5-8 relevant skills.'),
  languages: z
    .array(
      z.object({
        name: z.string().describe("The name of the language."),
        proficiency: z.string().describe("The proficiency level in the language (e.g., Native, Fluent, B2, Basic)."),
      })
    )
    .describe('A list of 2-3 language proficiencies. If not specified in self-description, assume English (Native) and one plausible additional language.'),
  workExperience: z
    .array(
      z.object({
        jobTitle: z.string(),
        company: z.string(),
        dates: z.string().describe("Employment dates (e.g., YYYY-YYYY, Month YYYY - Present)."),
        duties: z.array(z.string()).describe("A list of 2-3 concise duties or responsibilities for the job."),
      })
    )
    .describe('A list of 1-3 work experience entries. If hasExperience is false, generate fictional but plausible entries. Otherwise, use "No prior experience" details.'),
});
export type GenerateResumeContentOutput = z.infer<typeof GenerateResumeContentOutputSchema>;

export async function generateResumeContent(
  input: GenerateResumeContentInput
): Promise<GenerateResumeContentOutput> {
  return generateResumeContentFlow(input);
}

const generateResumeContentPrompt = ai.definePrompt({
  name: 'generateResumeContentPrompt',
  input: {schema: GenerateResumeContentInputSchema},
  output: {schema: GenerateResumeContentOutputSchema},
  prompt: `You are an expert resume writer. Generate content for a resume based on a job description and a self-description.

Job Description: {{{jobDescription}}}

Self-Description: {{{selfDescription}}}

Output the following sections, ensuring content is concise to fit standard resume height constraints:

Name: Extract the candidate's full name from the self-description. If not found, use "Candidate Name".
Contact: Extract email, phone, and LinkedIn URL from self-description.
  - Email: If not found, use "candidate@email.com".
  - Phone: Optional.
  - LinkedIn: Optional.
About Me: A tailored "About Me" section, 100-150 words (approx. 5-6 lines).
Skills: A list of 5-8 relevant skills, based on the job description and self-description.
Languages: A list of 2-3 language proficiencies (e.g., English - Native, Spanish - B2). If not specified, assume English (Native) and add one plausible additional language like Spanish - Basic. Each language should be an object with "name" and "proficiency".
Work Experience: A list of 1-3 work experience entries.
  - If hasExperience ({{{hasExperience}}}) is false, generate 1-3 fictional but plausible entries with duties matching the job requirements. Each entry should have a jobTitle, company, dates, and an array of 2-3 duties.
  - If hasExperience is true but no specific experience is detailed in self-description, create a single entry: jobTitle "To be detailed by user", company "N/A", dates "N/A", duties ["User to fill in details of prior experience."].
  - If hasExperience is true AND specific experience is mentioned, try to parse it into entries. If parsing is difficult, use the "To be detailed by user" structure.
  - Each duty in the duties array should be a concise string.

Make sure the output matches the schema exactly. Be very careful with the types for languages and workExperience.duties.
For workExperience, if 'hasExperience' is true but no experience is provided in self-description, use "No prior experience", "N/A", "N/A", ["User to fill in details"]. If 'hasExperience' is false, generate fictional entries.
`,
});

const generateResumeContentFlow = ai.defineFlow(
  {
    name: 'generateResumeContentFlow',
    inputSchema: GenerateResumeContentInputSchema,
    outputSchema: GenerateResumeContentOutputSchema,
  },
  async input => {
    const {output} = await generateResumeContentPrompt(input);
    // Basic validation, though schema validation handles more.
    if (!output?.name || !output.contact?.email) {
        // Fallback if AI fails to generate basic fields
        const fallbackName = "Candidate Name";
        const fallbackEmail = "candidate@email.com";
        return {
            name: output?.name || fallbackName,
            contact: {
                email: output?.contact?.email || fallbackEmail,
                phone: output?.contact?.phone,
                linkedin: output?.contact?.linkedin,
            },
            aboutMe: output?.aboutMe || "AI failed to generate this section.",
            skills: output?.skills || ["AI failed to generate skills."],
            languages: output?.languages || [{name: "English", proficiency: "Native"}],
            workExperience: output?.workExperience || [{
                jobTitle: "Placeholder",
                company: "Placeholder Inc.",
                dates: "YYYY-YYYY",
                duties: ["AI failed to generate duties."]
            }],
        };
    }
    return output!;
  }
);

