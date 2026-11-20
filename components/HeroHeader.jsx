import React from 'react';

/**
 * HeroHeader Component
 * Modern minimalist navbar with AVENZA brand logo, navigation links, and dark pill CTA button.
 */
export const HeroHeader = ({ onContactClick }) => {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between relative z-30">
      {/* Brand Logo */}
      <a href="#" className="flex items-center gap-3 group" aria-label="AVENZA Home">
        <div className="w-9 h-9 rounded-xl bg-[#ffe600] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
          <svg
            className="w-5 h-5 text-neutral-900"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className="font-extrabold text-2xl tracking-tight text-neutral-900">
          AVENZA
        </span>
      </a>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-neutral-700" aria-label="Main Navigation">
        <a href="#home" className="text-neutral-950 font-semibold hover:text-neutral-900 transition-colors">
          Home
        </a>
        <a href="#about" className="hover:text-neutral-950 transition-colors">
          About
        </a>
        <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
          How It Works
        </a>
        <a href="#properties" className="hover:text-neutral-950 transition-colors">
          Properties
        </a>
        <a href="#faqs" className="hover:text-neutral-950 transition-colors">
          FAQs
        </a>
      </nav>

      {/* Right Action Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onContactClick}
          className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          Contact Us
        </button>
      </div>
    </header>
  );
};

export default HeroHeader;
