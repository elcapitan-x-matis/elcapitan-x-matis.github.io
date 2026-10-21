/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!toggle || !icon) return;

  const saved = localStorage.getItem('ck-theme') || 'dark';
  html.setAttribute('data-bs-theme', saved);
  updateIcon(saved);

  toggle.addEventListener('click', function () {
    const current = html.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', next);
    localStorage.setItem('ck-theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark'
      ? 'bi bi-moon-stars-fill'
      : 'bi bi-sun-fill';
  }
})();

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function initProgressBar() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ============================================================
   TYPING EFFECT — Hero section
   ============================================================ */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'ICT Support Officer',
    'Web Application Developer',
    'Office 365 & SharePoint Admin',
    'SQL & ASYCUDA World Reporting',
    'Systems & Network Support'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 70);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  }
  tick();
})();

/* ============================================================
   NAV ACTIVE STATE ON SCROLL
   ============================================================ */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (sec) { observer.observe(sec); });
})();

/* ============================================================
   FOOTER YEAR
   ============================================================ */
(function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ============================================================
   FLOATING SCROLL TO TOP BUTTON
   ============================================================ */
(function initScrollTopButton() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function () {
    // Show button after scrolling down 300px
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }, { passive: true });

  // Smooth scroll to top on click
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();