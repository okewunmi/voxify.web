'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, UserPlus } from 'lucide-react';

const SignUpPage = () => {
  const router = useRouter();
  const [isChecked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.username) {
      alert('All fields are required.');
      return;
    }

    if (!isChecked) {
      alert('Please agree to the Terms & Conditions.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Your authentication logic here
      // const result = await createUser(form.email, form.password, form.username);
      
      // Simulate API call
      setTimeout(() => {
        alert('Account created successfully!');
        router.replace('/signIn');
        setIsSubmitting(false);
      }, 2000);
      
    } catch (error) {
      alert('Sign Up Failed: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-5 animate-bounce delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Join Voxify Today ✨
            </h1>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Sign up to unlock the full power of Voxify
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                What's your email address?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                How should we call you?
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Your awesome username"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Create a secure password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Make it strong & memorable"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500 mt-0.5"
              />
              <p className="text-sm text-gray-600 leading-relaxed">
                I agree to Voxify's{' '}
                <button
                  type="button"
                  onClick={() => router.push('/terms')}
                  className="text-violet-600 hover:text-violet-700 font-medium transition-colors hover:underline"
                >
                  Terms & Conditions
                </button>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isSubmitting || !isChecked}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create My Account</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sign In Link Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/signIn')}
              className="text-violet-600 hover:text-violet-700 font-semibold transition-colors hover:underline"
            >
              Sign in instead
            </button>
          </p>
        </div>

        {/* Decorative Line */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-gray-500">
                Secure • Private • AI-Powered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;