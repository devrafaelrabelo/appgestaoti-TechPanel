# Guia de Contribuição

## Sumário

1. [Introdução](#introdução)
2. [Configuração do Ambiente](#configuração-do-ambiente)
3. [Fluxo de Trabalho](#fluxo-de-trabalho)
4. [Padrões de Código](#padrões-de-código)
5. [Commits e Mensagens](#commits-e-mensagens)
6. [Pull Requests](#pull-requests)
7. [Revisão de Código](#revisão-de-código)
8. [Reportando Bugs](#reportando-bugs)
9. [Solicitando Funcionalidades](#solicitando-funcionalidades)
10. [Código de Conduta](#código-de-conduta)

## Introdução

Bem-vindo ao guia de contribuição do ProjectBasePronto! Este documento fornece diretrizes para contribuir com o projeto, garantindo que todos os colaboradores sigam os mesmos padrões e práticas. Agradecemos seu interesse em contribuir e esperamos que este guia torne o processo mais claro e eficiente.

## Configuração do Ambiente

### Requisitos

- Node.js (versão 18.x ou superior)
- npm (versão 9.x ou superior) ou Yarn (versão 1.22.x ou superior)
- Git

### Passos para Configuração

1. **Clone o repositório**

   \`\`\`bash
   git clone https://github.com/sua-organizacao/project-base-pronto.git
   cd project-base-pronto
   \`\`\`

2. **Instale as dependências**

   \`\`\`bash
   npm install
   # ou
   yarn
   \`\`\`

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto baseado no arquivo `.env.example`:

   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Edite o arquivo `.env.local` com as configurações necessárias.

4. **Inicie o servidor de desenvolvimento**

   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   \`\`\`

   O servidor estará disponível em `http://localhost:3000`.

5. **Execute os testes**

   \`\`\`bash
   npm test
   # ou
   yarn test
   \`\`\`

## Fluxo de Trabalho

Utilizamos o modelo de Git Flow adaptado para nosso projeto:

1. **Branches principais**
   - `main`: Código em produção
   - `develop`: Código em desenvolvimento, base para novas features

2. **Branches de suporte**
   - `feature/*`: Para novas funcionalidades (ex: `feature/login-page`)
   - `bugfix/*`: Para correções de bugs (ex: `bugfix/login-validation`)
   - `hotfix/*`: Para correções urgentes em produção (ex: `hotfix/security-issue`)
   - `release/*`: Para preparação de novas versões (ex: `release/v1.0.0`)

3. **Fluxo básico**
   - Crie uma branch a partir de `develop` para sua feature ou bugfix
   - Desenvolva e teste suas alterações
   - Envie um Pull Request para `develop`
   - Após revisão e aprovação, seu código será mesclado

## Padrões de Código

### Idioma no Código

- **Código (Inglês)**: Todos os elementos de código devem ser escritos em inglês
  - Nomes de variáveis, funções, classes, componentes
  - Nomes de arquivos e diretórios
  - Comentários no código
  - Nomes de branches e mensagens de commit

- **Interface do Usuário (Português)**: Apenas textos visíveis para o usuário final devem ser em português
  - Textos em botões, labels, mensagens
  - Títulos e descrições de páginas
  - Mensagens de erro e feedback

### Estilo de Código

Seguimos o padrão de estilo definido no ESLint e Prettier configurados no projeto:

- Indentação com 2 espaços
- Ponto e vírgula ao final das declarações
- Aspas simples para strings
- Máximo de 100 caracteres por linha
- Uso de TypeScript para tipagem estática

### Nomenclatura

- **Componentes**: PascalCase (ex: `UserProfile`, `DataTable`)
- **Arquivos de componentes**: kebab-case (ex: `user-profile.tsx`, `data-table.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth`, `useForm`)
- **Funções**: camelCase (ex: `handleSubmit`, `formatDate`)
- **Variáveis**: camelCase (ex: `userData`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_URL`, `MAX_RETRIES`)
- **Interfaces/Types**: PascalCase (ex: `UserData`, `ApiResponse`)

## Commits e Mensagens

Utilizamos o padrão [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit:

\`\`\`
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
\`\`\`

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações que não afetam o código (espaço em branco, formatação, etc)
- `refactor`: Refatoração de código
- `perf`: Melhorias de performance
- `test`: Adição ou correção de testes
- `build`: Alterações no sistema de build ou dependências
- `ci`: Alterações nos arquivos de CI
- `chore`: Outras alterações que não modificam código de produção

### Exemplos

\`\`\`
feat(auth): implementa autenticação com JWT

Adiciona sistema de autenticação baseado em JWT com refresh token.
Inclui middleware para proteção de rotas.

Closes #123
\`\`\`

\`\`\`
fix(login): corrige validação de formulário

Corrige bug na validação do campo de email que permitia valores inválidos.

Fixes #456
\`\`\`

## Pull Requests

### Criando um Pull Request

1. Certifique-se de que sua branch está atualizada com a branch de destino
2. Execute os testes e linting para garantir que seu código está correto
3. Crie o Pull Request no GitHub com as seguintes informações:
   - Título claro e descritivo
   - Descrição detalhada das alterações
   - Referência a issues relacionadas (ex: "Closes #123")
   - Screenshots ou GIFs demonstrando as alterações (se aplicável)

### Template de Pull Request

\`\`\`markdown
## Descrição
Descreva brevemente o propósito deste PR.

## Mudanças
- Lista de alterações principais
- Outra alteração importante

## Screenshots
(Se aplicável, adicione screenshots para demonstrar as alterações visuais)

## Testes
Descreva os testes realizados e como verificar as alterações.

## Issues Relacionadas
Closes #123
\`\`\`

## Revisão de Código

### Processo de Revisão

1. Todos os Pull Requests devem ser revisados por pelo menos um desenvolvedor
2. O revisor deve verificar:
   - Funcionalidade: O código faz o que deveria fazer?
   - Qualidade: O código segue os padrões do projeto?
   - Testes: Existem testes adequados para as alterações?
   - Documentação: As alterações estão documentadas adequadamente?

### Checklist de Revisão

- [ ] O código segue os padrões de estilo do projeto
- [ ] Os testes foram adicionados ou atualizados
- [ ] A documentação foi atualizada (se necessário)
- [ ] O código é legível e fácil de entender
- [ ] Não há código duplicado ou desnecessário
- [ ] As alterações são relevantes para o escopo do PR
- [ ] O código é seguro e não introduz vulnerabilidades

## Reportando Bugs

### Como Reportar um Bug

1. Verifique se o bug já não foi reportado
2. Use o template de bug report no GitHub
3. Forneça informações detalhadas:
   - Descrição clara e concisa do bug
   - Passos para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Screenshots ou vídeos (se aplicável)
   - Ambiente (navegador, sistema operacional, etc.)
   - Logs de erro relevantes

### Template de Bug Report

\`\`\`markdown
## Descrição do Bug
Uma descrição clara e concisa do bug.

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

## Comportamento Esperado
Uma descrição clara do que você esperava que acontecesse.

## Screenshots
Se aplicável, adicione screenshots para ajudar a explicar o problema.

## Ambiente
 - Dispositivo: [ex: Desktop, iPhone 12]
 - Sistema Operacional: [ex: Windows 10, iOS 15]
 - Navegador: [ex: Chrome 96, Safari 15]
 - Versão do Projeto: [ex: 1.0.0]

## Contexto Adicional
Qualquer outra informação relevante sobre o problema.
\`\`\`

## Solicitando Funcionalidades

### Como Solicitar uma Funcionalidade

1. Verifique se a funcionalidade já não foi solicitada ou implementada
2. Use o template de feature request no GitHub
3. Forneça informações detalhadas:
   - Descrição clara da funcionalidade
   - Justificativa (por que esta funcionalidade é necessária)
   - Comportamento esperado
   - Alternativas consideradas
   - Mockups ou exemplos (se aplicável)

### Template de Feature Request

\`\`\`markdown
## Problema Relacionado
Uma descrição clara e concisa do problema que esta funcionalidade resolveria.
Ex: Fico frustrado quando [...]

## Solução Desejada
Uma descrição clara e concisa do que você gostaria que acontecesse.

## Alternativas Consideradas
Uma descrição clara e concisa de quaisquer soluções alternativas que você considerou.

## Contexto Adicional
Adicione qualquer outro contexto ou screenshots sobre a solicitação de funcionalidade aqui.
\`\`\`

## Código de Conduta

### Nosso Compromisso

No interesse de promover um ambiente aberto e acolhedor, nós, como contribuidores e mantenedores, nos comprometemos a tornar a participação em nosso projeto uma experiência livre de assédio para todos, independentemente de idade, tamanho corporal, deficiência, etnia, identidade e expressão de gênero, nível de experiência, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

### Nossos Padrões

Exemplos de comportamento que contribuem para criar um ambiente positivo incluem:

- Usar linguagem acolhedora e inclusiva
- Respeitar pontos de vista e experiências diferentes
- Aceitar críticas construtivas com elegância
- Focar no que é melhor para a comunidade
- Mostrar empatia para com outros membros da comunidade

Exemplos de comportamento inaceitável incluem:

- Uso de linguagem ou imagens sexualizadas e atenção ou avanços sexuais indesejados
- Comentários insultuosos/depreciativos e ataques pessoais ou políticos
- Assédio público ou privado
- Publicar informações privadas de terceiros sem permissão explícita
- Outras condutas que poderiam ser consideradas inapropriadas em um ambiente profissional

### Responsabilidades dos Mantenedores

Os mantenedores do projeto são responsáveis por esclarecer os padrões de comportamento aceitável e devem tomar medidas corretivas apropriadas e justas em resposta a quaisquer casos de comportamento inaceitável.

Os mantenedores do projeto têm o direito e a responsabilidade de remover, editar ou rejeitar comentários, commits, código, edições de wiki, issues e outras contribuições que não estejam alinhadas a este Código de Conduta, ou banir temporária ou permanentemente qualquer contribuidor por outros comportamentos que considerem inapropriados, ameaçadores, ofensivos ou prejudiciais.

### Escopo

Este Código de Conduta se aplica tanto em espaços do projeto quanto em espaços públicos quando um indivíduo está representando o projeto ou sua comunidade. Exemplos de representação de um projeto ou comunidade incluem o uso de um endereço de e-mail oficial do projeto, postagem por meio de uma conta oficial de mídia social ou atuação como representante designado em um evento online ou offline.

### Aplicação

Casos de comportamento abusivo, de assédio ou de outra forma inaceitável podem ser relatados entrando em contato com a equipe do projeto em [email do projeto]. Todas as reclamações serão analisadas e investigadas e resultarão em uma resposta considerada necessária e apropriada às circunstâncias. A equipe do projeto é obrigada a manter a confidencialidade em relação ao relator de um incidente.

### Atribuição

Este Código de Conduta é adaptado do [Contributor Covenant](https://www.contributor-covenant.org), versão 2.0, disponível em https://www.contributor-covenant.org/version/2/0/code_of_conduct.html.
