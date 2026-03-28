document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Mouse Cursor Glow Positioning
  // ==========================================
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  // ==========================================
  // 2. Theme Toggler (Keep for flexibility)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  if (themeToggle) {
    const toggleIcon = themeToggle.querySelector('i');
    
    // Default to the Photo Theme (Dark/Navy)
    body.classList.add('dark-mode'); 
    localStorage.setItem('theme', 'dark');

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        toggleIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
      } else {
        toggleIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ==========================================
  // 3. Sticky Header
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 4. Dynamic Perspective Scroll Reveal
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 5. FAQ Accordion 
  // ==========================================
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const headerBtn = item.querySelector('.accordion-header');
    headerBtn.addEventListener('click', () => {
      const activeItem = document.querySelector('.accordion-item.active');
      if (activeItem && activeItem !== item) {
        activeItem.classList.remove('active');
      }
      item.classList.toggle('active');
    });
  });

  // ==========================================
  // 6. Smooth Scroll 
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // Footer Year
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
