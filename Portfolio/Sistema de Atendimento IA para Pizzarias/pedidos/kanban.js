/**
 * Arquivo JavaScript para o sistema de gerenciamento de pedidos (Kanban)
 * Responsável por gerenciar o quadro kanban, movimentação de pedidos e detalhes
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
    
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializar sistema de kanban
    initKanbanSystem();
    
    // Carregar pedidos
    loadOrders();
    
    // Configurar eventos para o modal de novo pedido
    setupNewOrderModal();
    
    // Configurar eventos para o modal de detalhes do pedido
    setupOrderDetailsModal();
});

// Função para inicializar o sistema de kanban
function initKanbanSystem() {
    // Configurar eventos para botões de movimentação de pedidos
    const moveButtons = document.querySelectorAll('.move-order-btn');
    moveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('.kanban-item').getAttribute('data-order-id');
            const targetColumn = this.getAttribute('data-target');
            moveOrder(orderId, targetColumn);
        });
    });
    
    // Configurar evento para botão de novo pedido
    document.getElementById('newOrderBtn').addEventListener('click', function() {
        // Abrir modal de novo pedido
        const newOrderModal = new bootstrap.Modal(document.getElementById('newOrderModal'));
        newOrderModal.show();
    });
    
    // Configurar eventos para botões de detalhes do pedido
    const detailButtons = document.querySelectorAll('.kanban-item .btn-outline-secondary');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('.kanban-item').getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });
    
    // Configurar evento para filtro de status
    document.getElementById('filterStatus').addEventListener('change', function() {
        filterOrders();
    });
    
    // Configurar evento para filtro de data
    document.getElementById('filterDate').addEventListener('change', function() {
        filterOrders();
    });
    
    // Configurar evento para busca de pedidos
    document.getElementById('searchOrder').addEventListener('input', function() {
        filterOrders();
    });
    
    // Configurar evento para botão de relatório
    document.getElementById('viewReportBtn').addEventListener('click', function() {
        window.location.href = 'relatorio.html';
    });
    
    // Configurar evento para botão de exportação
    document.getElementById('exportBtn').addEventListener('click', function() {
        exportOrders();
    });
}

// Função para carregar pedidos
async function loadOrders() {
    try {
        // Em um sistema real, buscaríamos os pedidos da API
        const orders = await window.apiService.getPedidos();
        
        // Atualizar kanban com os pedidos
        updateKanbanBoard(orders);
        
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        
        // Em caso de erro, manter os pedidos de demonstração que já estão no HTML
    }
}

// Função para atualizar o quadro kanban
function updateKanbanBoard(orders) {
    // Em um sistema real, atualizaríamos o kanban com os dados da API
    // Por enquanto, mantemos os pedidos de demonstração que já estão no HTML
}

// Função para mover um pedido para outra coluna
async function moveOrder(orderId, targetColumn) {
    try {
        // Mapear coluna de destino para status
        const statusMap = {
            'inPreparation': 'em_preparo',
            'inDelivery': 'em_entrega',
            'delivered': 'entregue',
            'canceled': 'cancelado',
            'pending': 'pendente'
        };
        
        const newStatus = statusMap[targetColumn];
        
        if (!newStatus) {
            throw new Error('Status inválido');
        }
        
        // Em um sistema real, atualizaríamos o status do pedido na API
        await window.apiService.atualizarPedido(orderId, { status: newStatus });
        
        // Mover o pedido no kanban
        const orderElement = document.querySelector(`.kanban-item[data-order-id="${orderId}"]`);
        
        if (!orderElement) {
            throw new Error('Pedido não encontrado');
        }
        
        // Remover o pedido da coluna atual
        orderElement.remove();
        
        // Adicionar o pedido na coluna de destino
        const targetColumnElement = document.getElementById(`${targetColumn}Orders`);
        
        if (!targetColumnElement) {
            throw new Error('Coluna de destino não encontrada');
        }
        
        // Atualizar o botão de movimentação com base no novo status
        updateMoveButton(orderElement, newStatus);
        
        // Adicionar o pedido na coluna de destino
        targetColumnElement.appendChild(orderElement);
        
        // Atualizar contadores de pedidos
        updateOrderCounters();
        
    } catch (error) {
        console.error(`Erro ao mover pedido ${orderId} para ${targetColumn}:`, error);
        alert('Erro ao mover pedido. Por favor, tente novamente.');
    }
}

// Função para atualizar o botão de movimentação com base no status
function updateMoveButton(orderElement, status) {
    const moveButton = orderElement.querySelector('.move-order-btn');
    
    if (!moveButton) {
        return;
    }
    
    // Atualizar botão com base no status
    switch (status) {
        case 'pendente':
            moveButton.setAttribute('data-target', 'inPreparation');
            moveButton.innerHTML = '<i class="bi bi-arrow-right"></i> Preparar';
            break;
        case 'em_preparo':
            moveButton.setAttribute('data-target', 'inDelivery');
            moveButton.innerHTML = '<i class="bi bi-arrow-right"></i> Entregar';
            break;
        case 'em_entrega':
            moveButton.setAttribute('data-target', 'delivered');
            moveButton.innerHTML = '<i class="bi bi-arrow-right"></i> Finalizar';
            break;
        case 'entregue':
            // Remover botão de movimentação e adicionar botão de impressão
            const btnGroup = moveButton.parentElement;
            moveButton.remove();
            
            const printButton = document.createElement('button');
            printButton.className = 'btn btn-sm btn-outline-success';
            printButton.setAttribute('data-bs-toggle', 'tooltip');
            printButton.setAttribute('title', 'Imprimir');
            printButton.innerHTML = '<i class="bi bi-printer"></i>';
            
            btnGroup.appendChild(printButton);
            
            // Inicializar tooltip para o novo botão
            new bootstrap.Tooltip(printButton);
            break;
        case 'cancelado':
            // Remover botão de movimentação e adicionar botão de reativação
            const btnContainer = moveButton.parentElement;
            moveButton.remove();
            
            const reactivateButton = document.createElement('button');
            reactivateButton.className = 'btn btn-sm btn-outline-primary';
            reactivateButton.setAttribute('data-bs-toggle', 'tooltip');
            reactivateButton.setAttribute('title', 'Reativar');
            reactivateButton.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
            
            btnContainer.appendChild(reactivateButton);
            
            // Inicializar tooltip para o novo botão
            new bootstrap.Tooltip(reactivateButton);
            break;
    }
}

// Função para atualizar contadores de pedidos
function updateOrderCounters() {
    // Atualizar contador de pedidos pendentes
    const pendingCount = document.querySelectorAll('#pendingOrders .kanban-item').length;
    document.querySelector('.kanban-column:nth-child(1) h5 .badge').textContent = pendingCount;
    
    // Atualizar contador de pedidos em preparo
    const inPreparationCount = document.querySelectorAll('#inPreparationOrders .kanban-item').length;
    document.querySelector('.kanban-column:nth-child(2) h5 .badge').textContent = inPreparationCount;
    
    // Atualizar contador de pedidos em entrega
    const inDeliveryCount = document.querySelectorAll('#inDeliveryOrders .kanban-item').length;
    document.querySelector('.kanban-column:nth-child(3) h5 .badge').textContent = inDeliveryCount;
    
    // Atualizar contador de pedidos entregues
    const deliveredCount = document.querySelectorAll('#deliveredOrders .kanban-item').length;
    document.querySelector('.kanban-column:nth-child(4) h5 .badge').textContent = deliveredCount;
    
    // Atualizar contador de pedidos cancelados
    const canceledCount = document.querySelectorAll('#canceledOrders .kanban-item').length;
    document.querySelector('.kanban-column:nth-child(5) h5 .badge').textContent = canceledCount;
}

// Função para mostrar detalhes do pedido
async function showOrderDetails(orderId) {
    try {
        // Em um sistema real, buscaríamos os detalhes do pedido da API
        const orderDetails = await window.apiService.getPedidoById(orderId);
        
        // Preencher modal com os detalhes do pedido
        updateOrderDetailsModal(orderDetails);
        
        // Abrir modal de detalhes do pedido
        const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        orderDetailsModal.show();
        
    } catch (error) {
        console.error(`Erro ao carregar detalhes do pedido ${orderId}:`, error);
        
        // Em caso de erro, mostrar detalhes fictícios
        // Atualizar título do modal
        document.getElementById('orderDetailsModalLabel').textContent = `Detalhes do Pedido #${orderId}`;
        
        // Abrir modal de detalhes do pedido
        const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
        orderDetailsModal.show();
    }
}

// Função para atualizar o modal de detalhes do pedido
function updateOrderDetailsModal(orderDetails) {
    // Em um sistema real, atualizaríamos o modal com os dados da API
    // Por enquanto, mantemos os detalhes de demonstração que já estão no HTML
    
    // Atualizar título do modal
    document.getElementById('orderDetailsModalLabel').textContent = `Detalhes do Pedido #${orderDetails?.id || '1234'}`;
}

// Função para filtrar pedidos
function filterOrders() {
    const statusFilter = document.getElementById('filterStatus').value;
    const dateFilter = document.getElementById('filterDate').value;
    const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
    
    // Obter todos os pedidos
    const orderItems = document.querySelectorAll('.kanban-item');
    
    orderItems.forEach(item => {
        let showItem = true;
        
        // Aplicar filtro de status
        if (statusFilter) {
            const statusMap = {
                'pendente': '#pendingOrders',
                'em_preparo': '#inPreparationOrders',
                'em_entrega': '#inDeliveryOrders',
                'entregue': '#deliveredOrders',
                'cancelado': '#canceledOrders'
            };
            
            const parentId = item.parentElement.id;
            if (parentId !== statusMap[statusFilter].substring(1)) {
                showItem = false;
            }
        }
        
        // Aplicar filtro de busca
        if (searchTerm && showItem) {
            const orderNumber = item.querySelector('h6').textContent.toLowerCase();
            const customerName = item.querySelector('small').textContent.toLowerCase();
            const orderItems = item.querySelector('p').textContent.toLowerCase();
            
            if (!orderNumber.includes(searchTerm) && !customerName.includes(searchTerm) && !orderItems.includes(searchTerm)) {
                showItem = false;
            }
        }
        
        // Aplicar filtro de data (simplificado para demonstração)
        // Em um sistema real, verificaríamos a data do pedido
        
        // Mostrar ou ocultar o item
        item.style.display = showItem ? '' : 'none';
    });
}

// Função para exportar pedidos
function exportOrders() {
    alert('Funcionalidade de exportação será implementada em breve.');
}

// Função para configurar o modal de novo pedido
function setupNewOrderModal() {
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
    
    // Configurar evento para buscar cliente
    document.getElementById('searchCustomerBtn').addEventListener('click', function() {
        searchCustomer();
    });
}

// Função para adicionar item ao pedido
function addOrderItem() {
    const tbody = document.querySelector('#newOrderItemsTable tbody');
    
    // Criar nova linha
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <select class="form-select form-select-sm product-select">
                <option value="1">Pizza Calabresa (G)</option>
                <option value="2">Pizza Portuguesa (G)</option>
                <option value="3">Pizza Margherita (G)</option>
                <option value="4">Refrigerante Cola 2L</option>
            </select>
        </td>
        <td>
            <input type="number" class="form-control form-control-sm quantity-input" value="1" min="1">
        </td>
        <td>R$ 0,00</td>
        <td>R$ 0,00</td>
        <td>
            <button type="button" class="btn btn-sm btn-outline-danger remove-item-btn">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    // Adicionar à tabela
    tbody.appendChild(newRow);
    
    // Configurar eventos para o novo item
    setupProductSelect(newRow.querySelector('.product-select'));
    setupQuantityInput(newRow.querySelector('.quantity-input'));
    
    // Configurar evento para remover item
    const removeBtn = newRow.querySelector('.remove-item-btn');
    removeBtn.addEventListener('click', function() {
        newRow.remove();
        updateOrderTotal();
    });
    
    // Atualizar preço do produto selecionado
    updateProductPrice(newRow.querySelector('.product-select'));
}

// Função para configurar botões de remoção de itens
function setupRemoveItemButtons() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Verificar se há mais de um item antes de remover
            const itemCount = document.querySelectorAll('#newOrderItemsTable tbody tr').length;
            
    
(Content truncated due to size limit. Use line ranges to read in chunks)