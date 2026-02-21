/* ============================================================
   SACRED CUISINE & GRILLS — script.js
   ============================================================ */

'use strict';

const WA_NUMBER = '2349164059883';
const WA_MESSAGE = encodeURIComponent("Hello Sacred Cuisine & Grills, I'd like to place an order...");
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

/* ============================================================
   MENU DATA
   ============================================================ */
const menuItems = [
  // BBQ
  {
    id: 1, category: 'bbq',
    name: 'BBQ Fish',
    desc: 'Whole tilapia, charcoal-grilled, marinated in our secret pepper sauce.',
    price: '₦ 4,500',
    image: 'images/bbq_fish.png',
    emoji: '🐟',
    tag: 'Signature'
  },
  {
    id: 2, category: 'bbq',
    name: 'Crocker Fish BBQ',
    desc: 'Firm, smoky crocker fish grilled to perfection with Naija spice blend.',
    price: '₦ 5,000',
    image: 'images/bbq_fish.png',
    emoji: '🐠',
    tag: 'BBQ'
  },
  {
    id: 3, category: 'bbq',
    name: 'Chicken BBQ',
    desc: 'Juicy, chargrilled chicken pieces — seasoned the real Lagos way.',
    price: '₦ 3,500',
    image: 'images/chicken_bbq.png',
    emoji: '🍗',
    tag: 'Fan Favourite'
  },
  // SOUPS
  {
    id: 4, category: 'soup',
    name: 'Catfish Pepper Soup',
    desc: 'Spicy, steaming catfish pepper soup — the real deal. 🔥',
    price: '₦ 4,000',
    image: 'images/pepper_soup.png',
    emoji: '🍲',
    tag: 'Soup'
  },
  {
    id: 5, category: 'soup',
    name: 'Cow Tail Pepper Soup',
    desc: 'Tender cow tail in a rich, deeply spiced pepper broth.',
    price: '₦ 4,500',
    image: 'images/pepper_soup.png',
    emoji: '🫕',
    tag: 'Soup'
  },
  {
    id: 6, category: 'soup',
    name: 'Chicken Pepper Soup',
    desc: 'Light but fiery chicken pepper soup — perfect starter or main.',
    price: '₦ 3,500',
    image: 'images/pepper_soup.png',
    emoji: '🍜',
    tag: 'Soup'
  },
  {
    id: 7, category: 'soup',
    name: 'Egusi Soup',
    desc: 'Rich, meaty egusi soup with assorted protein. Best with pounded yam.',
    price: '₦ 3,000',
    image: 'images/egusi.png',
    emoji: '🥘',
    tag: 'Soup'
  },
  {
    id: 8, category: 'soup',
    name: 'Okro Soup',
    desc: 'Smooth, draw-y okro cooked with assorted meat and seafood.',
    price: '₦ 3,200',
    image: null,
    emoji: '🍵',
    tag: 'Soup'
  },
  {
    id: 9, category: 'soup',
    name: 'White Soup',
    desc: 'Creamy, light Igbo-style ofe onugbu. Delicate and deeply satisfying.',
    price: '₦ 3,500',
    image: null,
    emoji: '🍶',
    tag: 'Soup'
  },
  {
    id: 10, category: 'soup',
    name: 'Banga Soup',
    desc: 'Palm-nut banga soup — rich, bold, made from scratch daily.',
    price: '₦ 3,500',
    image: null,
    emoji: '🫙',
    tag: 'Soup'
  },
  // RICE & MORE
  {
    id: 11, category: 'rice',
    name: 'Shawarma',
    desc: 'Loaded Lagos shawarma — chicken, coleslaw, sauce, the works.',
    price: '₦ 2,500',
    image: 'images/shawarma.png',
    emoji: '🌯',
    tag: 'Street Fave'
  },
  {
    id: 12, category: 'rice',
    name: 'Fried Rice',
    desc: 'Party-style fried rice with vegetables, egg, and your choice of protein.',
    price: '₦ 2,000',
    image: 'images/shawarma.png',
    emoji: '🍳',
    tag: 'Rice'
  },
  {
    id: 13, category: 'rice',
    name: 'Asun Jollof',
    desc: 'Smoky jollof rice topped with spicy peppered goat meat (asun). Fire! 🔥',
    price: '₦ 3,000',
    image: 'images/shawarma.png',
    emoji: '🔥',
    tag: 'Special'
  },
  {
    id: 14, category: 'rice',
    name: 'White Rice & Stew',
    desc: 'Fluffy white rice with rich tomato stew and choice of protein.',
    price: '₦ 1,800',
    image: null,
    emoji: '🍚',
    tag: 'Rice'
  },
  {
    id: 15, category: 'rice',
    name: 'Coconut Rice',
    desc: 'Fragrant coconut-infused rice — sweet, savoury, and unique.',
    price: '₦ 2,500',
    image: null,
    emoji: '🥥',
    tag: 'Rice'
  }
];

/* ============================================================
   RENDER MENU CARDS
   ============================================================ */
function buildMenuCard(item) {
  const orderMsg = encodeURIComponent(`Hello Sacred Cuisine & Grills, I'd like to order: ${item.name}. Price: ${item.price}`);
  const imgHtml = item.image
    ? `<img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" />`
    : `<div class="menu-card-img-placeholder" aria-label="${item.name} image coming soon">${item.emoji}</div>`;

  return `
    <article class="menu-card" data-category="${item.category}" role="listitem">
      ${imgHtml}
      <div class="menu-card-body">
        <div class="menu-card-tag">${item.tag}</div>
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${item.price}</span>
          <button
            class="menu-order-btn"
            onclick="orderItem('${encodeURIComponent(item.name)}', '${encodeURIComponent(item.price)}')"
            aria-label="Order ${item.name}">
            Order Now
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderMenu(filter) {
  const grid = document.getElementById('menuGrid');
  const filtered = filter === 'all'
    ? menuItems
    : menuItems.filter(i => i.category === filter);

  grid.innerHTML = filtered.map(buildMenuCard).join('');
}

function orderItem(encodedName, encodedPrice) {
  const name = decodeURIComponent(encodedName);
  const price = decodeURIComponent(encodedPrice);
  const msg = encodeURIComponent(`Hello Sacred Cuisine & Grills, I'd like to order: ${name} (${price}). Please confirm availability and delivery details. Thank you!`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener');
}

/* ============================================================
   FILTER TABS
   ============================================================ */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const filter = btn.getAttribute('data-filter');
      renderMenu(filter);
      initScrollReveal(); // re-observe new cards
    });
  });
}

/* ============================================================
   FLAME PARTICLES
   ============================================================ */
function createFlames() {
  const container = document.getElementById('flames');
  if (!container) return;

  const colors = ['#FF6B00', '#C0392B', '#FF9500', '#ff4500', '#ffcc00'];
  const count = window.innerWidth < 600 ? 18 : 35;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'flame-particle';
    const size = Math.random() * 10 + 4;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size * 3}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 2 + 1.5}s;
      animation-delay: ${Math.random() * 3}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   PARALLAX HERO
   ============================================================ */
function initParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
}

/* ============================================================
   STICKY HEADER
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + '+';
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initCounter() {
  const el = document.getElementById('statCustomers');
  if (!el) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter(el, 500, 1800);
      observer.disconnect();
    }
  });
  observer.observe(el);
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function openNav() {
  document.getElementById('mobileNav').classList.add('open');
  document.getElementById('mobileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   MENU CARD SCROLL ANIMATION (add fade-in after render)
   ============================================================ */
function addFadeInToCards() {
  document.querySelectorAll('.menu-card').forEach((card, i) => {
    card.classList.add('fade-in');
    card.style.transitionDelay = `${i * 0.05}s`;
  });
  initScrollReveal();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  renderMenu('all');
  addFadeInToCards();
  initFilters();
  createFlames();
  initParallax();
  initHeader();
  initScrollReveal();
  initCounter();

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
