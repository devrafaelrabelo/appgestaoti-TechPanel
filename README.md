# ProjectBasePronto

Base sólida para desenvolvimento de projetos com Next.js, TypeScript e Tailwind CSS.

## Características

- Estrutura de diretórios organizada
- Componentes reutilizáveis
- Autenticação pronta para implementação
- Temas claro e escuro
- Responsivo
- Documentação completa
- Nome do sistema configurável via variável de ambiente

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

\`\`\`bash

# Clone o repositório

git clone https://github.com/seu-usuario/projectbasepronto.git

# Entre no diretório

cd projectbasepronto

# Instale as dependências

npm install

# ou

yarn install

# Configure o nome do sistema (opcional)

# Crie um arquivo .env.local e adicione:

# NEXT_PUBLIC_SYSTEM_NAME="Seu Sistema"

# Inicie o servidor de desenvolvimento

npm run dev

# ou

yarn dev
\`\`\`

## Configuração

### Nome do Sistema

O nome do sistema pode ser configurado através da variável de ambiente `NEXT_PUBLIC_SYSTEM_NAME`. Se não for definida, o valor padrão será "ProjectBasePronto".

Exemplo no arquivo `.env.local`:
\`\`\`
NEXT_PUBLIC_SYSTEM_NAME="Meu Sistema Personalizado"
\`\`\`

### URL da API

A URL da API pode ser configurada através da variável de ambiente `NEXT_PUBLIC_API_BASE_URL`. Se não for definida, o valor padrão será "http://localhost:8080".

Exemplo no arquivo `.env.local`:
\`\`\`
NEXT_PUBLIC_API_BASE_URL="https://minha-api.com"
\`\`\`

## Estrutura do Projeto

O projeto segue uma estrutura organizada por features, com separação clara de responsabilidades:

\`\`\`
src/
├── app/ # Diretórios de rotas do Next.js App Router
├── components/ # Componentes compartilhados
├── features/ # Módulos organizados por funcionalidade
├── hooks/ # Hooks personalizados
├── lib/ # Utilitários e funções auxiliares
├── providers/ # Provedores de contexto
└── docs/ # Documentação do projeto
\`\`\`

## Documentação

A documentação completa está disponível no diretório `src/docs`. Consulte o arquivo `src/docs/00-README.md` para um índice completo da documentação.

## Desenvolvimento

**IMPORTANTE: Este projeto não requer variáveis de ambiente para funcionar.**

Todas as funcionalidades são simuladas para facilitar o desenvolvimento. As variáveis de ambiente são opcionais e servem apenas para personalização.

## Licença

# 🌐 AppGestaoTI Frontend - Configuração de Ambiente

Este projeto utiliza variáveis de ambiente para configurar os endpoints de API, autenticação e preferências visuais do usuário.

---

## 📁 Arquivos `.env` disponíveis

- `.env.local` → Ambiente de desenvolvimento local
- `.env.production` → Ambiente de produção (Docker ou deploy)
- `.env.test` → Ambiente de testes locais

---

## 🔑 Variáveis importantes

| Variável                          | Descrição                                |
| --------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`        | URL da API Java (Spring Boot)            |
| `NEXT_PUBLIC_API_USERHUB_URL`     | URL da API de Usuários (FastAPI)         |
| `NEXT_PUBLIC_API_SELENIUM_URL`    | URL da API de Consulta CPF               |
| `NEXT_PUBLIC_WPP_API_URL`         | URL da API do WhatsApp (WPPConnect)      |
| `NEXT_PUBLIC_COOKIE_*`            | Nomes dos cookies usados na autenticação |
| `NEXT_PUBLIC_HEADER_AUTH_STATUS`  | Header usado para validação de sessão    |
| `NEXT_PUBLIC_REVALIDATE_INTERVAL` | Intervalo de revalidação SWR (em ms)     |

---

## ⚙️ Recomendação

Use `process.env.NEXT_PUBLIC_*` apenas no **frontend**. O backend deve usar suas próprias variáveis (`application.yml`, `.env` etc.).

---

## 🧪 Rodando localmente

```bash
cp .env.local.example .env.local
pnpm install
pnpm dev
```
