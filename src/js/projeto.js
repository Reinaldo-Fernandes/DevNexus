/* ══════════════════════════════════════════════════════════
   projeto.js — renderiza os cards de projeto em projetos.html
   Depende de db.js (getProjetos, getPerfilPorId) já carregado.
═══════════════════════════════════════════════════════════ */

const listaProjetosEl = document.getElementById('lista-projetos');

function criarCardProjeto(projeto) {
  const dev = getPerfilPorId(projeto.devId);
  const nomeDev = dev ? dev.nome : 'Desenvolvedor';
  const sessao = getSessao();
  const jaSolicitou = sessao && sessao.tipo === 'dev' && jaSolicitouParticipacao(projeto.id, sessao.id);

  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.projetoId = projeto.id;
  card.innerHTML = `
    <div class="project-image-container">
        <img
            src="${projeto.imagem || 'https://picsum.photos/600/300'}"
            alt="Projeto"
            class="project-image"
        >
        <div class="project-placeholder">🚀</div>
    </div>

    <div class="project-content">
        <h3>${projeto.titulo}</h3>
        <p>${projeto.descricao}</p>
        <span class="autor">por ${nomeDev}</span>

        <div class="tags">
            ${projeto.tecnologias.map(t => `<span>${t}</span>`).join('')}
        </div>

        <div class="project-footer">
            <span>👥 ${projeto.participantes || 1} participantes</span>
            <div class="project-footer-actions">
                <button type="button" class="btn-participar" ${jaSolicitou ? 'disabled' : ''}>${jaSolicitou ? 'Pedido enviado ✓' : 'Quero participar'}</button>
                <button type="button" class="btn-ver">Ver Projeto</button>
            </div>
        </div>
    </div>
  `;

  // Mesma lógica de fallback que já existia: se a imagem quebrar,
  // esconde ela e mostra o emoji de placeholder no lugar.
  const img = card.querySelector('.project-image');
  img.onerror = () => {
    img.style.display = 'none';
    card.querySelector('.project-placeholder').style.display = 'flex';
  };

  return card;
}

function renderizarProjetos() {
  if (!listaProjetosEl) return;
  const projetos = getProjetos();

  if (projetos.length === 0) {
    listaProjetosEl.innerHTML = '<p class="empty-state">Nenhum projeto publicado ainda. Seja o primeiro!</p>';
    return;
  }

  listaProjetosEl.innerHTML = '';
  projetos.slice().reverse().forEach(projeto => {
    listaProjetosEl.appendChild(criarCardProjeto(projeto));
  });
}

/* ── Delegação de evento (mesma ideia do vaga.js) ────────── */
if (listaProjetosEl) {
  listaProjetosEl.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;
    const projetoId = card.dataset.projetoId;

    // "Ver Projeto" — sempre disponível, não precisa estar logado
    if (e.target.closest('.btn-ver')) {
      const projeto = getProjetos().find(p => p.id === projetoId);
      if (projeto && projeto.link) {
        window.open(projeto.link, '_blank');
      } else {
        alert('Esse projeto ainda não tem um link cadastrado.');
      }
      return;
    }

    // "Quero participar" — precisa de um dev logado, e registra de verdade
    const btnParticipar = e.target.closest('.btn-participar');
    if (btnParticipar) {
      const sessao = getSessao();
      if (!sessao) {
        alert('Você precisa estar logado como desenvolvedor para pedir participação. Faça login ou cadastre-se.');
        return;
      }
      if (sessao.tipo !== 'dev') {
        alert('Apenas contas de desenvolvedor podem pedir para participar de projetos.');
        return;
      }
      if (jaSolicitouParticipacao(projetoId, sessao.id)) {
        alert('Você já pediu para participar desse projeto.');
        return;
      }

      const ok = solicitarParticipacao(projetoId, sessao.id);
      if (!ok) {
        alert('Não foi possível enviar o pedido. Tente novamente.');
        return;
      }

      btnParticipar.textContent = 'Pedido enviado ✓';
      btnParticipar.disabled = true;
    }
  });
}

renderizarProjetos();