'use client';

import { useEffect, useState } from 'react';
import { FiEdit2, FiSettings } from 'react-icons/fi';
import { useUserStore } from '../stores/useUserStore';

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    gender: '',
    interests: '', // will be comma separated string
  });

  useEffect(() => {
    if (user) {
      const [firstName = '', lastName = ''] = user.full_name?.split(' ') || [];
      setForm({
        firstName,
        lastName,
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || '',
        interests: (user.interests || []).join(', '),
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({
      ...user,
      full_name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      age: form.age,
      gender: form.gender,
      interests: form.interests.split(',').map((i) => i.trim()).filter(Boolean),
    });
    setIsEditing(false);
    console.log('Saved:', form);
  };

  return (
    <main className="min-h-screen bg-white text-black px-4 md:px-12 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <FiSettings className="text-2xl cursor-pointer" />
      </div>

      <div className="bg-gray-100 p-6 rounded-lg flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 shadow">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-16 h-16 rounded-full bg-gray-300" />
          <div>
            <h2 className="text-lg font-bold">{user?.full_name || 'Your Name'}</h2>
            <p className="text-sm text-gray-600">{form.age ? `Age: ${form.age}` : ''}</p>
            <p className="text-sm text-gray-600">{form.gender}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition"
        >
          <FiEdit2 />
          Edit
        </button>
      </div>

      <section className="bg-gray-100 p-6 rounded-lg mb-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Personal Information</h3>
          <FiEdit2 className="cursor-pointer" onClick={() => setIsEditing(!isEditing)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName" 
            value={form.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="First Name"
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Last Name"
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Email address"
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Age"
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          <input
            name="interests"
            value={form.interests}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Interests (comma separated)"
            className="border border-gray-300 px-4 py-2 rounded w-full col-span-2"
          />
        </div>
      </section>

      {isEditing && (
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Save Information
        </button>
      )}
    </main>
  );
}
