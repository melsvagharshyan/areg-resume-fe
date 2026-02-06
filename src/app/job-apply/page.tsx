'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { useGetCoverLetterQuery } from '../store/cover-letter/cover-letter.api';
import { toast } from 'sonner';
import { ImSpinner } from 'react-icons/im';
import { ApplyJobSchema, applyJobSchema } from './utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { cvUrls } from './utils/constants';

const tabs = ['frontend', 'backend', 'fullstack'];

const tabTitles: Record<string, string> = {
  frontend: 'Sr. Front-end',
  backend: 'Sr. Back-end',
  fullstack: 'Sr. Full Stack',
};

export default function ApplyJob() {
  const [selectedTab, setSelectedTab] = useState('frontend');

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
    },
  });

  const { data, isLoading } = useGetCoverLetterQuery(selectedTab);

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
          job_title: tabTitles[selectedTab],
          cv_url: cvUrls[selectedTab],
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      toast.success('Application sent successfully!', { duration: 1000 });

      reset({
        companyEmail: '',
        coverLetterText: data?.text || '',
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
      <div className="flex space-x-3">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`px-5 py-2.5 rounded-full cursor-pointer font-medium transition-all shadow-sm 
              ${
                selectedTab === tab
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

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

      <div>
        {isLoading ? (
          <p className="text-gray-500 italic">Loading cover letter...</p>
        ) : (
          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-gray-800 resize-none overflow-y-auto max-h-[400px] 
            scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-100"
            rows={12}
            {...register('coverLetterText')}
          />
        )}
        {errors.coverLetterText && (
          <p className="text-red-500 text-sm">{errors.coverLetterText.message}</p>
        )}
      </div>

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
