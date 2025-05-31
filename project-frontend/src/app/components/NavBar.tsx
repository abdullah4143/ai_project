'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import { useUserStore } from '../stores/useUserStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NavBar() {
  const user = useUserStore((state) => state.user);
  const resetUser = useUserStore((state) => state.resetUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPinkBar, setShowPinkBar] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="border-b bg-white py-2 text-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="font-bold text-lg">
          <Link href="/" className="hover:opacity-80">
            Ink &amp; Quill
          </Link>
        </div>

        <div className="hidden sm:flex items-center space-x-6">
          <Link href="/blogs" className="hover:text-indigo-600">
            Blogs
          </Link>
          {user?.accessToken && (
            <>
              <Link href="/blogs/new" className="hover:text-indigo-600">
                Create Blog
              </Link>
              <Link href="/bookmarks" className="hover:text-indigo-600">
                Bookmarks
              </Link>
            </>
          )}
          <Image src="/globe.svg" alt="Logo" width={32} height={32} />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              if (!user?.accessToken) {
                router.push('/login');
              } else {
                setDropdownOpen((prev) => !prev);
              }
            }}
            className="flex items-center gap-1 hover:opacity-80"
          >
            <FaRegUserCircle className="text-xl" />
            {user?.full_name ? (
              <span className="hidden sm:inline font-medium">{user.full_name}</span>
            ) : (
              <span className="hidden sm:inline hover:underline">Sign In</span>
            )}
          </button>

          {dropdownOpen && user?.accessToken && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  router.push('/profile');
                  setDropdownOpen(false);
                }}
              >
                Profile
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  router.push('/blogs/new');
                  setDropdownOpen(false);
                }}
              >
                Create Blog
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  router.push('/settings');
                  setDropdownOpen(false);
                }}
              >
                Settings
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                onClick={() => {
                  resetUser();
                  router.push('/login');
                  setDropdownOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pink news bar */}
      {showPinkBar && (
        <div className="relative bg-pink-200 text-black flex space-x-4 overflow-x-auto px-4 py-1 text-sm font-semibold items-center">
          <span>March 24, 1976</span>
          <span>Hollywood Buzz</span>
          <button
            onClick={() => setShowPinkBar(false)}
            className="ml-auto text-black font-bold px-2 hover:text-gray-700"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white border-t py-2 px-4 flex flex-wrap gap-4 font-medium text-sm">
        <div className="flex w-full sm:hidden justify-start gap-4">
          {['LATEST', 'FEATURED', 'EXPLORE MORE'].map((item, idx) => (
            <span key={idx} className="cursor-pointer hover:underline">
              {item}
            </span>
          ))}
        </div>

        <div className="hidden sm:flex flex-wrap justify-center gap-4 w-full">
          {[
            'All',
            'Sports',
            'Technology',
            'Entertainment',
            'Health',
            'Science',
            'Business',
            'General',
          ].map((name, idx) => (
            <span
              key={idx}
              onClick={() => router.push(`/category/${name.toLowerCase()}`)}
              className="cursor-pointer hover:underline"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
