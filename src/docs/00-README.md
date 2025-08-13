# ProjectBasePronto - Documentação

## Sobre o Projeto

O **ProjectBasePronto** é uma base sólida para desenvolvimento de projetos web, construída com Next.js, React e TypeScript. Este projeto fornece uma estrutura pronta com autenticação, navegação e componentes reutilizáveis para acelerar o desenvolvimento de novos projetos.

## Objetivo

O objetivo principal do ProjectBasePronto é fornecer uma base consistente e bem estruturada para o desenvolvimento de aplicações web, eliminando a necessidade de configurar do zero componentes e funcionalidades comuns em cada novo projeto.

## Principais Características

- **Autenticação completa**: Sistema de login, logout e recuperação de senha
- **Estrutura de rotas organizada**: Separação entre rotas públicas e protegidas
- **Componentes UI reutilizáveis**: Biblioteca de componentes baseada em shadcn/ui
- **Tema claro/escuro**: Suporte completo para temas com transições suaves
- **Responsividade**: Design adaptável para diferentes tamanhos de tela
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Padrões de código**: Estrutura organizada seguindo as melhores práticas

## Tecnologias Utilizadas

- **Next.js**: Framework React com renderização híbrida (SSR/CSR)
- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS utilitário
- **Radix UI**: Componentes acessíveis e sem estilo
- **Lucide React**: Biblioteca de ícones

## Como Usar Esta Documentação

Esta documentação está organizada em seções que cobrem diferentes aspectos do projeto:

1. **[Visão Geral do Sistema](./01-visao-geral.md)**: Introdução detalhada ao sistema
2. **[Arquitetura](./02-arquitetura.md)**: Estrutura e design do sistema
3. **[Estrutura de Diretórios](./03-estrutura-diretorios.md)**: Organização dos arquivos e pastas
4. **[Módulos e Funcionalidades](./04-modulos-funcionalidades.md)**: Descrição dos principais módulos
5. **[Fluxo de Autenticação](./05-fluxo-autenticacao.md)**: Como funciona a autenticação
6. **[Componentes Reutilizáveis](./06-componentes-reutilizaveis.md)**: Guia dos componentes disponíveis
7. **[Guia de Estilo e Padrões](./07-guia-estilo-padroes.md)**: Convenções de código e estilo
8. **[Segurança](./08-seguranca.md)**: Práticas de segurança implementadas
9. **[Manutenção e Escalabilidade](./09-manutencao-escalabilidade.md)**: Como manter e escalar o projeto
10. **[Guia de Contribuição](./10-guia-contribuicao.md)**: Como contribuir com o projeto
11. **[API e Serviços](./11-api-servicos.md)**: Documentação das APIs e serviços
12. **[Testes](./12-testes.md)**: Estratégias e implementação de testes

## Primeiros Passos

Para começar a usar o ProjectBasePronto como base para seu projeto:

1. Clone o repositório
2. Instale as dependências com `npm install` ou `yarn install`
3. Execute o servidor de desenvolvimento com `npm run dev` ou `yarn dev`
4. Acesse `http://localhost:3000` no seu navegador

## Credenciais de Acesso (Ambiente de Desenvolvimento)

Para acessar o sistema no ambiente de desenvolvimento:

- **Usuário**: admin
- **Senha**: admin

## Estrutura de Arquivos

O projeto segue uma estrutura organizada baseada em recursos e funcionalidades:

\`\`\`
src/
  /app                  # Páginas e rotas da aplicação
    /(protected)/       # Rotas protegidas que requerem autenticação
    /(public)/          # Rotas públicas
  /components           # Componentes reutilizáveis
    /ui                 # Componentes de UI básicos
  /features             # Funcionalidades organizadas por domínio
    /auth               # Autenticação
    /users              # Gerenciamento de usuários
  /hooks                # Hooks personalizados
  /lib                  # Bibliotecas e utilitários
  /utils                # Utilitários gerais
  /docs                 # Documentação
\`\`\`

## Convenções e Boas Práticas

O projeto segue convenções específicas para garantir consistência e manutenibilidade:

- **Nomenclatura**: Componentes em PascalCase, funções e variáveis em camelCase
- **Arquivos**: Nomes de arquivos em kebab-case
- **Idioma**: Código em inglês, interface do usuário em português
- **Estilização**: Tailwind CSS para estilos
- **Estado**: Context API para estado global, useState para estado local

## Contribuição

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](./10-guia-contribuicao.md) antes de enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
