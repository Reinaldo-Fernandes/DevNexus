/* ══════════════════════════════════════════════════════════
   empresa.js — painel da empresa: publicar vaga
   Depende de db.js (getSessao, salvarVaga, getVagasPorEmpresa)
═══════════════════════════════════════════════════════════ */

const sessao = getSessao();

const painelEl   = document.getElementById('painel-vaga');
const ctaLoginEl = document.getElementById('cta-login');
const formEl     = document.getElementById('form-vaga');
const minhasVagasEl = document.getElementById('minhas-vagas');

/* ── Mostra o painel certo dependendo de quem está logado ── */
function iniciarPainel() {
  const logadoComoEmpresa = sessao && sessao.tipo === 'empresa';

  if (painelEl)   painelEl.style.display   = logadoComoEmpresa ? 'block' : 'none';
  if (ctaLoginEl) ctaLoginEl.style.display = logadoComoEmpresa ? 'none'  : 'block';

  if (logadoComoEmpresa) {
    renderizarMinhasVagas();
  }
}

/* ── Lista as vagas que ESSA empresa já publicou, com os
   candidatos reais de cada uma ─────────────────────────── */
function renderizarMinhasVagas() {
  if (!minhasVagasEl) return;
  const vagas = getVagasPorEmpresa(sessao.id);

  if (vagas.length === 0) {
    minhasVagasEl.innerHTML = '<p class="empty-state">Você ainda não publicou nenhuma vaga.</p>';
    return;
  }

  minhasVagasEl.innerHTML = '';
  vagas.slice().reverse().forEach(v => {
    const candidaturas = getCandidaturasPorVaga(v.id);
    const candidatos = candidaturas
      .map(c => getPerfilPorId(c.devId))
      .filter(Boolean); // remove caso o perfil tenha sido excluído

    const li = document.createElement('li');
    li.className = 'vaga-item';
    li.dataset.id = v.id;
    li.innerHTML = `
      <div class="vaga-item-linha">
        <span>${v.titulo} — <span class="muted">${v.local || 'remoto'}</span></span>
        <span class="mini-card-actions">
          <button type="button" class="btn-candidatos">
            ${candidatos.length} candidato${candidatos.length === 1 ? '' : 's'}
          </button>
          <button type="button" class="btn-editar">Editar</button>
          <button type="button" class="btn-excluir">Excluir</button>
        </span>
      </div>
      <ul class="lista-candidatos" style="display:none;">
        ${candidatos.length === 0
          ? '<li class="empty-state">Ninguém se candidatou ainda.</li>'
          : candidatos.map(d => `
              <li>
                <span>${d.nome}${d.headline ? ' — <span class="muted">' + d.headline + '</span>' : ''}</span>
                ${d.email ? `<a href="mailto:${d.email}" class="btn-contatar">Contatar</a>` : ''}
              </li>
            `).join('')}
      </ul>
    `;
    minhasVagasEl.appendChild(li);
  });
}

/* ── Delegação de evento pros botões editar/excluir/candidatos ── */
if (minhasVagasEl) {
  minhasVagasEl.addEventListener('click', (e) => {
    const item = e.target.closest('.vaga-item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.closest('.btn-candidatos')) {
      const lista = item.querySelector('.lista-candidatos');
      lista.style.display = lista.style.display === 'none' ? 'block' : 'none';
      return;
    }

    if (e.target.closest('.btn-editar')) {
      entrarModoEdicaoVaga(id);
      return;
    }

    if (e.target.closest('.btn-excluir')) {
      if (!confirm('Excluir esta vaga? Essa ação não pode ser desfeita.')) return;
      excluirVaga(id);
      renderizarMinhasVagas();
      if (document.getElementById('v-editando-id').value === id) {
        sairModoEdicaoVaga();
      }
    }
  });
}

function entrarModoEdicaoVaga(id) {
  const vaga = getVagasPorEmpresa(sessao.id).find(v => v.id === id);
  if (!vaga) return;

  document.getElementById('v-editando-id').value = vaga.id;
  document.getElementById('v-titulo').value = vaga.titulo;
  document.getElementById('v-descricao').value = vaga.descricao;
  document.getElementById('v-local').value = vaga.local || '';
  document.getElementById('v-remoto').checked = !!vaga.remoto;
  document.getElementById('v-salario-min').value = vaga.salarioMin || '';
  document.getElementById('v-salario-max').value = vaga.salarioMax || '';

  document.getElementById('titulo-form-vaga').textContent = 'Editando vaga';
  document.getElementById('btn-salvar-vaga').textContent = 'Salvar alterações';
  document.getElementById('btn-cancelar-edicao-vaga').style.display = 'inline-block';

  formEl.scrollIntoView({ behavior: 'smooth' });
}

function sairModoEdicaoVaga() {
  formEl.reset();
  document.getElementById('v-editando-id').value = '';
  document.getElementById('titulo-form-vaga').textContent = 'Publicar uma vaga';
  document.getElementById('btn-salvar-vaga').textContent = 'Publicar vaga';
  document.getElementById('btn-cancelar-edicao-vaga').style.display = 'none';
}

const btnCancelarEdicaoVaga = document.getElementById('btn-cancelar-edicao-vaga');
if (btnCancelarEdicaoVaga) {
  btnCancelarEdicaoVaga.addEventListener('click', sairModoEdicaoVaga);
}

/* ── Envio do formulário: cria OU atualiza, dependendo se
   v-editando-id está preenchido ──────────────────────────── */
function publicarVaga() {
  const editandoId = document.getElementById('v-editando-id').value;
  const titulo    = document.getElementById('v-titulo').value.trim();
  const descricao = document.getElementById('v-descricao').value.trim();
  const local     = document.getElementById('v-local').value.trim();
  const remoto    = document.getElementById('v-remoto').checked;
  const salarioMin = document.getElementById('v-salario-min').value;
  const salarioMax = document.getElementById('v-salario-max').value;

  if (!titulo || !descricao) {
    alert('Preencha ao menos o título e a descrição da vaga.');
    return;
  }

  const dados = {
    titulo,
    descricao,
    local,
    remoto,
    salarioMin: salarioMin ? Number(salarioMin) : null,
    salarioMax: salarioMax ? Number(salarioMax) : null
  };

  let ok;
  if (editandoId) {
    ok = atualizarVaga(editandoId, dados);
  } else {
    ok = salvarVaga({ id: gerarId(), empresaId: sessao.id, criadoEm: new Date().toISOString(), ...dados });
  }

  if (!ok) {
    alert('Não foi possível salvar a vaga. Tente novamente.');
    return;
  }

  sairModoEdicaoVaga();
  renderizarMinhasVagas();
  alert(editandoId ? 'Vaga atualizada!' : 'Vaga publicada! Ela já aparece em /vagas.html.');
}

if (formEl) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    publicarVaga();
  });
}

iniciarPainel();