/* ══════════════════════════════════════════════════════════
   contato.js — formulário de contato (sem backend por enquanto,
   guarda no mesmo localStorage do restante do site)
═══════════════════════════════════════════════════════════ */

const formContato = document.getElementById('form-contato');
const contatoSucesso = document.getElementById('contato-sucesso');

if (formContato) {
  formContato.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('c-nome').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const mensagem = document.getElementById('c-mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      alert('Preencha todos os campos.');
      return;
    }

    salvarMensagemContato({ nome, email, mensagem });

    formContato.reset();
    formContato.style.display = 'none';
    contatoSucesso.style.display = 'block';
  });
}