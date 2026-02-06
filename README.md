# ☔ RainDrive

**O drive realmente perfeito.  
Até o clima opinar.**

RainDrive é um sistema de armazenamento em nuvem moderno, elegante e extremamente bem projetado — inspirado nos melhores padrões de UX do Google Drive, OneDrive, Dropbox e iCloud.

Ele faz tudo o que um drive sério faz.

Só existe um pequeno detalhe.

👉 **Downloads só são permitidos quando estiver chovendo no local do usuário.**

Sem chuva, sem download.  
Sem negociação.  
Sem misericórdia.

---

## 🌩️ O conceito

RainDrive nasceu como um experimento de UX e humor ácido:

- UX **premium**
- Interface **polida**
- Performance **real**
- Infraestrutura **de produção**

…com uma regra propositalmente absurda baseada em clima.

A ideia é simples:
> *E se um produto fosse tecnicamente impecável, mas tomasse decisões completamente idiotas por um critério externo?*

Bem-vindo ao RainDrive.

---

## ✨ Funcionalidades

### Autenticação
- Cadastro self-service (email + senha)
- Login / Logout
- Sessão persistente
- Separação total de dados por usuário  
  (cada pessoa tem seu próprio RainDrive)

### Arquivos e Pastas
- Upload de arquivos
- Drag & Drop (upload e movimentação)
- Organização por pastas
- Renomear, mover e deletar
- Breadcrumb de navegação
- Busca rápida
- Ordenação (nome, data, tamanho)
- Grid / List view
- Context Menu Avançado (Novo)
  - Controle de estado global
  - Fechamento automático inteligente
  - Transições suaves
  - Suporte completo a Lixeira (Restaurar, Excluir)

### Weather Gate™ ☔
- O sistema verifica o clima no local do usuário
- Estados:
  - **CLOUDY** → checando o céu
  - **DRY** → sem chuva (download bloqueado)
  - **RAINING** → chovendo (download liberado)
- A validação acontece **no backend**
- A UI apenas reflete a decisão do clima

### Landing Page (Marketing)
- Site one-page com navegação por âncoras
- Copy sarcástica e subliminar
- Hero interativo
- Depoimentos “suspeitamente positivos”
- Logos de empresas fictícias
- Formulário de contato fake (não envia nada)

### Tema
- Light
- Cloud Noir (dark premium)
- System (segue o sistema)
- Dropdown de tema visível na Topbar
- Preferência persistida (cookie + localStorage)

---

## 🎨 UX & Design

- Inspirado em:
  - Google Drive (busca e organização)
  - Dropbox (ações rápidas e previsíveis)
  - OneDrive (estados claros de arquivo)
  - iCloud (limpeza visual e polimento)
- Paródia controlada:
  - O sarcasmo vive no texto, nos estados e no clima
  - O fluxo do usuário é sempre claro e funcional
- Micro-animações com Framer Motion
- Ícones com **Lucide Icons**
- Cursor Pointer Universal em elementos interativos

---

## 🧱 Stack técnica

### Frontend
- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- Framer Motion
- Lucide Icons

### Autenticação
- Auth.js (NextAuth)
- Credentials (email + senha)
- Hash de senha com **bcryptjs**
- MVP direto (sem verificação de email)

### Backend
- Route Handlers / Server Actions (Next.js)
- Prisma ORM

### Banco de dados
- PostgreSQL (Neon)

### Storage
- Vercel Blob
- Upload via API
- Download via endpoint protegido

### Clima
- Open-Meteo API
- Geolocalização via Edge / request.geo
- Cache server-side

---

## 🗂️ Estrutura do projeto

```txt
/
├─ app/
│  ├─ (landing)        → site one-page
│  ├─ auth/
│  │  ├─ login
│  │  └─ signup
│  └─ drive/           → aplicativo principal
├─ prisma/
├─ public/
└─ README.md
```

---

## 🚀 Rodando localmente

```bash
pnpm install
pnpm prisma migrate dev
pnpm dev
```	

### Variáveis de ambiente (exemplo)

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=...
```

---

## 🌍 Deploy

- Frontend + Backend: Vercel
- Database: Neon
- Storage: Vercel Blob

Totalmente compatível com ambiente serverless.

---

## ⚠️ Aviso legal (moral)

RainDrive não é responsável por:
- usuários olhando obsessivamente para o céu
- pessoas torcendo por tempestades
- conflitos familiares envolvendo clima e downloads
- ataques de ódio a meteorologia

---

## 🏁 Conclusão

RainDrive é:
- Um experimento de UX
- Um projeto técnico sério
- Uma piada bem executada
- Um lembrete de que **regras idiotas também podem ser bem implementadas**

### ☔ Sem chuva, sem download.