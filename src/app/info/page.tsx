'use client';

import {
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaCopy,
  FaEnvelope,
  FaPhone,
  FaTelegram,
} from 'react-icons/fa';
import { JSX, useState } from 'react';

interface SocialLink {
  id: string;
  icon: JSX.Element;
  label: string;
  url: string;
  isCopyOnly?: boolean; // for text-only items (like "Available Immediately" or Telegram nickname)
}

const socialLinks: SocialLink[] = [
  {
    id: 'linkedin',
    icon: <FaLinkedin className="text-blue-600 w-6 h-6 flex-shrink-0" />,
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mels-vagharshyan',
  },
  {
    id: 'website',
    icon: <FaGlobe className="text-cyan-500 w-6 h-6 flex-shrink-0" />,
    label: 'Website',
    url: 'https://www.melsvagharshyan.com',
  },
  {
    id: 'github',
    icon: <FaGithub className="text-gray-800 w-6 h-6 flex-shrink-0" />,
    label: 'GitHub',
    url: 'https://github.com/melsvagharshyan',
  },
  {
    id: 'email',
    icon: <FaEnvelope className="text-red-500 w-6 h-6 flex-shrink-0" />,
    label: 'Email',
    url: 'mels.vagharshyandev@gmail.com',
  },
  {
    id: 'telegram',
    icon: <FaTelegram className="text-sky-500 w-6 h-6 flex-shrink-0" />,
    label: 'Telegram',
    url: '@mels_dev',
    isCopyOnly: true, // makes it copyable instead of clickable
  },
  {
    id: 'phone',
    icon: <FaPhone className="text-green-600 w-6 h-6 flex-shrink-0" />,
    label: 'Phone',
    url: '+37494541615',
  },
  {
    id: 'availability',
    icon: <FaCopy className="text-purple-600 w-6 h-6 flex-shrink-0" />,
    label: 'Availability',
    url: 'Available Immediately',
    isCopyOnly: true,
  },
];

export default function InfoPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 lg:px-8">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center">My Info</h1>

        <div className="space-y-4">
          {socialLinks.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center space-x-3 min-w-0">
                {item.icon}
                {item.isCopyOnly ? (
                  <span className="text-gray-700 font-medium truncate">{item.url}</span>
                ) : (
                  <a
                    href={
                      item.id === 'email'
                        ? `mailto:${item.url}`
                        : item.id === 'phone'
                          ? `tel:${item.url}`
                          : item.url
                    }
                    target={item.id !== 'email' && item.id !== 'phone' ? '_blank' : undefined}
                    rel={
                      item.id !== 'email' && item.id !== 'phone' ? 'noopener noreferrer' : undefined
                    }
                    className="text-gray-700 hover:text-blue-600 font-medium truncate"
                  >
                    {item.url}
                  </a>
                )}
              </div>
              <button
                onClick={() => handleCopy(item.url, item.id)}
                className="flex items-center cursor-pointer justify-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                <FaCopy className="text-gray-600" />
                <span className="text-gray-600">{copied === item.id ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
