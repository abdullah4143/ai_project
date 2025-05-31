'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/stores/useUserStore';
import Link from 'next/link';
import {login} from '@/services/auth';


export default function Login() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user);
      router.push('/');
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    mutation.mutate({ email, password });
  };

  return (
    <main className="min-h-screen relative font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
      />

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-pink-50 p-10 py-30 rounded-md shadow-xl w-full max-w-md text-center">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
            Welcome Back
          </p>
          <h1 className="text-3xl font-semibold mb-8 text-pink-400">Hello, friend.</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border-b border-gray-300 py-2 px-1 outline-none bg-transparent placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b border-gray-300 py-2 px-1 outline-none bg-transparent placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-pink-400 text-white py-2 mt-2 hover:bg-gray-900 transition-all"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>


          <p className="mt-2 text-sm text-gray-500 text-center">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-black underline hover:text-gray-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
