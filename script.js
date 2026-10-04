/* ═══════════════════════════════════════════════════════════════════════════
   PURRORA — Luxury Cat Café  |  JavaScript
═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── SCROLLED NAV ─────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── HERO IMAGE SCALE-IN ──────────────────────────────────────────────── */
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) {
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
    }
  }

  /* ─── MOBILE MENU ──────────────────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMenu  = () => { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

  
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObs.observe(el));

  
  const tabs   = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');

      
      document.querySelectorAll(`#tab-${target} .reveal`).forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 50);
      });
    });
  });

  
  const track    = document.querySelector('.cats__track');
  const btnPrev  = document.getElementById('catsPrev');
  const btnNext  = document.getElementById('catsNext');

  if (track && btnPrev && btnNext) {
    const cardWidth = () => {
      const card = track.querySelector('.cat-card');
      if (!card) return 316;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap || '24');
      return card.offsetWidth + gap;
    };

    let currentIndex = 0;
    const totalCards = track.querySelectorAll('.cat-card').length;

    const visibleCount = () => {
      const wrapper = document.querySelector('.cats__scroll-wrapper');
      if (!wrapper) return 3;
      return Math.floor(wrapper.offsetWidth / cardWidth());
    };

    const maxIndex = () => Math.max(0, totalCards - visibleCount());

    const goTo = (idx) => {
      currentIndex = Math.max(0, Math.min(idx, maxIndex()));
      track.style.transform = `translateX(-${currentIndex * cardWidth()}px)`;
    };

    btnPrev.addEventListener('click', () => goTo(currentIndex - 1));
    btnNext.addEventListener('click', () => goTo(currentIndex + 1));

    // Drag-to-scroll
    let startX = 0, isDragging = false, dragDelta = 0;

    const dragStart = (e) => {
      isDragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      track.style.transition = 'none';
    };
    const dragMove = (e) => {
      if (!isDragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      dragDelta = x - startX;
      track.style.transform = `translateX(${-currentIndex * cardWidth() + dragDelta}px)`;
    };
    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = '';
      if (dragDelta < -60) goTo(currentIndex + 1);
      else if (dragDelta > 60) goTo(currentIndex - 1);
      else goTo(currentIndex);
      dragDelta = 0;
    };

    track.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchstart', dragStart, { passive: true });
    track.addEventListener('touchmove', dragMove, { passive: true });
    track.addEventListener('touchend', dragEnd);
  }

  
  const form        = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Reserving…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      formSuccess.style.display = 'block';
      form.reset();
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 1400);
  });

 
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav?.offsetHeight || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  
  const heroImg2 = document.querySelector('.hero__img');
  window.addEventListener('scroll', () => {
    if (!heroImg2) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg2.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });

  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const activeLinkObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--gold)'
              : '';
          });
        }
      });
    },
    { threshold: 0.45 }
  );
  sections.forEach(s => activeLinkObs.observe(s));

});
