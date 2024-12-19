# Backend - Agendei?

Este é o servidor backend para o projeto **Agendei?**, desenvolvido com **Node.js** e **NestJS**. A API RESTful gerencia eventos, convites e autenticação dos usuários.

## Estrutura de Rotas

### Registro

- **POST** `/users/register`: Registra um novo usuário.

### Autenticação

- **POST** `/auth/login`: Realiza o login e retorna um token JWT para autenticação.

### Eventos

- **GET** `/events`: Retorna todos os eventos do usuário autenticado.
- **POST** `/events`: Cria um novo evento.
- **DELETE** `/events/:id`: Deleta um evento específico.
- **GET** `/events/:id/invites`: Retorna os convites do evento.
- **PATCH** `/events/invite/respond`: Responde ao convite de um evento (aceitar ou recusar).

## Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

- **DB_HOST**: Endereço do banco de dados.
- **DB_USER**: Usuário do banco de dados.
- **DB_PASS**: Senha do banco de dados.
- **DB_PORT**: Porta do banco de dados.
- **DB_NAME**: Nome do banco de dados.
- **BACKEND_PORT**: Porta para o servidor backend.
- **JWT_SECRET**: Segredo para geração do JWT.

## Como Rodar o Backend

1. Clone o repositório.
2. Navegue até o diretório do backend e instale as dependências:

   ```npm install```

3. Configure o arquivo `.env` com as variáveis de ambiente apropriadas.
4. Inicie o servidor:

   ```npm run start:dev```

---
