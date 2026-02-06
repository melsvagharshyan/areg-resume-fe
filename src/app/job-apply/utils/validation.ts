import { z } from 'zod';

export const applyJobSchema = z.object({
  companyEmail: z.string().min(1, 'Company email is required').email('Invalid email address'),

  cvUrl: z.string().min(1, 'CV URL is required').url('Please enter a valid CV URL'),

  coverLetterText: z.string().min(30, 'Cover letter must be at least 30 characters long'),
});

export type ApplyJobSchema = z.infer<typeof applyJobSchema>;
