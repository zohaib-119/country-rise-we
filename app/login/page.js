'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { images } from '@/constants';
import CustomInput from '@/components/CustomInput';
import { signIn } from 'next-auth/react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleEmailChange = (e) => {
    setForm({ ...form, email: e.target.value });
  }

  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  }


  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false, // Prevents automatic redirection
      email: form.email,
      password: form.password,
    });

    if (result.ok) {
      // Redirect to dashboard on success
      window.location.href = '/'
    } else {
      // Handle login error
      console.error('Login failed:', result.error);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center fixed top-0 mb-10 w-full px-8 py-4 bg-blue-600 text-white">
        <h1 className="text-3xl font-bold">CountryRise</h1>
      </header>
      <div className="flex min-h-screen bg-gradient-to-br from-white to-blue-200">
        {/* Left Side: Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-16 bg-white shadow-lg rounded-r-lg">
          <div className="max-w-md w-full">
            <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">Login to Your Account</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <CustomInput
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                handleChange={handleEmailChange}
              />
              <CustomInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                handleChange={handlePasswordChange}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              >
                Login
              </button>
            </form>
            <p className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image Section */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-blue-900">
          <Image
            src={images.login}
            alt="Empowering Rural Women Entrepreneurs"
            className="object-cover w-full h-full rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
