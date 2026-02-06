'use client';

import { useState, useEffect } from 'react';
import {
  useGetCoverLetterQuery,
  useUpdateCoverLetterMutation,
} from '../store/cover-letter/cover-letter.api';
import { FaRegCopy } from 'react-icons/fa';
import { ImSpinner } from 'react-icons/im';
import { toast } from 'sonner';

export default function FrontendPage() {
  const type = 'frontend';

  const { data, isLoading, isError } = useGetCoverLetterQuery(type);
  const [updateCoverLetter, { isLoading: isUpdating }] = useUpdateCoverLetterMutation();

  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.text) {
      setText(data.text);
    } else if (!data) {
      setText(
        `Dear Hiring Manager,\n\nI am excited to apply for the Front-end Developer position...`,
      );
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateCoverLetter({ type, text }).unwrap();
      setIsEditing(false);
      toast.success('Cover letter saved!', { duration: 1000 });
    } catch (err) {
      console.error(err);
      toast.error('Error saving cover letter');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-cyan-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (isError) return <p className="text-center text-red-500">Error loading cover letter</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 space-y-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Front-end Cover Letter</h1>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95
                     transition cursor-pointer shadow-sm"
        >
          <FaRegCopy className="text-lg" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          className="w-full h-[400px] p-4 border border-gray-200 rounded-xl shadow-sm 
                     focus:ring focus:ring-cyan-400 focus:border-cyan-400 outline-none 
                     transition text-gray-800 resize-none overflow-y-auto
                     scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-100"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p className="whitespace-pre-wrap text-gray-800">{text}</p>
      )}

      {/* Action button */}
      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        disabled={isUpdating}
        className="bg-cyan-500 text-white cursor-pointer px-6 py-3 rounded-xl font-semibold shadow-md 
                   hover:bg-cyan-400 active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isEditing ? isUpdating ? <ImSpinner className="animate-spin h-5 w-5" /> : 'Save' : 'Edit'}
      </button>
    </div>
  );
}
