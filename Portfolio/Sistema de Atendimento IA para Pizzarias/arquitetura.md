# Arquitetura do Sistema de Atendimento para Pizzarias

## Visão Geral
O sistema será desenvolvido com uma arquitetura de microsserviços e solicitações de API RESTful, servido através do n8n e outros serviços. Esta abordagem permite escalabilidade e manutenção independente de cada componente.

## Componentes Principais

### Front-end
- **Tecnologias**: HTML, CSS, Bootstrap, JavaScript, Node.js
- **Estrutura de Diretórios**:
  ```
  frontend/
  ├── assets/
  │   ├── css/
  │   ├── js/
  │   └── images/
  ├── auth/
  │   ├── entrar.html
  │   ├── entrar.js
  │   ├── cadastrar.html
  │   ├── cadastrar.js
  │   ├── esquecisenha.html
  │   └── esquecisenha.js
  ├── dashboard/
  │   ├── index.html
  │   └── dashboard.js
  ├── atendimento/
  │   ├── chatbot.html
  │   └── chatbot.js
  ├── pedidos/
  │   ├── kanban.html
  │   ├── kanban.js
  │   ├── relatorio.html
  │   └── relatorio.js
  ├── clientes/
  │   ├── clientes.html
  │   ├── clientes.js
  │   ├── marketing.html
  │   └── marketing.js
  ├── empresa/
  │   ├── colaboradores.html
  │   ├── colaboradores.js
  │   ├── informacoes.html
  │   ├── informacoes.js
  │   ├── cardapio.html
  │   ├── cardapio.js
  │   ├── promocoes.html
  │   ├── promocoes.js
  │   ├── entrega.html
  │   └── entrega.js
  ├── configuracoes/
  │   ├── conta.html
  │   └── conta.js
  ├── public/
  │   ├── landing.html
  │   ├── landing.js
  │   ├── cardapio.html
  │   └── cardapio.js
  └── index.html
  ```

### Back-end
- **Tecnologias**: n8n (para API RESTful e automações), PostgreSQL, OpenAI API, WhatsApp Web.js
- **Estrutura de Diretórios**:
  ```
  backend/
  ├── api/
  │   ├── endpoints.js
  │   └── webhooks.js
  ├── n8n/
  │   ├── workflows/
  │   └── prompts/
  ├── whatsapp/
  │   ├── bot.js
  │   └── handlers.js
  └── llm/
      ├── openai.js
      └── prompts.js
  ```

### Banco de Dados
- **Tecnologia**: PostgreSQL
- **Estrutura de Diretórios**:
  ```
  database/
  ├── schema/
  │   ├── usuarios.sql
  │   ├── clientes.sql
  │   ├── pedidos.sql
  │   ├── produtos.sql
  │   └── configuracoes.sql
  ├── migrations/
  └── seeds/
  ```

## Fluxo de Comunicação

1. **Atendimento ao Cliente**:
   - Cliente envia mensagem via WhatsApp
   - WhatsApp Web.js recebe a mensagem
   - Mensagem é processada pelo n8n
   - n8n envia a mensagem para a API OpenAI (LLM)
   - Resposta da LLM é processada pelo n8n
   - Resposta é enviada de volta ao cliente via WhatsApp

2. **Gestão de Pedidos**:
   - Pedido recebido via WhatsApp é processado pela LLM
   - LLM extrai informações do pedido (produtos, quantidades, endereço)
   - n8n registra o pedido no banco de dados PostgreSQL
   - Painel administrativo (Kanban) é atualizado em tempo real
   - Atualizações de status são enviadas ao cliente via WhatsApp

3. **Gestão de Clientes**:
   - Dados do cliente são extraídos das conversas
   - n8n registra/atualiza informações no banco de dados
   - Painel CRM exibe informações dos clientes
   - Ações de marketing podem ser disparadas com base nos dados

## Integração com API RESTful

Todas as solicitações do front-end serão feitas para o endpoint base:
```
https://api.astrodev.com.br/webhook/
```

### Endpoints Principais:

1. **Autenticação**:
   - `POST /auth/login` - Autenticação de usuários
   - `POST /auth/register` - Registro de novos usuários
   - `POST /auth/reset-password` - Recuperação de senha

2. **Pedidos**:
   - `GET /pedidos` - Listar todos os pedidos
   - `GET /pedidos/{id}` - Obter detalhes de um pedido
   - `POST /pedidos` - Criar novo pedido
   - `PUT /pedidos/{id}` - Atualizar status de um pedido
   - `DELETE /pedidos/{id}` - Cancelar um pedido

3. **Clientes**:
   - `GET /clientes` - Listar todos os clientes
   - `GET /clientes/{id}` - Obter detalhes de um cliente
   - `POST /clientes` - Cadastrar novo cliente
   - `PUT /clientes/{id}` - Atualizar dados de um cliente
   - `DELETE /clientes/{id}` - Remover um cliente

4. **Produtos/Cardápio**:
   - `GET /produtos` - Listar todos os produtos
   - `GET /produtos/{id}` - Obter detalhes de um produto
   - `POST /produtos` - Adicionar novo produto
   - `PUT /produtos/{id}` - Atualizar produto
   - `DELETE /produtos/{id}` - Remover produto

5. **Atendimento**:
   - `POST /atendimento/mensagem` - Processar mensagem do cliente
   - `GET /atendimento/conversas` - Listar conversas ativas
   - `GET /atendimento/conversas/{id}` - Obter histórico de conversa

## Segurança

- Autenticação JWT (JSON Web Tokens)
- Criptografia de dados sensíveis
- HTTPS para todas as comunicações
- Controle de acesso baseado em funções (RBAC)
- Logs de auditoria para ações críticas
- Proteção contra ataques comuns (XSS, CSRF, SQL Injection)

## Escalabilidade

- Arquitetura de microsserviços para escalar componentes independentemente
- Cache de dados frequentemente acessados
- Otimização de consultas ao banco de dados
