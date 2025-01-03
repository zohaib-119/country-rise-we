'use client'

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineLineChart,
  AiOutlineSetting,
  AiOutlineLogout,
} from 'react-icons/ai';
import {
  FaBook, FaChalkboardTeacher, FaCompass
} from 'react-icons/fa'
import { useLanguage } from '@/context/LanguageProvider';
import { translations } from '@/constants';

const Sidebar = () => {
  const { language } = useLanguage();

  return (
    <div className="h-screen w-1/6 bg-white text-blue-600 flex flex-col rounded-2xl shadow-md">
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-blue-200">
        <h1 className="text-2xl font-bold">{translations[language].websiteName}</h1>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <AiOutlineDashboard size={20} />
              {translations[language].dashboard}
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <AiOutlineShoppingCart size={20} />
              {translations[language].products}
            </Link>
          </li>
          <li>
            <Link
              href="/sales"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <AiOutlineLineChart size={20} />
              {translations[language].salesOverview}
            </Link>
          </li>
          <li>
            <Link
              href="/offered-courses"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <FaChalkboardTeacher size={20} />
              {translations[language].myCourses}
            </Link>
          </li>
          <li>
            <Link
              href="/enrolled-courses"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <FaBook size={20} />
              {translations[language].enrolledCourses}
            </Link>
          </li>
          <li>
            <Link
              href="/explore-courses"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <FaCompass size={20} />
              {translations[language].exploreCourses}
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-2 py-2 px-4 hover:bg-blue-100 rounded-md"
            >
              <AiOutlineSetting size={20} />
              {translations[language].accountSettings}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="border-t border-blue-200 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })} // Redirect to /signin
          className="w-full flex items-center gap-2 py-2 px-4 text-left hover:bg-blue-100 rounded-md"
        >
          <AiOutlineLogout size={20} />
          {translations[language].signOut}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
