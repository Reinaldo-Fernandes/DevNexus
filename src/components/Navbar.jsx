import React from 'react';

export default function Navbar() {
  return (
    <header>
      <div className="navbar">
        <h1>Empresas</h1>
        <nav>
          <a href="/index.html">Home</a>
          <a href="sobre.html">Sobre</a>
          <a href="projetos.html">Projetos</a>
          <a href="vagas.html">Vagas</a>
          <a href="perfil.html" className="perfil-link">Perfil</a>
        </nav>
      </div>
    </header>
  );
}
