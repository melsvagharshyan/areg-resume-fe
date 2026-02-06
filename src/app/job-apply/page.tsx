'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { ImSpinner } from 'react-icons/im';

import { useGetCoverLetterQuery } from '../store/cover-letter/cover-letter.api';
import { ApplyJobSchema, applyJobSchema } from './utils/validation';

const JOB_KEY = 'cpp';
const JOB_TITLE = 'C++ Software Engineer';

export default function ApplyJob() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobSchema>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      companyEmail: '',
      coverLetterText: '',
      cvUrl: '',
    },
  });

  const { data, isLoading } = useGetCoverLetterQuery(JOB_KEY);

  useEffect(() => {
    if (data?.text) {
      setValue('coverLetterText', data.text);
    }
  }, [data, setValue]);

  const onSubmit = async (values: ApplyJobSchema) => {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: values.companyEmail.trim(),
          cover_letter: values.coverLetterText,
          job_title: JOB_TITLE,
          cv_url: values.cvUrl.trim(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      toast.success('Application sent successfully!', { duration: 1000 });

      reset({
        companyEmail: '',
        coverLetterText: data?.text || '',
        cvUrl: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send application');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-8 space-y-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl mt-10 border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Apply for {JOB_TITLE}</h2>

      {/* Company Email */}
      <div>
        <input
          type="email"
          placeholder="Company email"
          className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:ring focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-gray-700"
          {...register('companyEmail')}
        />
        {errors.companyEmail && (
          <p className="text-red-500 text-sm">{errors.companyEmail.message}</p>
        )}
      </div>

      {/* CV URL */}
      <div>
        <input
          type="url"
          placeholder="CV URL (Google Drive, Dropbox, etc.)"
          className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:ring focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-gray-700"
          {...register('cvUrl')}
        />
        {errors.cvUrl && <p className="text-red-500 text-sm">{errors.cvUrl.message}</p>}
      </div>

      {/* Cover Letter */}
      <div>
        {isLoading ? (
          <p className="text-gray-500 italic">Loading cover letter...</p>
        ) : (
          <textarea
            rows={12}
            className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-gray-800 resize-none overflow-y-auto max-h-[400px]
            scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-100"
            {...register('coverLetterText')}
          />
        )}
        {errors.coverLetterText && (
          <p className="text-red-500 text-sm">{errors.coverLetterText.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-cyan-500 cursor-pointer text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? <ImSpinner className="animate-spin h-5 w-5" /> : 'Apply'}
      </button>
    </form>
  );
}
