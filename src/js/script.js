// ===== MENU MOBILE =====
const toggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ===== HERO IMAGE FLUID MOTION =====
const heroImg = document.querySelector('.hero-image img');

if (heroImg) {
  const maxOffset = 15; // Máximo movimento (px)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  // Suavização do movimento
  function animate() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    heroImg.style.transform = `translate(${targetX}px, ${targetY}px) scale(1.03)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Captura movimento do mouse
  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const xRatio = (e.clientX / innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / innerHeight - 0.5) * 2;

    mouseX = xRatio * maxOffset;
    mouseY = yRatio * maxOffset;
  });

  // Remove o efeito em telas pequenas
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      heroImg.style.transform = 'none';
    }
  });
}
