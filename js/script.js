document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // GSAP Plugins registration
  gsap.registerPlugin(ScrollTrigger);

  // 1. Language Switcher Logic
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = 'ar';

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    langToggle.innerText = currentLang === 'ar' ? 'EN' : 'AR';
    
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('.t9n').forEach(el => {
      el.innerText = el.getAttribute(`data-${currentLang}`);
    });

    // Handle placeholders for inputs/textareas
    document.querySelectorAll('[data-ar][placeholder]').forEach(el => {
      el.setAttribute('placeholder', el.getAttribute(`data-${currentLang}`));
    });

    // Refresh ScrollTrigger and Lucide
    ScrollTrigger.refresh();
    lucide.createIcons();
  });

  // 1. Navbar Logic
  const nav = document.querySelector('.nav-island');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const menuIcon = menuToggle.querySelector('i');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    menuIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
    lucide.createIcons();
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
      if (self.direction === 1) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }); 


  // 2. Hero Animations
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 }});
  
  heroTl.from('.visual-frame', {
    scale: 0.5,
    opacity: 0,
    duration: 1.5,
  }, 0)
  .from('.orbit-ring', {
    scale: 0.5,
    opacity: 0,
    stagger: 0.2,
    duration: 1.5
  }, 0.5)
  .from('.orbit-badge', {
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    duration: 1
  }, 1)
  .from('.hero-content .reveal', { 
    x: 100, 
    opacity: 0, 
    stagger: 0.1 
  }, 0.2);

  // 3. High-Fidelity Orbit Interaction
  function initOrbits() {
    const visual = document.querySelector('.hero-visual');
    const rings = document.querySelectorAll('.orbit-ring');
    const badgesCfg = {
      '#badge-1': { ringRatio: 0.84, speed: 45, offset: 0 },
      '#badge-2': { ringRatio: 1.1, speed: 60, offset: 120 },
      '#badge-3': { ringRatio: 0.64, speed: 30, offset: 240 }
    };

    // Main Orbit Logic
    let angle = 0;
    function updateOrbits() {
      angle += 0.002;
      const visualWidth = visual.offsetWidth;
      
      // Rotate Badges
      Object.entries(badgesCfg).forEach(([id, cfg]) => {
        const el = document.querySelector(id);
        if (!el) return;
        const currentAngle = angle * cfg.speed + cfg.offset;
        const radius = (visualWidth * cfg.ringRatio) / 2;
        const x = Math.cos(currentAngle * (Math.PI / 180)) * radius;
        const y = Math.sin(currentAngle * (Math.PI / 180)) * radius;
        
        gsap.set(el, { x, y });
      });

      // Rotate Dot
      const dot = document.getElementById('dot-main');
      if (dot) {
        const dotAngle = angle * 80;
        const radius = visualWidth / 2;
        const x = Math.cos(dotAngle * (Math.PI / 180)) * radius;
        const y = Math.sin(dotAngle * (Math.PI / 180)) * radius;
        gsap.set(dot, { x, y });
      }

      requestAnimationFrame(updateOrbits);
    }
    updateOrbits();


    // Rotate Rings (Static background)
    gsap.to('.ring-1', { rotate: 360, duration: 40, repeat: -1, ease: 'none' });
    gsap.to('.ring-2', { rotate: -360, duration: 60, repeat: -1, ease: 'none' });
    gsap.to('.ring-3', { rotate: 360, duration: 80, repeat: -1, ease: 'none' });
  }
  initOrbits();

  // FAQ Accordion Toggle
  window.toggleFaq = function(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  };

  // Contact Form Submission Handler
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button');
      
      // Dynamic text based on language
      const isAr = document.documentElement.getAttribute('lang') === 'ar';
      const originalText = submitBtn.innerText;
      const sendingText = isAr ? 'جاري الإرسال...' : 'Sending...';
      const successText = isAr ? 'تم الإرسال بنجاح! ✓' : 'Sent Successfully! ✓';
      const errorText = isAr ? 'حدث خطأ ما! ✗' : 'Error Sending! ✗';

      gsap.to(submitBtn, { scale: 0.95, opacity: 0.8, duration: 0.2 });
      submitBtn.innerText = sendingText;
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        if (response.ok) {
          submitBtn.innerText = successText;
          submitBtn.style.background = '#4CAF50';
          contactForm.reset();
        } else {
          submitBtn.innerText = errorText;
          submitBtn.style.background = '#f44336';
        }
      })
      .catch(() => {
        submitBtn.innerText = errorText;
        submitBtn.style.background = '#f44336';
      })
      .finally(() => {
        gsap.to(submitBtn, { scale: 1.05, duration: 0.6, ease: 'back.out' });
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          gsap.to(submitBtn, { scale: 1, duration: 0.3 });
        }, 3000);
      });
    });
  }

  // 3. Feature Cards - Interactive Artifacts

  // Card 1: Diagnostic Shuffler
  const shuffleCards = document.querySelectorAll('.shuffler-card');
  let currentShufflerIndex = 0;
  setInterval(() => {
    const cards = Array.from(shuffleCards);
    cards.forEach((card, index) => {
      const offset = (index - currentShufflerIndex + cards.length) % cards.length;
      gsap.to(card, {
        y: offset * 20,
        scale: 1 - offset * 0.1,
        opacity: 1 - offset * 0.3,
        zIndex: cards.length - offset,
        duration: 0.6,
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      });
    });
    currentShufflerIndex = (currentShufflerIndex + 1) % cards.length;
  }, 3000);

  // Card 2: Telemetry Typewriter
  const typewriterText = document.getElementById('typewriter-text');
  const messages = [
    "> Initializing scan...",
    "> Analyzing bone density...",
    "> Fracture detected: Humeral Head",
    "> Repair protocol: Plate Fixation",
    "> Recovery projection: 12 weeks",
    "> Patient status: Stable"
  ];
  let msgIndex = 0;
  let charIndex = 0;

  function typeWriterEffect() {
    if (charIndex < messages[msgIndex].length) {
      typewriterText.innerHTML = messages[msgIndex].substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeWriterEffect, 50);
    } else {
      setTimeout(() => {
        charIndex = 0;
        msgIndex = (msgIndex + 1) % messages.length;
        typeWriterEffect();
      }, 2000);
    }
  }
  typeWriterEffect();

  // Card 3: Cursor Scheduler
  const cursor = document.getElementById('virtual-cursor');
  const targetDay = document.getElementById('target-day');
  function runSchedulerAnim() {
    const rect = targetDay.getBoundingClientRect();
    const parentRect = targetDay.parentElement.getBoundingClientRect();
    const scheduleRect = targetDay.closest('.scheduler').getBoundingClientRect();
    
    const targetX = rect.left - scheduleRect.left + rect.width / 2;
    const targetY = rect.top - scheduleRect.top + rect.height / 2;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.set(cursor, { x: 20, y: 120, opacity: 0 })
      .to(cursor, { opacity: 1, duration: 0.4 })
      .to(cursor, { x: targetX, y: targetY, duration: 1.5, ease: 'power2.inOut' })
      .to(targetDay, { scale: 0.9, duration: 0.1 })
      .to(targetDay, { scale: 1, backgroundColor: '#c9a84c', duration: 0.1 })
      .to(cursor, { opacity: 0, duration: 0.4, delay: 0.5 })
      .set(targetDay, { backgroundColor: 'rgba(255,255,255,0.1)' });
  }
  runSchedulerAnim();

  // 4. Reveal Animations
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // 5. Protocol Section - Sticky Stacking
  const protocolCards = gsap.utils.toArray('.protocol-card');
  protocolCards.forEach((card, i) => {
    if (i === protocolCards.length - 1) return;
    
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        pinSpacing: false
      },
      scale: 0.9,
      filter: 'blur(20px)',
      opacity: 0.5
    });
  });



  // 7. General Magnetic Feel for Buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  // 8. Custom Protocol Animations
  gsap.to('.rotate-anim', {
    rotate: 360,
    transformOrigin: 'center',
    duration: 10,
    repeat: -1,
    ease: 'none'
  });

  gsap.to('.laser-scan', {
    y: 100,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  gsap.to('.wave-anim', {
    attr: { d: 'M0 30 Q 50 60, 100 30 T 200 30' },
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

});
