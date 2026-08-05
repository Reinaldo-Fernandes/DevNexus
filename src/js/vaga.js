/* ══════════════════════════════════════════════════════════
   vaga.js — renderiza os cards de vaga em vagas.html
   Depende de db.js (getVagas, getPerfilPorId) já carregado.
═══════════════════════════════════════════════════════════ */

const listaVagasEl = document.getElementById('lista-vagas');

function formatarSalario(min, max) {
  if (!min && !max) return '💰 A combinar';
  const fmt = n => Number(n).toLocaleString('pt-BR');
  if (min && max) return `💰 R$ ${fmt(min)} - R$ ${fmt(max)}`;
  return `💰 A partir de R$ ${fmt(min || max)}`;
}

function criarCardVaga(vaga) {
  const empresa = getPerfilPorId(vaga.empresaId);
  const nomeEmpresa = empresa ? empresa.nome : 'Empresa';
  const sessao = getSessao();
  const jaSeCandidatou = sessao && sessao.tipo === 'dev' && jaCandidatado(vaga.id, sessao.id);

  const card = document.createElement('div');
  card.className = 'job-card';
  card.dataset.vagaId = vaga.id;
  card.innerHTML = `
    <div class="job-header">
        <div>
            <h3>${vaga.titulo}</h3>
            <span class="company">${nomeEmpresa}</span>
        </div>
        <span class="badge ${vaga.remoto ? 'remote' : ''}">${vaga.remoto ? 'Remoto' : 'Presencial'}</span>
    </div>

    <p class="description">${vaga.descricao}</p>

    <div class="job-info">
        <span>📍 ${vaga.local || 'Não informado'}</span>
        <span>${formatarSalario(vaga.salarioMin, vaga.salarioMax)}</span>
    </div>

    <button class="apply-btn" ${jaSeCandidatou ? 'disabled' : ''}>${jaSeCandidatou ? 'Candidatura enviada ✓' : 'Candidatar-se'}</button>
  `;
  return card;
}

function renderizarVagas() {
  if (!listaVagasEl) return;
  const vagas = getVagas();

  if (vagas.length === 0) {
    listaVagasEl.innerHTML = '<p class="empty-state">Nenhuma vaga publicada ainda. Volte em breve!</p>';
    return;
  }

  listaVagasEl.innerHTML = '';
  // .reverse() pra mostrar as vagas mais recentes primeiro
  vagas.slice().reverse().forEach(vaga => {
    listaVagasEl.appendChild(criarCardVaga(vaga));
  });
}

/* ── Delegação de evento ──────────────────────────────────
   Antes: document.querySelector('.apply-btn') pegava só o
   PRIMEIRO botão que existia no HTML no momento em que o
   script rodava — cards criados depois (via renderizarVagas)
   ficavam mudos, porque nunca tiveram um listener próprio.

   Agora: o listener fica no container (#lista-vagas), que
   nunca é substituído. Quando um clique acontece em QUALQUER
   lugar dentro dele, a gente checa se foi em um .apply-btn
   usando closest(). Assim funciona pra 0, 1 ou 100 cards,
   inclusive os que ainda nem existem quando essa linha roda. */
if (listaVagasEl) {
  listaVagasEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.apply-btn');
    if (!btn) return;

    const sessao = getSessao();
    if (!sessao) {
      alert('Você precisa estar logado como desenvolvedor para se candidatar. Faça login ou cadastre-se.');
      return;
    }
    if (sessao.tipo !== 'dev') {
      alert('Apenas contas de desenvolvedor podem se candidatar a vagas.');
      return;
    }

    const card = btn.closest('.job-card');
    const vagaId = card.dataset.vagaId;

    if (jaCandidatado(vagaId, sessao.id)) {
      alert('Você já se candidatou a essa vaga.');
      return;
    }

    const ok = candidatar(vagaId, sessao.id);
    if (!ok) {
      alert('Não foi possível registrar sua candidatura. Tente novamente.');
      return;
    }

    btn.textContent = 'Candidatura enviada ✓';
    btn.disabled = true;
  });
}

renderizarVagas();