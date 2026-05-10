/* ===== ARYAN GADHWAL PORTFOLIO — ENHANCED JS ===== */
(function () {
    'use strict';
    function requiredElement(id) {
        const el = document.getElementById(id);
        if (!el)
            throw new Error(`Missing required element: #${id}`);
        return el;
    }
    function requiredCanvas(id) {
        return requiredElement(id);
    }
    function requiredContext(canvas) {
        const context = canvas.getContext('2d');
        if (!context)
            throw new Error(`Could not create 2D context for #${canvas.id}`);
        return context;
    }
    let mouseX = 0, mouseY = 0;
    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    // ===== CUSTOM CURSOR =====
    const cursorDot = requiredElement('cursorDot');
    const cursorRing = requiredElement('cursorRing');
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
    document.querySelectorAll('a, button, .skill-item, .project-card, .social-link').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
    // ===== NAVBAR =====
    const navbar = requiredElement('navbar');
    const navToggle = requiredElement('navToggle');
    const navLinks = requiredElement('navLinks');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 80));
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => { navToggle.classList.remove('active'); navLinks.classList.remove('open'); });
    });
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');
            if (!href || href === '#')
                return;
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            }
        });
    });
    // ===== TYPING ANIMATION =====
    const typingElement = requiredElement('typingText');
    const words = ['Coder', 'Full Stack Developer', 'MERN Stack Developer', 'Next.js Developer'];
    let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;
    function typeEffect() {
        const w = words[wordIndex];
        if (isDeleting) {
            typingElement.textContent = w.substring(0, --charIndex);
            typingSpeed = 50;
        }
        else {
            typingElement.textContent = w.substring(0, ++charIndex);
            typingSpeed = 100;
        }
        if (!isDeleting && charIndex === w.length) {
            typingSpeed = 2000;
            isDeleting = true;
        }
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400;
        }
        setTimeout(typeEffect, typingSpeed);
    }
    setTimeout(typeEffect, 1200);
    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('active'), i * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));
    // ===== GALAXY CANVAS =====
    const galaxy = requiredCanvas('galaxyCanvas');
    const gctx = requiredContext(galaxy);
    let stars = [], nebulae = [], shootingStars = [];
    let galaxyHue = 220; // shifts with scroll
    function resizeGalaxy() { galaxy.width = window.innerWidth; galaxy.height = window.innerHeight; }
    resizeGalaxy();
    window.addEventListener('resize', resizeGalaxy);
    class Star {
        constructor() {
            this.x = Math.random() * galaxy.width;
            this.y = Math.random() * galaxy.height;
            this.size = Math.random() * 2.5 + 0.3;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.baseOpacity = Math.random() * 0.6 + 0.2;
            this.depth = Math.random(); // 0=far, 1=near for parallax
        }
        draw(t) {
            const twinkle = Math.sin(t * this.twinkleSpeed + this.twinklePhase) * 0.3 + 0.7;
            const opacity = this.baseOpacity * twinkle;
            const px = this.x + (mouseX - galaxy.width / 2) * this.depth * 0.02;
            const py = this.y + (mouseY - galaxy.height / 2) * this.depth * 0.02;
            gctx.beginPath();
            gctx.arc(px, py, this.size, 0, Math.PI * 2);
            const hue = galaxyHue + this.depth * 40;
            gctx.fillStyle = `hsla(${hue}, 70%, ${65 + this.depth * 20}%, ${opacity})`;
            gctx.fill();
            if (this.size > 1.5) {
                gctx.beginPath();
                gctx.arc(px, py, this.size * 3, 0, Math.PI * 2);
                gctx.fillStyle = `hsla(${hue}, 70%, 70%, ${opacity * 0.08})`;
                gctx.fill();
            }
        }
    }
    class Nebula {
        constructor() {
            this.x = Math.random() * galaxy.width;
            this.y = Math.random() * galaxy.height;
            this.radius = Math.random() * 200 + 100;
            this.hueOffset = Math.random() * 60 - 30;
            this.opacity = Math.random() * 0.04 + 0.01;
            this.driftX = (Math.random() - 0.5) * 0.15;
            this.driftY = (Math.random() - 0.5) * 0.1;
        }
        draw() {
            this.x += this.driftX;
            this.y += this.driftY;
            if (this.x < -200)
                this.x = galaxy.width + 200;
            if (this.x > galaxy.width + 200)
                this.x = -200;
            if (this.y < -200)
                this.y = galaxy.height + 200;
            if (this.y > galaxy.height + 200)
                this.y = -200;
            const grad = gctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            const h = galaxyHue + this.hueOffset;
            grad.addColorStop(0, `hsla(${h}, 60%, 40%, ${this.opacity})`);
            grad.addColorStop(0.5, `hsla(${h + 20}, 50%, 30%, ${this.opacity * 0.5})`);
            grad.addColorStop(1, 'transparent');
            gctx.fillStyle = grad;
            gctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
    }
    class ShootingStar {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.len = 0;
            this.speed = 0;
            this.angle = 0;
            this.opacity = 1;
            this.life = 1;
            this.reset();
        }
        reset() {
            this.x = Math.random() * galaxy.width;
            this.y = Math.random() * galaxy.height * 0.5;
            this.len = Math.random() * 80 + 40;
            this.speed = Math.random() * 8 + 4;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            this.opacity = 1;
            this.life = 1;
        }
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= 0.015;
            this.opacity = this.life;
            if (this.life <= 0)
                this.reset();
        }
        draw() {
            const tailX = this.x - Math.cos(this.angle) * this.len;
            const tailY = this.y - Math.sin(this.angle) * this.len;
            const grad = gctx.createLinearGradient(tailX, tailY, this.x, this.y);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, `rgba(255,255,255,${this.opacity})`);
            gctx.strokeStyle = grad;
            gctx.lineWidth = 1.5;
            gctx.beginPath();
            gctx.moveTo(tailX, tailY);
            gctx.lineTo(this.x, this.y);
            gctx.stroke();
        }
    }
    // Init galaxy objects
    for (let i = 0; i < 300; i++)
        stars.push(new Star());
    for (let i = 0; i < 6; i++)
        nebulae.push(new Nebula());
    for (let i = 0; i < 3; i++) {
        const s = new ShootingStar();
        s.life = Math.random();
        shootingStars.push(s);
    }
    let galaxyTime = 0;
    function renderGalaxy() {
        gctx.clearRect(0, 0, galaxy.width, galaxy.height);
        nebulae.forEach(n => n.draw());
        stars.forEach(s => s.draw(galaxyTime));
        shootingStars.forEach(s => { s.update(); s.draw(); });
        galaxyTime++;
        requestAnimationFrame(renderGalaxy);
    }
    renderGalaxy();
    // ===== DEITY SCROLL LAYERS =====
    const deityShiva = requiredElement('deityShiva');
    const deityKrishna = requiredElement('deityKrishna');
    const deityVishnu = requiredElement('deityVishnu');
    const deityLayers = [
        { el: deityShiva, start: 0.05, end: 0.3 },
        { el: deityKrishna, start: 0.35, end: 0.6 },
        { el: deityVishnu, start: 0.65, end: 0.9 }
    ];
    // ===== DIVINE SKILL ENTRANCE =====
    const divineSkillObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('divine-enter');
                    for (let p = 0; p < 8; p++) {
                        setTimeout(() => spawnDivineParticle(entry.target), p * 100);
                    }
                }, i * 200);
                divineSkillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-category.glass-card').forEach(c => divineSkillObs.observe(c));
    function spawnDivineParticle(target) {
        const rect = target.getBoundingClientRect();
        const particle = document.createElement('div');
        particle.className = 'divine-particle';
        const colors = ['#FFD700', '#FFA500', '#4ba8eb', '#e22134'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        particle.style.boxShadow = `0 0 6px ${particle.style.background}`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
    // ===== MASTER SCROLL HANDLER =====
    const docHeight = () => document.documentElement.scrollHeight - window.innerHeight;
    function onScroll() {
        const scrollY = window.scrollY;
        const progress = scrollY / docHeight();
        // Scroll progress bar
        progressBar.style.width = `${progress * 100}%`;
        // Galaxy hue shift
        galaxyHue = 220 + progress * 130;
        // Deity layer scroll triggers (cinematic fade)
        deityLayers.forEach(d => {
            const visible = progress >= d.start && progress <= d.end;
            d.el.classList.toggle('visible', visible);
            if (visible) {
                const localP = (progress - d.start) / (d.end - d.start);
                const scale = 1 + localP * 0.15;
                const ty = (localP - 0.5) * -50;
                const figure = d.el.querySelector('.deity-figure');
                if (figure)
                    figure.style.transform = `scale(${scale}) translateY(${ty}px)`;
            }
        });
        // Parallax elements
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.dataset.speed ?? '0.1') || 0.1;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
        // Active nav highlight
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop, height = section.offsetHeight, id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link)
                link.style.color = (scrollY + 150 >= top && scrollY + 150 < top + height) ? 'var(--text-primary)' : '';
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // ===== HERO MOUSE PARALLAX =====
    const heroContent = document.querySelector('.hero-content');
    const heroGradient = document.querySelector('.hero-gradient');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768)
            return;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        if (heroContent)
            heroContent.style.transform = `translate(${x * 8}px, ${y * 5}px)`;
        if (heroGradient)
            heroGradient.style.transform = `translate(calc(-50% + ${x * 30}px), calc(-50% + ${y * 30}px))`;
    });
    // ===== LIQUID GLASS TILT ON SKILL CARDS =====
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768)
                return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
            // Move the glass shine to follow cursor
            const shine = card.querySelector('.glass-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,.08), transparent 60%)`;
                shine.style.animation = 'none';
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const shine = card.querySelector('.glass-shine');
            if (shine) {
                shine.style.background = '';
                shine.style.animation = '';
            }
        });
    });
    // ===== MAGNETIC HOVER ON SKILL ITEMS =====
    document.querySelectorAll('[data-magnetic]').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.08)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.transition = 'transform 0.5s cubic-bezier(.25,.46,.45,.94)';
        });
        item.addEventListener('mouseenter', () => { item.style.transition = 'transform 0.15s ease'; });
    });
    // ===== STAGGER SKILL ITEMS =====
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
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
    // ===== TIMELINE DOT GLOW =====
    const dotObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const dot = entry.target;
                dot.style.transform = 'translateX(-6px) scale(1.3)';
                dot.style.transition = 'transform 0.5s cubic-bezier(.68,-.55,.265,1.55)';
                setTimeout(() => { dot.style.transform = 'translateX(-6px) scale(1)'; }, 600);
            }
        });
    }, { threshold: 1 });
    document.querySelectorAll('.timeline-dot').forEach(dot => dotObserver.observe(dot));
    // ===== 3D TILT ON PROJECT CARDS =====
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768)
                return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
    // ===== SOCIAL SIDEBAR =====
    const socialSidebar = document.getElementById('socialSidebar');
    window.addEventListener('scroll', () => {
        if (socialSidebar) {
            socialSidebar.style.opacity = window.scrollY > 400 ? '1' : '0';
            socialSidebar.style.transition = 'opacity 0.5s ease';
        }
    });
})();
