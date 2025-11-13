import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2024 Minha Empresa. Todos os direitos reservados.</p>
      <nav>
        <a href="/privacy">Política de Privacidade</a>
        <a href="/terms">Termos de Serviço</a>
        <a href="/contact">Contato</a>
      </nav>
    </footer>
  );
}