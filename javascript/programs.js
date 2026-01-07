/* ============================================
   PROGRAMS PAGES - JavaScript
   Simple scroll animations using Intersection Observer
   ============================================ */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('Initializing programs page...');
        
        // ============================================
        // SCROLL ANIMATIONS
        // ============================================
        
        // Selectors for elements that should animate on scroll
        const animatedElements = document.querySelectorAll(`
            .program-intro__content,
            .program-intro__visual,
            .program-intro__highlight,
            .program-benefits__header,
            .program-benefits__card,
            .program-methodology__header,
            .program-methodology__week,
            .program-testimonials__header,
            .program-testimonials__card,
            .program-pricing__header,
            .program-pricing__card,
            .program-pricing__guarantee,
            .program-experience__header,
            .program-experience__card,
            .program-experience__gallery-item,
            .program-agenda__header,
            .program-agenda__day,
            .program-problem__header,
            .program-problem__card,
            .program-services__header,
            .program-services__card,
            .program-process__header,
            .program-process__step,
            .program-cases__header,
            .program-cases__card,
            .program-contact__content,
            .program-contact__form-wrapper,
            .program-final-cta__container
        `);
        
        console.log(`Found ${animatedElements.length} elements to animate`);
        
        // Apply initial styles via JS (so they work even without CSS)
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        });
        
        // Create Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe all elements
        animatedElements.forEach(el => observer.observe(el));
        
        // ============================================
        // CURSOR GLOW
        // ============================================
        
        const cursorGlow = document.querySelector('.cursor-glow');
        if (cursorGlow && window.innerWidth >= 768) {
            document.addEventListener('mousemove', (e) => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        } else if (cursorGlow) {
            cursorGlow.style.display = 'none';
        }
        
        // ============================================
        // HEADER SCROLL
        // ============================================
        
        const header = document.querySelector('.program-header');
        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('scrolled', window.scrollY > 100);
            });
        }
        
        // ============================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ============================================
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = header?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
        
        // ============================================
        // COUNTDOWN TIMER
        // ============================================
        
        const countdownDays = document.getElementById('days');
        if (countdownDays) {
            const targetDate = new Date('2026-02-15T09:00:00').getTime();
            
            function updateCountdown() {
                const now = Date.now();
                const distance = targetDate - now;
                
                if (distance > 0) {
                    document.getElementById('days').textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
                    document.getElementById('hours').textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
                    document.getElementById('minutes').textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                    document.getElementById('seconds').textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
                }
            }
            
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
        
        // ============================================
        // FORM HANDLING
        // ============================================
        
        const contactForm = document.querySelector('.program-contact__form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const btn = this.querySelector('.program-contact__form-btn');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<span>Enviando...</span>';
                btn.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    btn.innerHTML = '<span>¡Mensaje enviado! ✓</span>';
                    btn.style.background = '#00C9A7';
                    this.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.pointerEvents = 'auto';
                        btn.style.background = '';
                    }, 3000);
                }, 1500);
            });
        }
        
        // ============================================
        // SCROLL INDICATOR
        // ============================================
        
        const scrollIndicator = document.querySelector('.program-hero__scroll');
        if (scrollIndicator) {
            window.addEventListener('scroll', () => {
                scrollIndicator.style.opacity = window.scrollY > 200 ? '0' : '1';
            });
        }
        
        // ============================================
        // PARTICLES
        // ============================================
        
        const particles = document.getElementById('particles');
        if (particles) {
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('div');
                p.style.cssText = `
                    position: absolute;
                    width: ${2 + Math.random() * 4}px;
                    height: ${2 + Math.random() * 4}px;
                    background: var(--program-primary);
                    border-radius: 50%;
                    opacity: ${0.1 + Math.random() * 0.2};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    pointer-events: none;
                `;
                particles.appendChild(p);
            }
        }
        
        console.log('Programs page initialized! 🚀');
    }
})();
