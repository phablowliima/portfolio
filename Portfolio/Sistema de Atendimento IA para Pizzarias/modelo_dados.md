# Modelo de Dados para Sistema de Pizzarias

Este documento descreve o modelo de dados para o sistema de atendimento para pizzarias, que será implementado no banco de dados PostgreSQL.

## Entidades Principais

### Usuários

Tabela: `usuarios`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do usuário |
| nome | VARCHAR(100) | Nome completo do usuário |
| email | VARCHAR(100) | Email do usuário (único) |
| senha | VARCHAR(255) | Senha criptografada do usuário |
| telefone | VARCHAR(20) | Número de telefone do usuário |
| cargo | VARCHAR(50) | Cargo do usuário (administrador, gerente, atendente, entregador) |
| foto | VARCHAR(255) | URL da foto de perfil do usuário |
| biografia | TEXT | Biografia ou descrição do usuário |
| ativo | BOOLEAN | Status ativo/inativo do usuário |
| data_cadastro | TIMESTAMP | Data de cadastro do usuário |
| ultimo_acesso | TIMESTAMP | Data do último acesso do usuário |
| token_2fa | VARCHAR(100) | Token para autenticação de dois fatores |

Tabela: `permissoes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da permissão |
| nome | VARCHAR(50) | Nome da permissão |
| descricao | VARCHAR(255) | Descrição da permissão |

Tabela: `usuario_permissoes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario_id | INTEGER | Referência ao usuário |
| permissao_id | INTEGER | Referência à permissão |

Tabela: `sessoes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da sessão |
| usuario_id | INTEGER | Referência ao usuário |
| token | VARCHAR(255) | Token de sessão |
| dispositivo | VARCHAR(100) | Informações do dispositivo |
| ip | VARCHAR(45) | Endereço IP |
| localizacao | VARCHAR(100) | Localização aproximada |
| data_criacao | TIMESTAMP | Data de criação da sessão |
| data_expiracao | TIMESTAMP | Data de expiração da sessão |
| ativa | BOOLEAN | Status ativo/inativo da sessão |

Tabela: `preferencias_usuario`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario_id | INTEGER | Referência ao usuário |
| tema | VARCHAR(20) | Tema de interface (light, dark, system) |
| cor | VARCHAR(20) | Cor principal da interface |
| tamanho_fonte | VARCHAR(20) | Tamanho da fonte (small, medium, large) |
| modo_compacto | BOOLEAN | Modo compacto ativado/desativado |
| notificacoes | JSONB | Configurações de notificações |

### Clientes

Tabela: `clientes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do cliente |
| nome | VARCHAR(100) | Nome completo do cliente |
| telefone | VARCHAR(20) | Número de telefone do cliente (único) |
| email | VARCHAR(100) | Email do cliente |
| data_nascimento | DATE | Data de nascimento do cliente |
| data_cadastro | TIMESTAMP | Data de cadastro do cliente |
| observacoes | TEXT | Observações sobre o cliente |

Tabela: `enderecos_cliente`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do endereço |
| cliente_id | INTEGER | Referência ao cliente |
| logradouro | VARCHAR(100) | Nome da rua |
| numero | VARCHAR(20) | Número do endereço |
| complemento | VARCHAR(100) | Complemento do endereço |
| bairro | VARCHAR(50) | Bairro |
| cidade | VARCHAR(50) | Cidade |
| estado | VARCHAR(2) | Estado (UF) |
| cep | VARCHAR(10) | CEP |
| referencia | VARCHAR(255) | Ponto de referência |
| principal | BOOLEAN | Indica se é o endereço principal |

### Cardápio

Tabela: `categorias`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da categoria |
| nome | VARCHAR(50) | Nome da categoria |
| descricao | VARCHAR(255) | Descrição da categoria |
| ordem | INTEGER | Ordem de exibição |
| ativo | BOOLEAN | Status ativo/inativo da categoria |

Tabela: `produtos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do produto |
| categoria_id | INTEGER | Referência à categoria |
| nome | VARCHAR(100) | Nome do produto |
| descricao | TEXT | Descrição do produto |
| imagem | VARCHAR(255) | URL da imagem do produto |
| ingredientes | TEXT[] | Array de ingredientes |
| destaque | BOOLEAN | Indica se o produto está em destaque |
| ativo | BOOLEAN | Status ativo/inativo do produto |

Tabela: `tamanhos_produto`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do tamanho |
| produto_id | INTEGER | Referência ao produto |
| tamanho | VARCHAR(20) | Tamanho (P, M, G, etc.) |
| valor | DECIMAL(10,2) | Valor do produto neste tamanho |
| ativo | BOOLEAN | Status ativo/inativo do tamanho |

### Pedidos

Tabela: `pedidos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do pedido |
| cliente_id | INTEGER | Referência ao cliente |
| atendimento_id | INTEGER | Referência ao atendimento (opcional) |
| valor_subtotal | DECIMAL(10,2) | Valor subtotal do pedido |
| valor_entrega | DECIMAL(10,2) | Valor da taxa de entrega |
| valor_desconto | DECIMAL(10,2) | Valor do desconto aplicado |
| valor_total | DECIMAL(10,2) | Valor total do pedido |
| forma_pagamento | VARCHAR(50) | Forma de pagamento |
| troco_para | DECIMAL(10,2) | Valor para troco (se aplicável) |
| cupom_id | INTEGER | Referência ao cupom aplicado (opcional) |
| status | VARCHAR(20) | Status do pedido (aguardando, preparando, entregando, concluido, cancelado) |
| tipo_entrega | VARCHAR(20) | Tipo de entrega (delivery, retirada) |
| endereco_entrega_id | INTEGER | Referência ao endereço de entrega (opcional) |
| previsao_entrega | TIMESTAMP | Previsão de entrega |
| observacoes | TEXT | Observações sobre o pedido |
| data_criacao | TIMESTAMP | Data de criação do pedido |
| data_atualizacao | TIMESTAMP | Data da última atualização do pedido |

Tabela: `itens_pedido`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do item |
| pedido_id | INTEGER | Referência ao pedido |
| produto_id | INTEGER | Referência ao produto |
| tamanho_id | INTEGER | Referência ao tamanho do produto |
| quantidade | INTEGER | Quantidade do item |
| valor_unitario | DECIMAL(10,2) | Valor unitário do item |
| valor_total | DECIMAL(10,2) | Valor total do item |
| observacoes | TEXT | Observações sobre o item |

Tabela: `historico_pedido`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do histórico |
| pedido_id | INTEGER | Referência ao pedido |
| status | VARCHAR(20) | Status do pedido |
| observacao | TEXT | Observação sobre a mudança de status |
| usuario_id | INTEGER | Referência ao usuário que alterou o status |
| data | TIMESTAMP | Data da alteração |

### Atendimento

Tabela: `atendimentos`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do atendimento |
| cliente_id | INTEGER | Referência ao cliente |
| status | VARCHAR(20) | Status do atendimento (em_andamento, concluido, abandonado) |
| canal | VARCHAR(20) | Canal de atendimento (whatsapp, site, app) |
| data_inicio | TIMESTAMP | Data de início do atendimento |
| data_fim | TIMESTAMP | Data de fim do atendimento |

Tabela: `mensagens_atendimento`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da mensagem |
| atendimento_id | INTEGER | Referência ao atendimento |
| tipo | VARCHAR(20) | Tipo da mensagem (cliente, bot, atendente) |
| conteudo | TEXT | Conteúdo da mensagem |
| data | TIMESTAMP | Data da mensagem |

### Promoções

Tabela: `promocoes`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da promoção |
| titulo | VARCHAR(100) | Título da promoção |
| descricao | TEXT | Descrição da promoção |
| data_inicio | TIMESTAMP | Data de início da promoção |
| data_fim | TIMESTAMP | Data de fim da promoção |
| dias_semana | INTEGER[] | Dias da semana válidos (0-6) |
| hora_inicio | TIME | Hora de início da promoção |
| hora_fim | TIME | Hora de fim da promoção |
| tipo | VARCHAR(50) | Tipo da promoção (desconto_percentual, desconto_valor, compre_ganhe) |
| regras | JSONB | Regras da promoção em formato JSON |
| imagem | VARCHAR(255) | URL da imagem da promoção |
| ativo | BOOLEAN | Status ativo/inativo da promoção |

Tabela: `cupons`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do cupom |
| codigo | VARCHAR(20) | Código do cupom (único) |
| descricao | VARCHAR(255) | Descrição do cupom |
| tipo | VARCHAR(20) | Tipo do cupom (percentual, valor) |
| valor | DECIMAL(10,2) | Valor do desconto |
| valor_minimo | DECIMAL(10,2) | Valor mínimo para aplicação do cupom |
| valor_maximo | DECIMAL(10,2) | Valor máximo de desconto |
| data_inicio | TIMESTAMP | Data de início da validade |
| data_fim | TIMESTAMP | Data de fim da validade |
| uso_maximo | INTEGER | Número máximo de usos |
| uso_atual | INTEGER | Número atual de usos |
| uso_maximo_por_cliente | INTEGER | Número máximo de usos por cliente |
| ativo | BOOLEAN | Status ativo/inativo do cupom |

Tabela: `uso_cupons`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do uso |
| cupom_id | INTEGER | Referência ao cupom |
| cliente_id | INTEGER | Referência ao cliente |
| pedido_id | INTEGER | Referência ao pedido |
| valor_desconto | DECIMAL(10,2) | Valor do desconto aplicado |
| data | TIMESTAMP | Data de uso do cupom |

### Empresa

Tabela: `empresa`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da empresa |
| nome | VARCHAR(100) | Nome da empresa |
| cnpj | VARCHAR(20) | CNPJ da empresa |
| telefone | VARCHAR(20) | Telefone da empresa |
| whatsapp | VARCHAR(20) | WhatsApp da empresa |
| email | VARCHAR(100) | Email da empresa |
| logo | VARCHAR(255) | URL do logo da empresa |

Tabela: `endereco_empresa`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| empresa_id | INTEGER | Referência à empresa |
| logradouro | VARCHAR(100) | Nome da rua |
| numero | VARCHAR(20) | Número do endereço |
| complemento | VARCHAR(100) | Complemento do endereço |
| bairro | VARCHAR(50) | Bairro |
| cidade | VARCHAR(50) | Cidade |
| estado | VARCHAR(2) | Estado (UF) |
| cep | VARCHAR(10) | CEP |

Tabela: `horarios_funcionamento`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único do horário |
| empresa_id | INTEGER | Referência à empresa |
| dia | INTEGER | Dia da semana (0-6) |
| aberto | BOOLEAN | Indica se está aberto neste dia |
| abertura | TIME | Horário de abertura |
| fechamento | TIME | Horário de fechamento |

Tabela: `configuracoes_entrega`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| empresa_id | INTEGER | Referência à empresa |
| raio | INTEGER | Raio de entrega em km |
| tempo_estimado | INTEGER | Tempo estimado de entrega em minutos |
| valor_minimo | DECIMAL(10,2) | Valor mínimo para entrega |

Tabela: `taxas_entrega`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único da taxa |
| empresa_id | INTEGER | Referência à empresa |
| bairro | VARCHAR(50) | Bairro |
| valor | DECIMAL(10,2) | Valor da taxa de entrega |

Tabela: `configuracoes_pagamento`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| empresa_id | INTEGER | Referência à empresa |
| dinheiro | BOOLEAN | Aceita pagamento em dinheiro |
| cartao | BOOLEAN | Aceita pagamento em cartão |
| pix | BOOLEAN | Aceita pagamento via PIX |
| pix_chave | VARCHAR(100) | Chave PIX |
| pix_qrcode | VARCHAR(255) | URL do QR Code PIX |

Tabela: `redes_sociais`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| empresa_id | INTEGER | Referência à empresa |
| facebook | VARCHAR(255) | URL do Facebook |
| instagram | VARCHAR(255) | URL do Instagram |
| twitter | VARCHAR(255) | URL do Twitter |
| youtube | VARCHAR(255) | URL do YouTube |

## Relacionamentos

- Um **Usuário** pode ter várias **Permissões** (N:N)
- Um **Usuário** pode ter várias **Sessões** (1:N)
- Um **Usuário** tem uma **Preferência** (1:1)
- Um **Cliente** pode ter vários **Endereços** (1:N)
- Um **Cliente** pode fazer vários **Pedidos** (1:N)
- Uma **Categoria** pode ter vários **Produtos** (1:N)
- Um **Produto** pode ter vários **Tamanhos** (1:N)
- Um **Pedido** pertence a um **Cliente** (N:1)
- Um **Pedido** pode estar associado a um **Atendimento** (N:1)
- Um **Pedido** pode ter vários **Itens** (1:N)
- Um **Pedido** pode ter vários registros no **Histórico** (1:N)
- Um **Atendimento** pertence a um **Cliente** (N:1)
- Um **Atendimento** pode ter várias **Mensagens** (1:N)
- Um **Cupom** pode ser usado em vários **Pedidos** (1:N)
- Uma **Empresa** tem um **Endereço** (1:1)
- Uma **Empresa** tem vários **Horários de Funcionamento** (1:N)
- Uma **Empresa** tem uma **Configuração de Entrega** (1:1)
- Uma **Empresa** tem várias **Taxas de Entrega** (1:N)
- Uma **Empresa** tem uma **Configuração de Pagamento** (1:1)
- Uma **Empresa** tem uma configuração de **Redes Sociais** (1:1)

## Índices

- `usuarios`: `email` (único)
- `clientes`: `telefone` (único)
- `produtos`: `categoria_id`
- `pedidos`: `cliente_id`, `status`
- `itens_pedido`: `pedido_id`, `produto_id`
- `atendimentos`: `cliente_id`, `status`
- `mensagens_atendimento`: `atendimento_id`
- `cupons`: `codigo` (único)

## Triggers e Funções

1. Atualizar `valor_total` em `pedidos` quando itens são adicionados, modificados ou removidos
2. Atualizar `uso_atual` em `cupons` quando um cupom é usado
3. Registrar automaticamente no `historico_pedido` quando o status de um pedido é alterado
4. Atualizar `data_atualizacao` em `pedidos` quando qualquer alteração é feita
5. Atualizar estatísticas de cliente (total de pedidos, valor total) quando um pedido é concluído

## Considerações de Segurança

1. Senhas armazenadas com hash e salt
2. Tokens de sessão com expiração automática
3. Controle de acesso baseado em permissões
4. Validação de dados em todas as operações
5. Logs de auditoria para operações críticas
