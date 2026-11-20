import React from 'react';
import HeroHeader from './HeroHeader';
import HeroMainContent from './HeroMainContent';

/**
 * HomeloHero Master Container Component
 * Renders the full modern hero section matching the AVENZA design.
 * Features warm fluid cream background, subtle ambient gradient waves,
 * massive display typography, 3D villa parallax, and bottom floating search card.
 */
export const HomeloHero = ({
  onContactClick,
  onGetStarted,
  onExplore,
  onSearch,
}) => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#fbf8f3] via-[#f5efe4] to-[#ede3d1] text-neutral-900 overflow-hidden flex flex-col justify-between">
      {/* Subtle Fluid Background Waves & Glows Matching Reference Image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-amber-100/50 blur-[130px] rounded-full" />
        
        {/* Organic Curved Fluid Lines SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-45"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 280 C 200 180, 450 350, 750 240 C 1050 130, 1300 280, 1550 200"
            stroke="#deb887"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <path
            d="M-50 420 C 250 320, 500 480, 800 380 C 1100 280, 1350 420, 1600 340"
            stroke="#deb887"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
          <path
            d="M-120 180 C 180 80, 520 220, 880 150 C 1200 80, 1400 210, 1620 160"
            stroke="#e6ca9f"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      {/* 1. Header / Navbar Component */}
      <HeroHeader onContactClick={onContactClick} />

      {/* 2. Hero Core Layer with 3D Building & Integrated Property Search Form */}
      <HeroMainContent
        onGetStarted={onGetStarted}
        onExplore={onExplore}
        onSearch={onSearch}
      />
    </section>
  );
};

export default HomeloHero;
