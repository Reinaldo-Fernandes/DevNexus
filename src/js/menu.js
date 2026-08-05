/* ══════════════════════════════════════════════════════════
   menu.js — abre/fecha o menu mobile (☰)
   Reutilizado em toda página que tenha #menu-toggle + .nav-links
═══════════════════════════════════════════════════════════ */

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