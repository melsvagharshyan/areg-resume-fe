'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { links } from './utils/constants';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/dxfqf6fgv/image/upload/v1746817593/script_oyyrxy.png"
            alt="Logo"
            className="h-13 w-auto"
          />
        </Link>
        <ul className="hidden md:flex space-x-8 items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative px-2 py-1 transition-colors duration-200
          ${
            pathname === link.href
              ? 'text-cyan-400 font-medium'
              : 'text-gray-200 hover:text-cyan-400 font-normal'
          }`}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-cyan-400 rounded-full"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <button
            onClick={() => router.push('/job-apply')}
            className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-2 rounded-xl shadow-md font-semibold cursor-pointer"
          >
            Apply
          </button>
        </div>
        <button
          className="md:hidden text-2xl p-2 rounded-md hover:bg-gray-800 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div
        className={`md:hidden bg-gray-900 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 py-6' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col items-center space-y-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-white text-lg px-4 py-2 rounded-lg transition-colors duration-200
                  ${pathname === link.href ? 'bg-cyan-500 font-semibold' : 'hover:bg-cyan-700'}
                `}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              router.push('/job-apply');
              setIsOpen(false);
            }}
            className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-2 rounded-xl shadow-md font-semibold cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
