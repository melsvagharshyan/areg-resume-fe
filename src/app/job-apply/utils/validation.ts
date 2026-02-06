import { z } from 'zod';

export const applyJobSchema = z.object({
  companyEmail: z.email('Invalid email address').min(1, 'Company email is required'),
  coverLetterText: z.string().min(30, 'Cover letter must be at least 30 characters long'),
});

export type ApplyJobSchema = z.infer<typeof applyJobSchema>;
