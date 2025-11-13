import React, { useState } from 'react';
import { User, Mail, Zap, BookOpen, MapPin, Code, ChevronLeft, ChevronRight } from 'lucide-react';

// --- COMPONENTE DE CADASTRO PARA DEVS ---

const DevRegistrationForm = () => {
  const [devData, setDevData] = useState({
    name: '',
    email: '',
    location: '',
    linkedin: '',
    github: '',
    // Etapa 2
    seniority: 'junior',
    techStack: [],
    yearsOfExperience: 0,
    portfolioLink: '',
    bio: '',
  });

  const [message, setMessage] = useState(''); // Estado para mensagens de feedback
  const [formStep, setFormStep] = useState(1); // 1: Perfil Básico, 2: Habilidades
  const [currentSkill, setCurrentSkill] = useState(''); // Para adicionar habilidades

  // Opções para Selects e Multi-selects
  const seniorityOptions = [
    { value: 'intern', label: 'Estágio' },
    { value: 'junior', label: 'Júnior' },
    { value: 'mid', label: 'Pleno' },
    { value: 'senior', label: 'Sênior' },
    { value: 'lead', label: 'Liderança/Tech Lead' },
  ];
  
  // Lista de habilidades comuns para sugestão (exemplo)
  const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Tailwind CSS', 'AWS', 'Docker', 'SQL', 'MongoDB'];

  // Limpa a mensagem após um tempo
  const clearMessage = () => {
    setTimeout(() => setMessage(''), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    const skillToAdd = currentSkill.trim();
    if (skillToAdd && !devData.techStack.includes(skillToAdd)) {
      setDevData(prev => ({ 
        ...prev, 
        techStack: [...prev.techStack, skillToAdd] 
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setDevData(prev => ({ 
      ...prev, 
      techStack: prev.techStack.filter(s => s !== skill) 
    }));
  };
  
  const handleSelectCommonSkill = (skill) => {
      if (!devData.techStack.includes(skill)) {
          setDevData(prev => ({ 
            ...prev, 
            techStack: [...prev.techStack, skill] 
          }));
      }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!devData.name || !devData.email) {
        setMessage('🛑 Por favor, preencha o Nome e o Email do seu Perfil.');
        clearMessage();
        return;
    }
    
    console.log("--- DADOS FINAIS DEVS SUBMETIDOS ---");
    console.log("Dados do Desenvolvedor:", devData);
    
    // Lógica para enviar dados para a API/servidor
    setMessage("🚀 Perfil de Desenvolvedor Submetido com Sucesso! (Verifique o console para os dados)");
    // Resetar o formulário (opcional)
    setDevData({
        name: '', email: '', location: '', linkedin: '', github: '',
        seniority: 'junior', techStack: [], yearsOfExperience: 0, portfolioLink: '', bio: '',
    });
    setFormStep(1); 
    clearMessage();
  };

  // Estilos de botão base
  const buttonStyle = "w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition duration-200";
  const primaryButton = `${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-700`;
  const secondaryButton = `${buttonStyle} bg-gray-200 text-gray-800 hover:bg-gray-300`;
  
  const inputClass = "mt-1 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto my-8 border-t-4 border-indigo-500">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
        <User className="w-7 h-7 mr-3 text-indigo-600" />
        Cadastro de Desenvolvedor(a)
      </h2>
      
      {message && (
        <div className="p-4 mb-6 text-sm rounded-xl text-center" style={{ backgroundColor: message.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✅') ? '#059669' : '#ef4444' }}>
          {message}
        </div>
      )}

      {/* Navegação por Etapas (Simples) */}
      <div className="flex justify-center mb-8 space-x-6">
        <button 
            className={`p-3 rounded-full text-sm font-medium transition ${formStep === 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
            onClick={() => setFormStep(1)}
        >
            1. Perfil Básico
        </button>
        <button 
            className={`p-3 rounded-full text-sm font-medium transition ${formStep === 2 ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
            onClick={() => setFormStep(2)}
        >
            2. Habilidades
        </button>
      </div>


      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Etapa 1: Perfil Básico */}
        {formStep === 1 && (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-700 flex items-center"><User className="w-5 h-5 mr-2"/> Detalhes do Perfil</h3>
                
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className={labelClass}>Nome Completo <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            id="name"
                            name="name" 
                            placeholder="Seu Nome e Sobrenome" 
                            value={devData.name} 
                            onChange={handleChange} 
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClass}>Email <span className="text-red-500">*</span></label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            placeholder="seu.email@exemplo.com" 
                            value={devData.email} 
                            onChange={handleChange} 
                            className={inputClass}
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="location" className={labelClass}>Localização Preferencial <MapPin className="w-4 h-4 inline ml-1 text-gray-500"/></label>
                    <input 
                        type="text" 
                        id="location"
                        name="location" 
                        placeholder="Ex: Remoto, São Paulo, Florianópolis" 
                        value={devData.location} 
                        onChange={handleChange} 
                        className={inputClass}
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="linkedin" className={labelClass}>Perfil LinkedIn</label>
                        <input 
                            type="url" 
                            id="linkedin"
                            name="linkedin" 
                            placeholder="https://linkedin.com/in/seuuser" 
                            value={devData.linkedin} 
                            onChange={handleChange} 
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="github" className={labelClass}>Perfil GitHub</label>
                        <input 
                            type="url" 
                            id="github"
                            name="github" 
                            placeholder="https://github.com/seuuser" 
                            value={devData.github} 
                            onChange={handleChange} 
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="button" onClick={() => setFormStep(2)} className={primaryButton}>
                        Próxima Etapa: Habilidades <ChevronRight className="w-5 h-5 ml-1 inline"/>
                    </button>
                </div>
            </div>
        )}

        {/* Etapa 2: Habilidades & Experiência */}
        {formStep === 2 && (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-700 flex items-center"><Zap className="w-5 h-5 mr-2"/> Habilidades Técnicas</h3>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="seniority" className={labelClass}>Nível de Senioridade</label>
                        <select 
                            id="seniority"
                            name="seniority" 
                            value={devData.seniority} 
                            onChange={handleChange}
                            className={inputClass}
                        >
                            {seniorityOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="yearsOfExperience" className={labelClass}>Anos de Experiência Formal</label>
                        <input 
                            type="number" 
                            id="yearsOfExperience"
                            name="yearsOfExperience" 
                            min="0"
                            max="50"
                            placeholder="Anos de XP" 
                            value={devData.yearsOfExperience} 
                            onChange={handleChange} 
                            className={inputClass}
                        />
                    </div>
                </div>
                
                {/* Adicionar Tech Stack */}
                <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center"><Code className="w-4 h-4 mr-2"/> Tech Stack/Skills</h4>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {commonSkills.map(skill => (
                            <button 
                                key={skill}
                                type="button" 
                                onClick={() => handleSelectCommonSkill(skill)}
                                className={`text-xs px-3 py-1 rounded-full border transition ${devData.techStack.includes(skill) ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'}`}
                            >
                                + {skill}
                            </button>
                        ))}
                    </div>

                    <div className="flex space-x-3">
                        <input 
                            type="text" 
                            placeholder="Adicione uma skill customizada (Ex: Ruby)" 
                            value={currentSkill} 
                            onChange={(e) => setCurrentSkill(e.target.value)} 
                            onKeyPress={(e) => { if (e.key === 'Enter') handleAddSkill(e); }}
                            className="flex-grow border border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <button type="button" onClick={handleAddSkill} className="flex-shrink-0 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
                            Adicionar
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                        {devData.techStack.map((skill) => (
                            <span key={skill} className="inline-flex items-center text-sm font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                                {skill}
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-indigo-500 hover:text-indigo-700">
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="portfolioLink" className={labelClass}>Link para Portfólio/Website <BookOpen className="w-4 h-4 inline ml-1 text-gray-500"/></label>
                    <input 
                        type="url" 
                        id="portfolioLink"
                        name="portfolioLink" 
                        placeholder="https://www.seuportfolio.com" 
                        value={devData.portfolioLink} 
                        onChange={handleChange} 
                        className={inputClass}
                    />
                </div>
                
                <div>
                    <label htmlFor="bio" className={labelClass}>Bio/Resumo Profissional</label>
                    <textarea 
                        id="bio"
                        name="bio" 
                        placeholder="Fale um pouco sobre você, seus objetivos e o que busca." 
                        value={devData.bio} 
                        onChange={handleChange} 
                        rows="4"
                        className={inputClass}
                    />
                </div>


                <div className="flex justify-between pt-6">
                    <button type="button" onClick={() => setFormStep(1)} className={secondaryButton}>
                        <ChevronLeft className="w-5 h-5 mr-1 inline"/> Voltar ao Perfil
                    </button>
                    <button type="submit" className={primaryButton}>
                        Concluir Cadastro
                    </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
};

export default DevRegistrationForm;