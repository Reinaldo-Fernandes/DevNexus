import React, { useState } from 'react';
// Importe componentes de formulário individuais aqui (por exemplo, CompanyProfileForm e JobPostingForm)

function CompanyForm() {
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    logo: null,
  });

  const [jobPostings, setJobPostings] = useState([]);
  const [currentJob, setCurrentJob] = useState({
    title: '',
    location: '',
    type: 'full-time',
    description: '',
    requirements: '',
  });

  // Funções de manipulação e submissão

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setCurrentJob(prev => ({ ...prev, [name]: value }));
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (currentJob.title && currentJob.description) {
      setJobPostings(prev => [...prev, { ...currentJob, id: Date.now() }]);
      // Resetar o formulário da vaga
      setCurrentJob({
        title: '',
        location: '',
        type: 'full-time',
        description: '',
        requirements: '',
      });
    } else {
        alert("Preencha o Título e a Descrição da Vaga.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do Perfil:", profileData);
    console.log("Vagas Publicadas:", jobPostings);
    
    // Lógica para enviar dados para a API/servidor
    alert("Formulário Submetido com Sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>✏️ Perfil da Empresa</h2>
      {/* Componente ou campos para o Perfil da Empresa */}
      <input 
        type="text" 
        name="name" 
        placeholder="Nome da Empresa" 
        value={profileData.name} 
        onChange={handleProfileChange} 
        required
      />
      <textarea 
        name="description" 
        placeholder="Descrição da Empresa" 
        value={profileData.description} 
        onChange={handleProfileChange} 
        required
      />
      {/* Adicione mais campos de perfil (Indústria, Website, Logo, etc.) */}
      
      <hr />
      
      <h2>💼 Publicar Nova Vaga</h2>
      {/* Componente ou campos para a Publicação de Vaga */}
      <input 
        type="text" 
        name="title" 
        placeholder="Título da Vaga" 
        value={currentJob.title} 
        onChange={handleJobChange} 
        required
      />
      <select name="type" value={currentJob.type} onChange={handleJobChange}>
        <option value="full-time">Tempo Integral</option>
        <option value="part-time">Meio Período</option>
        <option value="contract">Contrato</option>
      </select>
      <textarea 
        name="description" 
        placeholder="Descrição da Vaga" 
        value={currentJob.description} 
        onChange={handleJobChange} 
        required
      />
      <button type="button" onClick={handleAddJob}>Adicionar Vaga Temporariamente</button>

      <hr />

      <h3>Vagas a Serem Publicadas ({jobPostings.length})</h3>
      {jobPostings.map((job) => (
        <div key={job.id}>
          <strong>{job.title}</strong> - {job.type}
        </div>
      ))}

      <hr />
      
      <button type="submit">Salvar Perfil e Publicar Vagas</button>
    </form>
  );
}

export default CompanyForm;