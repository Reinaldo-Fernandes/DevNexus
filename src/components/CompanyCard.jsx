import React from 'react';

export default function CompanyCard({ company, index }) {
  return (
    <article className="empresa-item" style={{ animationDelay: `${0.2 + index * 0.2}s` }}>
      <h3>{company.name}</h3>
      <p>{company.description}</p>
      <button className="btn-empresa" onClick={() => alert(`${company.name} — mais sobre a empresa`)}>
        Sobre a empresa
      </button>
    </article>
  );
}
