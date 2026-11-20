import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * BuildingVisual Component
 * Modern architectural 3D building cutout layered over background typography
 * Features subtle interactive mouse parallax and initial load entrance.
 */
export const BuildingVisual = ({ imageSrc = '/assets/homelo-villa.png' }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation - slow, smooth, opaque rise (no opacity fade to prevent text showing through)
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { y: 200, scale: 0.95 },
        {
          y: 0,
          scale: 1,
          duration: 2.4,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }

    // Interactive 3D mouse parallax
    const handleMouseMove = (e) => {
      if (!imageRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(imageRef.current, {
        x: xNorm * 22,
        y: yNorm * 14,
        rotateY: xNorm * 4,
        rotateX: -yNorm * 3,
        duration: 0.8,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    };

    const handleMouseLeave = () => {
      if (!imageRef.current) return;
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        rotateY: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-20 flex items-end justify-center pointer-events-auto w-full max-w-[840px] md:max-w-[940px] lg:max-w-[1140px] mx-auto"
      style={{ perspective: '1200px', transformOrigin: 'center bottom' }}
    >
      {/* 80% Visible Height Window - bottom 20% is hidden, touching bottom flush */}
      <div className="relative w-full aspect-[10/8] overflow-hidden flex items-start justify-center">
        {/* Grounding Ambient Drop Shadow */}
        <div className="absolute bottom-0 w-[80%] max-w-lg h-12 bg-black/20 blur-2xl rounded-full pointer-events-none transform scale-y-50 z-[1]" />

        {/* Modern 3D Villa Subject (Enlarged and Animated) */}
        <div ref={imageRef} className="relative w-full will-change-transform transform-gpu">
          <img
            src={imageSrc}
            alt="Avenza luxury modern architectural glass villa"
            className="w-full aspect-square object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] select-none [clip-path:inset(0_0_20%_0)]"
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
};

export default BuildingVisual;
