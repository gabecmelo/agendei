# Agendei?

O **Agendei?** é um sistema de agendamento de eventos onde os usuários podem criar, editar e convidar pessoas para eventos, além de responder a convites. O projeto é composto por um backend em **Node.js** com **NestJS**, e um frontend em **Next.js** com **React** e **Tailwind CSS**.

## Tecnologias Usadas

- **Backend**: Node.js, NestJS
- **Frontend**: Next.js, React, Tailwind CSS, Next-Auth
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (JSON Web Token)

## Estrutura do Projeto

### Backend

O backend é responsável por gerenciar eventos, convites e autenticação. Ele fornece uma API RESTful para que o frontend possa interagir com o sistema.

### Frontend

O frontend permite que os usuários interajam com o sistema de agendamento, visualizando eventos, criando novos eventos e respondendo a convites.

## Variáveis de Ambiente

### Backend

O backend usa algumas variáveis de ambiente para configuração. As variáveis são armazenadas em um arquivo `.env` e devem ser configuradas da seguinte maneira:

- **PORT**: Porta em que o servidor backend ficará ouvindo (padrão: 3000).
- **DB_HOST**: Endereço do servidor MySQL.
- **DB_USER**: Usuário do banco de dados MySQL.
- **DB_PASS**: Senha do banco de dados MySQL.
- **DB_PORT**: Porta do servidor MySQL (padrão: 3306).
- **DB_NAME**: Nome do banco de dados MySQL.
- **BACKEND_PORT**: Porta para hostear a API do backend.
- **JWT_SECRET**: Segredo para a geração de tokens JWT.

### Frontend

As variáveis de ambiente do frontend são configuradas em um arquivo `.env.local` e incluem:

- **NEXT_PUBLIC_API_URL**: URL da API backend, usada para todas as requisições HTTP.

### Banco de Dados

O banco de dados utilizado é o **MySQL**, que armazena informações sobre usuários, eventos e convites. 

O modelo de dados do banco inclui as tabelas:

- **users**: Armazena dados dos usuários.
- **events**: Armazena informações sobre os eventos.
- **event_invites**: Armazena o status dos convites enviados para os usuários.

## Como Rodar o Projeto

### Backend

1. Clone o repositório do backend.
2. Navegue até o diretório do backend e instale as dependências:

   ```npm install```

3. Configure o arquivo `.env` com as variáveis de ambiente apropriadas.
4. Inicie o servidor:

   ```npm run start:dev```

### Frontend

1. Clone o repositório do frontend.
2. Navegue até o diretório do frontend e instale as dependências:

   ```npm install```

3. Configure o arquivo `.env.local` com a variável de ambiente `NEXT_PUBLIC_API_URL`.
4. Inicie o servidor:

   ```npm run dev```

---

## Para mais informações visite as pastas FRONTEND e BACKEND e visualize seus respectivos READMEs