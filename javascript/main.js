// ============================================
// INTRO OVERLAY HANDLER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const introOverlay = document.getElementById('introOverlay');
    
    if (introOverlay) {
        // Hide overlay after animation completes
        setTimeout(() => {
            introOverlay.classList.add('hidden');
        }, 2800);
        
        // Remove from DOM after transition
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 3500);
    }
});

// ============================================
// HERO INTERACTIVE EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Mouse tracking for shapes only - subtle parallax effect
    const hero = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.hero__shape');
    const glowLines = document.querySelectorAll('.hero__glow-line');
    
    // Wait for intro animation to complete before enabling parallax
    setTimeout(() => {
        if (hero && shapes.length > 0) {
            let mouseX = 0;
            let mouseY = 0;
            let currentX = 0;
            let currentY = 0;
            
            hero.addEventListener('mousemove', function(e) {
                const rect = hero.getBoundingClientRect();
                mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
                mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
            });
            
            function animateElements() {
                // Smooth interpolation
                currentX += (mouseX - currentX) * 0.03;
                currentY += (mouseY - currentY) * 0.03;
                
                // Animate floating shapes with parallax (preserve scale from animation)
                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 12;
                    const x = currentX * speed;
                    const y = currentY * speed;
                    const baseRotation = shape.classList.contains('hero__shape--diamond') ? 45 : 0;
                    shape.style.transform = `translate(${x}px, ${y}px) rotate(${baseRotation}deg) scale(1)`;
                });
                
                // Subtle parallax on glow lines
                glowLines.forEach((line, index) => {
                    const speed = (index + 1) * 5;
                    const x = currentX * speed;
                    const baseRotation = index === 0 ? -45 : 30;
                    line.style.transform = `translateX(${x}px) rotate(${baseRotation}deg)`;
                });
                
                requestAnimationFrame(animateElements);
            }
            
            animateElements();
        }
    }, 3500); // Start after intro animation
    
    // Intersection Observer for stats animation
    const statCards = document.querySelectorAll('.hero__stat-card');
    if (statCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.5 });
        
        statCards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }
    
    // Animate numbers on stat cards
    const statNumbers = document.querySelectorAll('.hero__stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        const suffix = finalValue.replace(/[0-9]/g, '');
        
        let currentValue = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            currentValue = Math.floor(numericValue * easeOutQuart);
            
            stat.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        // Start animation when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateNumber);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
});

// ============================================
// VIDEO MODAL FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const videoPlayBtn = document.querySelector('.hero__video-btn');
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.querySelector('.video-modal__close');
    const videoModalOverlay = document.querySelector('.video-modal__overlay');
    const video = document.querySelector('.video-modal__video');

    // Open modal
    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', function() {
            if (videoModal) {
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Play video when modal opens
                if (video) {
                    setTimeout(() => {
                        video.play();
                    }, 300);
                }
            }
        });
    }

    // Close modal function
    function closeModal() {
        if (videoModal) {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            // Pause video when modal closes
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    }

    // Close on button click
    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeModal);
    }

    // Close on overlay click
    if (videoModalOverlay) {
        videoModalOverlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // ============================================
    // GSAP SCROLL TRIGGER - PROGRAMS SECTION
    // AWWWARDS STYLE SCROLL-DRIVEN ANIMATIONS
    // ============================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const programsSection = document.querySelector('.programs');
        
        if (programsSection) {
            
            // ============================================
            // HEADER - SCROLL SCRUB REVEAL
            // Animation completes as section becomes fully visible
            // ============================================
            
            // Label - Scroll driven fade in
            const programsLabel = programsSection.querySelector('.programs__label');
            if (programsLabel) {
                gsap.fromTo(programsLabel,
                    {
                        opacity: 0,
                        y: 40,
                        filter: 'blur(10px)'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 40%',
                            scrub: 1
                        }
                    }
                );
            }
            
            // Title - Dramatic scroll reveal with clip-path
            const programsTitle = programsSection.querySelector('.programs__title');
            if (programsTitle) {
                gsap.fromTo(programsTitle,
                    {
                        opacity: 0,
                        y: 80,
                        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 35%',
                            scrub: 1.2
                        }
                    }
                );
            }
            
            // Description - Fade and slide
            const programsDesc = programsSection.querySelector('.programs__description');
            if (programsDesc) {
                gsap.fromTo(programsDesc,
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 30%',
                            scrub: 1
                        }
                    }
                );
            }
            
            // ============================================
            // PROGRAMS HEADER - ENTRANCE ANIMATION
            // ============================================
            const programsHeader = programsSection.querySelector('.programs__header');
            if (programsHeader) {
                gsap.fromTo(programsHeader,
                    { 
                        opacity: 0, 
                        y: 60 
                    },
                    {
                        opacity: 1,
                        y: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsHeader,
                            start: 'top bottom',
                            end: 'bottom bottom',
                            scrub: 0.6
                        }
                    }
                );
                
                // Staggered inner elements
                const headerElements = [
                    programsHeader.querySelector('.programs__header-label'),
                    programsHeader.querySelector('.programs__header-title'),
                    programsHeader.querySelector('.programs__header-desc')
                ].filter(Boolean);
                
                headerElements.forEach((el, i) => {
                    gsap.fromTo(el,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: programsHeader,
                                start: `top+=${i * 20} bottom`,
                                end: 'bottom bottom',
                                scrub: 0.5
                            }
                        }
                    );
                });
            }
            
            // ============================================
            // PROGRAM ACCORDIONS - BLUR REVEAL ANIMATION
            // Characters appear from left to right with blur effect
            // ============================================
            const programAccordions = document.querySelectorAll('.program-accordion');
            
            programAccordions.forEach((accordion, index) => {
                const header = accordion.querySelector('.program-accordion__header');
                const panel = accordion.querySelector('.program-accordion__panel');
                const titleEl = accordion.querySelector('.program-row__title');
                const descEl = accordion.querySelector('.program-row__desc');
                const indicator = accordion.querySelector('.program-row__indicator');
                const content = accordion.querySelector('.program-row__content');
                const toggle = accordion.querySelector('.program-accordion__toggle');
                
                // Accordion toggle functionality
                if (header) {
                    header.addEventListener('click', () => {
                        const isActive = accordion.classList.contains('active');
                        
                        // Close all other accordions
                        programAccordions.forEach(acc => {
                            if (acc !== accordion) {
                                acc.classList.remove('active');
                            }
                        });
                        
                        // Toggle current accordion
                        accordion.classList.toggle('active');
                    });
                }
                
                // Split text into words for blur reveal effect
                if (titleEl) {
                    const titleText = titleEl.textContent;
                    const words = titleText.split(' ');
                    titleEl.innerHTML = words.map((word, wordIndex) => 
                        `<span class="word" style="transition-delay: ${wordIndex * 0.1}s">${word}</span>`
                    ).join(' ');
                }
                
                if (descEl) {
                    const descText = descEl.textContent;
                    const words = descText.split(' ');
                    descEl.innerHTML = words.map((word, wordIndex) => 
                        `<span class="word" style="transition-delay: ${(wordIndex * 0.03) + 0.15}s">${word}</span>`
                    ).join(' ');
                }
                
                // Create ScrollTrigger for each accordion
                ScrollTrigger.create({
                    trigger: accordion,
                    start: 'top 85%',
                    end: 'bottom 60%',
                    onEnter: () => {
                        accordion.classList.add('revealed');
                    },
                    onLeaveBack: () => {
                        accordion.classList.remove('revealed');
                    }
                });
                
                // Indicator animation with GSAP
                if (indicator) {
                    gsap.fromTo(indicator,
                        { 
                            scale: 0, 
                            opacity: 0,
                            rotate: -90
                        },
                        {
                            scale: 1,
                            opacity: 1,
                            rotate: 0,
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: accordion,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                }
                
                // Content blur reveal with GSAP
                if (content) {
                    gsap.fromTo(content,
                        {
                            opacity: 0,
                            x: -60,
                            filter: 'blur(20px)'
                        },
                        {
                            opacity: 1,
                            x: 0,
                            filter: 'blur(0px)',
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: accordion,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                }
                
                // Toggle button animation
                if (toggle) {
                    gsap.fromTo(toggle,
                        {
                            opacity: 0,
                            scale: 0.5,
                            rotate: -90
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            duration: 0.6,
                            delay: 0.2,
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: accordion,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                }
            });
            
            // ============================================
            // BACKGROUND PARALLAX - SUBTLE DEPTH
            // ============================================
            gsap.to('.programs__orb--1', {
                y: -50,
                opacity: 0.3,
                ease: 'none',
                    scrollTrigger: {
                        trigger: programsSection,
                        start: 'top bottom',
                        end: 'bottom top',
                    scrub: 2
                }
            });
            
            gsap.to('.programs__orb--2', {
                y: 40,
                opacity: 0.4,
                ease: 'none',
                scrollTrigger: {
                    trigger: programsSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
            
            // ============================================
            // DECORATIVE ELEMENTS ANIMATION
            // ============================================
            
            // Pattern reveal - completes when section is fully visible
            const pattern = programsSection.querySelector('.programs__pattern');
            if (pattern) {
                gsap.fromTo(pattern,
                    { opacity: 0, scale: 0.8 },
                    {
                        opacity: 0.4,
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 20%',
                            scrub: 1.5
                        }
                    }
                );
            }
            
            // Deco blobs animation
            const decoElements = programsSection.querySelectorAll('.programs__deco');
            decoElements.forEach((deco, index) => {
                gsap.fromTo(deco,
                    { 
                        opacity: 0, 
                        scale: 0.5,
                        x: index % 2 === 0 ? -50 : 50
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 20%',
                            scrub: 1
                        }
                    }
                );
                
                // Parallax on scroll
                gsap.to(deco, {
                    y: index % 2 === 0 ? -60 : 60,
                    rotation: index % 2 === 0 ? 10 : -10,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: programsSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2
                    }
                });
            });
            
            // Geometric shapes animation
            const geoElements = programsSection.querySelectorAll('.programs__geo');
            geoElements.forEach((geo, index) => {
                gsap.fromTo(geo,
                    {
                        opacity: 0,
                        scale: 0,
                        rotation: -45
                    },
                    {
                        opacity: index === 0 ? 0.15 : 0.12,
                        scale: 1,
                        rotation: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 30%',
                            scrub: 1
                        }
                    }
                );
            });
            
            // Circles animation
            const circles = programsSection.querySelectorAll('.programs__circle');
            circles.forEach((circle, index) => {
                gsap.fromTo(circle,
                    { 
                        opacity: 0,
                        scale: 0
                    },
                    {
                        opacity: 0.6 - index * 0.1,
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: programsSection,
                            start: 'top bottom',
                            end: 'top 30%',
                            scrub: 0.8
                        }
                    }
                );
                
                // Floating parallax
                gsap.to(circle, {
                    y: -30 - index * 10,
                    x: index % 2 === 0 ? 20 : -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: programsSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                });
            });
        }
        
        // ============================================
        // GALLERY CINEMATIC MARQUEE ANIMATIONS
        // ============================================
        const gallerySection = document.querySelector('.gallery');
        if (gallerySection) {
            
            // Giant heading words - 3D reveal
            const headingWords = gallerySection.querySelectorAll('.gallery__heading-word');
            
            headingWords.forEach((word, index) => {
                ScrollTrigger.create({
                    trigger: gallerySection,
                    start: 'top 80%',
                    onEnter: () => {
                        setTimeout(() => {
                            word.classList.add('revealed');
                        }, index * 150);
                    },
                    onLeaveBack: () => {
                        word.classList.remove('revealed');
                    }
                });
            });
            
            // Marquee speed control based on scroll
            const tracks = gallerySection.querySelectorAll('.gallery__track');
            
            gsap.to(tracks[0], {
                x: -200,
                ease: 'none',
                scrollTrigger: {
                    trigger: gallerySection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
            
            if (tracks[1]) {
                gsap.to(tracks[1], {
                    x: 200,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: gallerySection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2
                    }
                });
            }
            
            // CTA button animation
            const galleryCta = gallerySection.querySelector('.gallery__cta');
            if (galleryCta) {
                gsap.fromTo(galleryCta,
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: galleryCta,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
            
            // Slides entrance animation
            const slides = gallerySection.querySelectorAll('.gallery__slide');
            slides.forEach((slide, index) => {
                gsap.fromTo(slide,
                    {
                        opacity: 0,
                        scale: 0.8,
                        rotateY: index % 2 === 0 ? 15 : -15
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: gallerySection,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
        }
        
        // ============================================
        // ABOUT SECTION - STAGGERED TEXT ANIMATION
        // ============================================
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            
            // Get all staggered words
            const staggerWords = aboutSection.querySelectorAll('.about__word');
            
            // Animate words to align as you scroll
            staggerWords.forEach((word) => {
                const initialOffset = parseInt(word.dataset.offset) || 0;
                
                gsap.to(word, {
                    x: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: 'top 80%',
                        end: 'top 20%',
                        scrub: 1
                    }
                });
            });
            
            // Description fade in
            const aboutDesc = aboutSection.querySelector('.about__description');
            if (aboutDesc) {
                gsap.to(aboutDesc, {
                    opacity: 1,
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: 'top 30%',
                        end: 'top 10%',
                        scrub: 1
                    }
                });
            }
            
            // Video section reveal
            const videoSection = aboutSection.querySelector('.about__video-section');
            if (videoSection) {
                gsap.to(videoSection, {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: videoSection,
                        start: 'top 90%',
                        end: 'top 50%',
                        scrub: 1
                    }
                });
            }
            
            // Video Play/Pause functionality
            const aboutVideo = document.getElementById('aboutVideo');
            const playBtn = document.getElementById('aboutPlayBtn');
            const videoContainer = aboutSection.querySelector('.about__video-container');
            
            if (aboutVideo && playBtn && videoContainer) {
                playBtn.addEventListener('click', function() {
                    if (aboutVideo.paused) {
                        aboutVideo.muted = false;
                        aboutVideo.play();
                        videoContainer.classList.add('playing');
                    } else {
                        aboutVideo.pause();
                        videoContainer.classList.remove('playing');
                    }
                });
                
                // Click on video to pause
                aboutVideo.addEventListener('click', function() {
                    if (!aboutVideo.paused) {
                        aboutVideo.pause();
                        videoContainer.classList.remove('playing');
                    }
                });
                
                // On video end, show overlay again
                aboutVideo.addEventListener('ended', function() {
                    videoContainer.classList.remove('playing');
                });
            }
        }
    }
    
    // ========================================
    // TESTIMONIALS - STORIES LAYOUT
    // ========================================
    function initTestimonialsAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded for Testimonials animations');
            return;
        }
        
        const testimonialsSection = document.querySelector('.testimonials');
        if (!testimonialsSection) return;
        
        const items = testimonialsSection.querySelectorAll('.testimonials__item');
        const video = document.getElementById('testimonialVideo');
        const playBtn = testimonialsSection.querySelector('.testimonials__play-btn');
        const videoControls = testimonialsSection.querySelector('.testimonials__video-controls');
        const phoneFrame = testimonialsSection.querySelector('.testimonials__phone-frame');
        
        const posterCanvas = document.getElementById('testimonialPoster');
        const posterCtx = posterCanvas ? posterCanvas.getContext('2d') : null;
        
        let currentIndex = 0;
        let isPlaying = false;
        
        // Function to capture first frame as poster
        function captureVideoPoster() {
            if (!video || !posterCanvas || !posterCtx) return;
            
            // Set canvas size to match video
            posterCanvas.width = video.videoWidth || 360;
            posterCanvas.height = video.videoHeight || 640;
            
            // Draw the first frame
            posterCtx.drawImage(video, 0, 0, posterCanvas.width, posterCanvas.height);
            posterCanvas.style.display = 'block';
        }
        
        // Capture poster when video metadata is loaded
        if (video) {
            video.addEventListener('loadeddata', function() {
                video.currentTime = 0.1; // Seek to first frame
            });
            
            video.addEventListener('seeked', function() {
                if (!isPlaying) {
                    captureVideoPoster();
                }
            });
        }
        
        // Function to update active testimonial
        function setActiveTestimonial(index) {
            if (index === currentIndex) return;
            
            const clickedItem = items[index];
            const videoSrc = clickedItem ? clickedItem.dataset.video : null;
            
            // Update active class
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            // Animate phone
            gsap.to(phoneFrame, {
                scale: 0.95,
                opacity: 0.8,
                duration: 0.2,
                onComplete: () => {
                    // Update video source
                    if (video && videoSrc) {
                        const source = video.querySelector('source');
                        if (source) {
                            source.src = videoSrc;
                        }
                        video.load();
                        isPlaying = false;
                        if (videoControls) videoControls.classList.remove('hidden');
                        if (posterCanvas) posterCanvas.style.display = 'block';
                    }
                    
                    gsap.to(phoneFrame, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            currentIndex = index;
        }
        
        // Click handlers for items
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                setActiveTestimonial(index);
            });
            
            // Hover effect
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { x: 10, duration: 0.3 });
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { x: 0, duration: 0.3 });
                }
            });
        });
        
        // Play button handler
        if (playBtn && video) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isPlaying) {
                    video.pause();
                    if (videoControls) videoControls.classList.remove('hidden');
                    if (posterCanvas) posterCanvas.style.display = 'block';
                    isPlaying = false;
                } else {
                    if (posterCanvas) posterCanvas.style.display = 'none';
                    if (videoControls) videoControls.classList.add('hidden');
                    video.muted = false; // Asegurar sonido activado
                    video.play().catch(() => {});
                    isPlaying = true;
                }
            });
            
            // Video click to pause
            video.addEventListener('click', () => {
                if (isPlaying) {
                    video.pause();
                    if (videoControls) videoControls.classList.remove('hidden');
                    if (posterCanvas) posterCanvas.style.display = 'block';
                    isPlaying = false;
                }
            });
            
            // Mostrar controles cuando el video termina
            video.addEventListener('ended', () => {
                if (videoControls) videoControls.classList.remove('hidden');
                if (posterCanvas) posterCanvas.style.display = 'block';
                isPlaying = false;
            });
        }
        
        // ========================================
        // SCROLL-DRIVEN PLACEMENT ANIMATIONS
        // ========================================
        
        const header = testimonialsSection.querySelector('.testimonials__header');
        const list = testimonialsSection.querySelector('.testimonials__list');
        const phone = testimonialsSection.querySelector('.testimonials__phone');
        const bgGlows = testimonialsSection.querySelectorAll('.testimonials__bg-glow');
        
        // Set initial states
        gsap.set(header, { opacity: 0, y: 100 });
        gsap.set(items, { opacity: 0, x: -80, rotateY: -15 });
        gsap.set(phone, { opacity: 0, x: 150, rotateY: 20, scale: 0.9 });
        
        // Main timeline for scroll-driven animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: testimonialsSection,
                start: 'top 90%',
                end: 'top 20%',
                scrub: 1,
            }
        });
        
        // Header slides into place
        tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        }, 0);
        
        // Items stagger into place from left with 3D rotation
        tl.to(items, {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out'
        }, 0.1);
        
        // Phone slides in from right with 3D rotation
        tl.to(phone, {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0.2);
        
        // Background glows parallax
        if (bgGlows.length > 0) {
            gsap.to(bgGlows[0], {
                y: -100,
                x: 50,
                ease: 'none',
                scrollTrigger: {
                    trigger: testimonialsSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
            
            if (bgGlows[1]) {
                gsap.to(bgGlows[1], {
                    y: 80,
                    x: -40,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: testimonialsSection,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            }
        }
        
        // Subtle parallax on phone while scrolling through section
        gsap.to(phone, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: testimonialsSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    }
    
    // Initialize testimonials animations
    initTestimonialsAnimations();
    
    // ========================================
    // CONTACT SECTION ANIMATIONS
    // ========================================
    function initContactAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }
        
        const contactSection = document.querySelector('.contact');
        if (!contactSection) return;
        
        const label = contactSection.querySelector('.contact__label');
        const titleLines = contactSection.querySelectorAll('.contact__title-line');
        const description = contactSection.querySelector('.contact__description');
        const stats = contactSection.querySelectorAll('.contact__stat');
        const form = contactSection.querySelector('.contact__form');
        const bgGlows = contactSection.querySelectorAll('.contact__bg-glow');
        
        // Label animation
        if (label) {
            gsap.fromTo(label,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contactSection,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        // Title lines animation
        titleLines.forEach((line, index) => {
            gsap.fromTo(line,
                { opacity: 0, y: 50, rotateX: -20 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contactSection,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Description animation
        if (description) {
            gsap.fromTo(description,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contactSection,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        // Stats animation
        stats.forEach((stat, index) => {
            gsap.fromTo(stat,
                { opacity: 0, y: 30, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: contactSection,
                        start: 'top 65%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Form animation
        if (form) {
            gsap.fromTo(form,
                { opacity: 0, x: 80, rotateY: -10 },
                {
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contactSection,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        // Background glows parallax
        bgGlows.forEach((glow, index) => {
            gsap.to(glow, {
                y: index === 0 ? -80 : 80,
                x: index === 0 ? 40 : -40,
                ease: 'none',
                scrollTrigger: {
                    trigger: contactSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }
    
    // Initialize contact animations
    initContactAnimations();
    
    // ========================================
    // BLOG SECTION - MAGAZINE ANIMATIONS
    // ========================================
    function initBlogAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }
        
        const blogSection = document.querySelector('.blog');
        if (!blogSection) return;
        
        const label = blogSection.querySelector('.blog__label');
        const titleWords = blogSection.querySelectorAll('.blog__title-word');
        const viewAll = blogSection.querySelector('.blog__view-all');
        const cards = blogSection.querySelectorAll('.blog__card');
        
        // Label animation with line
        if (label) {
            const labelLine = label.querySelector('.blog__label-line');
            
            gsap.fromTo(labelLine,
                { width: 0 },
                {
                    width: 40,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: blogSection,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            gsap.fromTo(label,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: blogSection,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        // Title words - staggered 3D reveal
        titleWords.forEach((word, index) => {
            gsap.fromTo(word,
                { 
                    opacity: 0, 
                    y: 80, 
                    rotateX: -45,
                    transformOrigin: 'center bottom'
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 1,
                    delay: index * 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: blogSection,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // View all button
        if (viewAll) {
            gsap.fromTo(viewAll,
                { opacity: 0, x: 30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    delay: 0.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: blogSection,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
        
        // Cards - dramatic staggered entrance with 3D
        cards.forEach((card, index) => {
            const isFeatured = card.classList.contains('blog__card--featured');
            const isWide = card.classList.contains('blog__card--wide');
            
            // Different animations based on card type
            const xOffset = isFeatured ? -100 : (index % 2 === 0 ? -60 : 60);
            const rotateY = isFeatured ? -10 : (index % 2 === 0 ? -8 : 8);
            
            gsap.fromTo(card,
                { 
                    opacity: 0, 
                    y: 80, 
                    x: xOffset,
                    rotateY: rotateY,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    rotateY: 0,
                    scale: 1,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Parallax effect on card images
          
            
            // Number parallax
            const cardNumber = card.querySelector('.blog__card-number');
            if (cardNumber) {
                gsap.fromTo(cardNumber,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.3,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
        });
        
        // Background lines parallax
        const bgLines = blogSection.querySelector('.blog__bg-lines');
        if (bgLines) {
            gsap.to(bgLines, {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: blogSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
        }
    }
    
    // Initialize blog animations
    initBlogAnimations();
    
    // ========================================
    // BLOG POSTS - DYNAMIC LOADING FROM WP API
    // ========================================
    async function loadBlogPosts() {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;
        
        const API_URL = 'http://escuelaven7as.local/wp-json/wp/v2/posts?per_page=3&_embed';
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar posts');
            
            const posts = await response.json();
            
            if (posts.length === 0) {
                blogGrid.innerHTML = '<p class="blog__empty">No hay artículos disponibles.</p>';
                return;
            }
            
            // Render posts
            blogGrid.innerHTML = posts.map((post, index) => {
                const title = post.title.rendered;
                const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
                const link = post.link;
                const date = new Date(post.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
                
                // Get featured image
                let imageUrl = 'assets/hero/1.jpg'; // fallback
                if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
                    imageUrl = post._embedded['wp:featuredmedia'][0].source_url || imageUrl;
                }
                
                // Get category
                let category = 'Estrategia';
                let categoryClass = 'blog__card-category--coral';
                if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]) {
                    category = post._embedded['wp:term'][0][0].name;
                    // Alternate colors based on category
                    const catSlug = post._embedded['wp:term'][0][0].slug.toLowerCase();
                    if (catSlug.includes('mindset') || catSlug.includes('psicolog')) {
                        categoryClass = 'blog__card-category--blue';
                    }
                }
                
                // Calculate read time (approx 200 words per minute)
                const wordCount = post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length;
                const readTime = Math.max(1, Math.ceil(wordCount / 200));
                
                const cardClass = index === 0 ? 'blog__card blog__card--featured' : 'blog__card blog__card--vertical';
                const cardNumber = String(index + 1).padStart(2, '0');
                
                return `
                    <a href="${link}" class="${cardClass}" data-index="${cardNumber}" target="_blank">
                        <div class="blog__card-image">
                            <img src="${imageUrl}" alt="${title}" loading="lazy">
                            <div class="blog__card-overlay"></div>
                        </div>
                        <div class="blog__card-content">
                            <span class="blog__card-category ${categoryClass}">${category}</span>
                            <h3 class="blog__card-title">${title}</h3>
                            <p class="blog__card-excerpt">${excerpt}</p>
                            <div class="blog__card-meta">
                                <span class="blog__card-date">${date}</span>
                                <span class="blog__card-read">${readTime} min lectura</span>
                            </div>
                        </div>
                        <span class="blog__card-number">${cardNumber}</span>
                    </a>
                `;
            }).join('');
            
            // Re-initialize blog animations after loading
            initBlogAnimations();
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            blogGrid.innerHTML = `
                <p class="blog__error">No se pudieron cargar los artículos. <br>
                <small>Intenta recargar la página.</small></p>
            `;
        }
    }
    
    // Load blog posts
    loadBlogPosts();
    
    // ========================================
    // CONTACT FORM - WHATSAPP INTEGRATION
    // ========================================
    function initContactFormWhatsApp() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Número de WhatsApp (con código de país, sin + ni espacios)
        const WHATSAPP_NUMBER = '593981037979';
        
        // Detectar si es móvil
        function isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
        
        // Mapeo de programas para mostrar nombre legible
        const programasMap = {
            'she-closer': 'SHE CLOSER - Entrenamiento para mujeres',
            'he-closer': 'HE CLOSER - Entrenamiento para hombres',
            'cerradores-elite': 'CERRADORES ÉLITE - Clínica de ventas',
            'closers-hub': 'CLOSERS HUB - Agencia de ventas',
            'todos': 'Todos los programas'
        };
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const email = document.getElementById('email').value.trim();
            const programaValue = document.getElementById('programa').value;
            const programa = programasMap[programaValue] || programaValue;
            
            // Construir mensaje
            let mensaje = ` *SOLICITUD DE INFORMACIÓN*\n\n`;
            mensaje += ` *Nombre:* ${nombre} ${apellido}\n`;
            if (empresa) {
                mensaje += ` *Empresa:* ${empresa}\n`;
            }
            mensaje += ` *Teléfono:* ${telefono}\n`;
            mensaje += ` *Email:* ${email}\n`;
            mensaje += ` *Programa de interés:* ${programa}\n\n`;
            mensaje += `_Enviado desde escuelaven7as.com_`;
            
            // Codificar mensaje para URL
            const mensajeCodificado = encodeURIComponent(mensaje);
            
            // Construir URL de WhatsApp
            let whatsappURL;
            if (isMobile()) {
                // Para móvil - abre la app de WhatsApp
                whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;
            } else {
                // Para desktop - abre WhatsApp Web
                whatsappURL = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${mensajeCodificado}`;
            }
            
            // Abrir WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Opcional: Mostrar mensaje de confirmación
            const submitBtn = contactForm.querySelector('.contact__submit');
            const originalText = submitBtn.querySelector('.contact__submit-text').textContent;
            submitBtn.querySelector('.contact__submit-text').textContent = '¡Enviado!';
            submitBtn.style.background = '#10B981';
            
            setTimeout(() => {
                submitBtn.querySelector('.contact__submit-text').textContent = originalText;
                submitBtn.style.background = '';
                // Limpiar formulario
                contactForm.reset();
            }, 3000);
        });
    }
    
    // Initialize WhatsApp form
    initContactFormWhatsApp();
});

