import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { images } from '@/constants';

const Onboarding = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-200 text-black">
            <header className="flex justify-between items-center mb-40 w-full px-8 py-4 bg-gray-900 bg-opacity-75 text-white">
                <h1 className="text-3xl font-bold">EmpowerHer Hub</h1>
            </header>
            <div className="text-center max-w-sm mx-auto h-40 w-40 mb-10">
                <Image
                    src={images.logo}
                    alt="Empowering Rural Women Entrepreneurs"
                    className="w-40 h-40 object-cover rounded-lg shadow-lg"
                />
            </div>
            <header className="text-center mb-10">
                <h2 className="text-4xl font-extrabold mb-2">Empower Women, Empower Pakistan</h2>
                <p className="text-xl text-black mx-4 mb-4">
                    EmpowerHer Hub is a space where rural women entrepreneurs can sell their products, connect<br /> with mentors, and grow their businesses through community support and resources.
                </p>
            </header>
            <div className="text-center mb-10 space-x-4">
                <Link href="/login">
                    <button className="bg-blue-600 font-semibold text-white px-8 py-2 rounded-lg transition-transform transform hover:scale-105">
                        Login
                    </button>
                </Link>
                <Link href="/signup">
                    <button className="bg-white font-semibold text-blue-600 px-8 py-2 rounded-lg border-2 border-blue-600 transition-transform transform hover:scale-105">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Onboarding;