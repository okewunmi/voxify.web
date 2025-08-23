'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Volume2 } from 'lucide-react';

const SignInPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center px-6 py-8">
      {/* Logo with enhanced styling */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-4 shadow-lg mb-12 transform hover:scale-105 transition-all duration-300">
        <Volume2 size={50} className="text-white" />
      </div>

      {/* Heading Section with better typography */}
      <div className="text-center mb-16 max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Let's Get Started!
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          Let's dive into your account
        </p>
      </div>

      {/* Sign In/Up Buttons with enhanced design */}
      <div className="space-y-4 w-full max-w-sm mb-20">
        <button
          onClick={() => router.push('/signUp')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
        >
          Sign Up
        </button>
        
        <button
          onClick={() => router.push('/signIn')}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-4 px-8 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transform hover:-translate-y-1 transition-all duration-300 text-lg"
        >
          Sign In
        </button>
      </div>

      {/* Policy Links with better spacing and hover effects */}
      <div className="flex space-x-8 text-sm">
        <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:underline">
          Privacy Policy
        </button>
        <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:underline">
          Terms of Service
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-10 animate-bounce delay-500"></div>
    </div>
  );
};

export default SignInPage;