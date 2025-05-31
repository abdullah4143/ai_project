'use client'; // Only needed for App Router

import { useState } from 'react';
import { MailIcon } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v4m0 0h6m-6 0a2 2 0 01-2-2v-2a2 2 0 012-2h6" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email to reset your password.
        </p>
        <form className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <MailIcon className="h-4 w-4" />
            </span>
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-500">
          Don’t have access anymore?{' '}
          <a href="#" className="text-black underline hover:text-gray-700">
            Try another method
          </a>
        </div>
      </div>
    </div>
  );
}
