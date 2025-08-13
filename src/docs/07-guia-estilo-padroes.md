# Guia de Estilo e Padrões

## Introdução

Este documento estabelece os padrões de codificação, design visual e boas práticas a serem seguidas no desenvolvimento do ProjectBasePronto. A adesão a estes padrões garante consistência, legibilidade e manutenibilidade do código, além de proporcionar uma experiência de usuário coesa.

## Sumário

1. [Padrões de Codificação](#1-padrões-de-codificação)
2. [Convenções de Nomenclatura](#2-convenções-de-nomenclatura)
3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
4. [Design Visual](#4-design-visual)
5. [Boas Práticas](#5-boas-práticas)
6. [Controle de Versão](#6-controle-de-versão)
7. [Documentação de Código](#7-documentação-de-código)

## 1. Padrões de Codificação

### 1.1. TypeScript/JavaScript

#### Formatação

- Use 2 espaços para indentação
- Limite de 100 caracteres por linha
- Use ponto e vírgula (`;`) ao final de cada instrução
- Use aspas simples (`'`) para strings
- Adicione uma linha em branco ao final de cada arquivo

\`\`\`typescript
// Correto
const greeting = 'Olá, mundo!';
const user = {
  name: 'João',
  age: 30,
};

// Incorreto
const greeting = "Olá, mundo!"
const user = {
    name: "João",
    age: 30
}
\`\`\`

#### TypeScript

- Sempre defina tipos explícitos para funções e variáveis públicas
- Use interfaces para definir contratos e tipos para estruturas de dados
- Evite o uso de `any`; prefira `unknown` quando necessário
- Use tipos genéricos para componentes e funções reutilizáveis

\`\`\`typescript
// Correto
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

function getUserById(id: string): Promise<User | null> {
  // implementação
}

// Incorreto
function getUserById(id): Promise<any> {
  // implementação
}
\`\`\`

#### Importações

- Organize as importações na seguinte ordem:
  1. Bibliotecas externas
  2. Componentes internos
  3. Hooks
  4. Utilitários
  5. Tipos
  6. Estilos
- Adicione uma linha em branco entre cada grupo

\`\`\`typescript
// Bibliotecas externas
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Componentes internos
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Hooks
import { useAuth } from '@/hooks/useAuth';

// Utilitários
import { formatDate } from '@/utils/date';

// Tipos
import type { User } from '@/types';

// Estilos
import '@/styles/component.css';
\`\`\`

### 1.2. React

#### Componentes

- Use componentes funcionais com hooks
- Extraia lógica complexa para hooks personalizados
- Mantenha componentes pequenos e focados em uma única responsabilidade
- Use React.memo para componentes que renderizam frequentemente com as mesmas props

\`\`\`typescript
// Componente funcional
import React from 'react';
import { useUser } from '@/hooks/useUser';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user, isLoading, error } = useUser(userId);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar usuário</div>;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

#### Props

- Desestruture props no parâmetro da função
- Use tipos explícitos para props
- Forneça valores padrão quando apropriado

\`\`\`typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  onClick,
  children,
}: ButtonProps) {
  // implementação
}
\`\`\`

#### Estado e Efeitos

- Use nomes descritivos para estados
- Prefira múltiplos `useState` para estados não relacionados
- Use `useReducer` para estados complexos
- Limite o escopo dos efeitos e forneça dependências explícitas

\`\`\`typescript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchApi(query);
        setResults(data);
      } catch (err) {
        setError(err as Error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // resto do componente
}
\`\`\`

### 1.3. CSS/Tailwind

#### Tailwind CSS

- Use classes Tailwind para estilização sempre que possível
- Agrupe classes relacionadas (layout, espaçamento, cores, etc.)
- Use a função `cn()` para combinar classes condicionalmente

\`\`\`typescript
import { cn } from '@/utils/cn';

function Button({ variant, size, className }) {
  return (
    <button
      className={cn(
        // Base
        'rounded-md font-medium transition-colors focus:outline-none focus:ring-2',
        // Variantes
        variant === 'primary' && 'bg-primary text-white hover:bg-primary-dark',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        // Tamanhos
        size === 'sm' && 'px-3 py-1 text-sm',
        size === 'md' && 'px-4 py-2',
        size === 'lg' && 'px-6 py-3 text-lg',
        // Classes personalizadas
        className
      )}
    >
      {children}
    </button>
  );
}
\`\`\`

#### CSS Personalizado

- Use CSS Modules para estilos específicos de componentes
- Siga a metodologia BEM (Block Element Modifier) para nomenclatura de classes
- Evite seletores profundamente aninhados

\`\`\`css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button--primary {
  background-color: var(--color-primary);
  color: white;
}

.button--secondary {
  background-color: var(--color-gray-200);
  color: var(--color-gray-800);
}

.button__icon {
  margin-right: 0.5rem;
}
\`\`\`

## 2. Convenções de Nomenclatura

### 2.1. Arquivos e Diretórios

- Use kebab-case para nomes de arquivos e diretórios
  - Exemplos: `user-profile.tsx`, `auth-service.ts`, `use-form.ts`
- Exceções:
  - Componentes React: use PascalCase (ex: `Button.tsx`, `UserProfile.tsx`)
  - Arquivos de barril (index): use `index.ts` ou `index.tsx`

### 2.2. Componentes

- Use PascalCase para nomes de componentes
  - Exemplos: `Button`, `UserProfile`, `LoginForm`
- Sufixos comuns:
  - `Form` para formulários: `LoginForm`, `RegistrationForm`
  - `List` para listas: `UserList`, `ProductList`
  - `Item` para itens de lista: `UserItem`, `ProductItem`
  - `Provider` para contextos: `AuthProvider`, `ThemeProvider`

### 2.3. Hooks

- Prefixe hooks personalizados com `use`
  - Exemplos: `useAuth`, `useForm`, `useLocalStorage`

### 2.4. Funções e Variáveis

- Use camelCase para funções e variáveis
  - Exemplos: `getUserData()`, `isAuthenticated`, `formattedDate`
- Use nomes descritivos que indicam o propósito
  - Prefira `isUserAuthenticated` em vez de `flag` ou `check`
  - Prefira `fetchUserData` em vez de `getData`

### 2.5. Interfaces e Tipos

- Use PascalCase para interfaces e tipos
- Sufixe interfaces de props com `Props`
- Não prefixe interfaces com `I` ou tipos com `T`

\`\`\`typescript
// Correto
interface User {
  id: string;
  name: string;
}

interface ButtonProps {
  variant: string;
}

type Theme = 'light' | 'dark' | 'system';

// Incorreto
interface IUser {
  id: string;
  name: string;
}

type TTheme = 'light' | 'dark' | 'system';
\`\`\`

### 2.6. Constantes

- Use UPPER_SNAKE_CASE para constantes globais
  - Exemplos: `API_URL`, `MAX_RETRY_COUNT`
- Use camelCase para constantes locais
  - Exemplos: `defaultOptions`, `initialState`

## 3. Estrutura de Arquivos

### 3.1. Estrutura de Diretórios

\`\`\`
src/
├── app/                  # Rotas e páginas (Next.js App Router)
├── components/           # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI básicos
│   ├── layout/           # Componentes de layout
│   ├── form/             # Componentes de formulário
│   └── [feature]/        # Componentes específicos de feature
├── hooks/                # Hooks personalizados
├── lib/                  # Bibliotecas e integrações
├── services/             # Serviços de API e lógica de negócios
├── store/                # Gerenciamento de estado global
├── styles/               # Estilos globais e variáveis
├── types/                # Definições de tipos globais
└── utils/                # Funções utilitárias
\`\`\`

### 3.2. Estrutura de Componentes

Cada componente deve seguir uma estrutura consistente:

\`\`\`
components/ui/Button/
├── index.tsx             # Exportação principal
├── Button.tsx            # Implementação do componente
├── Button.test.tsx       # Testes
└── Button.module.css     # Estilos (se necessário)
\`\`\`

### 3.3. Arquivos de Barril (Index)

Use arquivos de barril para simplificar importações:

\`\`\`typescript
// components/ui/index.ts
export * from './Button';
export * from './Card';
export * from './Input';
\`\`\`

Isso permite importações mais limpas:

\`\`\`typescript
// Importação com barril
import { Button, Card, Input } from '@/components/ui';

// Sem barril
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
\`\`\`

## 4. Design Visual

### 4.1. Sistema de Cores

O sistema de cores do ProjectBasePronto é definido em variáveis CSS e configurações do Tailwind:

#### Cores Primárias

| Nome | Hex | Uso |
|------|-----|-----|
| primary | `#0070f3` | Ações principais, links, elementos de destaque |
| primary-dark | `#0050d0` | Hover e estados ativos de elementos primários |
| primary-light | `#3291ff` | Backgrounds e elementos secundários |

#### Cores Neutras

| Nome | Hex | Uso |
|------|-----|-----|
| background | `#ffffff` | Fundo da aplicação |
| foreground | `#000000` | Texto principal |
| muted | `#f5f5f5` | Backgrounds secundários |
| muted-foreground | `#737373` | Texto secundário |
| border | `#e5e5e5` | Bordas e separadores |

#### Cores de Estado

| Nome | Hex | Uso |
|------|-----|-----|
| success | `#10b981` | Confirmações, ações bem-sucedidas |
| warning | `#f59e0b` | Alertas, ações que requerem atenção |
| error | `#ef4444` | Erros, ações destrutivas |
| info | `#3b82f6` | Informações, dicas |

### 4.2. Tipografia

#### Família de Fontes

- **Principal**: Inter (sans-serif)
- **Alternativa**: System UI stack

#### Tamanhos de Fonte

| Nome | Tamanho | Uso |
|------|---------|-----|
| xs | 0.75rem (12px) | Texto muito pequeno, notas de rodapé |
| sm | 0.875rem (14px) | Texto secundário, legendas |
| base | 1rem (16px) | Texto principal do corpo |
| lg | 1.125rem (18px) | Subtítulos, texto destacado |
| xl | 1.25rem (20px) | Títulos pequenos |
| 2xl | 1.5rem (24px) | Títulos de seção |
| 3xl | 1.875rem (30px) | Títulos de página |
| 4xl | 2.25rem (36px) | Títulos principais |

#### Pesos de Fonte

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### 4.3. Espaçamento

O sistema de espaçamento segue uma escala consistente:

| Nome | Valor | Uso |
|------|-------|-----|
| 0 | 0px | Sem espaçamento |
| 1 | 0.25rem (4px) | Espaçamento mínimo |
| 2 | 0.5rem (8px) | Espaçamento pequeno |
| 3 | 0.75rem (12px) | Espaçamento entre elementos relacionados |
| 4 | 1rem (16px) | Espaçamento padrão |
| 5 | 1.25rem (20px) | Espaçamento médio |
| 6 | 1.5rem (24px) | Espaçamento entre seções |
| 8 | 2rem (32px) | Espaçamento grande |
| 10 | 2.5rem (40px) | Espaçamento entre componentes principais |
| 12 | 3rem (48px) | Espaçamento entre seções principais |
| 16 | 4rem (64px) | Espaçamento muito grande |

### 4.4. Bordas e Sombras

#### Bordas

| Nome | Valor | Uso |
|------|-------|-----|
| border-width | 1px | Largura padrão de borda |
| border-radius-sm | 0.125rem (2px) | Arredondamento mínimo |
| border-radius | 0.25rem (4px) | Arredondamento padrão |
| border-radius-md | 0.375rem (6px) | Arredondamento médio |
| border-radius-lg | 0.5rem (8px) | Arredondamento grande |
| border-radius-xl | 0.75rem (12px) | Arredondamento muito grande |
| border-radius-full | 9999px | Arredondamento completo (círculo) |

#### Sombras

| Nome | Valor | Uso |
|------|-------|-----|
| shadow-sm | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Sombra sutil |
| shadow | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` | Sombra padrão |
| shadow-md | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Sombra média |
| shadow-lg | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Sombra grande |
| shadow-xl | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Sombra muito grande |

### 4.5. Breakpoints Responsivos

| Nome | Valor | Descrição |
|------|-------|-----------|
| sm | 640px | Dispositivos móveis em modo paisagem |
| md | 768px | Tablets |
| lg | 1024px | Laptops/Desktops pequenos |
| xl | 1280px | Desktops |
| 2xl | 1536px | Telas grandes |

## 5. Boas Práticas

### 5.1. Performance

- Use React.memo para componentes que renderizam frequentemente com as mesmas props
- Evite renderizações desnecessárias usando useCallback e useMemo
- Otimize imagens usando formatos modernos (WebP, AVIF) e carregamento lazy
- Divida código usando importações dinâmicas e React.lazy
- Minimize o número de estados e efeitos colaterais

\`\`\`typescript
// Uso de useCallback
const handleClick = useCallback(() => {
  // lógica do manipulador
}, [dependências]);

// Uso de useMemo
const filteredItems = useMemo(() => {
  return items.filter(item => item.category === selectedCategory);
}, [items, selectedCategory]);

// Importação dinâmica
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Carregando...</p>,
  ssr: false,
});
\`\`\`

### 5.2. Acessibilidade

- Use elementos semânticos HTML5 (`<nav>`, `<main>`, `<section>`, etc.)
- Forneça textos alternativos para imagens
- Garanta contraste adequado de cores
- Implemente navegação por teclado
- Use atributos ARIA quando necessário
- Teste com leitores de tela

\`\`\`typescript
// Exemplo de botão acessível
<button
  aria-label="Fechar modal"
  aria-pressed={isPressed}
  onClick={handleClose}
>
  <span className="sr-only">Fechar</span>
  <XIcon />
</button>

// Exemplo de imagem acessível
<img 
  src="/images/logo.png" 
  alt="Logo da empresa ProjectBasePronto" 
  width={200} 
  height={50} 
/>
\`\`\`

### 5.3. Segurança

- Sanitize dados de entrada para prevenir XSS
- Use HTTPS para todas as requisições
- Implemente CSRF tokens para formulários
- Não armazene informações sensíveis no localStorage ou sessionStorage
- Valide dados tanto no cliente quanto no servidor

\`\`\`typescript
// Sanitização de HTML (usando DOMPurify)
import DOMPurify from 'dompurify';

function Comment({ content }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
\`\`\`

### 5.4. Testes

- Escreva testes unitários para funções e componentes
- Implemente testes de integração para fluxos importantes
- Use mocks para serviços externos
- Teste casos de erro e edge cases
- Mantenha cobertura de testes acima de 80%

\`\`\`typescript
// Exemplo de teste de componente
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza corretamente', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clique aqui</Button>);
    fireEvent.click(screen.getByText('Clique aqui'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('está desabilitado quando isDisabled é true', () => {
    render(<Button isDisabled>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeDisabled();
  });
});
\`\`\`

## 6. Controle de Versão

### 6.1. Padrões de Commit

Siga o padrão Conventional Commits para mensagens de commit:

\`\`\`
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
\`\`\`

#### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o código (espaços em branco, formatação, etc.)
- **refactor**: Refatoração de código
- **perf**: Melhorias de performance
- **test**: Adição ou correção de testes
- **build**: Alterações no sistema de build ou dependências
- **ci**: Alterações nos arquivos de CI
- **chore**: Outras alterações que não modificam código de produção

#### Exemplos

\`\`\`
feat(auth): adiciona autenticação com Google

fix(dashboard): corrige cálculo de estatísticas

docs: atualiza README com instruções de instalação

refactor(api): simplifica lógica de paginação
\`\`\`

### 6.2. Fluxo de Trabalho Git

- Use o fluxo GitFlow ou GitHub Flow
- Crie branches para features, fixes e releases
- Use pull requests para revisão de código
- Faça squash de commits antes de mesclar
- Mantenha o histórico de commits limpo e significativo

#### Nomenclatura de Branches

- **feature/**: Para novas funcionalidades (`feature/auth-google`)
- **fix/**: Para correções de bugs (`fix/login-validation`)
- **docs/**: Para documentação (`docs/api-reference`)
- **refactor/**: Para refatorações (`refactor/user-service`)
- **release/**: Para releases (`release/v1.2.0`)

## 7. Documentação de Código

### 7.1. Comentários

- Use comentários para explicar "por quê", não "o quê" ou "como"
- Documente decisões não óbvias e casos especiais
- Evite comentários redundantes que apenas repetem o código
- Use TODO, FIXME e NOTE para marcar itens que precisam de atenção

\`\`\`typescript
// Bom comentário
// Usamos setTimeout com 0ms para mover esta operação para o final da fila de eventos,
// evitando bloqueio da UI durante o processamento de dados grandes
setTimeout(() => {
  processLargeDataSet(data);
}, 0);

// Comentário ruim
// Incrementa o contador
counter++;
\`\`\`

### 7.2. JSDoc

Use JSDoc para documentar funções, classes e interfaces:

\`\`\`typescript
/**
 * Formata um número como moeda brasileira (BRL)
 * 
 * @param {number} value - O valor a ser formatado
 * @param {boolean} [showSymbol=true] - Se deve mostrar o símbolo da moeda
 * @returns {string} O valor formatado como moeda
 * 
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(1234.56, false) // "1.234,56"
 */
export function formatCurrency(value: number, showSymbol: boolean = true): string {
  // implementação
}
\`\`\`

### 7.3. README e Documentação

- Mantenha um README atualizado com:
  - Visão geral do projeto
  - Requisitos e dependências
  - Instruções de instalação e configuração
  - Exemplos de uso
  - Contribuição e diretrizes
- Documente APIs e serviços
- Mantenha um CHANGELOG para registrar alterações

## Conclusão

Este guia de estilo e padrões estabelece as diretrizes para manter consistência e qualidade no desenvolvimento do ProjectBasePronto. Seguir estes padrões ajuda a garantir que o código seja legível, manutenível e escalável.

A adesão a estes padrões é importante para todos os membros da equipe, pois facilita a colaboração, reduz o tempo de onboarding de novos desenvolvedores e minimiza erros e inconsistências.

Este documento deve ser revisado e atualizado regularmente para refletir as melhores práticas e necessidades em evolução do projeto.
