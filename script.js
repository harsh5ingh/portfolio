// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== Active nav link on scroll =====
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// ===== Scroll reveal =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Skill bar animation =====
const skillCards = document.querySelectorAll('.skill-card');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

skillCards.forEach(card => skillObserver.observe(card));

// ===== Animated counter =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterEls = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

// ===== Typing effect for hero subtitle =====
const typingEl = document.getElementById('typing-text');
const phrases = [
  'Frontend Developer',
  'UI/UX Enthusiast',
  'React Developer',
  'Open Source Contributor',
];
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;

function type() {
  const current = phrases[phraseIdx];
  if (deleting) {
    typingEl.textContent = current.substring(0, charIdx--);
  } else {
    typingEl.textContent = current.substring(0, charIdx++);
  }

  if (!deleting && charIdx > current.length) {
    deleting = true;
    setTimeout(type, 1800);
    return;
  }

  if (deleting && charIdx < 0) {
    deleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    charIdx = 0;
    setTimeout(type, 400);
    return;
  }

  setTimeout(type, deleting ? 60 : 90);
}

if (typingEl) type();

// ===== Contact form =====
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '✅ Thanks! Message noted. (Form demo – no server)';
    form.reset();
    setTimeout(() => { formStatus.textContent = ''; }, 4000);
  });
}
