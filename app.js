/**
 * Avenza Real Estate — Core Interactive Engine
 * Integrates Lenis Smooth Scrolling with GSAP & ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Lenis Smooth Scrolling & GSAP Integration
  // =========================================================================
  let lenis;
  try {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
      });

      // Synchronize Lenis with GSAP ScrollTrigger with hardware acceleration
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.config({ autoSleep: 60, force3D: true });
        ScrollTrigger.config({ limitCallbacks: true, syncInterval: 100 });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(500, 33);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }
  } catch (e) {
    console.warn('Lenis could not initialize, falling back to standard scroll', e);
  }

  // =========================================================================
  // 2. GSAP Scroll & Entrance Animations
  // =========================================================================
  // =========================================================================
  // 2. Avenza GSAP Entrance & Split Text Animations
  // =========================================================================
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Subheading Reveal
    heroTl.fromTo(
      '.hero-subheading-text',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.1 }
    );

    // 2. Synchronized Hero Entrance: Background Typography ("AVENZA") and Foreground 3D Villa
    const splitChars = document.querySelectorAll('.hero-massive-title .split-char');
    if (splitChars.length > 0) {
      heroTl.fromTo(
        splitChars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.025,
          duration: 1.15,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }

    // 3. Central 3D Building Villa: Solid foreground entrance always in front of text
    heroTl.fromTo(
      '#building-parallax-box',
      { y: 50, scale: 0.97 },
      {
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      },
      '<'
    );

    // 4. Right Callout (when present)
    if (document.querySelector('#hero-right-callout')) {
      heroTl.fromTo(
        '#hero-right-callout',
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.8'
      );
    }

    // 5. Floating Property Search Form: Smooth entrance
    heroTl.fromTo(
      '#property-search-form-wrap',
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.7'
    );

    // 6. Workable Number Counter Animation on Load
    initNumberCounters();

    // =========================================================================
    // 3. Interactive 3D Parallax on Mouse Move (Depth effect)
    // =========================================================================
    const heroSection = document.getElementById('hero');
    const buildingBox = document.getElementById('building-parallax-box');
    const massiveTitle = document.querySelector('.hero-massive-title');

    if (heroSection && buildingBox) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const xNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const yNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        // Subtle 3D tilt and shift on the building
        gsap.to(buildingBox, {
          x: xNorm * 22,
          y: yNorm * 14,
          rotateY: xNorm * 4.5,
          rotateX: -yNorm * 3.5,
          duration: 0.8,
          ease: 'power2.out',
          transformPerspective: 1200,
        });

        // Slight opposing shift on the background typography for amplified parallax depth
        if (massiveTitle) {
          gsap.to(massiveTitle, {
            x: -xNorm * 12,
            y: -yNorm * 6,
            duration: 1,
            ease: 'power2.out',
          });
        }
      });

      heroSection.addEventListener('mouseleave', () => {
        gsap.to(buildingBox, {
          x: 0,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          duration: 1.2,
          ease: 'power2.out',
        });
        if (massiveTitle) {
          gsap.to(massiveTitle, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
          });
        }
      });
    }

    // ScrollTrigger Animations
    if (typeof ScrollTrigger !== 'undefined') {
      // 1. Hero-to-About Us Layered Curtain Cover Overlap Effect
      if (document.querySelector('#hero') && document.querySelector('#about')) {
        gsap.to('#hero .homelo-hero-container', {
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'top 30%',
            scrub: true,
          },
          scale: 0.96,
          opacity: 0.45,
          transformOrigin: 'center top',
          ease: 'none',
        });
      }

      // 2. Copenhagen About Us Section Text & Image Parallax Reveal
      if (document.querySelector('.about-section-copenhagen')) {
        gsap.from('.about-text-anim', {
          scrollTrigger: {
            trigger: '.about-section-copenhagen',
            start: 'top 75%',
          },
          y: 45,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
        });

        // Parallax scroll on staggered images
        gsap.to('#about-img-box-1', {
          scrollTrigger: {
            trigger: '.about-section-copenhagen',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -35,
          ease: 'none',
        });

        gsap.to('#about-img-box-2', {
          scrollTrigger: {
            trigger: '.about-section-copenhagen',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: 25,
          ease: 'none',
        });
      }

      // 3. How FIND Section Scroll Reveals
      if (document.querySelector('.how-find-section')) {
        const findItems = document.querySelectorAll('.how-find-item');
        if (findItems.length > 0) {
          gsap.from(findItems, {
            scrollTrigger: {
              trigger: '.how-find-section',
              start: 'top 75%',
              once: true,
            },
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          });
        }

        const supportCards = document.querySelectorAll('.support-card');
        if (supportCards.length > 0) {
          gsap.from(supportCards, {
            scrollTrigger: {
              trigger: '.support-cards-grid',
              start: 'top 85%',
              once: true,
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          });
        }
      }

      // =========================================================================
      // SCRAMBLE TEXT ANIMATION ENGINE (ScrollTrigger & Hover Triggers)
      // =========================================================================
      const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

      function scrambleElement(el, duration = 0.7) {
        if (!el || el.dataset.isScrambling === 'true') return;
        el.dataset.isScrambling = 'true';

        const targetText = el.dataset.originalText || el.textContent.trim();
        if (!el.dataset.originalText) {
          el.dataset.originalText = targetText;
        }

        let frame = 0;
        const fps = 40;
        const totalFrames = Math.floor((duration * 1000) / (1000 / fps));

        const interval = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          const revealCount = Math.floor(progress * targetText.length);

          let output = '';
          for (let i = 0; i < targetText.length; i++) {
            if (targetText[i] === ' ') {
              output += ' ';
            } else if (i < revealCount) {
              output += targetText[i];
            } else {
              output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
          }

          el.textContent = output;

          if (frame >= totalFrames) {
            clearInterval(interval);
            el.textContent = targetText;
            el.dataset.isScrambling = 'false';
          }
        }, 1000 / fps);
      }

      // Scroll-triggered Scramble on Headings & Badges
      const scrambleHeadings = document.querySelectorAll(
        '.about-title-display, .section-heading, .about-badge-tag, .hero-subheading-text'
      );
      scrambleHeadings.forEach((heading) => {
        ScrollTrigger.create({
          trigger: heading,
          start: 'top 85%',
          once: true,
          onEnter: () => scrambleElement(heading, 0.9),
        });
      });

      // Hover-triggered Scramble on Action Buttons (Excluding navigation links to avoid text glitches)
      const scrambleTargets = document.querySelectorAll(
        '.btn-contact-pill, .btn-get-started, .btn-copenhagen-pill, .btn-dark, .explore-link span, .psf-tab'
      );
      scrambleTargets.forEach((target) => {
        target.addEventListener('mouseenter', () => {
          scrambleElement(target, 0.45);
        });
      });

      // Active Section Tracker for Vertical Right Navigation Sidebar
      const vnavLinks = document.querySelectorAll('.vnav-link');
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              const secId = sec.getAttribute('id');
              vnavLinks.forEach((link) => {
                const isMatch = link.getAttribute('href') === `#${secId}` || link.dataset.section === secId;
                link.classList.toggle('active', isMatch);
              });
            }
          }
        });
      });

      // Featured Properties Cards Reveal
      if (document.querySelectorAll('.property-card').length > 0) {
        gsap.from('.property-card', {
          scrollTrigger: {
            trigger: '.property-grid',
            start: 'top 82%',
            once: true,
          },
          y: 50,
          opacity: 0,
          stagger: 0.14,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // Architectural Modular Cabin Banner Ultra-Smooth Damped Scroll Animation
      if (document.querySelector('.banner-stats-section')) {
        // 1. Reveal headline & text details with smooth inertia
        gsap.from('.banner-headline, .banner-left-info', {
          scrollTrigger: {
            trigger: '.banner-stats-section',
            start: 'top 75%',
            end: 'top 30%',
            scrub: 1.8,
          },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          ease: 'power3.out',
        });

        // 2. House Image: 2.5s smooth damped momentum (feels slow, heavy & ultra-luxurious)
        if (document.querySelector('#banner-cabin-img')) {
          gsap.fromTo('#banner-cabin-img', 
            { x: 400, opacity: 0, scale: 0.94 },
            {
              scrollTrigger: {
                trigger: '.banner-stats-section',
                start: 'top 75%',
                end: 'bottom 45%',
                scrub: 2.5,
              },
              x: 0,
              opacity: 1,
              scale: 1,
              ease: 'power3.out',
            }
          );
        }
      }

      // =========================================================================
      // 5. Cinematic Point-Expansion Full-Screen Scroll-Driven Slider Engine
      // Reusable GSAP + ScrollTrigger Point Reveal with Word-to-Word Floating Details
      // =========================================================================
      // =========================================================================
      // 5. Cinematic Point-Expansion Full-Screen Scroll-Driven Slider Engine
      // Reusable GSAP + ScrollTrigger Point Reveal with Word-to-Word Floating Details
      // =========================================================================
      function initPointExpansionSlider() {
        const section = document.querySelector('#point-expansion-showcase');
        if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const imageLayers = section.querySelectorAll('.pe-image-layer');
        const contentSlides = section.querySelectorAll('.pe-content-slide');

        const totalSlides = imageLayers.length;
        if (totalSlides === 0) return;

        // Configurable reveal origin (defaults to bottom center 50% 88%)
        const revealOrigin = {
          x: '50%',
          y: '88%'
        };

        // 1. Text Word-by-Word Splitter
        contentSlides.forEach((slide) => {
          const splitTargets = slide.querySelectorAll('.pe-title, .pe-subtitle');
          splitTargets.forEach((target) => {
            const text = target.textContent.trim().replace(/\s+/g, ' ');
            const words = text.split(' ');
            target.innerHTML = '';
            words.forEach((word) => {
              const wrap = document.createElement('span');
              wrap.className = 'pe-word-wrap';
              const span = document.createElement('span');
              span.className = 'pe-word';
              span.textContent = word;
              wrap.appendChild(span);
              target.appendChild(wrap);
            });
          });
        });

        // 2. Set Initial GSAP States
        imageLayers.forEach((layer, idx) => {
          const img = layer.querySelector('.pe-img');
          if (idx === 0) {
            gsap.set(layer, {
              clipPath: `circle(160% at ${revealOrigin.x} ${revealOrigin.y})`,
              zIndex: 1,
            });
            if (img) gsap.set(img, { scale: 1, filter: 'contrast(1.08) brightness(0.96) saturate(1.12)' });
          } else {
            gsap.set(layer, {
              clipPath: `circle(0% at ${revealOrigin.x} ${revealOrigin.y})`,
              zIndex: idx + 1,
            });
            if (img) gsap.set(img, { scale: 1.08, filter: 'contrast(1.08) brightness(0.96) saturate(1.12)' });
          }
        });

        contentSlides.forEach((slide, idx) => {
          const meta = slide.querySelector('.pe-meta-pill');
          const words = slide.querySelectorAll('.pe-word');
          const specs = slide.querySelector('.pe-inline-specs');
          if (idx === 0) {
            gsap.set(slide, { opacity: 1, visibility: 'visible' });
            if (meta) gsap.set(meta, { y: 0, opacity: 1 });
            if (words.length) gsap.set(words, { y: 0, opacity: 1, filter: 'none' });
            if (specs) gsap.set(specs, { y: 0, opacity: 1 });
          } else {
            gsap.set(slide, { opacity: 0, visibility: 'hidden' });
            if (meta) gsap.set(meta, { y: 25, opacity: 0 });
            if (words.length) gsap.set(words, { y: 30, opacity: 0, filter: 'none' });
            if (specs) gsap.set(specs, { y: 25, opacity: 0 });
          }
        });

        // 3. Master Scrubbed Scroll Timeline (Adaptive Scrub for Buttery Smooth Mobile Scroll)
        const isMobile = window.innerWidth <= 768;
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${(totalSlides - 1) * window.innerHeight * (isMobile ? 1.1 : 1.4)}`,
            pin: true,
            scrub: isMobile ? 0.6 : 1.0,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // 4. Build Reusable Transitions Between Adjacent Slides
        for (let i = 0; i < totalSlides - 1; i++) {
          const currLayer = imageLayers[i];
          const nextLayer = imageLayers[i + 1];
          const currImg = currLayer ? currLayer.querySelector('.pe-img') : null;
          const nextImg = nextLayer ? nextLayer.querySelector('.pe-img') : null;

          const currSlide = contentSlides[i];
          const nextSlide = contentSlides[i + 1];
          const currMeta = currSlide ? currSlide.querySelector('.pe-meta-pill') : null;
          const nextMeta = nextSlide ? nextSlide.querySelector('.pe-meta-pill') : null;
          const currWords = currSlide ? currSlide.querySelectorAll('.pe-word') : [];
          const nextWords = nextSlide ? nextSlide.querySelectorAll('.pe-word') : [];
          const currSpecs = currSlide ? currSlide.querySelector('.pe-inline-specs') : null;
          const nextSpecs = nextSlide ? nextSlide.querySelector('.pe-inline-specs') : null;

          const label = `trans_${i}`;
          masterTl.addLabel(label);

          // A. Expand Next Layer from origin circle(0% -> 160%)
          masterTl.fromTo(
            nextLayer,
            { clipPath: `circle(0% at ${revealOrigin.x} ${revealOrigin.y})` },
            {
              clipPath: `circle(160% at ${revealOrigin.x} ${revealOrigin.y})`,
              ease: 'power1.inOut',
              duration: 1.0,
            },
            label
          );

          // B. Next image zoom settle (1.08 -> 1.00)
          if (nextImg) {
            masterTl.fromTo(
              nextImg,
              { scale: 1.08 },
              { scale: 1.00, ease: 'power1.out', duration: 1.0 },
              label
            );
          }

          // C. Current image slight zoom out/depth (1.00 -> 1.05)
          if (currImg) {
            masterTl.to(
              currImg,
              { scale: 1.05, ease: 'power1.inOut', duration: 0.9 },
              label
            );
          }

          // Slide Container Visibility Transitions (autoAlpha toggles opacity + visibility)
          masterTl.to(currSlide, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, label);
          masterTl.fromTo(
            nextSlide,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.5,
              ease: 'power2.out',
              onStart: () => {
                currSlide.classList.remove('active');
                nextSlide.classList.add('active');
              },
              onReverseComplete: () => {
                nextSlide.classList.remove('active');
                currSlide.classList.add('active');
              }
            },
            `${label}+=0.25`
          );

          // D. Current slide text floats upward with blur & disappears
          if (currMeta) {
            masterTl.to(currMeta, { y: -20, opacity: 0, duration: 0.4, ease: 'power2.in' }, label);
          }
          if (currWords.length > 0) {
            masterTl.to(
              currWords,
              {
                y: -20,
                opacity: 0,
                stagger: 0.008,
                duration: 0.4,
                ease: 'power2.in',
              },
              label
            );
          }
          if (currSpecs) {
            masterTl.to(
              currSpecs,
              {
                y: -20,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
              },
              label
            );
          }

          // E. Next slide elements float upward smoothly word-by-word
          if (nextMeta) {
            masterTl.fromTo(
              nextMeta,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
              `${label}+=0.35`
            );
          }
          if (nextWords.length > 0) {
            masterTl.fromTo(
              nextWords,
              { y: 28, opacity: 0, filter: 'none' },
              {
                y: 0,
                opacity: 1,
                filter: 'none',
                stagger: 0.01,
                duration: 0.55,
                ease: 'power2.out',
              },
              `${label}+=0.3`
            );
          }
          if (nextSpecs) {
            masterTl.fromTo(
              nextSpecs,
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
              `${label}+=0.45`
            );
          }
        }
      }

      initPointExpansionSlider();

      // Lightweight, buttery-smooth reveal for key headings and content sections
      const revealItems = document.querySelectorAll('.section-header, .feature-card, .perk-item');
      if (revealItems.length > 0) {
        gsap.from(revealItems, {
          scrollTrigger: {
            trigger: revealItems[0],
            start: 'top 85%',
            once: true,
          },
          y: 25,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
        });
      }

      // Ultra-Smooth Word-by-Word On-Scroll Scrub Reveal for Banner Headline
      const headlineWords = document.querySelectorAll('#banner-headline-words .word');
      if (headlineWords.length > 0) {
        gsap.fromTo(headlineWords, 
          { y: 24, opacity: 0.15, filter: 'blur(5px)', scale: 0.98 },
          {
            scrollTrigger: {
              trigger: '.banner-headline-wrap',
              start: 'top 85%',
              end: 'top 25%',
              scrub: 1.8,
            },
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      // 7. Process Showcase — Ultra-Smooth Left-to-Right Curtain Reveal & Scroll-Linked Timeline
      const processSec = document.getElementById('process');
      const villaCard = document.querySelector('.process-villa-card');
      const statCards = document.querySelectorAll('.process-stat-card');
      const detailedBox = document.querySelector('.process-detailed-box');
      const timelineItems = document.querySelectorAll('.process-timeline-item');

      if (processSec && villaCard) {
        // Ultra-smooth GSAP Left-to-Right Curtain Expansion (Left edge stays anchored at 0)
        gsap.fromTo(
          villaCard,
          {
            clipPath: 'inset(0% 100% 0% 0%)',
            webkitClipPath: 'inset(0% 100% 0% 0%)',
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            webkitClipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: processSec,
              start: 'top 75%',
              once: true,
              onEnter: () => {
                villaCard.classList.add('is-revealed');
              },
            },
          }
        );

        // Gentle entrance for top pill and bottom glass caption as curtain unrolls
        const villaBadge = villaCard.querySelector('.villa-badge-pill');
        const villaGlass = villaCard.querySelector('.villa-bottom-glass');
        if (villaBadge && villaGlass) {
          gsap.fromTo(
            [villaBadge, villaGlass],
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              delay: 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: processSec,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }

        // Scroll-driven progression for each step as right side scrolls past the sticky image
        if (timelineItems.length > 0) {
          timelineItems.forEach((item, index) => {
            const dot = item.querySelector('.marker-dot');
            const badge = item.querySelector('.timeline-step-badge');

            // Phase 1 is pre-activated as default starting point
            if (index === 0) {
              item.classList.add('active');
              if (dot) dot.classList.add('is-active');
              if (badge) badge.classList.add('is-active');
            }

            ScrollTrigger.create({
              trigger: item,
              start: 'top 72%',
              onEnter: () => {
                item.classList.add('active');
                if (dot) dot.classList.add('is-active');
                if (badge) badge.classList.add('is-active');
                // Fill connecting line from previous phase
                if (index > 0) {
                  const prevLineFill = timelineItems[index - 1]?.querySelector('.marker-line-fill');
                  if (prevLineFill) {
                    gsap.to(prevLineFill, { scaleY: 1, duration: 0.5, ease: 'power2.out' });
                  }
                }
              },
              onLeaveBack: () => {
                if (index > 0) {
                  item.classList.remove('active');
                  if (dot) dot.classList.remove('is-active');
                  if (badge) badge.classList.remove('is-active');
                  const prevLineFill = timelineItems[index - 1]?.querySelector('.marker-line-fill');
                  if (prevLineFill) {
                    gsap.to(prevLineFill, { scaleY: 0, duration: 0.35, ease: 'power2.in' });
                  }
                }
              },
            });
          });
        }

        // Clean entrance for upper stat cards
        if (statCards.length > 0) {
          gsap.from(statCards, {
            scrollTrigger: {
              trigger: '.process-stats-row',
              start: 'top 85%',
              once: true,
            },
            y: 20,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          });
        }

        // Clean entrance for detailed methodology box
        if (detailedBox) {
          gsap.from(detailedBox, {
            scrollTrigger: {
              trigger: detailedBox,
              start: 'top 88%',
              once: true,
            },
            y: 24,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          });
        }
      }



      // Blog Guides Reveal
      if (document.querySelectorAll('.guide-card').length > 0) {
        gsap.from('.guide-card', {
          scrollTrigger: {
            trigger: '.guides-grid',
            start: 'top 82%',
            once: true,
          },
          y: 45,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        });
      }

      // 4. Footer Giant Angled Text Smooth Scroll Transition to Upright (Slower, Silky Smooth)
      const footerAngledTitle = document.getElementById('footer-angled-title');
      const footerSection = document.getElementById('footer');

      if (footerAngledTitle && footerSection) {
        gsap.fromTo(
          footerAngledTitle,
          { rotateX: 26, skewX: -16, scaleY: 1.22 },
          {
            rotateX: 0,
            skewX: 0,
            scaleY: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: footerSection,
              start: 'top 95%',
              end: 'bottom 85%',
              scrub: 2,
            },
          }
        );
      }

      // =========================================================================
      // 5. 3D Origami/Paper Fold Text Animation (Letter-by-Letter On Scroll)
      // =========================================================================
      function init3DFoldText(titleContainer, triggerSection) {
        if (!titleContainer || !triggerSection) return;
        const foldLines = titleContainer.querySelectorAll('.fold-line-inner');
        if (foldLines.length === 0) return;

        let charIdx = 0;
        foldLines.forEach((line) => {
          const rawText = line.getAttribute('data-fold') || line.textContent.trim();
          line.innerHTML = '';
          const words = rawText.split(' ');

          words.forEach((word) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'fold-word';

            const chars = word.split('');
            chars.forEach((ch) => {
              const charSpan = document.createElement('span');
              charSpan.className = 'fold-char';
              charSpan.textContent = ch;
              charSpan.style.transitionDelay = `${charIdx * 0.022}s`;
              wordSpan.appendChild(charSpan);
              charIdx++;
            });

            line.appendChild(wordSpan);
          });
        });

        let hasTriggered = false;
        function triggerFold() {
          if (hasTriggered) return;
          hasTriggered = true;
          const chars = titleContainer.querySelectorAll('.fold-char');
          chars.forEach((charEl) => {
            charEl.classList.add('folded-in');
          });
        }

        ScrollTrigger.create({
          trigger: triggerSection,
          start: 'top 75%',
          once: true,
          onEnter: triggerFold,
        });

        if ('IntersectionObserver' in window) {
          const obs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  triggerFold();
                  obs.disconnect();
                }
              });
            },
            { threshold: 0.15 }
          );
          obs.observe(triggerSection);
        }
      }

      // Initialize 3D Origami Fold for All Section Headlines
      const foldTitleConfigs = [
        { titleId: 'process-fold-title', sectionId: 'process' },
        { titleId: 'reviews-fold-title', sectionId: 'testimonials' },
        { titleId: 'banner-headline-words', sectionId: 'about' },
        { titleId: 'how-find-fold-title', sectionId: 'how-find' },
        { titleId: 'support-fold-title', sectionId: 'how-find' },
        { titleId: 'guides-fold-title', sectionId: 'guides' },
      ];

      foldTitleConfigs.forEach(({ titleId, sectionId }) => {
        const titleEl = document.getElementById(titleId);
        const sectionEl = document.getElementById(sectionId);
        if (titleEl && sectionEl) {
          init3DFoldText(titleEl, sectionEl);
        }
      });

      // Initialize Universal Curtain Image Reveal System (Matching Our Process Reveal)
      function initCurtainImageReveals() {
        const curtainBoxes = document.querySelectorAll('.curtain-reveal-box');
        if (curtainBoxes.length === 0) return;

        curtainBoxes.forEach((box) => {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
              trigger: box,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                box.classList.add('is-revealed');
                const innerImg = box.querySelector('.curtain-reveal-img');
                if (innerImg && typeof gsap !== 'undefined') {
                  gsap.to(innerImg, {
                    scale: 1,
                    duration: 1.5,
                    ease: 'power3.out',
                  });
                }
              },
            });
          }

          if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    box.classList.add('is-revealed');
                    obs.unobserve(box);
                  }
                });
              },
              { threshold: 0.15 }
            );
            obs.observe(box);
          }
        });
      }
      initCurtainImageReveals();

      // Initialize Float Word & Text Reveal System
      function initFloatWordReveals() {
        const floatTexts = document.querySelectorAll('.float-word-reveal');
        if (floatTexts.length === 0) return;

        if ('IntersectionObserver' in window) {
          const obs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('is-visible');
                  obs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.1 }
          );
          floatTexts.forEach((el) => obs.observe(el));
        } else {
          floatTexts.forEach((el) => el.classList.add('is-visible'));
        }
      }
      initFloatWordReveals();

      // Reviews section card/avatar entrance
      const reviewsSection = document.getElementById('testimonials');
      if (reviewsSection) {
        let hasReviewsTriggered = false;
        function triggerReviewsCards() {
          if (hasReviewsTriggered) return;
          hasReviewsTriggered = true;

          reviewsSection.classList.add('is-in-view');
          const allCards = document.querySelectorAll('.review-arc-card');
          allCards.forEach((card, cIdx) => {
            setTimeout(() => {
              card.classList.add('revealed-avatar');
            }, 250 + (cIdx % 6) * 120);
          });
        }

        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.create({
            trigger: reviewsSection,
            start: 'top 75%',
            once: true,
            onEnter: triggerReviewsCards,
          });
        }

        if ('IntersectionObserver' in window) {
          const cardObs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  triggerReviewsCards();
                  cardObs.disconnect();
                }
              });
            },
            { threshold: 0.2 }
          );
          cardObs.observe(reviewsSection);
        }
      }



      // =========================================================================
      // 6. Interactive Infinite 3D Arched Carousel System (Zero-Glitch Endless Loop)
      // =========================================================================
      function initVoicesArcReviews() {
        const viewport = document.getElementById('reviews-arc-viewport');
        const track = document.getElementById('reviews-arc-track');
        const prevBtn = document.getElementById('arc-prev-btn');
        const nextBtn = document.getElementById('arc-next-btn');
        const progressFill = document.getElementById('arc-progress-fill');
        const controls = document.querySelector('.reviews-arc-controls');

        if (!track || !viewport) return;

        const originalCards = Array.from(track.querySelectorAll('.review-arc-card'));
        const originalCount = originalCards.length;
        if (originalCount === 0) return;

        // 1. Prepare Letter-by-Letter Split Text for each Card's Quote
        function splitCardQuotes(cardElements) {
          cardElements.forEach((card) => {
            const quoteTarget = card.querySelector('.quote-text-target');
            if (quoteTarget && !quoteTarget.dataset.splitDone) {
              quoteTarget.dataset.splitDone = 'true';
              const text = quoteTarget.textContent.trim();
              quoteTarget.innerHTML = '';
              const words = text.split(' ');
              let charCount = 0;

              words.forEach((word) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'quote-word';

                const chars = word.split('');
                chars.forEach((ch) => {
                  const charSpan = document.createElement('span');
                  charSpan.className = 'quote-char';
                  charSpan.textContent = ch;
                  charSpan.style.transitionDelay = `${(charCount * 0.012)}s`;
                  wordSpan.appendChild(charSpan);
                  charCount++;
                });

                // Add trailing space for word separation
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'quote-char';
                spaceSpan.innerHTML = '&nbsp;';
                spaceSpan.style.transitionDelay = `${(charCount * 0.012)}s`;
                wordSpan.appendChild(spaceSpan);
                charCount++;

                quoteTarget.appendChild(wordSpan);
              });
            }
          });
        }

        splitCardQuotes(originalCards);

        originalCards.forEach((orig, idx) => {
          orig.dataset.originalIndex = String(idx);
        });

        // 2. Clone sets to build a continuous infinite ribbon
        // 7 sets: Set 0 (0..5), Set 1 (6..11), Set 2 (12..17), Set 3 (18..23 center), Set 4 (24..29), Set 5 (30..35), Set 6 (36..41)
        const TOTAL_SETS = 7;
        const CENTER_SET_INDEX = 3;
        const centerSetStart = CENTER_SET_INDEX * originalCount;

        for (let s = 1; s < TOTAL_SETS; s++) {
          originalCards.forEach((origCard, cIdx) => {
            const clone = origCard.cloneNode(true);
            clone.dataset.originalIndex = String(cIdx);
            clone.classList.remove('active');
            track.appendChild(clone);
          });
        }

        const allCards = Array.from(track.querySelectorAll('.review-arc-card'));
        splitCardQuotes(allCards);

        // Determine default starting card based on initial active card if present
        const defaultActiveCard = originalCards.find((c) => c.classList.contains('active'));
        const defaultOrigIndex = defaultActiveCard
          ? parseInt(defaultActiveCard.dataset.index || defaultActiveCard.dataset.originalIndex || '0', 10)
          : 0;
        let activeIndex = centerSetStart + defaultOrigIndex;

        let isAnimating = false;
        let animationSafetyTimer = null;

        function getNormalizedIndex(index) {
          const orig = ((index % originalCount) + originalCount) % originalCount;
          return centerSetStart + orig;
        }

        function updateArcLayout(animate = true) {
          if (!allCards[0]) return;
          const cardWidth = allCards[0].offsetWidth || parseFloat(window.getComputedStyle(allCards[0]).width) || 360;
          const computedGap = parseFloat(window.getComputedStyle(track).gap) || (window.innerWidth <= 900 ? 20 : 28);
          const trackPaddingLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || (window.innerWidth <= 900 ? 10 : 40);
          const cardStep = cardWidth + computedGap;

          const viewportWidth = viewport.offsetWidth || window.innerWidth;
          const centerPos = (viewportWidth / 2) - (cardWidth / 2) - (activeIndex * cardStep) - trackPaddingLeft;

          if (animate) {
            track.style.transition = 'transform 0.55s cubic-bezier(0.2, 1, 0.3, 1)';
          } else {
            track.style.transition = 'none';
          }
          track.style.transform = `translateX(${centerPos}px)`;

          allCards.forEach((card, i) => {
            const dist = i - activeIndex;
            const rot = dist * 1.2;
            const translateY = Math.abs(dist) * 4;
            const scale = Math.max(0.95, 1 - Math.abs(dist) * 0.02);
            const opacity = Math.max(0.88, 1 - Math.abs(dist) * 0.04);

            if (animate) {
              card.style.transition = 'transform 0.55s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
            } else {
              card.style.transition = 'none';
            }

            card.style.transform = `perspective(1200px) rotate(${rot}deg) translateY(${translateY}px) scale(${scale})`;
            card.style.opacity = String(opacity);

            card.classList.add('is-visible', 'revealed-text', 'revealed-avatar');

            if (i === activeIndex) {
              card.classList.add('active');
              card.setAttribute('aria-current', 'true');
            } else {
              card.classList.remove('active');
              card.removeAttribute('aria-current');
            }
          });

          if (!animate) {
            void track.offsetHeight;
          }

          if (progressFill) {
            const origActive = ((activeIndex % originalCount) + originalCount) % originalCount;
            const progressPercent = ((origActive + 1) / originalCount) * 100;
            progressFill.style.width = `${progressPercent}%`;
          }
        }

        function silentNormalize() {
          const normalized = getNormalizedIndex(activeIndex);
          if (normalized !== activeIndex) {
            activeIndex = normalized;
            updateArcLayout(false);
          }
        }

        function finishAnimation() {
          clearTimeout(animationSafetyTimer);
          animationSafetyTimer = null;
          isAnimating = false;
          silentNormalize();
        }

        function goToIndex(targetIndex, animate = true) {
          if (isAnimating) {
            finishAnimation();
          } else {
            silentNormalize();
          }

          activeIndex = targetIndex;

          if (animate) {
            isAnimating = true;
            updateArcLayout(true);

            clearTimeout(animationSafetyTimer);
            animationSafetyTimer = setTimeout(() => {
              finishAnimation();
            }, 600);
          } else {
            updateArcLayout(false);
            silentNormalize();
          }
        }

        track.addEventListener('transitionend', (e) => {
          if (e.target !== track || e.propertyName !== 'transform') return;
          finishAnimation();
        });

        function stepNext() {
          goToIndex(activeIndex + 1, true);
          resetAutoPlay();
        }

        function stepPrev() {
          goToIndex(activeIndex - 1, true);
          resetAutoPlay();
        }

        // Navigation Handlers
        if (prevBtn) {
          prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stepPrev();
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            stepNext();
          });
        }

        // Direct Card Click Focus
        let hasDragged = false;
        allCards.forEach((card) => {
          card.addEventListener('click', () => {
            if (hasDragged) return;

            if (isAnimating) {
              finishAnimation();
            } else {
              silentNormalize();
            }

            const clickedOrig = parseInt(card.dataset.originalIndex, 10);
            const currentOrig = ((activeIndex % originalCount) + originalCount) % originalCount;
            let diff = clickedOrig - currentOrig;
            if (diff > originalCount / 2) diff -= originalCount;
            if (diff < -originalCount / 2) diff += originalCount;

            if (diff !== 0) {
              goToIndex(activeIndex + diff, true);
              resetAutoPlay();
            }
          });
        });

        // Touch & Drag Swipe Handling
        let isDragging = false;
        let startX = 0;
        let diffX = 0;

        function handleDragStart(pageX) {
          isDragging = true;
          hasDragged = false;
          startX = pageX;
          diffX = 0;
          track.style.cursor = 'grabbing';
          stopAutoPlay();
        }

        function handleDragMove(pageX) {
          if (!isDragging) return;
          diffX = pageX - startX;
          if (Math.abs(diffX) > 8) {
            hasDragged = true;
          }
        }

        function handleDragEnd() {
          if (!isDragging) return;
          isDragging = false;
          track.style.cursor = 'grab';

          if (diffX < -40) {
            stepNext();
          } else if (diffX > 40) {
            stepPrev();
          } else if (hasDragged) {
            goToIndex(activeIndex, true);
          }
          diffX = 0;
          resetAutoPlay();
          setTimeout(() => {
            hasDragged = false;
          }, 50);
        }

        track.addEventListener('mousedown', (e) => {
          handleDragStart(e.pageX);
        });

        window.addEventListener('mousemove', (e) => {
          handleDragMove(e.pageX);
        });

        window.addEventListener('mouseup', () => {
          handleDragEnd();
        });

        track.addEventListener('touchstart', (e) => {
          handleDragStart(e.touches[0].pageX);
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
          handleDragMove(e.touches[0].pageX);
        }, { passive: true });

        track.addEventListener('touchend', () => {
          handleDragEnd();
        });

        // Accessibility & Keyboard navigation
        viewport.setAttribute('tabindex', '0');
        viewport.setAttribute('role', 'region');
        viewport.setAttribute('aria-roledescription', 'carousel');
        viewport.setAttribute('aria-label', 'Reviews Carousel');

        viewport.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stepPrev();
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            stepNext();
          }
        });

        // Automatic Smooth Infinite Carousel Cycle
        let autoPlayTimer = null;

        function startAutoPlay() {
          stopAutoPlay();
          autoPlayTimer = setInterval(() => {
            stepNext();
          }, 4500);
        }

        function stopAutoPlay() {
          if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
          }
        }

        function resetAutoPlay() {
          stopAutoPlay();
          startAutoPlay();
        }

        viewport.addEventListener('mouseenter', stopAutoPlay);
        viewport.addEventListener('mouseleave', startAutoPlay);
        if (controls) {
          controls.addEventListener('mouseenter', stopAutoPlay);
          controls.addEventListener('mouseleave', startAutoPlay);
        }

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            stopAutoPlay();
          } else {
            finishAnimation();
            updateArcLayout(false);
            startAutoPlay();
          }
        });

        let resizeDebounce = null;
        window.addEventListener('resize', () => {
          clearTimeout(resizeDebounce);
          resizeDebounce = setTimeout(() => {
            finishAnimation();
            updateArcLayout(false);
          }, 50);
        });

        // Initial setup
        updateArcLayout(false);
        startAutoPlay();

        // Secondary pass to guarantee alignment after webfonts settle
        setTimeout(() => updateArcLayout(false), 150);
      }

      initVoicesArcReviews();
    }
  }


  // =========================================================================
  // 4. Integrated Floating Search Form Filtering
  // =========================================================================
  const propertyCards = document.querySelectorAll('.property-card');
  const searchLocationInput = document.getElementById('search-location-input');
  const searchTypeSelect = document.getElementById('search-type');
  const searchBudgetSelect = document.getElementById('search-budget');
  const searchForm = document.getElementById('property-search-form');

  function filterProperties() {
    const location = (searchLocationInput?.value || '').toLowerCase().trim();
    const type = searchTypeSelect?.value || 'all';
    const budget = searchBudgetSelect?.value || 'all';

    let matchCount = 0;

    propertyCards.forEach((card) => {
      const cardType = card.dataset.category;
      const cardCity = (card.dataset.city || '').toLowerCase();
      const cardAddress = card.querySelector('.property-address').textContent.toLowerCase();
      const cardPrice = parseInt(card.dataset.price, 10);

      // Check conditions
      const matchesLocation = !location || cardCity.includes(location) || cardAddress.includes(location);
      const matchesType = type === 'all' || cardType === type;
      
      let matchesBudget = true;
      if (budget !== 'all') {
        const maxBudget = parseInt(budget, 10);
        matchesBudget = cardPrice <= maxBudget;
      }

      if (matchesLocation && matchesType && matchesBudget) {
        card.style.display = 'block';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (matchCount === 0) {
      showToast('No properties found matching criteria. Showing suggestions.');
    }
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filterProperties();
      // Smooth scroll down to how-find / featured section
      const featuredSec = document.getElementById('how-find') || document.getElementById('featured');
      if (featuredSec) {
        if (lenis) {
          lenis.scrollTo(featuredSec, { offset: -60 });
        } else {
          featuredSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
      showToast('Filters applied! Scrolling to matching residences.');
    });
  }

  // View All Properties Button
  const btnViewAllProps = document.getElementById('btn-view-all-props');
  if (btnViewAllProps) {
    btnViewAllProps.addEventListener('click', () => {
      // Reset filter and display all
      propertyCards.forEach((c) => (c.style.display = 'block'));
      showToast('Displaying all 6 featured properties.');
      btnViewAllProps.textContent = 'All Properties Displayed';
      btnViewAllProps.disabled = true;
      btnViewAllProps.style.opacity = '0.6';
    });
  }

  // =========================================================================
  // 5. 3D Staircase GSAP Scroll-Driven Showcase Engine
  // =========================================================================
  function init3DStaircaseSlider() {
    const section = document.querySelector('.staircase-section');
    if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = Array.from(section.querySelectorAll('.staircase-card'));
    const textCards = Array.from(section.querySelectorAll('.staircase-text-card'));
    const totalSlides = cards.length;
    if (totalSlides === 0) return;

    // Helper: returns 3D Round/Spiral Staircase Arc transform properties for a slot index `k`
    function getStaircaseTransform(k) {
      if (k < 0) {
        // Exit arc state: Card sweeps out UP, LEFT and FORWARD following the round spiral path
        return {
          x: -95,
          y: -170,
          z: 240,
          scale: 1.08,
          rotateZ: 9,
          rotateY: 14,
          rotateX: -6,
          opacity: 0,
          zIndex: 50
        };
      }

      // Visible Round Spiral Staircase slots:
      // Angles, arc curvature (y-offset curves up in an arch), Z-depth, roll (rotateZ), yaw (rotateY), and pitch (rotateX)
      const angleRad = k * 0.28; // Step angle on round stair
      const arcY = -Math.sin(angleRad) * 260 - (k * 20); // Curved vertical ascension like a spiral stair
      const arcX = Math.cos(angleRad) * 35 - 35 + (k * 38); // Horizontal curvature offset
      const arcZ = -k * 115; // Depth receding along spiral
      const rotateZ = -k * 4.5; // Tilts cards along the curve of the round stair
      const rotateY = -k * 7.5; // Rotates card inward along spiral radius
      const rotateX = k * 3.5;  // Slight pitch along stair inclination
      const scale = Math.max(0.62, 1 - k * 0.085);
      const opacity = Math.max(0, 1 - k * 0.18);
      const zIndex = 30 - k;

      return {
        x: arcX,
        y: arcY,
        z: arcZ,
        scale,
        rotateZ,
        rotateY,
        rotateX,
        opacity,
        zIndex
      };
    }

    // Set initial 3D layout positions for all cards & text cards
    cards.forEach((card, i) => {
      const t = getStaircaseTransform(i);
      gsap.set(card, {
        x: t.x,
        y: t.y,
        z: t.z,
        scale: t.scale,
        rotateZ: t.rotateZ,
        rotateY: t.rotateY,
        rotateX: t.rotateX,
        opacity: t.opacity,
        zIndex: t.zIndex,
        transformPerspective: 1400,
        transformOrigin: 'left bottom'
      });
    });

    textCards.forEach((text, i) => {
      if (i === 0) {
        gsap.set(text, { y: 0, opacity: 1, pointerEvents: 'auto', display: 'flex' });
      } else {
        gsap.set(text, { y: 40, opacity: 0, pointerEvents: 'none', display: 'none' });
      }
    });

    let activeIndex = 0;

    function updateCounter(index) {
      activeIndex = index;
      const currNumEl = document.getElementById('staircase-curr-num');
      if (currNumEl) {
        currNumEl.textContent = String(index + 1).padStart(2, '0');
      }
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Build Pinned ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalSlides - 1) * 1.25}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const step = 1 / (totalSlides - 1);
          const index = Math.min(totalSlides - 1, Math.round(self.progress / step));
          if (index !== activeIndex) {
            updateCounter(index);
          }
        }
      }
    });

    // Animate every transition step sequentially along the 3D round staircase arc
    for (let s = 0; s < totalSlides - 1; s++) {
      const timeOffset = s * 1.6;

      // Animate cards through 3D round stair slots
      cards.forEach((card, cardIdx) => {
        const toSlot = cardIdx - (s + 1);
        const targetTransform = getStaircaseTransform(toSlot);

        tl.to(card, {
          x: targetTransform.x,
          y: targetTransform.y,
          z: targetTransform.z,
          scale: targetTransform.scale,
          rotateZ: targetTransform.rotateZ,
          rotateY: targetTransform.rotateY,
          rotateX: targetTransform.rotateX,
          opacity: targetTransform.opacity,
          zIndex: targetTransform.zIndex,
          duration: 1.4,
          ease: 'power2.inOut'
        }, timeOffset);
      });

      // Synchronized Text Cards Transition
      const currentText = textCards[s];
      const nextText = textCards[s + 1];

      tl.to(currentText, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => {
          currentText.style.display = 'none';
          currentText.style.pointerEvents = 'none';
        },
        onReverseComplete: () => {
          currentText.style.display = 'flex';
          currentText.style.pointerEvents = 'auto';
        }
      }, timeOffset);

      tl.set(nextText, { display: 'flex' }, timeOffset + 0.4);

      tl.fromTo(nextText,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          onStart: () => { nextText.style.pointerEvents = 'auto'; },
          onReverseComplete: () => {
            nextText.style.pointerEvents = 'none';
            nextText.style.display = 'none';
          }
        },
        timeOffset + 0.5
      );
    }

    // Connect Navigation Arrow Buttons (Prev / Next) to ScrollTrigger Progress
    const prevBtn = document.getElementById('staircase-prev-btn');
    const nextBtn = document.getElementById('staircase-next-btn');

    function navigateToSlide(targetIdx) {
      if (targetIdx < 0 || targetIdx >= totalSlides) return;
      const st = tl.scrollTrigger;
      if (!st) return;

      const progressTarget = targetIdx / (totalSlides - 1);
      const targetScroll = st.start + (st.end - st.start) * progressTarget;

      if (window.lenis) {
        window.lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToSlide(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToSlide(activeIndex + 1);
      });
    }
  }

  // Initialize 3D Staircase slider
  init3DStaircaseSlider();

  // =========================================================================
  // 6. Testimonials Slider
  // =========================================================================
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  const testimonialDots = document.querySelectorAll('.dot-btn');
  let currentTestimonial = 0;
  let testimonialTimer = null;

  function setTestimonial(index) {
    if (!testimonialItems || testimonialItems.length === 0) return;
    testimonialItems.forEach((t) => t.classList.remove('active'));
    if (testimonialDots && testimonialDots.length > 0) {
      testimonialDots.forEach((d) => {
        d.classList.remove('active');
        d.setAttribute('aria-selected', 'false');
      });
    }

    currentTestimonial = (index + testimonialItems.length) % testimonialItems.length;
    if (testimonialItems[currentTestimonial]) {
      testimonialItems[currentTestimonial].classList.add('active');
    }
    if (testimonialDots[currentTestimonial]) {
      testimonialDots[currentTestimonial].classList.add('active');
      testimonialDots[currentTestimonial].setAttribute('aria-selected', 'true');
    }
  }

  if (testimonialDots.length > 0) {
    testimonialDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const slide = parseInt(dot.dataset.slide, 10);
        setTestimonial(slide);
        resetTestimonialTimer();
      });
    });
  }

  function startTestimonialTimer() {
    if (!testimonialItems || testimonialItems.length === 0) return;
    testimonialTimer = setInterval(() => {
      setTestimonial(currentTestimonial + 1);
    }, 7000);
  }

  function resetTestimonialTimer() {
    if (!testimonialItems || testimonialItems.length === 0) return;
    clearInterval(testimonialTimer);
    startTestimonialTimer();
  }

  if (testimonialItems.length > 0) {
    startTestimonialTimer();
  }

  // =========================================================================
  // 7. Favorite Button Toggle & Saved Count
  // =========================================================================
  const favoriteBtns = document.querySelectorAll('.favorite-btn');
  const savedCountEl = document.getElementById('saved-count');
  let savedCount = 0;

  favoriteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isFav = btn.classList.toggle('favorited');
      if (isFav) {
        savedCount++;
        showToast('Property added to your saved listings.');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(btn, { scale: 0.8 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1 });
        }
      } else {
        savedCount = Math.max(0, savedCount - 1);
        showToast('Property removed from saved listings.');
      }
      if (savedCountEl) savedCountEl.textContent = savedCount;
    });
  });

  // Clicking a property card opens the Detail Modal
  propertyCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.favorite-btn')) return;

      const title = card.querySelector('.property-title').textContent;
      const addr = card.querySelector('.property-address').textContent;
      const price = card.querySelector('.price-value').textContent + ' ' + card.querySelector('.price-unit').textContent;
      const type = card.dataset.category || 'Luxury Residence';
      const img = card.querySelector('.card-img').src;
      const amenities = Array.from(card.querySelectorAll('.amenity-item span')).map((s) => s.textContent).join(' • ');

      openPropertyDetail({
        title,
        addr,
        price,
        type,
        img,
        specs: amenities,
      });
    });
  });

  // Explore Cities cards click filter
  const cityCards = document.querySelectorAll('.city-card');
  cityCards.forEach((c) => {
    c.addEventListener('click', () => {
      const city = c.dataset.city;
      if (searchLocationSelect) {
        searchLocationSelect.value = city;
        filterProperties();
      }
      const featuredSec = document.getElementById('how-find') || document.getElementById('featured');
      if (featuredSec) {
        if (lenis) {
          lenis.scrollTo(featuredSec, { offset: -60 });
        } else {
          featuredSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
      showToast(`Showing verified luxury properties in ${city}.`);
    });
  });

  // =========================================================================
  // 8. Modals System (Submit, Auth, Advanced Filter, Property Detail)
  // =========================================================================
  const allModals = document.querySelectorAll('.modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    // Allow display before adding open class for CSS transition
    requestAnimationFrame(() => {
      modal.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => {
      modal.hidden = true;
    }, 300);
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  allModals.forEach((modal) => {
    // Backdrop click close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    // Close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  // Global ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach((m) => {
        if (!m.hidden) closeModal(m);
      });
    }
  });

  // Modal 1: Submit Property
  const submitPropModal = document.getElementById('submit-property-modal');
  const submitPropTriggers = document.querySelectorAll('.submit-prop-trigger');
  const submitPropForm = document.getElementById('submit-property-form');

  submitPropTriggers.forEach((btn) => {
    btn.addEventListener('click', () => openModal(submitPropModal));
  });

  if (submitPropForm) {
    submitPropForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('prop-input-title').value;
      closeModal(submitPropModal);
      submitPropForm.reset();
      showToast(`Thank you! "${title}" submitted for Avenza verification.`);
    });
  }

  // Modal 2: Auth Modal
  const authModal = document.getElementById('auth-modal');
  const authTriggers = document.querySelectorAll('.auth-trigger');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const groupFullname = document.getElementById('group-fullname');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authForm = document.getElementById('auth-form');

  authTriggers.forEach((btn) => {
    btn.addEventListener('click', () => openModal(authModal));
  });

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabLoginBtn.setAttribute('aria-selected', 'true');
      tabRegisterBtn.classList.remove('active');
      tabRegisterBtn.setAttribute('aria-selected', 'false');
      groupFullname.style.display = 'none';
      authSubmitBtn.textContent = 'Sign In to Avenza';
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabRegisterBtn.setAttribute('aria-selected', 'true');
      tabLoginBtn.classList.remove('active');
      tabLoginBtn.setAttribute('aria-selected', 'false');
      groupFullname.style.display = 'flex';
      authSubmitBtn.textContent = 'Create Avenza Account';
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      closeModal(authModal);
      showToast(`Welcome! Authenticated as ${email}`);
    });
  }

  // Modal 3: Advanced Filter
  const filterModal = document.getElementById('filter-modal');
  const openAdvancedFilterBtn = document.getElementById('open-advanced-filter');
  const filterChips = document.querySelectorAll('.filter-chip');
  const applyFilterBtn = document.getElementById('apply-filter-btn');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  if (openAdvancedFilterBtn) {
    openAdvancedFilterBtn.addEventListener('click', () => openModal(filterModal));
  }

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', () => {
      const activeChip = document.querySelector('.filter-chip.active');
      const cat = activeChip ? activeChip.dataset.cat : 'all';
      if (cat !== 'all') {
        propertyCards.forEach((c) => {
          c.style.display = c.dataset.category === cat ? 'block' : 'none';
        });
      } else {
        propertyCards.forEach((c) => (c.style.display = 'block'));
      }
      closeModal(filterModal);
      showToast(`Filter applied for category: ${cat}`);
    });
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      if (filterChips[0]) filterChips[0].classList.add('active');
      propertyCards.forEach((c) => (c.style.display = 'block'));
      closeModal(filterModal);
      showToast('Filters reset to default.');
    });
  }

  // Modal 4: Property Detail Quick View
  const propertyDetailModal = document.getElementById('property-detail-modal');
  const modalDetailImg = document.getElementById('modal-detail-img');
  const modalDetailType = document.getElementById('modal-detail-type');
  const modalDetailTitle = document.getElementById('modal-detail-title');
  const modalDetailAddr = document.getElementById('modal-detail-addr');
  const modalDetailPrice = document.getElementById('modal-detail-price');
  const modalDetailSpecs = document.getElementById('modal-detail-specs');
  const bookTourBtn = document.getElementById('book-tour-btn');
  const contactBrokerBtn = document.getElementById('contact-broker-btn');

  function openPropertyDetail(data) {
    if (!propertyDetailModal) return;
    if (modalDetailImg) modalDetailImg.src = data.img;
    if (modalDetailType) modalDetailType.textContent = data.type;
    if (modalDetailTitle) modalDetailTitle.textContent = data.title;
    if (modalDetailAddr) modalDetailAddr.textContent = data.addr;
    if (modalDetailPrice) modalDetailPrice.textContent = data.price;
    if (modalDetailSpecs) modalDetailSpecs.textContent = data.specs;

    openModal(propertyDetailModal);
  }

  if (bookTourBtn) {
    bookTourBtn.addEventListener('click', () => {
      closeModal(propertyDetailModal);
      showToast('Tour request received! An Avenza broker will contact you shortly.');
    });
  }

  if (contactBrokerBtn) {
    contactBrokerBtn.addEventListener('click', () => {
      closeModal(propertyDetailModal);
      showToast('Connecting you with the property manager...');
    });
  }

  // =========================================================================
  // 9. Newsletter Subscription Form
  // =========================================================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value;
      newsletterForm.reset();
      showToast(`Thank you for subscribing, ${email}!`);
    });
  }

  // =========================================================================
  // 10. Scroll To Top Button
  // =========================================================================
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 11. Mobile Navigation Menu Toggle
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking nav links on mobile
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          mainNav.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // =========================================================================
  // 12. Property Search Form — Tab Switching (For Rent / For Sale)
  // =========================================================================
  const psfTabs = document.querySelectorAll('.psf-tab');
  if (psfTabs.length) {
    psfTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        psfTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        // Store the active tab type for search filtering
        const form = document.getElementById('property-search-form');
        if (form) form.dataset.listingType = tab.dataset.tab;
      });
    });
  }

  // =========================================================================
  // 12. Global Toast Notification System
  // =========================================================================
  function showToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e4e95b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // =========================================================================
  // 13. Workable Animated Number Counters on Load
  // =========================================================================
  function initNumberCounters() {
    const counters = document.querySelectorAll('.counter-number, .stat-number');
    counters.forEach((el) => {
      const targetAttr = el.getAttribute('data-target');
      const textContent = el.textContent.trim();
      const targetNum = targetAttr ? parseInt(targetAttr, 10) : parseInt(textContent.replace(/[^\d]/g, ''), 10);
      const suffix = el.getAttribute('data-suffix') || (textContent.includes('%') ? '%' : textContent.includes('+') ? '+' : '');
      const prefix = el.getAttribute('data-prefix') || (textContent.includes('$') ? '$' : '');

      if (isNaN(targetNum)) return;

      const counterState = { count: 0 };
      if (typeof gsap !== 'undefined') {
        gsap.to(counterState, {
          count: targetNum,
          duration: 2.2,
          ease: 'power2.out',
          delay: 0.3,
          onUpdate: () => {
            const formatted = Math.floor(counterState.count).toLocaleString();
            el.textContent = prefix + formatted + suffix;
          },
        });
      } else {
        // Fallback smooth counter animation via requestAnimationFrame
        const startTime = performance.now();
        const duration = 2000;
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * targetNum);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = prefix + targetNum.toLocaleString() + suffix;
          }
        }
        requestAnimationFrame(updateCounter);
      }
    });
  }

  // Expose showToast globally
  window.showToast = showToast;
  window.initNumberCounters = initNumberCounters;

  // Refresh ScrollTrigger after window images load to ensure perfect trigger coordinates
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
});
