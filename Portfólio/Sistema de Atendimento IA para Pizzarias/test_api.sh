#!/bin/bash

# Script para testar a API RESTful do sistema de pizzarias

# Configurações
API_BASE_URL="https://api.astrodev.com.br/webhook"
TOKEN=""
OUTPUT_DIR="./test_results"

# Criar diretório para resultados dos testes
mkdir -p $OUTPUT_DIR

# Função para fazer requisições HTTP
function make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth_header=""
    
    if [ ! -z "$TOKEN" ]; then
        auth_header="-H \"Authorization: Bearer $TOKEN\""
    fi
    
    if [ "$method" == "GET" ]; then
        cmd="curl -s -X $method \"$API_BASE_URL/$endpoint\" $auth_header"
    else
        cmd="curl -s -X $method \"$API_BASE_URL/$endpoint\" $auth_header -H \"Content-Type: application/json\" -d '$data'"
    fi
    
    echo "Executando: $cmd"
    eval $cmd
}

# Função para registrar resultados dos testes
function log_test_result() {
    local test_name=$1
    local status=$2
    local response=$3
    
    echo "[$status] $test_name" >> $OUTPUT_DIR/test_summary.log
    echo "$response" > "$OUTPUT_DIR/${test_name// /_}.json"
    
    if [ "$status" == "SUCESSO" ]; then
        echo "✅ $test_name: $status"
    else
        echo "❌ $test_name: $status"
    fi
}

echo "Iniciando testes da API RESTful do sistema de pizzarias..."
echo "Data e hora: $(date)" > $OUTPUT_DIR/test_summary.log
echo "----------------------------------------" >> $OUTPUT_DIR/test_summary.log

# Teste 1: Login
echo "Teste 1: Login"
login_data="{\"email\":\"admin@exemplo.com\",\"senha\":\"senha123\"}"
login_response=$(make_request "POST" "auth/login" "$login_data")

if [[ $login_response == *"token"* ]]; then
    TOKEN=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    log_test_result "Login" "SUCESSO" "$login_response"
else
    log_test_result "Login" "FALHA" "$login_response"
    echo "Falha no login. Continuando testes sem autenticação."
fi

# Teste 2: Obter dados do dashboard
echo "Teste 2: Obter dados do dashboard"
dashboard_response=$(make_request "GET" "dashboard" "")

if [[ $dashboard_response == *"resumo"* ]]; then
    log_test_result "Obter dados do dashboard" "SUCESSO" "$dashboard_response"
else
    log_test_result "Obter dados do dashboard" "FALHA" "$dashboard_response"
fi

# Teste 3: Listar clientes
echo "Teste 3: Listar clientes"
clients_response=$(make_request "GET" "clientes" "")

if [[ $clients_response == *"clientes"* ]]; then
    log_test_result "Listar clientes" "SUCESSO" "$clients_response"
else
    log_test_result "Listar clientes" "FALHA" "$clients_response"
fi

# Teste 4: Criar cliente
echo "Teste 4: Criar cliente"
client_data="{\"nome\":\"Cliente Teste\",\"telefone\":\"(11) 98765-4321\",\"email\":\"cliente.teste@exemplo.com\"}"
create_client_response=$(make_request "POST" "clientes" "$client_data")

if [[ $create_client_response == *"id"* ]]; then
    CLIENT_ID=$(echo $create_client_response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    log_test_result "Criar cliente" "SUCESSO" "$create_client_response"
else
    log_test_result "Criar cliente" "FALHA" "$create_client_response"
    CLIENT_ID="1" # ID padrão para continuar os testes
fi

# Teste 5: Obter cliente por ID
echo "Teste 5: Obter cliente por ID"
client_response=$(make_request "GET" "clientes/$CLIENT_ID" "")

if [[ $client_response == *"nome"* ]]; then
    log_test_result "Obter cliente por ID" "SUCESSO" "$client_response"
else
    log_test_result "Obter cliente por ID" "FALHA" "$client_response"
fi

# Teste 6: Listar categorias do cardápio
echo "Teste 6: Listar categorias do cardápio"
categories_response=$(make_request "GET" "cardapio/categorias" "")

if [[ $categories_response == *"categorias"* ]]; then
    log_test_result "Listar categorias do cardápio" "SUCESSO" "$categories_response"
else
    log_test_result "Listar categorias do cardápio" "FALHA" "$categories_response"
fi

# Teste 7: Criar categoria
echo "Teste 7: Criar categoria"
category_data="{\"nome\":\"Categoria Teste\",\"descricao\":\"Descrição da categoria de teste\",\"ordem\":1,\"ativo\":true}"
create_category_response=$(make_request "POST" "cardapio/categorias" "$category_data")

if [[ $create_category_response == *"id"* ]]; then
    CATEGORY_ID=$(echo $create_category_response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    log_test_result "Criar categoria" "SUCESSO" "$create_category_response"
else
    log_test_result "Criar categoria" "FALHA" "$create_category_response"
    CATEGORY_ID="1" # ID padrão para continuar os testes
fi

# Teste 8: Listar produtos
echo "Teste 8: Listar produtos"
products_response=$(make_request "GET" "cardapio/produtos" "")

if [[ $products_response == *"produtos"* ]]; then
    log_test_result "Listar produtos" "SUCESSO" "$products_response"
else
    log_test_result "Listar produtos" "FALHA" "$products_response"
fi

# Teste 9: Criar produto
echo "Teste 9: Criar produto"
product_data="{\"nome\":\"Produto Teste\",\"descricao\":\"Descrição do produto de teste\",\"categoria\":{\"id\":\"$CATEGORY_ID\"},\"precos\":[{\"tamanho\":\"M\",\"valor\":39.90}],\"ingredientes\":[\"Ingrediente 1\",\"Ingrediente 2\"],\"destaque\":false,\"ativo\":true}"
create_product_response=$(make_request "POST" "cardapio/produtos" "$product_data")

if [[ $create_product_response == *"id"* ]]; then
    PRODUCT_ID=$(echo $create_product_response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    log_test_result "Criar produto" "SUCESSO" "$create_product_response"
else
    log_test_result "Criar produto" "FALHA" "$create_product_response"
    PRODUCT_ID="1" # ID padrão para continuar os testes
fi

# Teste 10: Criar pedido
echo "Teste 10: Criar pedido"
order_data="{\"cliente\":{\"id\":\"$CLIENT_ID\"},\"entrega\":{\"tipo\":\"delivery\",\"endereco\":\"Rua Teste, 123\",\"complemento\":\"Apto 101\",\"referencia\":\"Próximo ao mercado\"},\"formaPagamento\":\"cartao_credito\",\"itens\":[{\"produto\":{\"id\":\"$PRODUCT_ID\"},\"quantidade\":1,\"observacao\":\"Sem cebola\"}]}"
create_order_response=$(make_request "POST" "pedidos" "$order_data")

if [[ $create_order_response == *"id"* ]]; then
    ORDER_ID=$(echo $create_order_response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    log_test_result "Criar pedido" "SUCESSO" "$create_order_response"
else
    log_test_result "Criar pedido" "FALHA" "$create_order_response"
    ORDER_ID="1" # ID padrão para continuar os testes
fi

# Teste 11: Obter pedido por ID
echo "Teste 11: Obter pedido por ID"
order_response=$(make_request "GET" "pedidos/$ORDER_ID" "")

if [[ $order_response == *"cliente"* ]]; then
    log_test_result "Obter pedido por ID" "SUCESSO" "$order_response"
else
    log_test_result "Obter pedido por ID" "FALHA" "$order_response"
fi

# Teste 12: Atualizar status do pedido
echo "Teste 12: Atualizar status do pedido"
status_data="{\"status\":\"preparando\"}"
update_status_response=$(make_request "PUT" "pedidos/$ORDER_ID/status" "$status_data")

if [[ $update_status_response == *"status"* ]]; then
    log_test_result "Atualizar status do pedido" "SUCESSO" "$update_status_response"
else
    log_test_result "Atualizar status do pedido" "FALHA" "$update_status_response"
fi

# Teste 13: Criar atendimento
echo "Teste 13: Criar atendimento"
attendance_data="{\"cliente\":{\"id\":\"$CLIENT_ID\"},\"canal\":\"whatsapp\"}"
create_attendance_response=$(make_request "POST" "atendimentos" "$attendance_data")

if [[ $create_attendance_response == *"id"* ]]; then
    ATTENDANCE_ID=$(echo $create_attendance_response | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    log_test_result "Criar atendimento" "SUCESSO" "$create_attendance_response"
else
    log_test_result "Criar atendimento" "FALHA" "$create_attendance_response"
    ATTENDANCE_ID="1" # ID padrão para continuar os testes
fi

# Teste 14: Enviar mensagem para chatbot
echo "Teste 14: Enviar mensagem para chatbot"
message_data="{\"mensagem\":\"Quero uma pizza de calabresa\"}"
send_message_response=$(make_request "POST" "atendimentos/$ATTENDANCE_ID/mensagem" "$message_data")

if [[ $send_message_response == *"resposta"* ]]; then
    log_test_result "Enviar mensagem para chatbot" "SUCESSO" "$send_message_response"
else
    log_test_result "Enviar mensagem para chatbot" "FALHA" "$send_message_response"
fi

# Teste 15: Obter informações da empresa
echo "Teste 15: Obter informações da empresa"
company_response=$(make_request "GET" "empresa" "")

if [[ $company_response == *"nome"* ]]; then
    log_test_result "Obter informações da empresa" "SUCESSO" "$company_response"
else
    log_test_result "Obter informações da empresa" "FALHA" "$company_response"
fi

# Teste 16: Logout
echo "Teste 16: Logout"
logout_response=$(make_request "POST" "auth/logout" "{}")

if [[ $logout_response == *"mensagem"* ]]; then
    log_test_result "Logout" "SUCESSO" "$logout_response"
else
    log_test_result "Logout" "FALHA" "$logout_response"
fi

# Resumo dos testes
echo "----------------------------------------"
echo "Resumo dos testes:"
success_count=$(grep -c "SUCESSO" $OUTPUT_DIR/test_summary.log)
failure_count=$(grep -c "FALHA" $OUTPUT_DIR/test_summary.log)
total_count=$((success_count + failure_count))

echo "Total de testes: $total_count"
echo "Testes bem-sucedidos: $success_count"
echo "Testes falhos: $failure_count"
echo "Taxa de sucesso: $(( (success_count * 100) / total_count ))%"

echo "----------------------------------------" >> $OUTPUT_DIR/test_summary.log
echo "Total de testes: $total_count" >> $OUTPUT_DIR/test_summary.log
echo "Testes bem-sucedidos: $success_count" >> $OUTPUT_DIR/test_summary.log
echo "Testes falhos: $failure_count" >> $OUTPUT_DIR/test_summary.log
echo "Taxa de sucesso: $(( (success_count * 100) / total_count ))%" >> $OUTPUT_DIR/test_summary.log

echo "Testes concluídos. Resultados salvos em $OUTPUT_DIR"
