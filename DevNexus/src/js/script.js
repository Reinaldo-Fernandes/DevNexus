

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

// Função para abrir/fechar o Modal de Cadastro
function toggleAuthModal() {
  const authModal = document.getElementById('modal-auth');
  authModal.classList.toggle('hidden');
  document.body.style.overflow = authModal.classList.contains('hidden') ? 'auto' : 'hidden';
}

// Função para as regras (abre por cima do cadastro)
function openRules(type) {
  const modalRules = document.getElementById('modal-rules');
  const info = rulesData[type]; // vindo do rules.js
  
  document.getElementById('modal-title').innerText = info.title;
  document.getElementById('modal-header').className = `p-5 text-white font-bold text-xl flex justify-between items-center ${info.color}`;
  document.getElementById('modal-content').innerHTML = info.items.map(i => `<li>${i}</li>`).join('');
  
  modalRules.classList.remove('hidden');
}

function closeRules() {
  document.getElementById('modal-rules').classList.add('hidden');
}

import React, { useState } from 'react';

const TermsAcceptance = ({ onAccept }) => {
  const [read, setRead] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Se o usuário chegou ao fim do texto
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setRead(true);
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      <h3 className="font-bold mb-2">Termos e Condições Jurídicas</h3>
      <div 
        onScroll={handleScroll}
        className="h-48 overflow-y-scroll bg-gray-50 p-2 text-sm border"
      >
        {/* Insira aqui o texto jurídico completo do item 2 */}
        <p>CONTRATO DE ADESÃO... (Texto Longo)...</p>
      </div>
      
      <div className="mt-4 flex items-center">
        <input 
          type="checkbox" 
          disabled={!read} 
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="mr-2"
        />
        <label className={read ? "text-black" : "text-gray-400"}>
          {read ? "Eu li e aceito todos os termos jurídicos" : "Role até o fim para aceitar"}
        </label>
      </div>

      <button 
        disabled={!checked}
        onClick={onAccept}
        className={`mt-4 px-4 py-2 rounded text-white ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        Finalizar Cadastro
      </button>
    </div>
  );
};

/*Parte Dev*/
 // Imagens do Projetos.
 // Link do Projeto 
 // Descrição do Projeto
 // Link do GitHub ou Repositório

/*Empresa */
// Anuncios das Vagas
// Link para Candidatar-se
// Descrição da Vaga
// Requisitos da Vaga