# Frontend - Agendei?

Este é o frontend do projeto **Agendei?**, desenvolvido com **Next.js**, **React**, **Tailwind CSS** e **Next-Auth** para autenticação.

## Funcionalidades

- Visualizar eventos do usuário.
- Criar, editar e deletar eventos.
- Convidar usuários para eventos.
- Responder a convites de eventos.

## Estrutura de Rotas

### Páginas

- **/login**: Página de login do usuário.
- **/calendar**: Exibe o calendário de eventos do usuário.

### Componentes

- **EventForm**: Formulário para criar e editar eventos.
- **EmailList**: Componente para gerenciar os emails dos convidados.
- **Calendar**: Exibe os eventos do usuário em um calendário interativo.

## Variáveis de Ambiente

Configure o arquivo `.env.local` com as seguintes variáveis:

- **NEXT_PUBLIC_API_URL**: URL da API backend.

## Como Rodar o Frontend

1. Clone o repositório.
2. Instale as dependências:

   ```npm install```

3. Configure o arquivo `.env.local` com a variável `NEXT_PUBLIC_API_URL`.
4. Inicie o servidor:

   ```npm run dev```
