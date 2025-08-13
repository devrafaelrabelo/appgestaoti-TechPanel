# Guia de Desenvolvimento - Sistema Base

Este documento define os padrões de código e boas práticas para o projeto. Ele tem como objetivo garantir consistência, manutenibilidade e legibilidade do código ao longo do tempo.

## Idioma no Código

### Regra Geral de Idiomas

- **Código (Inglês)**: Todos os elementos de código devem ser escritos em inglês
  - Nomes de variáveis, funções, classes, componentes
  - Nomes de arquivos e diretórios
  - Comentários no código
  - Nomes de branches e mensagens de commit
  - Documentação técnica interna

- **Interface do Usuário (Português)**: Apenas textos visíveis para o usuário final devem ser em português
  - Textos em botões, labels, mensagens
  - Títulos e descrições de páginas
  - Mensagens de erro e feedback
  - Tooltips e ajudas contextuais

### Exemplos de Aplicação

| Elemento | Correto (Inglês) | Incorreto (Português) |
|----------|------------------|------------------------|
| Nome de arquivo | `user-profile.tsx` | `perfil-usuario.tsx` |
| Nome de componente | `UserTable` | `TabelaUsuario` |
| Nome de função | `handleSubmit()` | `lidarComEnvio()` |
| Nome de variável | `isLoading` | `estaCarregando` |
| Comentário | `// Check if user is authenticated` | `// Verificar se o usuário está autenticado` |

| Elemento UI | Correto (Português) | Incorreto (Inglês) |
|-------------|---------------------|---------------------|
| Texto botão | `"Salvar alterações"` | `"Save changes"` |
| Mensagem erro | `"Credenciais inválidas"` | `"Invalid credentials"` |
| Título página | `"Configurações de Usuário"` | `"User Settings"` |

## Nomenclatura

### Componentes

- Usar **PascalCase** (ex: `UserProfile`, `DataTable`)
- Nomes devem ser descritivos e representar a função do componente
- Sufixos comuns: `Card`, `Table`, `Form`, `List`, `Item`, `Button`, `Modal`, `Dialog`

### Páginas

- Usar **PascalCase** com sufixo "Page" para componentes de página (ex: `DashboardPage`, `SettingsPage`)
- Arquivo principal sempre deve ser `page.tsx` dentro do diretório correspondente
- Componentes específicos da página devem seguir o padrão: `[page-name]-[functionality].tsx`

### Funções

- Usar **camelCase** (ex: `handleSubmit`, `formatDate`)
- Prefixos comuns:
  - `handle`: manipuladores de eventos (ex: `handleClick`, `handleSubmit`)
  - `format`: formatação de dados (ex: `formatDate`, `formatCurrency`)
  - `fetch`: busca de dados (ex: `fetchUserData`)
  - `validate`: validação (ex: `validateForm`, `validateEmail`)
  - `create`: criação de objetos (ex: `createUser`)
  - `update`: atualização (ex: `updateProfile`, `updateSettings`)
  - `delete`: exclusão (ex: `deleteUser`)

### Variáveis

- Usar **camelCase** (ex: `userData`, `isLoading`)
- Booleanos com prefixos que indiquem condição (ex: `isActive`, `hasPermission`)
- Arrays devem ser plurais (ex: `users`, `notifications`)

### Hooks

- Usar **camelCase** com prefixo `use` (ex: `useAuth`, `useNotifications`)
- Devem ser específicos e ter um propósito claro

### Tipos/Interfaces

- Usar **PascalCase** (ex: `UserData`)
- Interfaces de props com sufixo `Props` (ex: `ButtonProps`, `TableProps`)
- Tipos de estados com sufixo `State` (ex: `AuthState`, `FormState`)
- Tipos genéricos devem ser descritivos (ex: `TUser`)

### Arquivos

- Componentes: **kebab-case** (ex: `user-profile.tsx`, `data-table.tsx`)
- Páginas: `page.tsx` dentro de diretórios com **kebab-case** (ex: `dashboard/page.tsx`)
- Hooks: **kebab-case** (ex: `use-auth.ts`, `use-notifications.ts`)
- Utilitários: **kebab-case** (ex: `date-utils.ts`, `format-helpers.ts`)
- Testes: sufixo `.test.ts(x)` (ex: `login-form.test.tsx`)

## Estrutura de Diretórios

\`\`\`bash
src/                    # Diretório raiz do código-fonte
  /app                  # Páginas e rotas da aplicação
    /(protected)/       # Rotas protegidas que requerem autenticação
      /dashboard        # Dashboard principal
      /profile          # Perfil do usuário
      /settings         # Configurações
    /(public)/          # Rotas públicas
      /login            # Página de login
      /forgot-password  # Recuperação de senha
  /components           # Componentes reutilizáveis
    /ui                 # Componentes de UI básicos (botões, inputs, etc.)
    /layouts            # Layouts reutilizáveis
    /forms              # Componentes de formulário
  /hooks                # Hooks personalizados
  /lib                  # Bibliotecas e utilitários
  /features             # Funcionalidades organizadas por domínio
    /auth               # Autenticação
      /components       # Componentes específicos de autenticação
      /hooks            # Hooks específicos de autenticação
      /utils            # Utilitários específicos de autenticação
    /users              # Gerenciamento de usuários
    /profile            # Perfil de usuário
  /utils                # Utilitários gerais
  /types                # Definições de tipos TypeScript
  /styles               # Estilos globais
  /docs                 # Documentação
\`\`\`

## Boas Práticas

### Componentização

1. **Componentes Pequenos e Focados**: Cada componente deve ter uma única responsabilidade
2. **Composição sobre Herança**: Prefira compor componentes menores em vez de criar componentes grandes e complexos
3. **Reutilização**: Extraia lógica comum para componentes reutilizáveis
4. **Props Consistentes**: Mantenha a API de props consistente entre componentes similares

### Hooks Personalizados

1. **Extrair Lógica Complexa**: Mova lógica complexa de componentes para hooks personalizados
2. **Nomes Descritivos**: Use nomes que descrevam claramente o propósito do hook
3. **Retorno Consistente**: Mantenha o formato de retorno consistente
4. **Documentação**: Documente a API do hook com comentários JSDoc

### Performance

1. **Memoização**: Use `useMemo` e `useCallback` para evitar recálculos desnecessários
2. **Renderização Condicional**: Evite renderizar componentes desnecessariamente
3. **Lazy Loading**: Carregue componentes e dados apenas quando necessário
4. **Virtualização**: Use virtualização para listas longas
5. **Otimização de Imagens**: Otimize imagens para reduzir o tempo de carregamento

### Gerenciamento de Estado

1. **Estado Local**: Use `useState` para estado local simples
2. **Estado Complexo**: Use `useReducer` para estado local complexo
3. **Estado Global**: Use Context API para estado global
4. **Persistência**: Use localStorage/sessionStorage para persistência de estado

### Formulários

1. **Validação**: Implemente validação de formulários consistente
2. **Feedback**: Forneça feedback claro para erros de validação
3. **Acessibilidade**: Garanta que os formulários sejam acessíveis
4. **Estado Controlado**: Use componentes controlados para formulários

### Estilização

1. **Tailwind CSS**: Use classes Tailwind para estilização
2. **Consistência**: Mantenha um estilo consistente em toda a aplicação
3. **Responsividade**: Garanta que a aplicação seja responsiva
4. **Tema**: Suporte temas claro e escuro

### Segurança

1. **Validação de Entrada**: Valide todas as entradas do usuário
2. **Sanitização**: Sanitize dados antes de exibi-los
3. **CSRF**: Proteja contra ataques CSRF
4. **XSS**: Proteja contra ataques XSS
5. **Autenticação**: Implemente autenticação segura

### Testes

1. **Testes Unitários**: Teste componentes e funções isoladamente
2. **Testes de Integração**: Teste a interação entre componentes
3. **Testes E2E**: Teste fluxos completos do usuário
4. **Mocks**: Use mocks para simular APIs e serviços externos

## Linguagem Amigável ao Usuário

### Princípios Gerais

A linguagem usada na interface do usuário deve ser clara, direta e familiar para os usuários. Termos técnicos devem ser evitados em favor de expressões mais naturais e compreensíveis.

### Diretrizes para Textos de Interface

1. **Use linguagem simples e direta**
   - Evite jargões técnicos quando possível
   - Prefira frases curtas e objetivas
   - Use voz ativa em vez de passiva

2. **Seja consistente na terminologia**
   - Use os mesmos termos para as mesmas ações em todo o sistema
   - Mantenha a consistência entre rótulos de botões e títulos de páginas

3. **Humanize as interações**
   - Use um tom conversacional, mas profissional
   - Evite linguagem impessoal ou robótica
   - Dirija-se ao usuário diretamente quando apropriado

### Exemplos de Termos Amigáveis

| Termo Técnico | Termo Amigável |
|---------------|----------------|
| Resetar senha | Esqueci senha |
| Autenticar | Entrar |
| Encerrar sessão | Sair |
| Configurar | Personalizar |
| Deletar | Excluir |
| Modificar | Editar |
| Visualizar | Ver |

### Mensagens de Erro e Feedback

1. **Seja específico e útil**
   - Explique claramente o que aconteceu
   - Ofereça orientação sobre como resolver o problema
   - Evite mensagens genéricas como "Erro no sistema"

2. **Use tom positivo**
   - Foque na solução, não no problema
   - Evite culpar o usuário
   - Use linguagem encorajadora

3. **Exemplos de mensagens**:

   **Evite**: "Falha na autenticação devido a credenciais inválidas."  
   **Prefira**: "Nome de usuário ou senha incorretos. Tente novamente ou clique em 'Esqueci senha'."

   **Evite**: "Erro 404: Recurso não encontrado."  
   **Prefira**: "Não encontramos a página que você está procurando."

## Proteção de Rotas

O sistema utiliza o middleware do Next.js para proteger rotas que requerem autenticação:

1. **Rotas Públicas**: Acessíveis sem autenticação (ex: `/login`, `/forgot-password`)
2. **Rotas Protegidas**: Requerem autenticação (ex: `/dashboard`, `/profile`, `/settings`)

O middleware verifica a presença de um token de autenticação e redireciona usuários não autenticados para a página de login.

### Estrutura de Grupos de Rotas

- `(public)`: Contém rotas acessíveis sem autenticação
- `(protected)`: Contém rotas que requerem autenticação

### Fluxo de Autenticação

1. Usuário acessa uma rota protegida sem autenticação
2. Middleware redireciona para `/login` com parâmetro `callbackUrl`
3. Após login bem-sucedido, usuário é redirecionado para a página solicitada originalmente

## Novas Boas Práticas Recomendadas

### 1. Organização de Código

- **Arquivos de Barril (index.ts)**: Use arquivos de barril para exportar componentes e funções de um diretório
- **Colocação de Arquivos**: Mantenha arquivos relacionados próximos uns dos outros
- **Modularização**: Divida funcionalidades complexas em módulos menores

### 2. Gerenciamento de Dependências

- **Dependências Explícitas**: Declare todas as dependências explicitamente
- **Versionamento**: Use versionamento semântico para dependências
- **Auditoria**: Realize auditorias regulares de segurança nas dependências

### 3. Documentação de Código

- **JSDoc**: Use comentários JSDoc para documentar funções e componentes
- **Exemplos**: Inclua exemplos de uso em comentários
- **Atualizações**: Mantenha a documentação atualizada com o código

### 4. Convenções de Commits

- **Commits Atômicos**: Faça commits pequenos e focados
- **Mensagens Descritivas**: Use mensagens de commit claras e descritivas
- **Conventional Commits**: Siga o padrão de Conventional Commits (feat, fix, docs, etc.)

### 5. Revisão de Código

- **Checklists**: Use checklists para revisão de código
- **Feedback Construtivo**: Forneça feedback construtivo e específico
- **Automação**: Use ferramentas automatizadas para verificar problemas comuns

### 6. Acessibilidade

- **ARIA**: Use atributos ARIA apropriadamente
- **Contraste**: Garanta contraste suficiente para texto
- **Navegação por Teclado**: Garanta que a aplicação seja navegável por teclado
- **Leitor de Tela**: Teste com leitores de tela

### 7. Internacionalização

- **Extraia Strings**: Mantenha strings de UI em arquivos separados
- **Formatação**: Use formatação apropriada para datas, números e moedas
- **RTL**: Considere suporte para idiomas da direita para a esquerda

### 8. Monitoramento e Logging

- **Erros do Cliente**: Capture e reporte erros do cliente
- **Métricas de Performance**: Monitore métricas de performance
- **Logs Estruturados**: Use logs estruturados para facilitar a análise

### 9. Otimização de Imagens

- **Formatos Modernos**: Use formatos modernos como WebP
- **Dimensionamento**: Forneça imagens no tamanho apropriado
- **Lazy Loading**: Carregue imagens apenas quando necessário

### 10. Segurança Avançada

- **Content Security Policy**: Implemente CSP
- **HTTPS**: Use HTTPS para todas as requisições
- **Autenticação Multifator**: Implemente autenticação multifator quando possível
- **Rate Limiting**: Implemente rate limiting para APIs

## Conclusão

Seguir estas diretrizes e boas práticas ajudará a manter a consistência, qualidade e manutenibilidade do código ao longo do tempo. Este documento deve ser revisado e atualizado regularmente para refletir as melhores práticas atuais e as necessidades específicas do projeto.
