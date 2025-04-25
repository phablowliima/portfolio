/**
 * API Service para o Sistema de Pizzarias
 * Responsável por realizar todas as requisições para a API RESTful do n8n
 */

// Classe principal do serviço de API
class ApiService {
    constructor() {
        // URL base da API
        this.baseUrl = 'https://api.astrodev.com.br/webhook/';
        
        // Token de autenticação (será definido após o login)
        this.token = localStorage.getItem('authToken') || null;
    }

    /**
     * Configura o token de autenticação
     * @param {string} token - Token JWT de autenticação
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    /**
     * Remove o token de autenticação
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    /**
     * Realiza uma requisição para a API
     * @param {string} endpoint - Endpoint da API
     * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
     * @param {object} data - Dados a serem enviados (opcional)
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async request(endpoint, method = 'GET', data = null) {
        const url = this.baseUrl + endpoint;
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Adicionar token de autenticação se disponível
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const options = {
            method,
            headers,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        };
        
        // Adicionar corpo da requisição se houver dados
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            // Verificar se a resposta é bem-sucedida
            if (!response.ok) {
                // Tentar obter mensagem de erro da API
                const errorData = await response.json().catch(() => null);
                
                // Criar erro com mensagem da API ou mensagem padrão
                throw new Error(
                    errorData?.message || 
                    `Erro ${response.status}: ${response.statusText}`
                );
            }
            
            // Verificar se a resposta está vazia
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
            
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Realiza upload de arquivo para a API
     * @param {string} endpoint - Endpoint da API
     * @param {File} file - Arquivo a ser enviado
     * @param {string} fieldName - Nome do campo do arquivo (padrão: 'file')
     * @param {object} additionalData - Dados adicionais a serem enviados (opcional)
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async uploadFile(endpoint, file, fieldName = 'file', additionalData = {}) {
        const url = this.baseUrl + endpoint;
        
        const formData = new FormData();
        formData.append(fieldName, file);
        
        // Adicionar dados adicionais ao FormData
        for (const key in additionalData) {
            formData.append(key, additionalData[key]);
        }
        
        const headers = {};
        
        // Adicionar token de autenticação se disponível
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });
            
            // Verificar se a resposta é bem-sucedida
            if (!response.ok) {
                // Tentar obter mensagem de erro da API
                const errorData = await response.json().catch(() => null);
                
                // Criar erro com mensagem da API ou mensagem padrão
                throw new Error(
                    errorData?.message || 
                    `Erro ${response.status}: ${response.statusText}`
                );
            }
            
            // Verificar se a resposta está vazia
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
            
        } catch (error) {
            console.error(`Erro no upload para ${endpoint}:`, error);
            throw error;
        }
    }

    // ===== AUTENTICAÇÃO =====

    /**
     * Realiza login no sistema
     * @param {string} email - Email do usuário
     * @param {string} senha - Senha do usuário
     * @returns {Promise} - Promise com os dados do usuário e token
     */
    async login(email, senha) {
        const response = await this.request('auth/login', 'POST', { email, senha });
        
        // Armazenar token de autenticação
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    /**
     * Realiza logout no sistema
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async logout() {
        try {
            await this.request('auth/logout', 'POST');
        } finally {
            // Limpar token mesmo se a requisição falhar
            this.clearToken();
        }
    }

    /**
     * Registra um novo usuário
     * @param {object} userData - Dados do usuário
     * @returns {Promise} - Promise com os dados do usuário criado
     */
    async registrar(userData) {
        return await this.request('auth/registrar', 'POST', userData);
    }

    /**
     * Solicita redefinição de senha
     * @param {string} email - Email do usuário
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async solicitarRedefinicaoSenha(email) {
        return await this.request('auth/redefinir-senha', 'POST', { email });
    }

    /**
     * Redefine a senha do usuário
     * @param {string} token - Token de redefinição de senha
     * @param {string} novaSenha - Nova senha do usuário
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async redefinirSenha(token, novaSenha) {
        return await this.request('auth/redefinir-senha/confirmar', 'POST', { token, novaSenha });
    }

    // ===== DASHBOARD =====

    /**
     * Obtém dados para o dashboard
     * @param {string} periodo - Período dos dados (hoje, semana, mes, ano)
     * @returns {Promise} - Promise com os dados do dashboard
     */
    async getDashboardData(periodo = 'hoje') {
        return await this.request(`dashboard?periodo=${periodo}`, 'GET');
    }

    // ===== ATENDIMENTO =====

    /**
     * Obtém lista de atendimentos
     * @param {number} pagina - Número da página
     * @param {number} limite - Limite de itens por página
     * @returns {Promise} - Promise com a lista de atendimentos
     */
    async getAtendimentos(pagina = 1, limite = 10) {
        return await this.request(`atendimentos?pagina=${pagina}&limite=${limite}`, 'GET');
    }

    /**
     * Obtém detalhes de um atendimento
     * @param {string} id - ID do atendimento
     * @returns {Promise} - Promise com os detalhes do atendimento
     */
    async getAtendimentoById(id) {
        return await this.request(`atendimentos/${id}`, 'GET');
    }

    /**
     * Cria um novo atendimento
     * @param {object} atendimentoData - Dados do atendimento
     * @returns {Promise} - Promise com os dados do atendimento criado
     */
    async criarAtendimento(atendimentoData) {
        return await this.request('atendimentos', 'POST', atendimentoData);
    }

    /**
     * Atualiza um atendimento existente
     * @param {string} id - ID do atendimento
     * @param {object} atendimentoData - Dados do atendimento
     * @returns {Promise} - Promise com os dados do atendimento atualizado
     */
    async atualizarAtendimento(id, atendimentoData) {
        return await this.request(`atendimentos/${id}`, 'PUT', atendimentoData);
    }

    /**
     * Envia mensagem para o chatbot
     * @param {string} atendimentoId - ID do atendimento
     * @param {string} mensagem - Mensagem a ser enviada
     * @returns {Promise} - Promise com a resposta do chatbot
     */
    async enviarMensagemChatbot(atendimentoId, mensagem) {
        return await this.request(`atendimentos/${atendimentoId}/mensagem`, 'POST', { mensagem });
    }

    // ===== PEDIDOS =====

    /**
     * Obtém lista de pedidos
     * @param {number} pagina - Número da página
     * @param {number} limite - Limite de itens por página
     * @param {string} status - Status dos pedidos (opcional)
     * @returns {Promise} - Promise com a lista de pedidos
     */
    async getPedidos(pagina = 1, limite = 10, status = '') {
        let url = `pedidos?pagina=${pagina}&limite=${limite}`;
        if (status) {
            url += `&status=${status}`;
        }
        return await this.request(url, 'GET');
    }

    /**
     * Obtém detalhes de um pedido
     * @param {string} id - ID do pedido
     * @returns {Promise} - Promise com os detalhes do pedido
     */
    async getPedidoById(id) {
        return await this.request(`pedidos/${id}`, 'GET');
    }

    /**
     * Cria um novo pedido
     * @param {object} pedidoData - Dados do pedido
     * @returns {Promise} - Promise com os dados do pedido criado
     */
    async criarPedido(pedidoData) {
        return await this.request('pedidos', 'POST', pedidoData);
    }

    /**
     * Atualiza um pedido existente
     * @param {string} id - ID do pedido
     * @param {object} pedidoData - Dados do pedido
     * @returns {Promise} - Promise com os dados do pedido atualizado
     */
    async atualizarPedido(id, pedidoData) {
        return await this.request(`pedidos/${id}`, 'PUT', pedidoData);
    }

    /**
     * Atualiza o status de um pedido
     * @param {string} id - ID do pedido
     * @param {string} status - Novo status do pedido
     * @returns {Promise} - Promise com os dados do pedido atualizado
     */
    async atualizarStatusPedido(id, status) {
        return await this.request(`pedidos/${id}/status`, 'PUT', { status });
    }

    /**
     * Cancela um pedido
     * @param {string} id - ID do pedido
     * @param {string} motivo - Motivo do cancelamento
     * @returns {Promise} - Promise com os dados do pedido cancelado
     */
    async cancelarPedido(id, motivo) {
        return await this.request(`pedidos/${id}/cancelar`, 'POST', { motivo });
    }

    // ===== CLIENTES =====

    /**
     * Obtém lista de clientes
     * @param {number} pagina - Número da página
     * @param {number} limite - Limite de itens por página
     * @param {string} busca - Termo de busca (opcional)
     * @returns {Promise} - Promise com a lista de clientes
     */
    async getClientes(pagina = 1, limite = 10, busca = '') {
        let url = `clientes?pagina=${pagina}&limite=${limite}`;
        if (busca) {
            url += `&busca=${encodeURIComponent(busca)}`;
        }
        return await this.request(url, 'GET');
    }

    /**
     * Obtém detalhes de um cliente
     * @param {string} id - ID do cliente
     * @returns {Promise} - Promise com os detalhes do cliente
     */
    async getClienteById(id) {
        return await this.request(`clientes/${id}`, 'GET');
    }

    /**
     * Cria um novo cliente
     * @param {object} clienteData - Dados do cliente
     * @returns {Promise} - Promise com os dados do cliente criado
     */
    async criarCliente(clienteData) {
        return await this.request('clientes', 'POST', clienteData);
    }

    /**
     * Atualiza um cliente existente
     * @param {string} id - ID do cliente
     * @param {object} clienteData - Dados do cliente
     * @returns {Promise} - Promise com os dados do cliente atualizado
     */
    async atualizarCliente(id, clienteData) {
        return await this.request(`clientes/${id}`, 'PUT', clienteData);
    }

    /**
     * Obtém histórico de pedidos de um cliente
     * @param {string} id - ID do cliente
     * @param {number} pagina - Número da página
     * @param {number} limite - Limite de itens por página
     * @returns {Promise} - Promise com o histórico de pedidos do cliente
     */
    async getHistoricoPedidosCliente(id, pagina = 1, limite = 10) {
        return await this.request(`clientes/${id}/pedidos?pagina=${pagina}&limite=${limite}`, 'GET');
    }

    // ===== CARDÁPIO =====

    /**
     * Obtém lista de categorias do cardápio
     * @returns {Promise} - Promise com a lista de categorias
     */
    async getCategorias() {
        return await this.request('cardapio/categorias', 'GET');
    }

    /**
     * Cria uma nova categoria
     * @param {object} categoriaData - Dados da categoria
     * @returns {Promise} - Promise com os dados da categoria criada
     */
    async criarCategoria(categoriaData) {
        return await this.request('cardapio/categorias', 'POST', categoriaData);
    }

    /**
     * Atualiza uma categoria existente
     * @param {string} id - ID da categoria
     * @param {object} categoriaData - Dados da categoria
     * @returns {Promise} - Promise com os dados da categoria atualizada
     */
    async atualizarCategoria(id, categoriaData) {
        return await this.request(`cardapio/categorias/${id}`, 'PUT', categoriaData);
    }

    /**
     * Remove uma categoria
     * @param {string} id - ID da categoria
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async removerCategoria(id) {
        return await this.request(`cardapio/categorias/${id}`, 'DELETE');
    }

    /**
     * Obtém lista de produtos do cardápio
     * @param {number} pagina - Número da página
     * @param {number} limite - Limite de itens por página
     * @param {string} categoria - ID da categoria (opcional)
     * @returns {Promise} - Promise com a lista de produtos
     */
    async getProdutos(pagina = 1, limite = 10, categoria = '') {
        let url = `cardapio/produtos?pagina=${pagina}&limite=${limite}`;
        if (categoria) {
            url += `&categoria=${categoria}`;
        }
        return await this.request(url, 'GET');
    }

    /**
     * Obtém detalhes de um produto
     * @param {string} id - ID do produto
     * @returns {Promise} - Promise com os detalhes do produto
     */
    async getProdutoById(id) {
        return await this.request(`cardapio/produtos/${id}`, 'GET');
    }

    /**
     * Cria um novo produto
     * @param {object} produtoData - Dados do produto
     * @returns {Promise} - Promise com os dados do produto criado
     */
    async criarProduto(produtoData) {
        return await this.request('cardapio/produtos', 'POST', produtoData);
    }

    /**
     * Atualiza um produto existente
     * @param {string} id - ID do produto
     * @param {object} produtoData - Dados do produto
     * @returns {Promise} - Promise com os dados do produto atualizado
     */
    async atualizarProduto(id, produtoData) {
        return await this.request(`cardapio/produtos/${id}`, 'PUT', produtoData);
    }

    /**
     * Remove um produto
     * @param {string} id - ID do produto
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async removerProduto(id) {
        return await this.request(`cardapio/produtos/${id}`, 'DELETE');
    }

    /**
     * Faz upload de imagem de
    (Content truncated due to size limit. Use line ranges to read in chunks)