import { z } from 'zod';

export const ResumeFormSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters.").max(2000, "Job description cannot exceed 2000 characters."),
  selfDescription: z.string().min(20, "About me section must be at least 20 characters.").max(500, "About me section cannot exceed 500 characters."),
});

export type ResumeFormValues = z.infer<typeof ResumeFormSchema>;

// AI flow types are already in src/ai/flows/
// Re-exporting for convenience if needed, or import directly from AI flows.
// export type { GenerateResumeContentInput, GenerateResumeContentOutput } from '@/ai/flows/generate-resume-content';
