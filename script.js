/* ===== ARYAN GADHWAL PORTFOLIO — MAIN JS ===== */

(function () {
  'use strict';

  // ===== CUSTOM CURSOR =====
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card, .social-link');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // ===== TYPING ANIMATION =====
  const typingElement = document.getElementById('typingText');
  const words = ['Coder', 'Full Stack Developer', 'MERN Stack Developer', 'Next.js Developer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }
  setTimeout(typeEffect, 1200);

  // ===== INTERSECTION OBSERVER — SCROLL REVEAL =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations slightly
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== PARTICLE CANVAS — HERO BACKGROUND =====
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = [210, 220, 0][Math.floor(Math.random() * 3)]; // M blue, dark blue, or red
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse attraction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.x += dx * 0.002;
        this.y += dy * 0.002;
        this.opacity = Math.min(this.opacity + 0.01, 0.8);
      }

      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.hue === 0 ? `rgba(226, 33, 52, ${this.opacity})` : `hsla(${this.hue}, 70%, 55%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 119, 212, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Pause particles when not in viewport
  const heroSection = document.getElementById('hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationId) animateParticles();
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }, { threshold: 0.1 });
  heroObserver.observe(heroSection);

  // ===== PARALLAX ON MOUSE MOVE (HERO) =====
  const heroContent = document.querySelector('.hero-content');
  const heroGradient = document.querySelector('.hero-gradient');

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    if (heroContent) {
      heroContent.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
    }
    if (heroGradient) {
      heroGradient.style.transform = `translate(calc(-50% + ${x * 30}px), calc(-50% + ${y * 30}px))`;
    }
  });

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--text-primary)';
        } else {
          link.style.color = '';
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ===== STAGGER ANIMATIONS FOR SKILL ITEMS =====
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill-item');
        items.forEach((item, i) => {
          item.style.transitionDelay = `${i * 60}ms`;
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => {
    cat.querySelectorAll('.skill-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    skillObserver.observe(cat);
  });

  // ===== TIMELINE DOT GLOW ON SCROLL =====
  const timelineDots = document.querySelectorAll('.timeline-dot');
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateX(-6px) scale(1.3)';
        entry.target.style.transition = 'transform 0.5s cubic-bezier(.68,-.55,.265,1.55)';
        setTimeout(() => {
          entry.target.style.transform = 'translateX(-6px) scale(1)';
        }, 600);
      }
    });
  }, { threshold: 1 });
  timelineDots.forEach(dot => dotObserver.observe(dot));

  // ===== TILT EFFECT ON PROJECT CARDS =====
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });




  // ===== SOCIAL SIDEBAR SHOW/HIDE =====
  const socialSidebar = document.getElementById('socialSidebar');
  window.addEventListener('scroll', () => {
    if (socialSidebar) {
      socialSidebar.style.opacity = window.scrollY > 400 ? '1' : '0';
      socialSidebar.style.transition = 'opacity 0.5s ease';
    }
  });

  // ===== PRELOADER FADE (minimal) =====
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
  });
  document.body.style.opacity = '0';

})();
