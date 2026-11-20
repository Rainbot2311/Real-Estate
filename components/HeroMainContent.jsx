import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import BuildingVisual from './BuildingVisual';
import PropertySearchForm from './PropertySearchForm';

/**
 * HeroMainContent Component
 * Composites the massive AVENZA display typography, central 3D villa,
 * left/right callouts, and docked property search bar.
 */
export const HeroMainContent = ({ onGetStarted, onExplore, onSearch }) => {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const titleCharsRef = useRef([]);
  const leftCalloutRef = useRef(null);
  const rightCalloutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Subheading fade & slide up
      gsap.fromTo(
        headlineRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
      );

      // 2. Split text animation on massive "AVENZA" letters
      if (titleCharsRef.current.length > 0) {
        gsap.fromTo(
          titleCharsRef.current,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2,
          }
        );
      }

      // 3. Left Callout entrance
      gsap.fromTo(
        leftCalloutRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      );

      // 4. Right Callout entrance
      gsap.fromTo(
        rightCalloutRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.55 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const titleLetters = ['A', 'V', 'E', 'N', 'Z', 'A'];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden pt-6 pb-20 select-none">
      {/* Centered Subheading */}
      <div className="text-center mb-1 md:mb-2 px-4 relative z-10">
        <p
          ref={headlineRef}
          className="text-base sm:text-lg md:text-xl font-medium text-neutral-800 tracking-tight"
        >
          Transforming the future of home living
        </p>
      </div>

      {/* Massive Background Display Typography */}
      <div
        className="w-full flex justify-center items-center pointer-events-none relative z-0 -mb-28 sm:-mb-36 md:-mb-44 lg:-mb-52"
        aria-hidden="true"
      >
        <h1 className="flex font-black tracking-[-0.04em] text-[18vw] leading-none text-[#1b1d20] select-none uppercase overflow-hidden">
          {titleLetters.map((char, index) => (
            <span
              key={index}
              ref={(el) => (titleCharsRef.current[index] = el)}
              className="inline-block transform-gpu will-change-transform"
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      {/* Stage: Central Villa & Side Callouts */}
      <div className="max-w-7xl mx-auto px-6 relative min-h-[460px] md:min-h-[540px] flex items-end justify-center">
        
        {/* Left Callout (Positioned Little Up to Bottom) */}
        <div
          ref={leftCalloutRef}
          className="absolute left-6 md:left-12 lg:left-16 bottom-24 md:bottom-28 z-20 max-w-[240px] text-left"
        >
          <div className="bg-transparent p-0 mb-4 flex flex-col gap-1.5">
            <span className="text-xs font-black tracking-widest uppercase text-black">REAL ESTATE</span>
            <p className="text-sm font-semibold text-black leading-snug">
              We offer luxury houses and modern apartments
            </p>
            <div className="flex items-center gap-4 mt-2.5 pt-2.5 border-t border-black/15">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black text-black leading-none counter-number" data-target="1250" data-suffix="+">1,250+</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black mt-1">Houses Sold</span>
              </div>
              <div className="w-[1px] h-8 bg-black/20" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black text-black leading-none counter-number" data-target="98" data-suffix="%">98%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black mt-1">Satisfaction</span>
              </div>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-full bg-[#ffe600] text-neutral-950 font-bold text-sm shadow-sm hover:shadow-md hover:bg-[#fedb00] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Get Started
          </button>
        </div>

        {/* Central 3D Architectural Villa (Overlays background typography) */}
        <BuildingVisual imageSrc="/assets/homelo-villa.png" />

        {/* Right Callout */}
        <div
          ref={rightCalloutRef}
          className="absolute right-6 md:right-12 lg:right-16 top-16 md:top-24 z-20 flex flex-col items-start gap-3"
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800/20 bg-white/70 backdrop-blur-md shadow-sm text-xs font-bold text-neutral-900 transition-all hover:border-neutral-900 hover:scale-105">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span>Modern Home</span>
          </div>

          {/* Sub Badges Row */}
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full border border-neutral-800/15 bg-white/60 backdrop-blur-md text-[11px] font-semibold text-neutral-800 transition-all hover:bg-white hover:scale-105">
              Luxury
            </span>
            <span className="px-3.5 py-1.5 rounded-full border border-neutral-800/15 bg-white/60 backdrop-blur-md text-[11px] font-semibold text-neutral-800 transition-all hover:bg-white hover:scale-105">
              Eco Friendly
            </span>
          </div>

          {/* Explore Link */}
          <button
            onClick={onExplore}
            className="mt-1 text-sm font-bold text-neutral-900 underline underline-offset-4 flex items-center gap-1.5 hover:text-neutral-600 transition-colors group"
          >
            <span>Explore</span>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Docked Property Search Form Component */}
      <div className="mt-4 md:mt-6">
        <PropertySearchForm onSearch={onSearch} />
      </div>
    </div>
  );
};

export default HeroMainContent;
