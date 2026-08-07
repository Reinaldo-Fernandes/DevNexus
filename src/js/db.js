/* ══════════════════════════════════════════════════════════
   db.js — camada de dados do DevNexus
   Usa o localStorage do navegador como um "banco de dados"
   temporário. Toda página que precisa ler ou salvar perfis,
   sessão, projetos ou vagas inclui este arquivo ANTES do
   script próprio dela.

   Chaves usadas:
   - devnexus_perfis   → lista de todos os perfis (empresa + dev)
   - devnexus_sessao   → objeto único: quem está logado agora
   - devnexus_projetos → lista de projetos publicados pelos devs
   - devnexus_vagas    → lista de vagas publicadas pelas empresas
═══════════════════════════════════════════════════════════ */

const DB_PERFIS   = 'devnexus_perfis';
const DB_SESSAO   = 'devnexus_sessao';
const DB_PROJETOS = 'devnexus_projetos';
const DB_VAGAS    = 'devnexus_vagas';

/* ── util genérico ──────────────────────────────────────
   lerLista/salvarLista fazem o trabalho pesado (JSON.parse,
   try/catch) uma única vez, pra getPerfis/getProjetos/getVagas
   não precisarem repetir a mesma lógica cada um. */
function gerarId() {
  return (crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2));
}

function lerLista(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch (e) {
    console.error(`Não foi possível ler "${chave}":`, e);
    return [];
  }
}

function salvarLista(chave, lista) {
  try {
    localStorage.setItem(chave, JSON.stringify(lista));
    return true;
  } catch (e) {
    console.error(`Não foi possível salvar "${chave}":`, e);
    return false;
  }
}

/* ── perfis (empresa + dev) ─────────────────────────────── */
function getPerfis() {
  return lerLista(DB_PERFIS);
}

function getPerfilPorId(id) {
  return getPerfis().find(p => p.id === id) || null;
}

function salvarPerfil(perfil) {
  const perfis = getPerfis();
  perfis.push(perfil);
  return salvarLista(DB_PERFIS, perfis);
}

/* ── checagens de duplicidade ────────────────────────────
   Comparamos sempre em minúsculas pra "Joao@Mail.com" e
   "joao@mail.com" contarem como o mesmo e-mail. */
function emailJaCadastrado(email) {
  const alvo = (email || '').trim().toLowerCase();
  if (!alvo) return false;
  return getPerfis().some(p => (p.email || '').toLowerCase() === alvo);
}

function usernameJaCadastrado(username) {
  const alvo = (username || '').trim().toLowerCase();
  if (!alvo) return false;
  return getPerfis().some(p => (p.username || '').toLowerCase() === alvo);
}

function cnpjJaCadastrado(cnpj) {
  const alvo = (cnpj || '').replace(/\D/g, '');
  if (!alvo) return false;
  return getPerfis().some(p => (p.cnpj || '').replace(/\D/g, '') === alvo);
}

/* ── sessão (quem está logado agora) ────────────────────── */
function getSessao() {
  try {
    return JSON.parse(localStorage.getItem(DB_SESSAO));
  } catch (e) {
    return null;
  }
}

function iniciarSessao(perfil) {
  const sessao = { id: perfil.id, tipo: perfil.tipo, nome: perfil.nome };
  return salvarLista(DB_SESSAO, sessao); // salvarLista funciona pra objeto também, não só array
}

function encerrarSessao() {
  localStorage.removeItem(DB_SESSAO);
}

/* ── util genérico pra excluir/atualizar um item específico
   dentro de uma lista, pelo id ──────────────────────────── */
function excluirDeLista(chave, id) {
  const lista = lerLista(chave).filter(item => item.id !== id);
  return salvarLista(chave, lista);
}

function atualizarEmLista(chave, id, dadosNovos) {
  const lista = lerLista(chave);
  const indice = lista.findIndex(item => item.id === id);
  if (indice === -1) return false;
  lista[indice] = { ...lista[indice], ...dadosNovos }; // mescla o que mudou com o que já existia
  return salvarLista(chave, lista);
}

/* ── projetos (publicados por devs) ─────────────────────── */
function getProjetos() {
  return lerLista(DB_PROJETOS);
}

function getProjetosPorDev(devId) {
  return getProjetos().filter(p => p.devId === devId);
}

function salvarProjeto(projeto) {
  const projetos = getProjetos();
  projetos.push(projeto);
  return salvarLista(DB_PROJETOS, projetos);
}

function excluirProjeto(id) { return excluirDeLista(DB_PROJETOS, id); }
function atualizarProjeto(id, dados) { return atualizarEmLista(DB_PROJETOS, id, dados); }

/* ── vagas (publicadas por empresas) ────────────────────── */
function getVagas() {
  return lerLista(DB_VAGAS);
}

function getVagasPorEmpresa(empresaId) {
  return getVagas().filter(v => v.empresaId === empresaId);
}

function salvarVaga(vaga) {
  const vagas = getVagas();
  vagas.push(vaga);
  return salvarLista(DB_VAGAS, vagas);
}

function excluirVaga(id) { return excluirDeLista(DB_VAGAS, id); }
function atualizarVaga(id, dados) { return atualizarEmLista(DB_VAGAS, id, dados); }

/* ── candidaturas (dev → vaga) ───────────────────────────── */
const DB_CANDIDATURAS = 'devnexus_candidaturas';

function getCandidaturas() {
  return lerLista(DB_CANDIDATURAS);
}

function jaCandidatado(vagaId, devId) {
  return getCandidaturas().some(c => c.vagaId === vagaId && c.devId === devId);
}

function getCandidaturasPorVaga(vagaId) {
  return getCandidaturas().filter(c => c.vagaId === vagaId);
}

function candidatar(vagaId, devId) {
  if (jaCandidatado(vagaId, devId)) return false; // evita duplicar a mesma candidatura
  const lista = getCandidaturas();
  lista.push({ id: gerarId(), vagaId, devId, criadoEm: new Date().toISOString() });
  return salvarLista(DB_CANDIDATURAS, lista);
}

/* ── pedidos de participação (dev → projeto) ─────────────── */
const DB_PARTICIPACOES = 'devnexus_participacoes';

function getParticipacoes() {
  return lerLista(DB_PARTICIPACOES);
}

function jaSolicitouParticipacao(projetoId, devId) {
  return getParticipacoes().some(p => p.projetoId === projetoId && p.devId === devId);
}

function solicitarParticipacao(projetoId, devId) {
  if (jaSolicitouParticipacao(projetoId, devId)) return false;
  const lista = getParticipacoes();
  lista.push({ id: gerarId(), projetoId, devId, criadoEm: new Date().toISOString() });
  return salvarLista(DB_PARTICIPACOES, lista);
}

/* ── mensagens de contato ────────────────────────────────── */
const DB_MENSAGENS = 'devnexus_mensagens';

function salvarMensagemContato(mensagem) {
  const lista = lerLista(DB_MENSAGENS);
  lista.push({ id: gerarId(), ...mensagem, criadoEm: new Date().toISOString() });
  return salvarLista(DB_MENSAGENS, lista);
}