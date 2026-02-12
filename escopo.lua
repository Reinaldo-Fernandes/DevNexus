## 📋 Escopo do Projeto: DevNexus

O **DevNexus** é uma plataforma de portfólio minimalista projetada para conectar jovens talentos da programação diretamente com empresas, focando em clareza técnica e eliminação de distrações.

### 1. Funcionalidades Principais (MVP)

* **Vitrine de Projetos:** Galeria de cards onde cada projeto exibe título, stack técnica e links (GitHub/Live).
* **Perfil do Desenvolvedor:** Página única com bio técnica, tecnologias dominadas e widget de repositórios do GitHub.
* **Painel de Vagas:** Área simplificada para empresas listarem oportunidades.
* **Contato Direto:** Botão de chamada para ação (CTA) para facilitar o recrutamento.

### 2. Diferenciais Técnicos

* **Design Clean:** Interface baseada em modo escuro nativo para reduzir o cansaço visual.
* **Performance:** Uso de HTML/CSS puro com Next.js ou React para carregamento instantâneo.
* **Foco no Código:** Seções dedicadas a explicar a lógica por trás dos projetos, e não apenas o visual.

---

## 🎨 Scrapbook Visual (Conceito & Inspiração)

O Scrapbook serve como o seu guia de "sentimento" do site. Para o DevNexus, o tema é **"The Dark Terminal Aesthetic"**.

### 1. Atmosfera e Cores

* **Fundo:** `#0d1117` (A profundidade do VS Code/GitHub).
* **Ações (Buttons):** `#3b82f6` (Azul elétrico para destacar o que importa).
* **Superfícies:** Uso de glassmorphism (vidro fosco) no cabeçalho para passar modernidade.

### 2. Elementos de Interface (UI Components)

* **Cards de Projeto:** Devem ter bordas sutis (`1px solid #30363d`) que brilham levemente no hover.
* **Tipografia:** Mix entre a elegância da fonte `MonteCarlo` (Logo) com a legibilidade da `Inter` (Conteúdo).
* **Ícones:** Uso de ícones minimalistas (Lucide ou FontAwesome) para representar linguagens de programação.

### 3. Mapa de Navegação do Usuário

| Tela | Elemento Chave | Objetivo |
| --- | --- | --- |
| **Home** | Hero Section com CTA duplo | Converter visitantes em membros ou recrutadores. |
| **Explorar** | Grid de projetos com filtros | Permitir que empresas achem tecnologias específicas rapidamente. |
| **Perfil** | Markdown Bio + GitHub Stats | Provar a competência técnica do jovem dev. |

---

### 🚀 Status Atual do Desenvolvimento

* **Layout Base:** Finalizado (Header, Hero, Features, CTA e Footer).
* **CSS:** Organizado com variáveis e efeitos de transição profissional.
* **Pendente:** Implementar lógica do menu mobile e criar as subpáginas (`perfil.html`, `projetos.html`).
