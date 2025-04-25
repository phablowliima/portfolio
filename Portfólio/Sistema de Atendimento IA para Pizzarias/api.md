# Documentação da API RESTful para Sistema de Pizzarias

Esta documentação descreve os endpoints da API RESTful que serão implementados no n8n para suportar o sistema de atendimento para pizzarias.

## URL Base
```
https://api.astrodev.com.br/webhook/
```

## Autenticação

### Login
- **Endpoint:** `auth/login`
- **Método:** `POST`
- **Descrição:** Autentica um usuário no sistema
- **Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```
- **Resposta de Sucesso:**
```json
{
  "token": "jwt_token_aqui",
  "usuario": {
    "id": "1",
    "nome": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "cargo": "administrador",
    "telefone": "(11) 98765-4321",
    "foto": "url_da_foto",
    "permissoes": ["admin", "atendimento", "pedidos"]
  }
}
```

### Logout
- **Endpoint:** `auth/logout`
- **Método:** `POST`
- **Descrição:** Encerra a sessão do usuário
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Logout realizado com sucesso"
}
```

### Registrar
- **Endpoint:** `auth/registrar`
- **Método:** `POST`
- **Descrição:** Registra um novo usuário no sistema
- **Corpo da Requisição:**
```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "senha": "senha123",
  "telefone": "(11) 98765-4321",
  "cargo": "atendente"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "nome": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "cargo": "atendente",
  "telefone": "(11) 98765-4321",
  "mensagem": "Usuário registrado com sucesso"
}
```

### Redefinir Senha
- **Endpoint:** `auth/redefinir-senha`
- **Método:** `POST`
- **Descrição:** Solicita redefinição de senha
- **Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "E-mail de redefinição de senha enviado com sucesso"
}
```

### Confirmar Redefinição de Senha
- **Endpoint:** `auth/redefinir-senha/confirmar`
- **Método:** `POST`
- **Descrição:** Confirma redefinição de senha
- **Corpo da Requisição:**
```json
{
  "token": "token_de_redefinicao",
  "novaSenha": "nova_senha123"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Senha redefinida com sucesso"
}
```

## Dashboard

### Obter Dados do Dashboard
- **Endpoint:** `dashboard`
- **Método:** `GET`
- **Descrição:** Obtém dados para o dashboard
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `periodo` (opcional): Período dos dados (hoje, semana, mes, ano)
- **Resposta de Sucesso:**
```json
{
  "resumo": {
    "pedidos": 150,
    "faturamento": 5000.00,
    "clientes": 45,
    "ticketMedio": 33.33
  },
  "grafico": {
    "labels": ["10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h"],
    "pedidos": [5, 8, 12, 15, 10, 7, 5, 8, 15, 20, 25, 15, 5],
    "faturamento": [150, 240, 360, 450, 300, 210, 150, 240, 450, 600, 750, 450, 150]
  },
  "topProdutos": [
    { "nome": "Pizza de Calabresa", "quantidade": 45, "valor": 1350.00 },
    { "nome": "Pizza de Frango com Catupiry", "quantidade": 38, "valor": 1140.00 },
    { "nome": "Pizza de Portuguesa", "quantidade": 30, "valor": 900.00 }
  ],
  "statusPedidos": {
    "aguardando": 5,
    "preparando": 8,
    "entregando": 3,
    "concluidos": 134,
    "cancelados": 0
  }
}
```

## Atendimento

### Listar Atendimentos
- **Endpoint:** `atendimentos`
- **Método:** `GET`
- **Descrição:** Lista atendimentos
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
- **Resposta de Sucesso:**
```json
{
  "total": 50,
  "pagina": 1,
  "limite": 10,
  "atendimentos": [
    {
      "id": "1",
      "cliente": {
        "id": "1",
        "nome": "João Silva",
        "telefone": "(11) 98765-4321"
      },
      "status": "em_andamento",
      "canal": "whatsapp",
      "dataInicio": "2025-04-22T14:30:00Z",
      "ultimaMensagem": "2025-04-22T14:35:00Z",
      "mensagens": 5
    }
  ]
}
```

### Obter Atendimento
- **Endpoint:** `atendimentos/{id}`
- **Método:** `GET`
- **Descrição:** Obtém detalhes de um atendimento
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "cliente": {
    "id": "1",
    "nome": "João Silva",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua Exemplo, 123"
  },
  "status": "em_andamento",
  "canal": "whatsapp",
  "dataInicio": "2025-04-22T14:30:00Z",
  "ultimaMensagem": "2025-04-22T14:35:00Z",
  "mensagens": [
    {
      "id": "1",
      "tipo": "cliente",
      "conteudo": "Olá, gostaria de fazer um pedido",
      "data": "2025-04-22T14:30:00Z"
    },
    {
      "id": "2",
      "tipo": "bot",
      "conteudo": "Olá! Seja bem-vindo à Pizzaria Delícia. Como posso ajudar?",
      "data": "2025-04-22T14:30:05Z"
    }
  ]
}
```

### Criar Atendimento
- **Endpoint:** `atendimentos`
- **Método:** `POST`
- **Descrição:** Cria um novo atendimento
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "cliente": {
    "id": "1"
  },
  "canal": "whatsapp"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "cliente": {
    "id": "1",
    "nome": "João Silva",
    "telefone": "(11) 98765-4321"
  },
  "status": "em_andamento",
  "canal": "whatsapp",
  "dataInicio": "2025-04-22T14:30:00Z",
  "mensagem": "Atendimento criado com sucesso"
}
```

### Atualizar Atendimento
- **Endpoint:** `atendimentos/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza um atendimento existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "status": "concluido"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "status": "concluido",
  "mensagem": "Atendimento atualizado com sucesso"
}
```

### Enviar Mensagem para Chatbot
- **Endpoint:** `atendimentos/{id}/mensagem`
- **Método:** `POST`
- **Descrição:** Envia mensagem para o chatbot
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "mensagem": "Quero uma pizza de calabresa"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "3",
  "tipo": "cliente",
  "conteudo": "Quero uma pizza de calabresa",
  "data": "2025-04-22T14:40:00Z",
  "resposta": {
    "id": "4",
    "tipo": "bot",
    "conteudo": "Ótima escolha! Temos pizza de calabresa nos tamanhos P, M e G. Qual tamanho você deseja?",
    "data": "2025-04-22T14:40:05Z"
  }
}
```

## Pedidos

### Listar Pedidos
- **Endpoint:** `pedidos`
- **Método:** `GET`
- **Descrição:** Lista pedidos
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
  - `status` (opcional): Status dos pedidos
- **Resposta de Sucesso:**
```json
{
  "total": 150,
  "pagina": 1,
  "limite": 10,
  "pedidos": [
    {
      "id": "1",
      "cliente": {
        "id": "1",
        "nome": "João Silva",
        "telefone": "(11) 98765-4321"
      },
      "status": "preparando",
      "valorTotal": 45.90,
      "formaPagamento": "cartao_credito",
      "data": "2025-04-22T14:30:00Z",
      "entrega": {
        "tipo": "delivery",
        "endereco": "Rua Exemplo, 123",
        "previsao": "2025-04-22T15:00:00Z"
      }
    }
  ]
}
```

### Obter Pedido
- **Endpoint:** `pedidos/{id}`
- **Método:** `GET`
- **Descrição:** Obtém detalhes de um pedido
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "cliente": {
    "id": "1",
    "nome": "João Silva",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua Exemplo, 123"
  },
  "status": "preparando",
  "valorSubtotal": 39.90,
  "valorEntrega": 6.00,
  "valorDesconto": 0.00,
  "valorTotal": 45.90,
  "formaPagamento": "cartao_credito",
  "data": "2025-04-22T14:30:00Z",
  "entrega": {
    "tipo": "delivery",
    "endereco": "Rua Exemplo, 123",
    "complemento": "Apto 101",
    "referencia": "Próximo ao mercado",
    "previsao": "2025-04-22T15:00:00Z"
  },
  "itens": [
    {
      "id": "1",
      "produto": {
        "id": "1",
        "nome": "Pizza de Calabresa",
        "tamanho": "M"
      },
      "quantidade": 1,
      "valorUnitario": 39.90,
      "valorTotal": 39.90,
      "observacao": "Sem cebola"
    }
  ],
  "historico": [
    {
      "status": "aguardando",
      "data": "2025-04-22T14:30:00Z"
    },
    {
      "status": "preparando",
      "data": "2025-04-22T14:35:00Z"
    }
  ]
}
```

### Criar Pedido
- **Endpoint:** `pedidos`
- **Método:** `POST`
- **Descrição:** Cria um novo pedido
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "cliente": {
    "id": "1"
  },
  "entrega": {
    "tipo": "delivery",
    "endereco": "Rua Exemplo, 123",
    "complemento": "Apto 101",
    "referencia": "Próximo ao mercado"
  },
  "formaPagamento": "cartao_credito",
  "itens": [
    {
      "produto": {
        "id": "1"
      },
      "quantidade": 1,
      "observacao": "Sem cebola"
    }
  ],
  "cupom": "PROMO10"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "valorTotal": 45.90,
  "mensagem": "Pedido criado com sucesso"
}
```

### Atualizar Pedido
- **Endpoint:** `pedidos/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza um pedido existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "entrega": {
    "tipo": "retirada"
  },
  "formaPagamento": "dinheiro"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "mensagem": "Pedido atualizado com sucesso"
}
```

### Atualizar Status do Pedido
- **Endpoint:** `pedidos/{id}/status`
- **Método:** `PUT`
- **Descrição:** Atualiza o status de um pedido
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "status": "entregando"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "status": "entregando",
  "mensagem": "Status do pedido atualizado com sucesso"
}
```

### Cancelar Pedido
- **Endpoint:** `pedidos/{id}/cancelar`
- **Método:** `POST`
- **Descrição:** Cancela um pedido
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "motivo": "Cliente desistiu"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "status": "cancelado",
  "mensagem": "Pedido cancelado com sucesso"
}
```

## Clientes

### Listar Clientes
- **Endpoint:** `clientes`
- **Método:** `GET`
- **Descrição:** Lista clientes
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
  - `busca` (opcional): Termo de busca
- **Resposta de Sucesso:**
```json
{
  "total": 45,
  "pagina": 1,
  "limite": 10,
  "clientes": [
    {
      "id": "1",
      "nome": "João Silva",
      "telefone": "(11) 98765-4321",
      "email": "joao.silva@exemplo.com",
      "dataCadastro": "2025-01-15T10:30:00Z",
      "totalPedidos": 5,
      "valorTotal": 250.00
    }
  ]
}
```

### Obter Cliente
- **Endpoint:** `clientes/{id}`
- **Método:** `GET`
- **Descrição:** Obtém detalhes de um cliente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "nome": "João Silva",
  "telefone": "(11) 98765-4321",
  "email": "joao.silva@exemplo.com",
  "dataNascimento": "1990-05-15",
  "dataCadastro": "2025-01-15T10:30:00Z",
  "enderecos": [
    {
      "id": "1",
      "logradouro": "Rua Exemplo",
      "numero": "123",
      "complemento": "Apto 101",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01001-000",
      "referencia": "Próximo ao mercado",
      "principal": true
    }
  ],
  "estatisticas": {
    "totalPedidos": 5,
    "valorTotal": 250.00,
    "ultimoPedido": "2025-04-20T19:30:00Z",
    "produtosFavoritos": [
      { "nome": "Pizza de Calabresa", "quantidade": 3 },
      { "nome": "Pizza de Frango com Catupiry", "quantidade": 2 }
    ]
  }
}
```

### Criar Cliente
- **Endpoint:** `clientes`
- **Método:** `POST`
- **Descrição:** Cria um novo cliente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "João Silva",
  "telefone": "(11) 98765-4321",
  "email": "joao.silva@exemplo.com",
  "dataNascimento": "1990-05-15",
  "endereco": {
    "logradouro": "Rua Exemplo",
    "numero": "123",
    "complemento": "Apto 101",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01001-000",
    "referencia": "Próximo ao mercado"
  }
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "nome": "João Silva",
  "telefone": "(11) 98765-4321",
  "mensagem": "Cliente criado com sucesso"
}
```

### Atualizar Cliente
- **Endpoint:** `clientes/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza um cliente existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "João Silva Santos",
  "email": "joao.santos@exemplo.com"
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "mensagem": "Cliente atualizado com sucesso"
}
```

### Histórico de Pedidos do Cliente
- **Endpoint:** `clientes/{id}/pedidos`
- **Método:** `GET`
- **Descrição:** Obtém histórico de pedidos de um cliente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
- **Resposta de Sucesso:**
```json
{
  "total": 5,
  "pagina": 1,
  "limite": 10,
  "pedidos": [
    {
      "id": "1",
      "data": "2025-04-20T19:30:00Z",
      "valorTotal": 45.90,
      "status": "concluido",
      "itens": [
        {
          "produto": "Pizza de Calabresa",
          "quantidade": 1,
          "valorTotal": 39.90
        }
      ]
    }
  ]
}
```

## Cardápio

### Listar Categorias
- **Endpoint:** `cardapio/categorias`
- **Método:** `GET`
- **Descrição:** Lista categorias do cardápio
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "categorias": [
    {
      "id": "1",
      "nome": "Pizzas Tradicionais",
      "descricao": "Pizzas com sabores clássicos",
      "ordem": 1,
      "ativo": true
    },
    {
      "id": "2",
      "nome": "Pizzas Premium",
      "descricao": "Pizzas com ingredientes especiais",
      "ordem": 2,
      "ativo": true
    }
  ]
}
```

### Criar Categoria
- **Endpoint:** `cardapio/categorias`
- **Método:** `POST`
- **Descrição:** Cria uma nova categoria
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "Pizzas Doces",
  "descricao": "Pizzas com sabores doces",
  "ordem": 3,
  "ativo": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "3",
  "nome": "Pizzas Doces",
  "mensagem": "Categoria criada com sucesso"
}
```

### Atualizar Categoria
- **Endpoint:** `cardapio/categorias/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza uma categoria existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "Pizzas Doces Especiais",
  "ordem": 4
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "3",
  "mensagem": "Categoria atualizada com sucesso"
}
```

### Remover Categoria
- **Endpoint:** `cardapio/categorias/{id}`
- **Método:** `DELETE`
- **Descrição:** Remove uma categoria
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Categoria removida com sucesso"
}
```

### Listar Produtos
- **Endpoint:** `cardapio/produtos`
- **Método:** `GET`
- **Descrição:** Lista produtos do cardápio
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
  - `categoria` (opcional): ID da categoria
- **Resposta de Sucesso:**
```json
{
  "total": 20,
  "pagina": 1,
  "limite": 10,
  "produtos": [
    {
      "id": "1",
      "nome": "Pizza de Calabresa",
      "descricao": "Pizza com calabresa, cebola e azeitonas",
      "categoria": {
        "id": "1",
        "nome": "Pizzas Tradicionais"
      },
      "precos": [
        { "tamanho": "P", "valor": 29.90 },
        { "tamanho": "M", "valor": 39.90 },
        { "tamanho": "G", "valor": 49.90 }
      ],
      "imagem": "url_da_imagem",
      "destaque": true,
      "ativo": true
    }
  ]
}
```

### Obter Produto
- **Endpoint:** `cardapio/produtos/{id}`
- **Método:** `GET`
- **Descrição:** Obtém detalhes de um produto
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "nome": "Pizza de Calabresa",
  "descricao": "Pizza com calabresa, cebola e azeitonas",
  "categoria": {
    "id": "1",
    "nome": "Pizzas Tradicionais"
  },
  "precos": [
    { "tamanho": "P", "valor": 29.90 },
    { "tamanho": "M", "valor": 39.90 },
    { "tamanho": "G", "valor": 49.90 }
  ],
  "ingredientes": [
    "Molho de tomate",
    "Mussarela",
    "Calabresa",
    "Cebola",
    "Azeitonas"
  ],
  "imagem": "url_da_imagem",
  "destaque": true,
  "ativo": true,
  "estatisticas": {
    "totalVendas": 45,
    "avaliacao": 4.8
  }
}
```

### Criar Produto
- **Endpoint:** `cardapio/produtos`
- **Método:** `POST`
- **Descrição:** Cria um novo produto
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "Pizza de Frango com Catupiry",
  "descricao": "Pizza com frango desfiado e catupiry",
  "categoria": {
    "id": "1"
  },
  "precos": [
    { "tamanho": "P", "valor": 32.90 },
    { "tamanho": "M", "valor": 42.90 },
    { "tamanho": "G", "valor": 52.90 }
  ],
  "ingredientes": [
    "Molho de tomate",
    "Mussarela",
    "Frango desfiado",
    "Catupiry",
    "Azeitonas"
  ],
  "destaque": false,
  "ativo": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "nome": "Pizza de Frango com Catupiry",
  "mensagem": "Produto criado com sucesso"
}
```

### Atualizar Produto
- **Endpoint:** `cardapio/produtos/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza um produto existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "descricao": "Pizza com frango desfiado, catupiry e milho",
  "precos": [
    { "tamanho": "P", "valor": 34.90 },
    { "tamanho": "M", "valor": 44.90 },
    { "tamanho": "G", "valor": 54.90 }
  ],
  "ingredientes": [
    "Molho de tomate",
    "Mussarela",
    "Frango desfiado",
    "Catupiry",
    "Milho",
    "Azeitonas"
  ],
  "destaque": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "mensagem": "Produto atualizado com sucesso"
}
```

### Remover Produto
- **Endpoint:** `cardapio/produtos/{id}`
- **Método:** `DELETE`
- **Descrição:** Remove um produto
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Produto removido com sucesso"
}
```

### Upload de Imagem do Produto
- **Endpoint:** `cardapio/produtos/{id}/imagem`
- **Método:** `POST`
- **Descrição:** Faz upload de imagem de um produto
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:** FormData com campo `imagem`
- **Resposta de Sucesso:**
```json
{
  "url": "url_da_imagem",
  "mensagem": "Imagem enviada com sucesso"
}
```

## Promoções

### Listar Promoções
- **Endpoint:** `promocoes`
- **Método:** `GET`
- **Descrição:** Lista promoções
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
  - `status` (opcional): Status das promoções
- **Resposta de Sucesso:**
```json
{
  "total": 5,
  "pagina": 1,
  "limite": 10,
  "promocoes": [
    {
      "id": "1",
      "titulo": "Terça do Dobro",
      "descricao": "Compre uma pizza e ganhe outra",
      "dataInicio": "2025-04-01T00:00:00Z",
      "dataFim": "2025-04-30T23:59:59Z",
      "diasSemana": [2],
      "ativo": true,
      "tipo": "compre_ganhe"
    }
  ]
}
```

### Obter Promoção
- **Endpoint:** `promocoes/{id}`
- **Método:** `GET`
- **Descrição:** Obtém detalhes de uma promoção
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "titulo": "Terça do Dobro",
  "descricao": "Compre uma pizza e ganhe outra",
  "dataInicio": "2025-04-01T00:00:00Z",
  "dataFim": "2025-04-30T23:59:59Z",
  "diasSemana": [2],
  "horaInicio": "18:00",
  "horaFim": "22:00",
  "ativo": true,
  "tipo": "compre_ganhe",
  "regras": {
    "compre": {
      "quantidade": 1,
      "categorias": ["1"]
    },
    "ganhe": {
      "quantidade": 1,
      "categorias": ["1"],
      "valorMaximo": 39.90
    }
  },
  "imagem": "url_da_imagem",
  "estatisticas": {
    "totalUsos": 25,
    "valorEconomizado": 997.50
  }
}
```

### Criar Promoção
- **Endpoint:** `promocoes`
- **Método:** `POST`
- **Descrição:** Cria uma nova promoção
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "titulo": "Quarta de Desconto",
  "descricao": "15% de desconto em todas as pizzas",
  "dataInicio": "2025-05-01T00:00:00Z",
  "dataFim": "2025-05-31T23:59:59Z",
  "diasSemana": [3],
  "horaInicio": "18:00",
  "horaFim": "22:00",
  "ativo": true,
  "tipo": "desconto_percentual",
  "regras": {
    "percentual": 15,
    "categorias": ["1", "2"]
  }
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "titulo": "Quarta de Desconto",
  "mensagem": "Promoção criada com sucesso"
}
```

### Atualizar Promoção
- **Endpoint:** `promocoes/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza uma promoção existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "descricao": "20% de desconto em todas as pizzas",
  "regras": {
    "percentual": 20,
    "categorias": ["1", "2"]
  }
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "mensagem": "Promoção atualizada com sucesso"
}
```

### Remover Promoção
- **Endpoint:** `promocoes/{id}`
- **Método:** `DELETE`
- **Descrição:** Remove uma promoção
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Promoção removida com sucesso"
}
```

### Listar Cupons
- **Endpoint:** `promocoes/cupons`
- **Método:** `GET`
- **Descrição:** Lista cupons
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
- **Resposta de Sucesso:**
```json
{
  "total": 3,
  "pagina": 1,
  "limite": 10,
  "cupons": [
    {
      "id": "1",
      "codigo": "PROMO10",
      "descricao": "10% de desconto em qualquer pedido",
      "tipo": "percentual",
      "valor": 10,
      "valorMinimo": 50.00,
      "dataInicio": "2025-04-01T00:00:00Z",
      "dataFim": "2025-04-30T23:59:59Z",
      "usoMaximo": 100,
      "usoAtual": 45,
      "ativo": true
    }
  ]
}
```

### Criar Cupom
- **Endpoint:** `promocoes/cupons`
- **Método:** `POST`
- **Descrição:** Cria um novo cupom
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "codigo": "BEMVINDO20",
  "descricao": "20% de desconto para novos clientes",
  "tipo": "percentual",
  "valor": 20,
  "valorMinimo": 40.00,
  "valorMaximo": 30.00,
  "dataInicio": "2025-05-01T00:00:00Z",
  "dataFim": "2025-05-31T23:59:59Z",
  "usoMaximo": 50,
  "usoMaximoPorCliente": 1,
  "ativo": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "codigo": "BEMVINDO20",
  "mensagem": "Cupom criado com sucesso"
}
```

### Atualizar Cupom
- **Endpoint:** `promocoes/cupons/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza um cupom existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "valorMinimo": 30.00,
  "usoMaximo": 100,
  "ativo": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "mensagem": "Cupom atualizado com sucesso"
}
```

### Remover Cupom
- **Endpoint:** `promocoes/cupons/{id}`
- **Método:** `DELETE`
- **Descrição:** Remove um cupom
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Cupom removido com sucesso"
}
```

### Validar Cupom
- **Endpoint:** `promocoes/cupons/validar`
- **Método:** `POST`
- **Descrição:** Valida um cupom
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "codigo": "PROMO10",
  "valorPedido": 60.00,
  "clienteId": "1"
}
```
- **Resposta de Sucesso:**
```json
{
  "valido": true,
  "cupom": {
    "id": "1",
    "codigo": "PROMO10",
    "tipo": "percentual",
    "valor": 10,
    "valorDesconto": 6.00
  },
  "mensagem": "Cupom válido"
}
```

## Empresa

### Obter Informações da Empresa
- **Endpoint:** `empresa`
- **Método:** `GET`
- **Descrição:** Obtém informações da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "nome": "Pizzaria Delícia",
  "cnpj": "12.345.678/0001-90",
  "telefone": "(11) 3456-7890",
  "whatsapp": "(11) 98765-4321",
  "email": "contato@pizzariadelicia.com.br",
  "logo": "url_do_logo",
  "endereco": {
    "logradouro": "Rua das Pizzas",
    "numero": "123",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01001-000"
  },
  "horarios": [
    { "dia": 0, "aberto": false },
    { "dia": 1, "aberto": true, "abertura": "18:00", "fechamento": "23:00" },
    { "dia": 2, "aberto": true, "abertura": "18:00", "fechamento": "23:00" },
    { "dia": 3, "aberto": true, "abertura": "18:00", "fechamento": "23:00" },
    { "dia": 4, "aberto": true, "abertura": "18:00", "fechamento": "23:00" },
    { "dia": 5, "aberto": true, "abertura": "18:00", "fechamento": "00:00" },
    { "dia": 6, "aberto": true, "abertura": "18:00", "fechamento": "00:00" }
  ],
  "entrega": {
    "raio": 5,
    "tempoEstimado": 45,
    "valorMinimo": 20.00,
    "taxas": [
      { "bairro": "Centro", "valor": 5.00 },
      { "bairro": "Jardins", "valor": 8.00 }
    ]
  },
  "pagamento": {
    "dinheiro": true,
    "cartao": true,
    "pix": true,
    "pixChave": "12345678901",
    "pixQRCode": "url_do_qrcode"
  },
  "redesSociais": {
    "facebook": "https://facebook.com/pizzariadelicia",
    "instagram": "https://instagram.com/pizzariadelicia",
    "twitter": "https://twitter.com/pizzariadelicia"
  }
}
```

### Atualizar Informações da Empresa
- **Endpoint:** `empresa`
- **Método:** `PUT`
- **Descrição:** Atualiza informações da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "Pizzaria Delícia Gourmet",
  "telefone": "(11) 3456-7890",
  "whatsapp": "(11) 98765-4321",
  "email": "contato@pizzariadelicia.com.br"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Informações da empresa atualizadas com sucesso"
}
```

### Upload de Logo
- **Endpoint:** `empresa/logo`
- **Método:** `POST`
- **Descrição:** Faz upload do logo da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:** FormData com campo `logo`
- **Resposta de Sucesso:**
```json
{
  "url": "url_do_logo",
  "mensagem": "Logo enviado com sucesso"
}
```

### Atualizar Endereço da Empresa
- **Endpoint:** `empresa/endereco`
- **Método:** `PUT`
- **Descrição:** Atualiza endereço da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "logradouro": "Avenida das Pizzas",
  "numero": "456",
  "complemento": "Loja 1",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01001-000"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Endereço da empresa atualizado com sucesso"
}
```

### Atualizar Horários de Funcionamento
- **Endpoint:** `empresa/horarios`
- **Método:** `PUT`
- **Descrição:** Atualiza horários de funcionamento da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "horarios": [
    { "dia": 0, "aberto": false },
    { "dia": 1, "aberto": true, "abertura": "17:00", "fechamento": "23:00" },
    { "dia": 2, "aberto": true, "abertura": "17:00", "fechamento": "23:00" },
    { "dia": 3, "aberto": true, "abertura": "17:00", "fechamento": "23:00" },
    { "dia": 4, "aberto": true, "abertura": "17:00", "fechamento": "23:00" },
    { "dia": 5, "aberto": true, "abertura": "17:00", "fechamento": "00:00" },
    { "dia": 6, "aberto": true, "abertura": "17:00", "fechamento": "00:00" }
  ]
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Horários de funcionamento atualizados com sucesso"
}
```

### Atualizar Configurações de Entrega
- **Endpoint:** `empresa/entrega`
- **Método:** `PUT`
- **Descrição:** Atualiza configurações de entrega da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "raio": 7,
  "tempoEstimado": 40,
  "valorMinimo": 25.00,
  "taxas": [
    { "bairro": "Centro", "valor": 6.00 },
    { "bairro": "Jardins", "valor": 9.00 },
    { "bairro": "Moema", "valor": 12.00 }
  ]
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Configurações de entrega atualizadas com sucesso"
}
```

### Atualizar Configurações de Pagamento
- **Endpoint:** `empresa/pagamento`
- **Método:** `PUT`
- **Descrição:** Atualiza configurações de pagamento da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "dinheiro": true,
  "cartao": true,
  "pix": true,
  "pixChave": "98765432109"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Configurações de pagamento atualizadas com sucesso"
}
```

### Upload de QR Code PIX
- **Endpoint:** `empresa/pagamento/pix/qrcode`
- **Método:** `POST`
- **Descrição:** Faz upload do QR Code PIX da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:** FormData com campo `qrcode`
- **Resposta de Sucesso:**
```json
{
  "url": "url_do_qrcode",
  "mensagem": "QR Code PIX enviado com sucesso"
}
```

### Atualizar Redes Sociais
- **Endpoint:** `empresa/redes-sociais`
- **Método:** `PUT`
- **Descrição:** Atualiza redes sociais da empresa
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "facebook": "https://facebook.com/pizzariadeliciagourmet",
  "instagram": "https://instagram.com/pizzariadeliciagourmet",
  "twitter": "https://twitter.com/pizzariadelicia",
  "youtube": "https://youtube.com/pizzariadelicia"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Redes sociais atualizadas com sucesso"
}
```

## Usuários

### Listar Usuários
- **Endpoint:** `usuarios`
- **Método:** `GET`
- **Descrição:** Lista usuários
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Parâmetros de Consulta:**
  - `pagina` (opcional): Número da página
  - `limite` (opcional): Limite de itens por página
- **Resposta de Sucesso:**
```json
{
  "total": 5,
  "pagina": 1,
  "limite": 10,
  "usuarios": [
    {
      "id": "1",
      "nome": "João Silva",
      "email": "joao.silva@exemplo.com",
      "cargo": "administrador",
      "ativo": true,
      "ultimoAcesso": "2025-04-22T14:30:00Z"
    }
  ]
}
```

### Obter Usuário
- **Endpoint:** `usuarios/{id}`
- **Método:** `GET`
- **Descrição:** Obtém detalhes de um usuário
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "id": "1",
  "nome": "João Silva",
  "email": "joao.silva@exemplo.com",
  "telefone": "(11) 98765-4321",
  "cargo": "administrador",
  "foto": "url_da_foto",
  "ativo": true,
  "dataCadastro": "2025-01-15T10:30:00Z",
  "ultimoAcesso": "2025-04-22T14:30:00Z",
  "permissoes": ["admin", "atendimento", "pedidos"]
}
```

### Criar Usuário
- **Endpoint:** `usuarios`
- **Método:** `POST`
- **Descrição:** Cria um novo usuário
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "Maria Oliveira",
  "email": "maria.oliveira@exemplo.com",
  "telefone": "(11) 91234-5678",
  "cargo": "atendente",
  "senha": "senha123",
  "ativo": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "nome": "Maria Oliveira",
  "email": "maria.oliveira@exemplo.com",
  "mensagem": "Usuário criado com sucesso"
}
```

### Atualizar Usuário
- **Endpoint:** `usuarios/{id}`
- **Método:** `PUT`
- **Descrição:** Atualiza um usuário existente
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "Maria Silva Oliveira",
  "telefone": "(11) 91234-5678",
  "cargo": "gerente",
  "ativo": true
}
```
- **Resposta de Sucesso:**
```json
{
  "id": "2",
  "mensagem": "Usuário atualizado com sucesso"
}
```

### Remover Usuário
- **Endpoint:** `usuarios/{id}`
- **Método:** `DELETE`
- **Descrição:** Remove um usuário
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Usuário removido com sucesso"
}
```

### Atualizar Perfil
- **Endpoint:** `usuarios/perfil`
- **Método:** `PUT`
- **Descrição:** Atualiza perfil do usuário logado
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "nome": "João Carlos Silva",
  "email": "joao.silva@exemplo.com",
  "telefone": "(11) 98765-4321",
  "biografia": "Administrador do sistema de pizzarias"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Perfil atualizado com sucesso"
}
```

### Upload de Foto de Perfil
- **Endpoint:** `usuarios/perfil/foto`
- **Método:** `POST`
- **Descrição:** Faz upload da foto de perfil do usuário logado
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:** FormData com campo `foto`
- **Resposta de Sucesso:**
```json
{
  "url": "url_da_foto",
  "mensagem": "Foto de perfil enviada com sucesso"
}
```

### Alterar Senha
- **Endpoint:** `usuarios/senha`
- **Método:** `PUT`
- **Descrição:** Altera a senha do usuário logado
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "senhaAtual": "senha123",
  "novaSenha": "nova_senha456"
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Senha alterada com sucesso"
}
```

### Verificar 2FA
- **Endpoint:** `usuarios/2fa/verificar`
- **Método:** `POST`
- **Descrição:** Verifica código de autenticação de dois fatores
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "codigo": "123456"
}
```
- **Resposta de Sucesso:**
```json
{
  "valido": true,
  "mensagem": "Código válido"
}
```

### Encerrar Todas as Sessões
- **Endpoint:** `usuarios/sessoes/encerrar-todas`
- **Método:** `POST`
- **Descrição:** Encerra todas as sessões do usuário logado
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Todas as sessões foram encerradas"
}
```

### Atualizar Preferências de Notificação
- **Endpoint:** `usuarios/preferencias/notificacoes`
- **Método:** `PUT`
- **Descrição:** Atualiza preferências de notificação do usuário logado
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "sistema": {
    "novosPedidos": true,
    "alteracoesStatusPedidos": true,
    "novosClientes": true,
    "estoqueBaixo": false,
    "atualizacoesSistema": true
  },
  "canais": {
    "email": true,
    "navegador": true,
    "sms": false,
    "whatsapp": true
  }
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Preferências de notificação atualizadas com sucesso"
}
```

### Atualizar Preferências de Aparência
- **Endpoint:** `usuarios/preferencias/aparencia`
- **Método:** `PUT`
- **Descrição:** Atualiza preferências de aparência do usuário logado
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "tema": "dark",
  "cor": "blue",
  "tamanhoFonte": "medium",
  "modoCompacto": false
}
```
- **Resposta de Sucesso:**
```json
{
  "mensagem": "Preferências de aparência atualizadas com sucesso"
}
```

## Utilitários

### Buscar CEP
- **Endpoint:** `utils/cep/{cep}`
- **Método:** `GET`
- **Descrição:** Busca informações de um CEP
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Resposta de Sucesso:**
```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "complemento": "lado ímpar",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

### Enviar Mensagem de WhatsApp
- **Endpoint:** `utils/whatsapp/enviar`
- **Método:** `POST`
- **Descrição:** Envia mensagem de WhatsApp
- **Cabeçalhos:** `Authorization: Bearer {token}`
- **Corpo da Requisição:**
```json
{
  "telefone": "5511987654321",
  "mensagem": "Seu pedido #123 foi confirmado e está sendo preparado!"
}
```
- **Resposta de Sucesso:**
```json
{
  "enviado": true,
  "mensagem": "Mensagem enviada com sucesso"
}
```
