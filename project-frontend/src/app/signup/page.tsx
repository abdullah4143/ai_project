"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/app/stores/useUserStore';
import { signup } from '@/services/auth';
import Link from 'next/link';

const categories = [
  'Sports', 'Technology', 'Entertainment', 'Health', 'Science', 'Business', 'General'
];

export default function Signup() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    age: '',
    gender: '',
    interests: [] as string[],
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    full_name: '',
    age: '',
    gender: '',
    interests: '',
    password: '',
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setUser({
        username: formData.email,
        full_name: formData.full_name,
        interests: formData.interests,
        email: formData.email,
        gender: formData.gender,
        age: formData.age,
        accessToken: data.accessToken,
      });
      router.push('/');
    },
    onError: () => {
      setErrors(prev => ({ ...prev, email: 'Signup failed. Try again.' }));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const toggleInterest = (interest: string) => {
    let updated = [...formData.interests];
    if (updated.includes(interest)) {
      updated = updated.filter(i => i !== interest);
    } else if (updated.length < 3) {
      updated.push(interest);
    }
    setFormData({ ...formData, interests: updated });
    setErrors({ ...errors, interests: '' });
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { ...errors };

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, alphanumeric and contain a special character.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    mutate({
      email: formData.email,
      full_name: formData.full_name,
      age: formData.age,
      gender: formData.gender,
      interests: formData.interests,
      password: formData.password,
    });
  };

  const steps = ['Email', 'Profile', 'Interests', 'Password'];

  return (
    <div className="min-h-screen flex items-center justify-center font-serif transition-all duration-700">
      <div className="max-w-md w-full p-10 py-30 bg-pink-50 rounded-lg shadow-lg">
        <h1 className="text-3xl text-pink-700 font-bold text-center mb-6">Join Our Vintage Circle</h1>

        <div className="flex justify-between items-center mb-6">
          {steps.map((label, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = step > stepNumber;
            const isActive = step === stepNumber;

            return (
              <button
                key={label}
                disabled={!isCompleted && !isActive}
                onClick={() => isCompleted && setStep(stepNumber)}
                className={`flex-1 text-center py-1 px-2 text-sm rounded-full mx-1
                  ${isActive ? 'font-bold underline text-pink-600' : ''}
                  ${isCompleted ? 'text-pink-500 hover:underline' : 'text-pink-400 cursor-not-allowed'}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-700">
          {step === 1 && (
            <>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full p-2 border border-pink-400 rounded  placeholder:text-black"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <button
                type="button"
                onClick={() => {
                  if (!formData.email.includes('@')) {
                    setErrors(prev => ({ ...prev, email: 'Please enter a valid email.' }));
                  } else {
                    setStep(2);
                  }
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white p-2 rounded"
              >
                Continue
              </button>


               <p className="mt-2 text-sm text-gray-500 text-center">
            Already have an Account?{' '}
            <Link href="/login" className="text-black underline hover:text-gray-700">
              Login
            </Link>
          </p>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full p-2 border border-pink-400 rounded bg-pink-100 placeholder:text-gray-800"
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
                className="w-full p-2 border border-pink-400 rounded bg-pink-100 placeholder:text-gray-800"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full p-2 border border-pink-400 rounded bg-pink-100 text-gray-800"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              <button
                type="button"
                onClick={() => {
                  const newErrors = { ...errors };
                  if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
                  if (!formData.age || parseInt(formData.age) < 13) newErrors.age = 'You must be at least 13 years old.';
                  if (!formData.gender) newErrors.gender = 'Please select a gender.';

                  if (newErrors.full_name || newErrors.age || newErrors.gender) {
                    setErrors(newErrors);
                  } else {
                    setStep(3);
                  }
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white p-2 rounded"
              >
                Continue
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-pink-700 font-semibold">Select 3 Interests:</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleInterest(cat)}
                    className={`p-2 border border-pink-400 rounded ${formData.interests.includes(cat) ? ' bg-pink-100 text-pink-800' : 'bg-white text-black'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
              {formData.interests.length === 3 && (
                <button type="button" onClick={() => setStep(4)} className="w-full bg-pink-500 hover:bg-pink-600 text-white p-2 rounded mt-4">
                  Continue
                </button>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a strong password"
                required
                className="w-full p-2 border border-pink-400 rounded bg-pink-100 placeholder:text-pink-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <button type="submit" disabled={isLoading} className="w-full bg-pink-600 hover:bg-pink-700 text-white p-2 rounded">
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
