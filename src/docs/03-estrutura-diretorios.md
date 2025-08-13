# Estrutura de Diretórios

## Visão Geral

O ProjectBasePronto segue uma estrutura de diretórios organizada e intuitiva, baseada nas melhores práticas de desenvolvimento Next.js e na preferência por utilizar o padrão de pasta `src` para organizar o código-fonte. Esta estrutura foi projetada para facilitar a navegação, manutenção e escalabilidade do projeto.

## Estrutura Principal

\`\`\`
projeto-base-pronto/
├── public/               # Arquivos estáticos acessíveis publicamente
├── src/                  # Código-fonte da aplicação
│   ├── app/              # Estrutura de roteamento do App Router
│   ├── components/       # Componentes React reutilizáveis
│   ├── contexts/         # Contextos React para gerenciamento de estado
│   ├── hooks/            # Hooks personalizados
│   ├── services/         # Serviços para comunicação com APIs
│   ├── styles/           # Estilos globais e temas
│   ├── types/            # Definições de tipos TypeScript
│   ├── utils/            # Funções utilitárias
│   └── docs/             # Documentação do projeto
├── .env.local            # Variáveis de ambiente locais
├── .eslintrc.json        # Configuração do ESLint
├── .gitignore            # Arquivos ignorados pelo Git
├── next.config.js        # Configuração do Next.js
├── package.json          # Dependências e scripts
├── postcss.config.js     # Configuração do PostCSS
├── tailwind.config.js    # Configuração do Tailwind CSS
└── tsconfig.json         # Configuração do TypeScript
\`\`\`

## Detalhamento dos Diretórios

### `/public`

Contém arquivos estáticos que são servidos diretamente pelo servidor web:

\`\`\`
public/
├── favicon.ico           # Ícone da aplicação
├── images/               # Imagens estáticas
│   ├── logo.svg          # Logo da aplicação
│   └── ...
└── fonts/                # Fontes personalizadas
\`\`\`

**Propósito**: Armazenar arquivos que precisam ser acessíveis publicamente via URL direta.

**Boas práticas**:
- Coloque apenas arquivos que precisam ser acessados diretamente pelo navegador
- Organize em subdiretórios por tipo (imagens, fontes, etc.)
- Mantenha os nomes de arquivos em minúsculas e use hífens para separar palavras

### `/src`

Contém todo o código-fonte da aplicação, organizado em subdiretórios específicos:

#### `/src/app`

Implementa a estrutura de roteamento do App Router do Next.js:

\`\`\`
src/app/
├── layout.tsx            # Layout raiz da aplicação
├── page.tsx              # Página inicial (rota /)
├── favicon.ico           # Ícone específico da aplicação
├── globals.css           # Estilos globais
├── login/                # Rota de login
│   ├── page.tsx          # Página de login
│   └── layout.tsx        # Layout específico para login
├── dashboard/            # Rota do dashboard
│   ├── page.tsx          # Página principal do dashboard
│   ├── layout.tsx        # Layout do dashboard
│   └── [id]/             # Rota dinâmica com parâmetro id
│       └── page.tsx      # Página de detalhes com id específico
└── api/                  # Rotas de API
    └── auth/             # Endpoints de autenticação
        └── route.ts      # Manipulador de rota de autenticação
\`\`\`

**Propósito**: Implementar o roteamento da aplicação seguindo a convenção de arquivos do App Router do Next.js.

**Boas práticas**:
- Siga a convenção de nomenclatura do Next.js (page.tsx, layout.tsx, etc.)
- Organize rotas em diretórios que reflitam a estrutura da URL
- Use layouts aninhados para compartilhar UI entre rotas relacionadas
- Coloque componentes específicos de página em seus respectivos diretórios de rota

#### `/src/components`

Contém componentes React reutilizáveis:

\`\`\`
src/components/
├── ui/                   # Componentes de UI básicos
│   ├── Button/           # Componente de botão
│   │   ├── index.tsx     # Implementação do componente
│   │   └── Button.test.tsx # Testes do componente
│   ├── Card/             # Componente de card
│   ├── Input/            # Componente de input
│   └── ...
├── layout/               # Componentes de layout
│   ├── Header/           # Componente de cabeçalho
│   ├── Footer/           # Componente de rodapé
│   ├── Sidebar/          # Componente de barra lateral
│   └── ...
├── forms/                # Componentes relacionados a formulários
│   ├── LoginForm/        # Formulário de login
│   └── ...
└── common/               # Componentes comuns
    ├── ErrorBoundary/    # Componente para captura de erros
    └── ...
\`\`\`

**Propósito**: Armazenar componentes React reutilizáveis organizados por categoria.

**Boas práticas**:
- Organize componentes em subdiretórios por categoria ou domínio
- Use a abordagem de um componente por diretório para componentes complexos
- Inclua um arquivo index.tsx para exportação simplificada
- Mantenha testes junto aos componentes
- Documente props e comportamentos esperados

#### `/src/contexts`

Contém contextos React para gerenciamento de estado:

\`\`\`
src/contexts/
├── AuthContext/          # Contexto de autenticação
│   ├── index.tsx         # Implementação do contexto
│   ├── types.ts          # Tipos relacionados ao contexto
│   └── AuthContext.test.tsx # Testes do contexto
├── ThemeContext/         # Contexto de tema
└── ...
\`\`\`

**Propósito**: Gerenciar estado global da aplicação usando a Context API do React.

**Boas práticas**:
- Separe cada contexto em seu próprio diretório
- Inclua tipos bem definidos para o estado e ações
- Forneça hooks personalizados para acessar o contexto (useAuth, useTheme, etc.)
- Documente como o contexto deve ser utilizado

#### `/src/hooks`

Contém hooks React personalizados:

\`\`\`
src/hooks/
├── useAuth.ts            # Hook para autenticação
├── useLocalStorage.ts    # Hook para manipulação de localStorage
├── useForm.ts            # Hook para gerenciamento de formulários
└── ...
\`\`\`

**Propósito**: Encapsular lógica reutilizável em hooks personalizados.

**Boas práticas**:
- Nomeie hooks começando com "use" seguindo a convenção do React
- Mantenha cada hook em seu próprio arquivo
- Documente parâmetros, retornos e exemplos de uso
- Escreva testes para validar o comportamento esperado

#### `/src/services`

Contém serviços para comunicação com APIs e lógica de negócio:

\`\`\`
src/services/
├── api/                  # Configuração e instâncias de API
│   ├── index.ts          # Configuração base da API
│   └── endpoints.ts      # Definição de endpoints
├── auth/                 # Serviços de autenticação
│   ├── index.ts          # Métodos de autenticação
│   └── types.ts          # Tipos relacionados à autenticação
└── ...
\`\`\`

**Propósito**: Encapsular a lógica de comunicação com APIs e serviços externos.

**Boas práticas**:
- Organize serviços por domínio ou funcionalidade
- Use interfaces bem definidas para parâmetros e retornos
- Implemente tratamento de erros consistente
- Documente comportamentos esperados e possíveis erros

#### `/src/styles`

Contém estilos globais e configurações de tema:

\`\`\`
src/styles/
├── globals.css           # Estilos globais
├── themes/               # Definições de temas
│   ├── light.ts          # Tema claro
│   └── dark.ts           # Tema escuro
└── ...
\`\`\`

**Propósito**: Centralizar estilos globais e configurações de tema.

**Boas práticas**:
- Mantenha estilos globais mínimos
- Use variáveis CSS ou tokens de design para consistência
- Organize temas em arquivos separados
- Documente o sistema de design e convenções de estilo

#### `/src/types`

Contém definições de tipos TypeScript:

\`\`\`
src/types/
├── index.ts              # Exportações de tipos comuns
├── auth.ts               # Tipos relacionados à autenticação
├── user.ts               # Tipos relacionados ao usuário
└── ...
\`\`\`

**Propósito**: Centralizar definições de tipos TypeScript reutilizáveis.

**Boas práticas**:
- Organize tipos por domínio ou funcionalidade
- Use interfaces para objetos e type para unions/aliases
- Documente campos complexos ou não óbvios
- Exporte tipos de forma organizada

#### `/src/utils`

Contém funções utilitárias:

\`\`\`
src/utils/
├── format/               # Funções de formatação
│   ├── date.ts           # Formatação de datas
│   ├── currency.ts       # Formatação de moedas
│   └── ...
├── validation/           # Funções de validação
│   ├── email.ts          # Validação de email
│   └── ...
├── storage/              # Utilitários de armazenamento
│   ├── cookies.ts        # Manipulação de cookies
│   └── localStorage.ts   # Manipulação de localStorage
└── ...
\`\`\`

**Propósito**: Fornecer funções utilitárias reutilizáveis.

**Boas práticas**:
- Organize utilitários por categoria ou domínio
- Escreva funções puras sempre que possível
- Documente parâmetros, retornos e exemplos de uso
- Escreva testes unitários para validar comportamentos

#### `/src/docs`

Contém a documentação do projeto:

\`\`\`
src/docs/
├── README.md             # Visão geral da documentação
├── 01-visao-geral.md     # Visão geral do sistema
├── 02-arquitetura.md     # Arquitetura do sistema
├── 03-estrutura-diretorios.md # Este documento
└── ...
\`\`\`

**Propósito**: Centralizar a documentação do projeto.

**Boas práticas**:
- Mantenha a documentação atualizada com o código
- Use Markdown para facilitar a leitura e edição
- Organize documentos de forma lógica e numerada
- Inclua exemplos e diagramas quando necessário

## Convenções de Nomenclatura

### Arquivos

- **Componentes React**: PascalCase (ex: `Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase, começando com "use" (ex: `useAuth.ts`, `useLocalStorage.ts`)
- **Contextos**: PascalCase, terminando com "Context" (ex: `AuthContext.tsx`)
- **Utilitários**: camelCase (ex: `formatDate.ts`, `validateEmail.ts`)
- **Tipos**: PascalCase (ex: `User.ts`, `AuthResponse.ts`)
- **Constantes**: UPPER_SNAKE_CASE para valores fixos, camelCase para objetos (ex: `API_ENDPOINTS.ts`)

### Diretórios

- **Componentes**: PascalCase (ex: `Button/`, `UserProfile/`)
- **Funcionalidades/Módulos**: camelCase (ex: `auth/`, `dashboard/`)
- **Utilitários/Serviços**: camelCase (ex: `utils/`, `services/`)

## Arquivos de Barril (Barrel Files)

O projeto utiliza arquivos de barril (index.ts) para simplificar importações:

\`\`\`typescript
// src/components/ui/index.ts
export * from './Button';
export * from './Card';
export * from './Input';
// ...
\`\`\`

**Benefícios**:
- Simplifica importações (`import { Button, Card } from '@/components/ui'`)
- Oculta detalhes de implementação
- Facilita refatorações

## Importações Absolutas

O projeto está configurado para usar importações absolutas a partir da pasta `src`:

\`\`\`typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
\`\`\`

**Exemplo de uso**:
\`\`\`typescript
// Importação absoluta
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// Em vez de importação relativa
import { Button } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
\`\`\`

## Boas Práticas para Manutenção da Estrutura

1. **Consistência**: Siga as convenções estabelecidas para nomenclatura e organização
2. **Coesão**: Mantenha arquivos relacionados próximos uns dos outros
3. **Modularidade**: Divida o código em módulos pequenos e focados
4. **Separação de Responsabilidades**: Cada arquivo deve ter uma única responsabilidade
5. **Documentação**: Mantenha a documentação atualizada quando a estrutura mudar
6. **Refatoração**: Refatore regularmente para manter a estrutura limpa e organizada

## Evolução da Estrutura

À medida que o projeto cresce, a estrutura de diretórios pode evoluir:

1. **Módulos por Domínio**: Para projetos maiores, considere organizar por domínio de negócio:
   \`\`\`
   src/
   ├── modules/
   │   ├── auth/           # Tudo relacionado à autenticação
   │   │   ├── components/
   │   │   ├── hooks/
   │   │   ├── services/
   │   │   └── types/
   │   ├── users/          # Tudo relacionado a usuários
   │   └── ...
   \`\`\`

2. **Monorepo**: Para projetos muito grandes, considere uma estrutura de monorepo:
   \`\`\`
   packages/
   ├── ui/                 # Biblioteca de componentes UI
   ├── core/               # Lógica de negócio central
   ├── api/                # Cliente de API
   └── web/                # Aplicação web
   \`\`\`

## Conclusão

A estrutura de diretórios do ProjectBasePronto foi projetada para ser intuitiva, escalável e manutenível. Seguindo as convenções e boas práticas descritas neste documento, a equipe de desenvolvimento pode navegar facilmente pelo código, entender onde novos arquivos devem ser colocados e manter a organização do projeto à medida que ele cresce.

A estrutura atual reflete as melhores práticas do desenvolvimento moderno com Next.js e React, com foco na modularidade, reutilização e manutenibilidade. Ela pode evoluir conforme as necessidades do projeto, mas os princípios fundamentais de organização devem ser mantidos.
