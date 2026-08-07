/* ══════════════════════════════════════════════════════════
   perfil.js — página de perfil (dev ou empresa)
   Depende de db.js já carregado.
═══════════════════════════════════════════════════════════ */

const sessao = getSessao();

const elVazio   = document.getElementById('estado-vazio');
const elDev     = document.getElementById('perfil-dev');
const elEmpresa = document.getElementById('perfil-empresa');
const btnSair   = document.getElementById('btn-sair');
const formProjeto = document.getElementById('form-projeto');

function iniciar() {
  if (!sessao) {
    elVazio.style.display = 'block';
    return;
  }

  btnSair.style.display = 'inline-block';

  if (sessao.tipo === 'dev') {
    elDev.style.display = 'block';
    carregarPerfilDev();
    renderizarMeusProjetos();
  } else if (sessao.tipo === 'empresa') {
    elEmpresa.style.display = 'block';
    carregarPerfilEmpresa();
    renderizarMinhasVagas();
  }
}

/* ── Lado DEV ────────────────────────────────────────────── */
function carregarPerfilDev() {
  const perfil = getPerfilPorId(sessao.id);
  if (!perfil) return;
  document.getElementById('perfil-nome').textContent = perfil.nome;
  document.getElementById('perfil-headline').textContent = perfil.headline;
  document.getElementById('perfil-senioridade').textContent = formatarSenioridade(perfil.senioridade);
  document.getElementById('perfil-stacks').innerHTML =
    perfil.stacks.map(s => `<span>${s}</span>`).join('');

  const avatarEl = document.getElementById('perfil-avatar');
  if (perfil.avatar) {
    avatarEl.innerHTML = `<img src="${perfil.avatar}" alt="Avatar de ${perfil.nome}">`;
  } else {
    // sem foto salva: mostra a inicial do nome como fallback
    avatarEl.textContent = (perfil.nome || '?').trim().charAt(0).toUpperCase();
  }
}

/* Traduz o value do radio (junior/pleno/senior) pro texto exibido */
function formatarSenioridade(valor) {
  const mapa = { junior: 'Junior', pleno: 'Pleno', senior: 'Sênior' };
  return mapa[valor] || valor || '';
}

function renderizarMeusProjetos() {
  const container = document.getElementById('meus-projetos');
  const projetos = getProjetosPorDev(sessao.id);

  if (projetos.length === 0) {
    container.innerHTML = '<p class="empty-state">Você ainda não publicou nenhum projeto.</p>';
    return;
  }

  container.innerHTML = '';
  projetos.slice().reverse().forEach(p => {
    const card = document.createElement('div');
    card.className = 'mini-card';
    card.dataset.id = p.id;
    card.innerHTML = `
      <h4>${p.titulo}</h4>
      <p>${p.descricao}</p>
      <div class="tags">${p.tecnologias.map(t => `<span>${t}</span>`).join('')}</div>
      <div class="mini-card-actions">
        <button type="button" class="btn-editar">Editar</button>
        <button type="button" class="btn-excluir">Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ── Delegação de evento: um listener só, cobre todos os
   cards, inclusive os que ainda vão ser criados. ────────── */
const containerMeusProjetos = document.getElementById('meus-projetos');
if (containerMeusProjetos) {
  containerMeusProjetos.addEventListener('click', (e) => {
    const card = e.target.closest('.mini-card');
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.closest('.btn-editar')) {
      entrarModoEdicaoProjeto(id);
    }

    if (e.target.closest('.btn-excluir')) {
      if (!confirm('Excluir este projeto? Essa ação não pode ser desfeita.')) return;
      excluirProjeto(id);
      renderizarMeusProjetos();
      // se o item excluído era o que estava sendo editado, cancela a edição
      if (document.getElementById('p-editando-id').value === id) {
        sairModoEdicaoProjeto();
      }
    }
  });
}

/* ── Modo de edição: preenche o formulário com os dados
   existentes e lembra, via campo escondido, qual id estamos
   atualizando (em vez de criar um projeto novo). ─────────── */
function entrarModoEdicaoProjeto(id) {
  const projeto = getProjetosPorDev(sessao.id).find(p => p.id === id);
  if (!projeto) return;

  document.getElementById('p-editando-id').value = projeto.id;
  document.getElementById('p-titulo').value = projeto.titulo;
  document.getElementById('p-descricao').value = projeto.descricao;
  document.getElementById('p-link').value = projeto.link || '';
  document.getElementById('p-tecnologias').value = (projeto.tecnologias || []).join(', ');
  document.getElementById('p-participantes').value = projeto.participantes || 1;
  document.getElementById('p-imagem').value = projeto.imagem || '';

  document.getElementById('titulo-form-projeto').textContent = 'Editando projeto';
  document.getElementById('btn-salvar-projeto').textContent = 'Salvar alterações';
  document.getElementById('btn-cancelar-edicao-projeto').style.display = 'inline-block';

  formProjeto.scrollIntoView({ behavior: 'smooth' });
}

function sairModoEdicaoProjeto() {
  formProjeto.reset();
  document.getElementById('p-editando-id').value = '';
  document.getElementById('titulo-form-projeto').textContent = 'Publicar um novo projeto';
  document.getElementById('btn-salvar-projeto').textContent = 'Publicar projeto';
  document.getElementById('btn-cancelar-edicao-projeto').style.display = 'none';
}

const btnCancelarEdicaoProjeto = document.getElementById('btn-cancelar-edicao-projeto');
if (btnCancelarEdicaoProjeto) {
  btnCancelarEdicaoProjeto.addEventListener('click', sairModoEdicaoProjeto);
}

function publicarProjeto(e) {
  e.preventDefault();

  const editandoId  = document.getElementById('p-editando-id').value;
  const titulo      = document.getElementById('p-titulo').value.trim();
  const descricao   = document.getElementById('p-descricao').value.trim();
  const link        = document.getElementById('p-link').value.trim();
  const tecRaw      = document.getElementById('p-tecnologias').value.trim();
  const participantes = document.getElementById('p-participantes').value;
  const imagem      = document.getElementById('p-imagem').value.trim();

  if (!titulo || !descricao) {
    alert('Preencha ao menos o título e a descrição do projeto.');
    return;
  }

  const dados = {
    titulo,
    descricao,
    link,
    tecnologias: tecRaw ? tecRaw.split(',').map(t => t.trim()).filter(Boolean) : [],
    participantes: participantes ? Number(participantes) : 1,
    imagem
  };

  let ok;
  if (editandoId) {
    ok = atualizarProjeto(editandoId, dados);
  } else {
    ok = salvarProjeto({ id: gerarId(), devId: sessao.id, criadoEm: new Date().toISOString(), ...dados });
  }

  if (!ok) {
    alert('Não foi possível salvar o projeto. Tente novamente.');
    return;
  }

  sairModoEdicaoProjeto();
  renderizarMeusProjetos();
  alert(editandoId ? 'Projeto atualizado!' : 'Projeto publicado! Ele já aparece em /projetos.html.');
}

if (formProjeto) formProjeto.addEventListener('submit', publicarProjeto);

/* ── Lado EMPRESA ────────────────────────────────────────── */
function carregarPerfilEmpresa() {
  const perfil = getPerfilPorId(sessao.id);
  if (!perfil) return;
  document.getElementById('perfil-empresa-nome').textContent = perfil.nome;
  document.getElementById('perfil-empresa-segmento').textContent = perfil.segmento || 'Segmento não informado';
}

function renderizarMinhasVagas() {
  const container = document.getElementById('minhas-vagas-perfil');
  const vagas = getVagasPorEmpresa(sessao.id);

  if (vagas.length === 0) {
    container.innerHTML = '<p class="empty-state">Você ainda não publicou nenhuma vaga. <a href="empresa.html">Publicar agora</a></p>';
    return;
  }

  container.innerHTML = vagas
    .slice().reverse()
    .map(v => `<li>${v.titulo} — <span class="muted">${v.local || 'remoto'}</span></li>`)
    .join('');
}

/* ── Sair ────────────────────────────────────────────────── */
if (btnSair) {
  btnSair.addEventListener('click', () => {
    encerrarSessao();
    location.reload();
  });
}

iniciar();