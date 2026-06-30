// ===== MENU MOBILE =====
const toggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
  });

  // Fecha o menu ao clicar em qualquer link de navegação
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== HERO IMAGE FLUID MOTION =====
const heroImg = document.querySelector('.hero-image img');

if (heroImg) {
  const maxOffset = 15; // Máximo movimento (px)
  const mobileBreakpoint = 768;
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let rafId = null;
  let isMobile = window.innerWidth < mobileBreakpoint;

  // Suavização do movimento
  function animate() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    heroImg.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.03)`;
    rafId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (rafId === null) {
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopAnimation() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    heroImg.style.transform = 'none';
  }

  if (!isMobile) {
    startAnimation();
  } else {
    heroImg.style.transform = 'none';
  }

  // Captura movimento do mouse (só importa quando a animação está ativa)
  document.addEventListener('mousemove', (e) => {
    if (isMobile) return;

    const { innerWidth, innerHeight } = window;
    const xRatio = (e.clientX / innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / innerHeight - 0.5) * 2;

    mouseX = xRatio * maxOffset;
    mouseY = yRatio * maxOffset;
  });

  // Ativa/desativa o efeito ao cruzar o breakpoint, sem rodar o loop em telas pequenas
  window.addEventListener('resize', () => {
    const nowMobile = window.innerWidth < mobileBreakpoint;
    if (nowMobile === isMobile) return;

    isMobile = nowMobile;
    if (isMobile) {
      stopAnimation();
    } else {
      mouseX = 0;
      mouseY = 0;
      targetX = 0;
      targetY = 0;
      startAnimation();
    }
  });
}