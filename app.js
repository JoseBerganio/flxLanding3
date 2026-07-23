/* ============================================================
   FLEXIWOO — App Logic (app.js)
   ============================================================ */

// ── Navbar scroll effect ────────────────────────────────────
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileClose = document.getElementById('mobile-close');

hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ── Typewriter Effect ───────────────────────────────────────
const typewriterEl = document.getElementById('typewriter');
const words = ['Procrastinating', 'Planning', 'Waiting', 'Overthinking', 'Stalling'];
let wordIndex = 0, charIndex = 0, deleting = false;

function typewriter() {
  const current = words[wordIndex];
  if (deleting) {
    typewriterEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(typewriter, 500); return; }
  } else {
    typewriterEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) { deleting = true; setTimeout(typewriter, 1800); return; }
  }
  setTimeout(typewriter, deleting ? 60 : 100);
}
setTimeout(typewriter, 1000);

// ── Scroll Reveal ───────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated Counter ────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = eased * target;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// ── Animated Chat Demo ──────────────────────────────────────
const chatMessages = [
  { role: 'xiwoo', text: '🦉 Good morning! It\'s 8:00 AM. Ready to crush your goals today? You had 3 tasks left from yesterday.' },
  { role: 'user', text: 'Yes! I need to finish the client proposal.' },
  { role: 'xiwoo', text: '💜 Great. I\'ve set a 90-min focus block. I\'ll check in at 9:30 AM. Want me to block distractions?' },
  { role: 'user', text: 'Please do. Also remind me about the 11am call.' },
  { role: 'xiwoo', text: '✅ Done! Focus mode on. Reminder set for 10:45 AM. You\'ve got this — let\'s make it happen! 🚀' },
];
let chatIdx = 0;
const chatBody = document.getElementById('chat-body');

function addChatMessage() {
  if (chatIdx >= chatMessages.length) { chatIdx = 0; chatBody.innerHTML = ''; setTimeout(addChatMessage, 2000); return; }
  const msg = chatMessages[chatIdx++];
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg--${msg.role}`;
  div.innerHTML = `
    <div class="chat-msg__avatar">${msg.role === 'xiwoo' ? '🦉' : 'ME'}</div>
    <div class="chat-msg__bubble">${msg.text}</div>
  `;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(addChatMessage, 2000);
}

const chatObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    setTimeout(addChatMessage, 600);
    chatObserver.disconnect();
  }
}, { threshold: 0.4 });
const chatWindow = document.getElementById('chat-window');
if (chatWindow) chatObserver.observe(chatWindow);

// ── Pricing Toggle ──────────────────────────────────────────
const pricingToggle = document.getElementById('pricing-toggle');
const priceMonthly = document.querySelectorAll('[data-monthly]');
const priceAnnual = document.querySelectorAll('[data-annual]');

if (pricingToggle) {
  pricingToggle.addEventListener('change', () => {
    const isAnnual = pricingToggle.checked;
    priceMonthly.forEach(el => el.style.display = isAnnual ? 'none' : '');
    priceAnnual.forEach(el => el.style.display = isAnnual ? '' : 'none');
  });
  // init
  priceAnnual.forEach(el => el.style.display = 'none');
}

// ── CTA Form ────────────────────────────────────────────────
const ctaForm = document.getElementById('cta-form');
if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = ctaForm.querySelector('input[type=email]');
    const btn = ctaForm.querySelector('button');
    btn.textContent = '🎉 You\'re on the list!';
    btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Join Waitlist';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  });
}

// ── Particles ───────────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    o: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '124,58,237' : '6,182,212',
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.o})`;
      ctx.fill();
    });
    // Draw connecting lines
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ── Smooth scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Active nav link highlight ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.dataset.section === entry.target.id
          ? 'var(--text-primary)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));
