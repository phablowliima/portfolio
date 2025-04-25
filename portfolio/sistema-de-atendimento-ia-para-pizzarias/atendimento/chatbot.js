/**
 * Arquivo JavaScript para o sistema de atendimento via chatbot
 * Responsável por gerenciar conversas, mensagens e integração com LLM
 */

// Quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!window.authService.isAuthenticated()) {
        window.location.href = '../index.html';
        return;
    }
    
    // Carregar dados do usuário
    const userData = window.authService.getUserData();
    if (userData) {
        document.getElementById('userName').textContent = userData.nome || 'Usuário';
    }
    
    // Configurar eventos de logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        window.authService.logout();
    });
    
    document.getElementById('logoutBtnDropdown').addEventListener('click', function(e) {
        e.preventDefault();
        window.authService.logout();
    });
    
    // Inicializar sistema de chat
    initChatSystem();
    
    // Carregar conversas
    loadConversations();
    
    // Configurar eventos para o modal de criação de pedido
    setupOrderModal();
});

// Função para inicializar o sistema de chat
function initChatSystem() {
    // Configurar evento de envio de mensagem
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    sendMessageBtn.addEventListener('click', function() {
        sendMessage();
    });
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Configurar eventos para respostas rápidas
    const quickResponses = document.querySelectorAll('[data-response]');
    quickResponses.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const responseText = this.getAttribute('data-response');
            messageInput.value = responseText;
            messageInput.focus();
        });
    });
    
    // Configurar eventos para troca de conversa
    const conversationItems = document.querySelectorAll('[data-conversation-id]');
    conversationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe ativa de todos os itens
            conversationItems.forEach(i => i.classList.remove('active'));
            
            // Adicionar classe ativa ao item clicado
            this.classList.add('active');
            
            // Carregar conversa
            const conversationId = this.getAttribute('data-conversation-id');
            loadConversation(conversationId);
        });
    });
    
    // Configurar evento para criação de pedido
    document.getElementById('createOrderBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Abrir modal de criação de pedido
        const createOrderModal = new bootstrap.Modal(document.getElementById('createOrderModal'));
        createOrderModal.show();
    });
    
    // Configurar eventos para botões de ação
    document.getElementById('viewCustomerBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Redirecionar para página de detalhes do cliente
        // window.location.href = `../clientes/detalhes.html?id=${currentCustomerId}`;
        
        // Por enquanto, apenas rolar para a seção de informações do cliente
        document.querySelector('.card:last-child').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('viewOrdersBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Redirecionar para página de pedidos filtrada por cliente
        // window.location.href = `../pedidos/kanban.html?cliente=${currentCustomerId}`;
    });
    
    document.getElementById('transferChatBtn').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Funcionalidade de transferência de chat será implementada em breve.');
    });
    
    document.getElementById('endChatBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Tem certeza que deseja encerrar esta conversa?')) {
            alert('Conversa encerrada com sucesso.');
        }
    });
    
    // Configurar evento para edição de cliente
    document.getElementById('editCustomerBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Redirecionar para página de edição do cliente
        // window.location.href = `../clientes/editar.html?id=${currentCustomerId}`;
    });
    
    // Configurar evento para busca de conversas
    const searchInput = document.getElementById('searchConversations');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const conversationItems = document.querySelectorAll('#conversationList a');
        
        conversationItems.forEach(item => {
            const name = item.querySelector('h6').textContent.toLowerCase();
            const message = item.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || message.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Função para enviar mensagem
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    // Limpar campo de entrada
    messageInput.value = '';
    
    // Adicionar mensagem à conversa (lado do operador)
    addMessageToChat('bot', messageText);
    
    // Verificar se resposta automática está ativada
    const autoResponseEnabled = document.getElementById('autoResponseSwitch').checked;
    
    if (autoResponseEnabled) {
        // Simular resposta do cliente após um breve delay
        setTimeout(() => {
            simulateClientResponse(messageText);
        }, 1000);
    }
    
    try {
        // Enviar mensagem para a API
        const currentConversationId = getCurrentConversationId();
        
        await window.apiService.enviarMensagem({
            conversaId: currentConversationId,
            texto: messageText,
            tipo: 'operador'
        });
        
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}

// Função para simular resposta do cliente (para demonstração)
async function simulateClientResponse(messageText) {
    try {
        // Em um sistema real, isso seria substituído pela chamada à API LLM
        // Aqui estamos apenas simulando uma resposta para demonstração
        
        // Mostrar indicador de digitação
        showTypingIndicator();
        
        // Simular delay de processamento da LLM
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Gerar resposta baseada na mensagem do operador
        let responseText = '';
        
        if (messageText.toLowerCase().includes('olá') || messageText.toLowerCase().includes('oi')) {
            responseText = 'Olá! Tudo bem? Como posso ajudar?';
        } else if (messageText.toLowerCase().includes('tempo') && messageText.toLowerCase().includes('entrega')) {
            responseText = 'O tempo estimado de entrega é de 30 a 45 minutos, dependendo da sua localização.';
        } else if (messageText.toLowerCase().includes('forma') && messageText.toLowerCase().includes('pagamento')) {
            responseText = 'Aceitamos cartão de crédito, débito, dinheiro e PIX.';
        } else if (messageText.toLowerCase().includes('cardápio') || messageText.toLowerCase().includes('sabores')) {
            responseText = 'Temos diversos sabores como Calabresa, Portuguesa, Margherita, Quatro Queijos, Frango com Catupiry, entre outros. Gostaria de ver o cardápio completo?';
        } else if (messageText.toLowerCase().includes('promoção') || messageText.toLowerCase().includes('desconto')) {
            responseText = 'Temos uma promoção especial hoje: na compra de uma pizza grande, você ganha um refrigerante de 2L. Gostaria de aproveitar?';
        } else {
            responseText = 'Entendi! Posso ajudar com mais alguma coisa?';
        }
        
        // Remover indicador de digitação
        removeTypingIndicator();
        
        // Adicionar resposta à conversa
        addMessageToChat('client', responseText);
        
        // Em um sistema real, também enviaríamos esta resposta para a API
        const currentConversationId = getCurrentConversationId();
        
        await window.apiService.enviarMensagem({
            conversaId: currentConversationId,
            texto: responseText,
            tipo: 'cliente'
        });
        
    } catch (error) {
        console.error('Erro ao simular resposta do cliente:', error);
        removeTypingIndicator();
    }
}

// Função para mostrar indicador de digitação
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    // Criar elemento de indicador de digitação
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'd-flex mb-3';
    typingIndicator.id = 'typingIndicator';
    
    typingIndicator.innerHTML = `
        <div class="message message-client">
            <div class="message-content">
                <p class="mb-0">
                    <span class="typing-dot">.</span>
                    <span class="typing-dot">.</span>
                    <span class="typing-dot">.</span>
                </p>
            </div>
        </div>
    `;
    
    // Adicionar ao chat
    chatMessages.appendChild(typingIndicator);
    
    // Rolar para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Adicionar CSS para animação
    const style = document.createElement('style');
    style.id = 'typingStyle';
    style.textContent = `
        @keyframes typingAnimation {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }
        .typing-dot {
            animation: typingAnimation 1s infinite;
            margin-right: 2px;
        }
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
    `;
    
    document.head.appendChild(style);
}

// Função para remover indicador de digitação
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    const typingStyle = document.getElementById('typingStyle');
    if (typingStyle) {
        typingStyle.remove();
    }
}

// Função para adicionar mensagem ao chat
function addMessageToChat(type, text) {
    const chatMessages = document.getElementById('chatMessages');
    
    // Criar elemento de mensagem
    const messageElement = document.createElement('div');
    messageElement.className = 'd-flex mb-3';
    
    // Obter hora atual
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Definir conteúdo baseado no tipo
    if (type === 'client') {
        messageElement.innerHTML = `
            <div class="message message-client">
                <div class="message-content">
                    <p class="mb-0">${text}</p>
                </div>
                <small class="text-muted d-block text-end mt-1">${timeString}</small>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="message message-bot">
                <div class="message-content">
                    <p class="mb-0">${text}</p>
                </div>
                <small class="text-muted d-block mt-1">${timeString}</small>
            </div>
        `;
    }
    
    // Adicionar ao chat
    chatMessages.appendChild(messageElement);
    
    // Rolar para o final
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para carregar conversas
async function loadConversations() {
    try {
        // Em um sistema real, buscaríamos as conversas da API
        const conversations = await window.apiService.getConversas();
        
        // Atualizar lista de conversas
        updateConversationsList(conversations);
        
    } catch (error) {
        console.error('Erro ao carregar conversas:', error);
        
        // Em caso de erro, manter as conversas de demonstração que já estão no HTML
    }
}

// Função para atualizar lista de conversas
function updateConversationsList(conversations) {
    // Em um sistema real, atualizaríamos a lista com os dados da API
    // Por enquanto, mantemos as conversas de demonstração que já estão no HTML
}

// Função para carregar uma conversa específica
async function loadConversation(conversationId) {
    try {
        // Em um sistema real, buscaríamos a conversa da API
        const conversation = await window.apiService.getConversaById(conversationId);
        
        // Atualizar chat com as mensagens da conversa
        updateChatMessages(conversation);
        
        // Atualizar informações do cliente
        updateCustomerInfo(conversation.cliente);
        
    } catch (error) {
        console.error(`Erro ao carregar conversa ${conversationId}:`, error);
        
        // Em caso de erro, manter as mensagens de demonstração que já estão no HTML
        // e atualizar apenas o nome do cliente com base no item selecionado
        const selectedItem = document.querySelector(`[data-conversation-id="${conversationId}"].active`);
        if (selectedItem) {
            const clientName = selectedItem.querySelector('h6').textContent;
            document.getElementById('currentChatName').textContent = clientName;
        }
    }
}

// Função para atualizar mensagens do chat
function updateChatMessages(conversation) {
    // Em um sistema real, atualizaríamos o chat com as mensagens da API
    // Por enquanto, mantemos as mensagens de demonstração que já estão no HTML
}

// Função para atualizar informações do cliente
function updateCustomerInfo(cliente) {
    // Em um sistema real, atualizaríamos as informações do cliente com os dados da API
    // Por enquanto, mantemos as informações de demonstração que já estão no HTML
}

// Função para obter o ID da conversa atual
function getCurrentConversationId() {
    const activeConversation = document.querySelector('#conversationList a.active');
    return activeConversation ? activeConversation.getAttribute('data-conversation-id') : '1';
}

// Função para configurar o modal de criação de pedido
function setupOrderModal() {
    // Configurar evento para adicionar item
    document.getElementById('addItemBtn').addEventListener('click', function() {
        addOrderItem();
    });
    
    // Configurar eventos para remover itens
    setupRemoveItemButtons();
    
    // Configurar evento para atualizar total
    setupOrderTotalCalculation();
    
    // Configurar evento para salvar pedido
    document.getElementById('saveOrderBtn').addEventListener('click', function() {
        saveOrder();
    });
}

// Função para adicionar item ao pedido
function addOrderItem() {
    const tbody = document.querySelector('#orderItemsTable tbody');
    
    // Criar nova linha
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <select class="form-select form-select-sm product-select">
                <option value="1">Pizza Calabresa (G)</option>
                <option value="2">Pizza Portuguesa (G)</option>
(Content truncated due to size limit. Use line ranges to read in chunks)