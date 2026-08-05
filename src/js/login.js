/* ══════════════════════════════════════════════════════════
   login.js — reativa a sessão de quem já tem cadastro
   Depende de db.js já carregado.

   Importante (ponto de aprendizado): como o cadastro.js não
   guarda a senha no perfil salvo (guardar senha em texto puro
   no localStorage seria inseguro), esse login NÃO confere
   senha de verdade — ele só localiza o perfil pelo e-mail ou
   username e reabre a sessão. Num backend real, a senha seria
   verificada no servidor contra um hash, nunca no navegador.
═══════════════════════════════════════════════════════════ */

const formLogin = document.getElementById('form-login');
const erroLoginEl = document.getElementById('login-erro');

if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    erroLoginEl.style.display = 'none';

    const valor = document.getElementById('login-identificador').value.trim().toLowerCase();
    if (!valor) return;

    const perfil = getPerfis().find(p =>
      (p.email && p.email.toLowerCase() === valor) ||
      (p.username && p.username.toLowerCase() === valor)
    );

    if (!perfil) {
      erroLoginEl.style.display = 'block';
      return;
    }

    iniciarSessao(perfil);
    window.location.href = 'perfil.html';
  });
}