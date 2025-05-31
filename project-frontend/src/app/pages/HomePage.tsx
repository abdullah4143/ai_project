"use client";

import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import BlogSection from "../components/BlogSection";
import CategoryListWithLoadMore from "../components/CategoryListWithLoadMore";

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900 scroll-auto">
      <NavBar />
      <HeroSection />
      <BlogSection />
      <CategoryListWithLoadMore />
    </div>
  );
}
