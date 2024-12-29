'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { images } from '@/constants';
import CustomInput from '@/components/CustomInput';
import { useRouter } from 'next/navigation';

const SignUp = () => {

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ email: '', password: '', name: '', code: '' });

  const handleEmailChange = (e) => {
    setForm({ ...form, email: e.target.value });
  }

  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  }

  const handleNameChange = (e) => {
    setForm({ ...form, name: e.target.value });
  }

  const handleCodeChange = (e) => {
    setForm({ ...form, code: e.target.value })
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      // Send a request to get the verification code
      const response = await fetch('/api/auth/getcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json()
      if (response.ok) {
        console.log('Verification code sent successfully.');
        setShowModal(true); // Open the modal to enter verification code
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };
  
  const handleVerify = async () => {
    try {
      // Send a request to complete the signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          password: form.password,
          code: form.code, // Assuming the verification code is stored in `form.code`
        }),
      });

      const data = await response.json()
      if (response.ok) {
        console.log('Signup successful.');
        router.push('/login');
        setShowModal(false); // Close the modal after successful signup
      } else {
        setShowModal(false);
        setError(data.error);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center fixed top-0 mb-10 w-full px-8 py-4 bg-blue-600 text-white">
        <h1 className="text-3xl font-bold">CountryRise</h1>
      </header>
      <div className="flex min-h-screen bg-gradient-to-br from-white to-blue-200">
        {/* Left Side: Image Section */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-blue-900">
          <Image
            src={images.signup}
            alt="Empowering Rural Women Entrepreneurs"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        {/* Right Side: Form Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-16 bg-white rounded-l-lg">
          <div className="max-w-md w-full">
            <h2 className="text-4xl font-bold text-blue-600 mb-6 text-center">Create Your Account</h2>
            <form onSubmit={handleSignUp} className="space-y-6">
              <CustomInput
                label="Name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                handleChange={handleNameChange}
              />
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
                Sign Up
              </button>
            </form>
            {error && <p className='text-center text-sm mt-4 font-semibold text-red-600 border-red-600 border-2 rounded-md  bg-red-100 p-2'>{error}</p>}
            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* OTP Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Verify Your Account</h3>
              <CustomInput
                label="Enter any dummy code"
                type="text"
                placeholder="Enter verification code"
                value={form.code}
                handleChange={handleCodeChange}
              />
              <button
                onClick={handleVerify}
                className="mt-3 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              >
                Verify
              </button>
              <button
                onClick={handleCloseModal}
                className="mt-4 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
