import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * PropertySearchForm Component
 * Floating elevated glassmorphic property filter card docked at the bottom of the Hero section.
 */
export const PropertySearchForm = ({ onSearch }) => {
  const formRef = useRef(null);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    // Delayed upward entrance animation matching requirements
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          delay: 0.45,
        }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ location, propertyType, priceRange });
    }
  };

  return (
    <div
      ref={formRef}
      className="w-full max-w-5xl mx-auto px-4 relative z-30 transform-gpu"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl md:rounded-full p-3 md:p-3.5 md:pl-8 shadow-[0_20px_50px_rgba(30,30,40,0.12)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-3 transition-all duration-300 hover:shadow-[0_24px_55px_rgba(30,30,40,0.16)]"
      >
        {/* Field 1: Location */}
        <div className="flex-1 flex items-center gap-3 px-3 py-1">
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="search-loc" className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Location
            </label>
            <input
              id="search-loc"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, area or address..."
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-8 bg-neutral-200" />

        {/* Field 2: Property Type */}
        <div className="flex-1 flex items-center gap-3 px-3 py-1">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="search-type" className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Property Type
            </label>
            <select
              id="search-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Residences</option>
              <option value="modern-villa">Modern Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="luxury-suite">Luxury Suite</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-8 bg-neutral-200" />

        {/* Field 3: Price Range */}
        <div className="flex-1 flex items-center gap-3 px-3 py-1">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="search-price" className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Price Range
            </label>
            <select
              id="search-price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Any Price</option>
              <option value="under-1m">$500,000 - $1,000,000</option>
              <option value="1m-2.5m">$1,000,000 - $2,500,000</option>
              <option value="2.5m-5m">$2,500,000 - $5,000,000</option>
              <option value="above-5m">$5,000,000+</option>
            </select>
          </div>
        </div>

        {/* Submit Search CTA */}
        <button
          type="submit"
          className="px-7 py-3.5 bg-neutral-950 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default PropertySearchForm;
