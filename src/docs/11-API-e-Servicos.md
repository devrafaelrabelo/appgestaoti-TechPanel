# API e Serviços

## Sumário

1. [Introdução](#introdução)
2. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
3. [Autenticação e Autorização](#autenticação-e-autorização)
4. [APIs Internas](#apis-internas)
   - [API de Autenticação](#api-de-autenticação)
   - [API de Usuários](#api-de-usuários)
   - [API de Configurações](#api-de-configurações)
5. [Serviços Internos](#serviços-internos)
   - [Serviço de Autenticação](#serviço-de-autenticação)
   - [Serviço de Armazenamento](#serviço-de-armazenamento)
   - [Serviço de Notificação](#serviço-de-notificação)
6. [Integração com Serviços Externos](#integração-com-serviços-externos)
7. [Tratamento de Erros](#tratamento-de-erros)
8. [Melhores Práticas](#melhores-práticas)
9. [Exemplos de Uso](#exemplos-de-uso)
10. [Referência de Endpoints](#referência-de-endpoints)

## Introdução

Este documento descreve as APIs e serviços disponíveis no ProjectBasePronto, incluindo suas funcionalidades, estrutura, métodos de autenticação e exemplos de uso. As APIs e serviços são componentes fundamentais da aplicação, permitindo a comunicação entre o frontend e o backend, bem como a integração com sistemas externos.

## Visão Geral da Arquitetura

O ProjectBasePronto utiliza uma arquitetura baseada em API REST para comunicação entre o frontend e o backend. Além disso, implementa serviços internos para funcionalidades específicas e integração com serviços externos quando necessário.

### Estrutura Geral

\`\`\`
Frontend (Next.js) <--> API Routes (Next.js) <--> Serviços Internos <--> Banco de Dados/Serviços Externos
\`\`\`

### Tecnologias Utilizadas

- **API Routes do Next.js**: Para implementação de endpoints de API
- **Server Actions**: Para operações do lado do servidor
- **Fetch API**: Para comunicação com APIs externas
- **Middleware**: Para autenticação e processamento de requisições

## Autenticação e Autorização

### Mecanismos de Autenticação

O sistema utiliza autenticação baseada em tokens JWT (JSON Web Tokens) para proteger as APIs. O fluxo de autenticação segue estas etapas:

1. O usuário fornece credenciais (nome de usuário e senha)
2. O servidor valida as credenciais e gera um token JWT
3. O token é armazenado em cookies HTTP-only
4. O token é enviado em cada requisição subsequente
5. O servidor valida o token antes de processar a requisição

### Implementação

\`\`\`typescript
// Exemplo de middleware de autenticação
export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Verificar token JWT
    const decoded = verifyToken(token);
    
    // Adicionar usuário ao contexto da requisição
    req.user = decoded;
    
    return NextResponse.next();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
\`\`\`

### Autorização

A autorização é implementada através de um sistema de permissões baseado em funções (RBAC - Role-Based Access Control):

\`\`\`typescript
// Exemplo de verificação de permissão
export function hasPermission(user: User, resource: string, action: string): boolean {
  // Administradores têm acesso total
  if (user.role === 'admin') return true;
  
  // Verificar permissões específicas
  const userPermissions = user.permissions || [];
  return userPermissions.includes(`${resource}:${action}`);
}
\`\`\`

## APIs Internas

### API de Autenticação

#### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Autenticar usuário |
| POST | `/api/auth/logout` | Encerrar sessão |
| POST | `/api/auth/refresh` | Renovar token de autenticação |
| POST | `/api/auth/forgot-password` | Solicitar redefinição de senha |
| POST | `/api/auth/reset-password` | Redefinir senha |

#### Exemplo de Requisição e Resposta

**Requisição (POST /api/auth/login)**
\`\`\`json
{
  "username": "usuario@exemplo.com",
  "password": "senha123",
  "rememberMe": true
}
\`\`\`

**Resposta (200 OK)**
\`\`\`json
{
  "success": true,
  "user": {
    "id": "123",
    "username": "usuario@exemplo.com",
    "name": "Usuário Exemplo",
    "role": "user"
  }
}
\`\`\`

### API de Usuários

#### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Obter detalhes de um usuário |
| POST | `/api/users` | Criar novo usuário |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Excluir usuário |

#### Exemplo de Requisição e Resposta

**Requisição (GET /api/users)**
\`\`\`
GET /api/users?page=1&limit=10
\`\`\`

**Resposta (200 OK)**
\`\`\`json
{
  "users": [
    {
      "id": "123",
      "username": "usuario@exemplo.com",
      "name": "Usuário Exemplo",
      "role": "user",
      "createdAt": "2023-01-15T10:30:00Z"
    },
    // ...mais usuários
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
\`\`\`

### API de Configurações

#### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/settings` | Obter configurações do sistema |
| PUT | `/api/settings` | Atualizar configurações do sistema |
| GET | `/api/settings/user` | Obter configurações do usuário |
| PUT | `/api/settings/user` | Atualizar configurações do usuário |

#### Exemplo de Requisição e Resposta

**Requisição (GET /api/settings/user)**
\`\`\`
GET /api/settings/user
\`\`\`

**Resposta (200 OK)**
\`\`\`json
{
  "theme": "dark",
  "language": "pt-BR",
  "notifications": {
    "email": true,
    "push": false
  },
  "dashboard": {
    "layout": "compact"
  }
}
\`\`\`

## Serviços Internos

### Serviço de Autenticação

O serviço de autenticação gerencia a autenticação e autorização de usuários, incluindo:

- Validação de credenciais
- Geração e verificação de tokens
- Gerenciamento de sessões
- Controle de acesso baseado em funções

#### Implementação

\`\`\`typescript
// Exemplo do serviço de autenticação
export const authService = {
  // Login de usuário
  async login(username: string, password: string, rememberMe = false) {
    // Validar credenciais
    const user = await db.users.findUnique({ where: { username } });
    
    if (!user || !comparePasswords(password, user.passwordHash)) {
      return { success: false, message: 'Credenciais inválidas' };
    }
    
    // Gerar token JWT
    const token = generateToken(user);
    
    // Definir duração do token
    const expiresIn = rememberMe ? '30d' : '1d';
    
    return { 
      success: true, 
      user: sanitizeUser(user),
      token,
      expiresIn
    };
  },
  
  // Verificar token
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return { success: true, user: decoded };
    } catch (error) {
      return { success: false, message: 'Token inválido ou expirado' };
    }
  },
  
  // Mais métodos...
};
\`\`\`

### Serviço de Armazenamento

O serviço de armazenamento gerencia o armazenamento e recuperação de arquivos, incluindo:

- Upload de arquivos
- Download de arquivos
- Gerenciamento de permissões de acesso
- Integração com serviços de armazenamento em nuvem

#### Implementação

\`\`\`typescript
// Exemplo do serviço de armazenamento
export const storageService = {
  // Upload de arquivo
  async uploadFile(file: File, path: string, options: UploadOptions = {}) {
    try {
      // Validar arquivo
      if (!isValidFile(file, options.allowedTypes)) {
        return { success: false, message: 'Tipo de arquivo não permitido' };
      }
      
      // Processar arquivo (redimensionar, comprimir, etc.)
      const processedFile = await processFile(file, options);
      
      // Salvar arquivo
      const url = await saveFile(processedFile, path);
      
      return { success: true, url };
    } catch (error) {
      return { success: false, message: 'Erro ao fazer upload do arquivo' };
    }
  },
  
  // Mais métodos...
};
\`\`\`

## Integração com Serviços Externos

O ProjectBasePronto pode ser integrado com diversos serviços externos para estender suas funcionalidades:

### Serviços de Autenticação

- **OAuth/OpenID Connect**: Integração com provedores como Google, Microsoft, GitHub
- **LDAP/Active Directory**: Para ambientes corporativos

### Serviços de Armazenamento

- **AWS S3**: Para armazenamento de arquivos
- **Google Cloud Storage**: Alternativa para armazenamento

### Serviços de Comunicação

- **SendGrid/Mailgun**: Para envio de emails
- **Twilio**: Para SMS e comunicação por voz
- **Firebase Cloud Messaging**: Para notificações push

## Tratamento de Erros

### Estrutura de Erros

O sistema utiliza uma estrutura padronizada para erros de API:

\`\`\`json
{
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Credenciais inválidas",
    "details": {
      "field": "password",
      "reason": "A senha fornecida está incorreta"
    }
  }
}
\`\`\`

### Códigos de Status HTTP

| Código | Descrição | Uso |
|--------|-----------|-----|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Requisição inválida ou mal-formada |
| 401 | Unauthorized | Autenticação necessária ou falhou |
| 403 | Forbidden | Sem permissão para acessar o recurso |
| 404 | Not Found | Recurso não encontrado |
| 422 | Unprocessable Entity | Validação falhou |
| 429 | Too Many Requests | Limite de requisições excedido |
| 500 | Internal Server Error | Erro interno do servidor |

### Implementação

\`\`\`typescript
// Exemplo de tratamento de erros
export function handleApiError(error: unknown, req: NextRequest, res: NextResponse) {
  // Erro conhecido da aplicação
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Erro desconhecido
  console.error('Erro não tratado:', error);
  
  return new Response(
    JSON.stringify({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocorreu um erro interno no servidor',
      },
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
\`\`\`

## Melhores Práticas

### Segurança

1. **Autenticação robusta**: Utilize JWT com expiração adequada
2. **HTTPS**: Todas as comunicações devem ser criptografadas
3. **Validação de entrada**: Valide todos os dados de entrada
4. **Rate limiting**: Implemente limites de requisições para prevenir abusos
5. **CORS**: Configure adequadamente para permitir apenas origens confiáveis

### Performance

1. **Paginação**: Implemente paginação para grandes conjuntos de dados
2. **Caching**: Utilize cache para dados frequentemente acessados
3. **Compressão**: Habilite compressão gzip/brotli para respostas
4. **Lazy loading**: Carregue dados apenas quando necessário
5. **Otimização de consultas**: Minimize consultas ao banco de dados

### Versionamento

1. **Versionamento de API**: Utilize prefixos de versão (ex: `/api/v1/users`)
2. **Compatibilidade retroativa**: Mantenha compatibilidade com versões anteriores
3. **Documentação de mudanças**: Documente todas as alterações entre versões

## Exemplos de Uso

### Autenticação de Usuário

\`\`\`typescript
// Exemplo de login de usuário
async function loginUser(username: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao fazer login');
    }
    
    return data;
  } catch (error) {
    console.error('Erro de login:', error);
    throw error;
  }
}
\`\`\`

### Obtenção de Dados de Usuário

\`\`\`typescript
// Exemplo de obtenção de dados de usuário
async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao obter perfil do usuário');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    throw error;
  }
}
\`\`\`

### Atualização de Configurações

\`\`\`typescript
// Exemplo de atualização de configurações de usuário
async function updateUserSettings(settings: UserSettings) {
  try {
    const response = await fetch('/api/settings/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao atualizar configurações');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
}
\`\`\`

## Referência de Endpoints

### Autenticação

| Método | Endpoint | Descrição | Autenticação | Permissões |
|--------|----------|-----------|--------------|------------|
| POST | `/api/auth/login` | Autenticar usuário | Não | Nenhuma |
| POST | `/api/auth/logout` | Encerrar sessão | Sim | Nenhuma |
| POST | `/api/auth/refresh` | Renovar token | Sim | Nenhuma |
| POST | `/api/auth/forgot-password` | Solicitar redefinição de senha | Não | Nenhuma |
| POST | `/api/auth/reset-password` | Redefinir senha | Não | Nenhuma |

### Usuários

| Método | Endpoint | Descrição | Autenticação | Permissões |
|--------|----------|-----------|--------------|------------|
| GET | `/api/users` | Listar usuários | Sim | `users:list` |
| GET | `/api/users/:id` | Obter usuário | Sim | `users:read` |
| POST | `/api/users` | Criar usuário | Sim | `users:create` |
| PUT | `/api/users/:id` | Atualizar usuário | Sim | `users:update` |
| DELETE | `/api/users/:id` | Excluir usuário | Sim | `users:delete` |
| GET | `/api/users/me` | Obter perfil próprio | Sim | Nenhuma |
| PUT | `/api/users/me` | Atualizar perfil próprio | Sim | Nenhuma |

### Configurações

| Método | Endpoint | Descrição | Autenticação | Permissões |
|--------|----------|-----------|--------------|------------|
| GET | `/api/settings` | Obter configurações do sistema | Sim | `settings:read` |
| PUT | `/api/settings` | Atualizar configurações do sistema | Sim | `settings:update` |
| GET | `/api/settings/user` | Obter configurações do usuário | Sim | Nenhuma |
| PUT | `/api/settings/user` | Atualizar configurações do usuário | Sim | Nenhuma |

### Arquivos

| Método | Endpoint | Descrição | Autenticação | Permissões |
|--------|----------|-----------|--------------|------------|
| POST | `/api/files/upload` | Fazer upload de arquivo | Sim | `files:upload` |
| GET | `/api/files/:id` | Obter arquivo | Sim | `files:read` |
| DELETE | `/api/files/:id` | Excluir arquivo | Sim | `files:delete` |
