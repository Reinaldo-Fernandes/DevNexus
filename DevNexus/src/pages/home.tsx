import { useState } from "react";
import devImg from "../assets/dev.png";
import logoImg from "../assets/dn.png";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rulesType, setRulesType] = useState<"dev" | "empresa" | null>(null);

  const rulesConfig = {
    dev: {
      title: "Diretrizes para Devs",
      color: "bg-primary",
      items: [
        "Seu perfil deve ter um link de GitHub válido.",
        "Proibido postar projetos de terceiros como próprios.",
        "Mantenha um comportamento profissional nas interações.",
        "Preencha as redes sociais para facilitar o recrutamento."
      ]
    },
    empresa: {
      title: "Diretrizes para Empresas",
      color: "bg-emerald-600",
      items: [
        "Vagas devem conter descrição técnica clara.",
        "É obrigatório o feedback em até 15 dias após entrevistas.",
        "Proibido coletar dados para fins que não sejam recrutamento.",
        "Responsável deve usar e-mail institucional."
      ]
    }
  };

  return (
    <div className="bg-bg text-text-main font-sans leading-relaxed overflow-x-hidden">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 flex justify-between items-center bg-surface/80 backdrop-blur-md px-8 py-3 border-b border-border">
        <div className="flex items-center gap-3 font-logo text-2xl cursor-pointer">
          <img src={logoImg} className="w-8 h-8" />
          <h1 className="text-white">DevNexus</h1>
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          <button className="text-sm text-text-muted hover:text-primary-hover">
            Sobre
          </button>
          <button className="text-sm text-text-muted hover:text-primary-hover">
            Projetos
          </button>
          <button className="text-sm text-text-muted hover:text-primary-hover">
            Vagas
          </button>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-sm font-bold text-primary hover:text-primary-hover"
          >
            Cadastro
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-[1100px] mx-auto pt-24 pb-20 px-8 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
        <div className="max-w-[540px]">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Mostre seu talento, construa seu futuro.
          </h2>
          <p className="text-lg text-text-muted mb-10">
            Uma plataforma feita para jovens desenvolvedores exibirem seus projetos.
          </p>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white px-10 py-3 rounded-md font-semibold"
          >
            Começar Agora
          </button>
        </div>

        <div className="w-64 md:w-auto opacity-90">
          <img src={devImg} className="max-w-full" />
        </div>
      </section>

      {/* AUTH MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-3 right-4 text-2xl"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-6">
              Criar sua conta no DevNexus
            </h3>

            <button
              onClick={() => {
                setRulesType("dev");
                setIsRulesOpen(true);
              }}
              className="text-primary text-sm mb-4"
            >
              Ver regras para Dev
            </button>

            <button
              onClick={() => {
                setRulesType("empresa");
                setIsRulesOpen(true);
              }}
              className="text-emerald-500 text-sm"
            >
              Ver regras para Empresa
            </button>
          </div>
        </div>
      )}

      {/* RULES MODAL */}
      {isRulesOpen && rulesType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6">
            <h4 className="text-xl font-bold mb-4">
              {rulesConfig[rulesType].title}
            </h4>

            <ul className="space-y-2 text-text-muted list-disc pl-5">
              {rulesConfig[rulesType].items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <button
              onClick={() => setIsRulesOpen(false)}
              className="mt-6 bg-primary px-6 py-2 rounded text-white"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
