# Testes

## Sumário

1. [Introdução](#introdução)
2. [Estratégia de Testes](#estratégia-de-testes)
3. [Tipos de Testes](#tipos-de-testes)
   - [Testes Unitários](#testes-unitários)
   - [Testes de Integração](#testes-de-integração)
   - [Testes End-to-End](#testes-end-to-end)
   - [Testes de Performance](#testes-de-performance)
4. [Ferramentas e Frameworks](#ferramentas-e-frameworks)
5. [Estrutura e Organização](#estrutura-e-organização)
6. [Executando Testes](#executando-testes)
7. [Boas Práticas](#boas-práticas)
8. [Cobertura de Código](#cobertura-de-código)
9. [Integração com CI/CD](#integração-com-cicd)
10. [Testes de Regressão](#testes-de-regressão)
11. [Exemplos Práticos](#exemplos-práticos)
12. [Troubleshooting](#troubleshooting)

## Introdução

Este documento descreve a estratégia de testes do ProjectBasePronto, incluindo os tipos de testes implementados, ferramentas utilizadas, estrutura de organização e boas práticas. O objetivo é garantir a qualidade do código, prevenir regressões e facilitar o desenvolvimento contínuo do projeto.

Os testes são uma parte fundamental do ciclo de desenvolvimento, permitindo identificar problemas precocemente, garantir que novas funcionalidades não quebrem recursos existentes e documentar o comportamento esperado do sistema.

## Estratégia de Testes

A estratégia de testes do ProjectBasePronto segue a pirâmide de testes, com maior ênfase em testes unitários, seguidos por testes de integração e, por fim, testes end-to-end:

\`\`\`
    /\
   /  \
  /E2E \
 /------\
/        \
/Integração\
/------------\
/   Unitários  \
----------------
\`\`\`

### Princípios Fundamentais

1. **Testes Automatizados**: Priorizar testes automatizados sobre testes manuais
2. **Testes Rápidos**: Os testes devem ser rápidos para incentivar execuções frequentes
3. **Testes Independentes**: Cada teste deve ser independente e não depender de outros testes
4. **Testes Determinísticos**: Os testes devem produzir o mesmo resultado a cada execução
5. **Testes Legíveis**: Os testes devem ser fáceis de entender e manter

## Tipos de Testes

### Testes Unitários

Os testes unitários verificam o comportamento de unidades individuais de código (geralmente funções ou métodos) isoladamente do resto do sistema.

#### Características

- Testam uma única unidade de código
- São rápidos de executar
- Não dependem de recursos externos (banco de dados, APIs, etc.)
- Usam mocks e stubs para isolar a unidade sendo testada

#### Ferramentas

- Jest
- React Testing Library (para componentes React)
- Vitest (alternativa mais rápida ao Jest)

#### Exemplo

\`\`\`typescript
// src/utils/format-date.test.ts
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formata data no padrão brasileiro', () => {
    const date = new Date('2023-05-15T10:30:00');
    expect(formatDate(date)).toBe('15/05/2023');
  });

  it('retorna string vazia para data inválida', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});
\`\`\`

### Testes de Integração

Os testes de integração verificam como diferentes partes do sistema funcionam juntas, testando a integração entre componentes, serviços ou módulos.

#### Características

- Testam a interação entre múltiplos componentes
- Podem envolver recursos externos (banco de dados, APIs, etc.)
- São mais lentos que testes unitários
- Verificam fluxos de dados e comunicação entre partes do sistema

#### Ferramentas

- Jest
- Supertest (para testar APIs)
- MSW (Mock Service Worker) para simular APIs externas

#### Exemplo

\`\`\`typescript
// src/features/auth/services/auth-service.test.ts
import { authService } from './auth-service';
import { mockDb } from '@/test/mocks/db';

// Configurar mock do banco de dados
jest.mock('@/lib/db', () => mockDb);

describe('authService', () => {
  beforeEach(() => {
    mockDb.users.clear();
    mockDb.users.add({
      id: '1',
      username: 'teste@exemplo.com',
      passwordHash: '$2a$10$...',
      name: 'Usuário Teste',
      role: 'user'
    });
  });

  it('autentica usuário com credenciais válidas', async () => {
    const result = await authService.login('teste@exemplo.com', 'senha123');
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.username).toBe('teste@exemplo.com');
  });

  it('rejeita usuário com credenciais inválidas', async () => {
    const result = await authService.login('teste@exemplo.com', 'senhaerrada');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Credenciais inválidas');
  });
});
\`\`\`

### Testes End-to-End

Os testes end-to-end (E2E) verificam o sistema como um todo, simulando a interação do usuário com a aplicação em um ambiente próximo ao de produção.

#### Características

- Testam fluxos completos da aplicação
- Simulam interações reais do usuário
- São mais lentos e mais complexos
- Verificam a integração de todos os componentes do sistema

#### Ferramentas

- Cypress
- Playwright
- Selenium

#### Exemplo

\`\`\`typescript
// cypress/e2e/login.cy.ts
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('permite login com credenciais válidas', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();

    // Verifica redirecionamento para dashboard
    cy.url().should('include', '/modules');
    cy.contains('Bem-vindo').should('be.visible');
  });

  it('mostra erro com credenciais inválidas', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();

    // Verifica mensagem de erro
    cy.contains('Credenciais inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });
});
\`\`\`

### Testes de Performance

Os testes de performance avaliam o desempenho do sistema sob diferentes condições de carga e uso.

#### Características

- Medem tempo de resposta, throughput e uso de recursos
- Identificam gargalos de performance
- Verificam a escalabilidade do sistema
- Estabelecem limites de carga aceitáveis

#### Ferramentas

- Lighthouse (para performance web)
- k6 (para testes de carga)
- JMeter

#### Exemplo

\`\`\`javascript
// k6/login-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  const payload = JSON.stringify({
    username: 'admin',
    password: 'admin',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('https://api.exemplo.com/auth/login', payload, params);
  
  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
\`\`\`

## Ferramentas e Frameworks

### Principais Ferramentas

| Ferramenta | Tipo | Descrição |
|------------|------|-----------|
| Jest | Testes unitários e de integração | Framework de testes JavaScript com suporte a mocking e cobertura de código |
| React Testing Library | Testes de componentes | Biblioteca para testar componentes React de forma centrada no usuário |
| Cypress | Testes E2E | Framework para testes end-to-end com interface visual |
| Playwright | Testes E2E | Framework para testes end-to-end com suporte a múltiplos navegadores |
| MSW | Mock de API | Biblioteca para interceptar e simular requisições de rede |
| Lighthouse | Performance | Ferramenta para auditoria de performance, acessibilidade e SEO |
| k6 | Testes de carga | Ferramenta para testes de carga e performance |

### Configuração

#### Jest

\`\`\`javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/mocks/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
\`\`\`

#### Cypress

\`\`\`javascript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 5000,
  },
});
\`\`\`

## Estrutura e Organização

### Estrutura de Diretórios

\`\`\`
src/
  ├── __tests__/            # Testes globais
  ├── components/
  │   ├── __tests__/        # Testes de componentes
  │   └── ...
  ├── features/
  │   ├── auth/
  │   │   ├── __tests__/    # Testes específicos da feature
  │   ����   └── ...
  │   └── ...
  ├── utils/
  │   ├── __tests__/        # Testes de utilitários
  │   └── ...
  └── ...
cypress/
  ├── e2e/                  # Testes end-to-end
  ├── fixtures/             # Dados de teste
  ├── support/              # Comandos e utilitários
  └── ...
\`\`\`

### Convenções de Nomenclatura

- Arquivos de teste unitário: `[nome-do-arquivo].test.ts(x)`
- Arquivos de teste de integração: `[nome-do-arquivo].integration.test.ts(x)`
- Arquivos de teste E2E: `[nome-do-fluxo].cy.ts`

## Executando Testes

### Comandos Básicos

\`\`\`bash
# Executar todos os testes unitários e de integração
npm test

# Executar testes em modo watch (desenvolvimento)
npm test -- --watch

# Executar testes com cobertura
npm test -- --coverage

# Executar testes de um arquivo específico
npm test -- src/features/auth/services/auth-service.test.ts

# Executar testes E2E com Cypress
npm run cypress:open  # Interface visual
npm run cypress:run   # Linha de comando
\`\`\`

### Scripts no package.json

\`\`\`json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
\`\`\`

## Boas Práticas

### Escrevendo Testes Unitários

1. **Siga o padrão AAA (Arrange-Act-Assert)**
   \`\`\`typescript
   it('formata data corretamente', () => {
     // Arrange (Preparar)
     const date = new Date('2023-05-15');
     
     // Act (Agir)
     const result = formatDate(date);
     
     // Assert (Verificar)
     expect(result).toBe('15/05/2023');
   });
   \`\`\`

2. **Teste comportamentos, não implementação**
   - Foque no que a função deve fazer, não em como ela faz
   - Evite testar detalhes de implementação que podem mudar

3. **Use descrições claras**
   - Descreva o que está sendo testado e o resultado esperado
   - Use linguagem natural e específica

4. **Isole os testes**
   - Cada teste deve ser independente
   - Evite dependências entre testes
   - Use mocks e stubs para isolar o código sendo testado

5. **Teste casos de borda**
   - Valores nulos ou indefinidos
   - Listas vazias
   - Valores extremos
   - Casos de erro

### Escrevendo Testes de Componentes

1. **Teste do ponto de vista do usuário**
   - Foque em como o usuário interage com o componente
   - Evite testar detalhes de implementação

2. **Use seletores acessíveis**
   - Prefira seletores como `getByRole`, `getByLabelText`, `getByText`
   - Evite seletores baseados em classes CSS ou IDs

3. **Teste interações**
   - Cliques, digitação, submissão de formulários
   - Verifique mudanças de estado visíveis

4. **Teste acessibilidade**
   - Verifique se elementos têm rótulos adequados
   - Teste navegação por teclado

### Escrevendo Testes E2E

1. **Foque em fluxos críticos**
   - Login/logout
   - Registro de usuário
   - Fluxos de pagamento
   - Funcionalidades principais

2. **Mantenha os testes independentes**
   - Cada teste deve configurar seu próprio estado
   - Evite dependências entre testes

3. **Use dados de teste consistentes**
   - Crie fixtures para dados de teste
   - Limpe o estado entre testes

4. **Teste em múltiplos navegadores**
   - Chrome, Firefox, Safari, Edge
   - Dispositivos móveis

## Cobertura de Código

A cobertura de código mede quanto do código da aplicação é exercitado pelos testes. O ProjectBasePronto visa manter uma cobertura mínima de 70% para garantir que a maioria do código seja testada.

### Métricas de Cobertura

- **Linhas**: Percentual de linhas de código executadas
- **Funções**: Percentual de funções chamadas
- **Branches**: Percentual de branches (if/else, switch) executados
- **Statements**: Percentual de statements executados

### Visualizando Relatórios de Cobertura

Após executar os testes com cobertura, um relatório HTML é gerado em `coverage/lcov-report/index.html`.

\`\`\`bash
npm test -- --coverage
# Abra coverage/lcov-report/index.html no navegador
\`\`\`

### Configuração de Limites

\`\`\`javascript
// jest.config.js
module.exports = {
  // ...
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
\`\`\`

## Integração com CI/CD

O ProjectBasePronto integra testes automatizados ao pipeline de CI/CD para garantir que o código seja testado antes de ser implantado.

### GitHub Actions

\`\`\`yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
    
    - name: Run E2E tests
      run: |
        npm run build
        npm run start & npx wait-on http://localhost:3000
        npm run cypress:run
\`\`\`

### Verificações Pré-Commit

Utilizamos husky e lint-staged para executar testes antes de cada commit:

\`\`\`json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "jest --findRelatedTests"
    ]
  }
}
\`\`\`

## Testes de Regressão

Os testes de regressão garantem que alterações no código não quebrem funcionalidades existentes.

### Estratégia

1. **Testes Automatizados**: Executar todos os testes automatizados após cada alteração
2. **Testes Críticos**: Identificar e priorizar testes para funcionalidades críticas
3. **Testes Periódicos**: Executar testes completos periodicamente, mesmo sem alterações

### Implementação

\`\`\`bash
# Script para executar testes de regressão
npm run test:regression
\`\`\`

\`\`\`json
// package.json
{
  "scripts": {
    "test:regression": "jest --testPathIgnorePatterns='.*\\.perf\\.test\\.ts$'"
  }
}
\`\`\`

## Exemplos Práticos

### Teste de Componente de Login

\`\`\`tsx
// src/features/auth/components/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';
import { AuthProvider } from '@/features/auth/context/auth-context';
import { mockRouter } from '@/test/mocks/next-router';

// Mock do useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock do serviço de autenticação
jest.mock('@/features/auth/services/auth-service', () => ({
  authService: {
    login: jest.fn().mockImplementation((username, password) => {
      if (username === 'admin' && password === 'admin') {
        return Promise.resolve({ success: true });
      }
      return Promise.resolve({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
  });

  it('renderiza o formulário corretamente', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('mostra erro com credenciais inválidas', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: 'usuario' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senhaerrada' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('redireciona após login bem-sucedido', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'admin' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/modules');
    });
  });
});
\`\`\`

### Teste de Serviço de Autenticação

\`\`\`typescript
// src/features/auth/services/auth-service.test.ts
import { authService } from './auth-service';
import { cookies } from '@/features/common/utils/cookies-utils';

// Mock do módulo de cookies
jest.mock('@/features/common/utils/cookies-utils', () => ({
  cookies: {
    set: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('retorna sucesso com credenciais válidas', async () => {
      const result = await authService.login('admin', 'admin');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Login realizado com sucesso');
      expect(cookies.set).toHaveBeenCalledWith(
        'auth_token',
        expect.any(String),
        expect.objectContaining({ path: '/' })
      );
    });

    it('retorna erro com credenciais inválidas', async () => {
      const result = await authService.login('admin', 'senhaerrada');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciais inválidas. Por favor, tente novamente.');
      expect(cookies.set).not.toHaveBeenCalled();
    });

    it('armazena token com duração maior quando rememberMe é true', async () => {
      await authService.login('admin', 'admin', true);
      
      expect(cookies.set).toHaveBeenCalledWith(
        'auth_token',
        expect.any(String),
        expect.objectContaining({ 
          maxAge: 7 * 24 * 60 * 60,  // 7 dias
          path: '/' 
        })
      );
    });
  });

  describe('logout', () => {
    it('remove cookies de autenticação', async () => {
      await authService.logout();
      
      expect(cookies.remove).toHaveBeenCalledWith('auth_token');
      expect(cookies.remove).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('isAuthenticated', () => {
    it('retorna true quando token é válido', async () => {
      cookies.get.mockImplementation((name) => {
        if (name === 'auth_token') {
          return 'valid-token';
        }
        return null;
      });
      
      const result = await authService.isAuthenticated();
      
      expect(result).toBe(true);
    });

    it('retorna false quando token não existe', async () => {
      cookies.get.mockReturnValue(null);
      
      const result = await authService.isAuthenticated();
      
      expect(result).toBe(false);
    });
  });
});
\`\`\`

### Teste E2E de Fluxo de Login

\`\`\`typescript
// cypress/e2e/auth/login.cy.ts
describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('exibe formulário de login com todos os elementos', () => {
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Lembrar de mim').should('be.visible');
    cy.contains('Esqueci senha').should('be.visible');
  });

  it('permite login com credenciais válidas', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('button[type="submit"]').click();

    // Verifica redirecionamento para dashboard
    cy.url().should('include', '/modules');
    cy.contains('Bem-vindo').should('be.visible');
  });

  it('mostra erro com credenciais inválidas', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();

    // Verifica mensagem de erro
    cy.contains('Credenciais inválidas').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('redireciona para página de recuperação de senha', () => {
    cy.contains('Esqueci senha').click();
    cy.url().should('include', '/forgot-password');
  });

  it('mantém usuário logado com "Lembrar de mim"', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin');
    cy.get('input[id="remember"]').check();
    cy.get('button[type="submit"]').click();

    // Verifica redirecionamento
    cy.url().should('include', '/modules');

    // Fecha o navegador (simulado)
    cy.reload();

    // Verifica se ainda está logado
    cy.url().should('include', '/modules');
  });
});
\`\`\`

## Troubleshooting

### Problemas Comuns e Soluções

#### Testes Falham Intermitentemente

**Problema**: Testes que passam às vezes e falham outras vezes.

**Soluções**:
- Verifique se há dependências entre testes
- Aumente timeouts para operações assíncronas
- Verifique se há condições de corrida
- Limpe o estado entre testes

\`\`\`typescript
// Exemplo de aumento de timeout
it('carrega dados da API', async () => {
  await waitFor(() => expect(screen.getByText('Dados carregados')).toBeInTheDocument(), {
    timeout: 5000,  // Aumentar timeout para 5 segundos
  });
});
\`\`\`

#### Erros de Renderização com React Testing Library

**Problema**: Erros ao renderizar componentes com hooks ou contextos.

**Solução**: Envolva o componente com os provedores necessários.

\`\`\`typescript
// Exemplo de wrapper para testes
const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Uso
it('renderiza componente com contexto', () => {
  customRender(<MeuComponente />);
  // ...
});
\`\`\`

#### Problemas com Mocks

**Problema**: Mocks não funcionam como esperado.

**Soluções**:
- Verifique se o mock está no lugar certo
- Limpe mocks entre testes
- Use `jest.spyOn` para funções específicas

\`\`\`typescript
// Exemplo de mock com spyOn
beforeEach(() => {
  jest.spyOn(authService, 'login').mockResolvedValue({
    success: true,
    user: { id: '1', username: 'teste' },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
\`\`\`

#### Testes E2E Lentos

**Problema**: Testes E2E demoram muito para executar.

**Soluções**:
- Reduza o número de testes E2E
- Paralelizar execução de testes
- Use mocks para APIs externas
- Otimize seletores e esperas

\`\`\`javascript
// cypress.config.js - Configuração para execução paralela
module.exports = {
  // ...
  numTestsKeptInMemory: 5,
  experimentalRunAllSpecs: true,
};
