/**
 * Arquivo JavaScript para o sistema de gerenciamento de promoções
 * Responsável por gerenciar a listagem, criação, edição e exclusão de promoções e cupons
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
    
    // Inicializar sistema de promoções
    initPromotionsSystem();
    
    // Carregar promoções
    loadPromotions();
    
    // Inicializar gráfico de promoções
    initPromotionsChart();
    
    // Configurar eventos para o modal de promoção
    setupPromotionModal();
    
    // Configurar eventos para o modal de cupons
    setupCouponsModal();
});

// Função para inicializar o sistema de promoções
function initPromotionsSystem() {
    // Configurar evento para botão de nova promoção
    document.getElementById('newPromotionBtn').addEventListener('click', function() {
        // Limpar formulário
        document.getElementById('promotionForm').reset();
        document.getElementById('promotionModalLabel').textContent = 'Nova Promoção';
        document.getElementById('imagePreviewContainer').style.display = 'none';
        
        // Configurar data de início para hoje
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;
        
        // Configurar data de término para 30 dias depois
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
        
        // Remover atributos de edição
        const saveBtn = document.getElementById('savePromotionBtn');
        saveBtn.removeAttribute('data-promotion-id');
        saveBtn.removeAttribute('data-action');
        
        // Abrir modal de promoção
        const promotionModal = new bootstrap.Modal(document.getElementById('promotionModal'));
        promotionModal.show();
    });
    
    // Configurar eventos para botões de visualização de promoção
    const viewButtons = document.querySelectorAll('.view-promotion-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promotionId = this.getAttribute('data-promotion-id');
            viewPromotion(promotionId);
        });
    });
    
    // Configurar eventos para botões de edição de promoção
    const editButtons = document.querySelectorAll('.edit-promotion-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promotionId = this.getAttribute('data-promotion-id');
            editPromotion(promotionId);
        });
    });
    
    // Configurar eventos para botões de exclusão de promoção
    const deleteButtons = document.querySelectorAll('.delete-promotion-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promotionId = this.getAttribute('data-promotion-id');
            deletePromotion(promotionId);
        });
    });
    
    // Configurar evento para filtro de status
    document.getElementById('filterStatus').addEventListener('change', function() {
        filterPromotions();
    });
    
    // Configurar evento para busca de promoções
    document.getElementById('searchPromotion').addEventListener('input', function() {
        filterPromotions();
    });
    
    // Configurar evento para botão de cupons
    document.getElementById('couponsBtn').addEventListener('click', function() {
        // Abrir modal de cupons
        const couponsModal = new bootstrap.Modal(document.getElementById('couponsModal'));
        couponsModal.show();
    });
    
    // Configurar evento para botão de visualização
    document.getElementById('previewBtn').addEventListener('click', function() {
        // Abrir visualização das promoções em nova aba
        window.open('../public/promocoes.html', '_blank');
    });
}

// Função para carregar promoções
async function loadPromotions() {
    try {
        // Em um sistema real, buscaríamos as promoções da API
        const promotions = await window.apiService.getPromocoes();
        
        // Atualizar tabela com as promoções
        updatePromotionsTable(promotions);
        
    } catch (error) {
        console.error('Erro ao carregar promoções:', error);
        
        // Em caso de erro, manter as promoções de demonstração que já estão no HTML
    }
}

// Função para atualizar a tabela de promoções
function updatePromotionsTable(promotions) {
    // Em um sistema real, atualizaríamos a tabela com os dados da API
    // Por enquanto, mantemos as promoções de demonstração que já estão no HTML
}

// Função para inicializar o gráfico de promoções
function initPromotionsChart() {
    const ctx = document.getElementById('promotionsChart').getContext('2d');
    
    // Dados fictícios para o gráfico
    const data = {
        labels: ['Produto', 'Combo', 'Frete', 'Cupom', 'Pedido'],
        datasets: [{
            data: [2, 1, 1, 1, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 15,
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };
    
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// Função para filtrar promoções
function filterPromotions() {
    const statusFilter = document.getElementById('filterStatus').value;
    const searchTerm = document.getElementById('searchPromotion').value.toLowerCase();
    
    // Obter todas as linhas da tabela
    const rows = document.querySelectorAll('#promotionsTable tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Aplicar filtro de status
        if (statusFilter) {
            const statusCell = row.querySelector('td:nth-child(6)');
            const statusText = statusCell.textContent.toLowerCase();
            
            switch (statusFilter) {
                case 'active':
                    if (!statusText.includes('ativa')) {
                        showRow = false;
                    }
                    break;
                case 'scheduled':
                    if (!statusText.includes('agendada')) {
                        showRow = false;
                    }
                    break;
                case 'expired':
                    if (!statusText.includes('expirada')) {
                        showRow = false;
                    }
                    break;
                case 'inactive':
                    if (!statusText.includes('inativa')) {
                        showRow = false;
                    }
                    break;
            }
        }
        
        // Aplicar filtro de busca
        if (searchTerm && showRow) {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const type = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (!name.includes(searchTerm) && !type.includes(searchTerm)) {
                showRow = false;
            }
        }
        
        // Mostrar ou ocultar a linha
        row.style.display = showRow ? '' : 'none';
    });
}

// Função para configurar o modal de promoção
function setupPromotionModal() {
    // Configurar evento para pré-visualização de imagem
    document.getElementById('promotionImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                document.getElementById('imagePreview').src = e.target.result;
                document.getElementById('imagePreviewContainer').style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Configurar evento para tipo de promoção
    document.getElementById('promotionType').addEventListener('change', function() {
        const promotionType = this.value;
        
        // Mostrar ou ocultar campos específicos com base no tipo de promoção
        if (promotionType === 'coupon') {
            document.getElementById('couponCodeContainer').style.display = 'block';
        } else {
            document.getElementById('couponCodeContainer').style.display = 'none';
        }
    });
    
    // Configurar evento para tipo de desconto
    document.getElementById('discountType').addEventListener('change', function() {
        const discountType = this.value;
        const discountPrefix = document.getElementById('discountPrefix');
        const discountValue = document.getElementById('discountValue');
        const buyXGetYContainer = document.getElementById('buyXGetYContainer');
        
        // Atualizar prefixo e comportamento com base no tipo de desconto
        switch (discountType) {
            case 'percentage':
                discountPrefix.textContent = '%';
                discountValue.disabled = false;
                buyXGetYContainer.style.display = 'none';
                break;
            case 'fixed':
                discountPrefix.textContent = 'R$';
                discountValue.disabled = false;
                buyXGetYContainer.style.display = 'none';
                break;
            case 'free':
                discountPrefix.textContent = '';
                discountValue.value = '100';
                discountValue.disabled = true;
                buyXGetYContainer.style.display = 'none';
                break;
            case 'buy_x_get_y':
                discountPrefix.textContent = '';
                discountValue.value = '0';
                discountValue.disabled = true;
                buyXGetYContainer.style.display = 'flex';
                break;
        }
    });
    
    // Configurar evento para gerar código de cupom
    document.getElementById('generateCouponBtn').addEventListener('click', function() {
        const couponCode = generateRandomCouponCode();
        document.getElementById('couponCode').value = couponCode;
    });
    
    // Configurar evento para salvar promoção
    document.getElementById('savePromotionBtn').addEventListener('click', function() {
        savePromotion();
    });
}

// Função para gerar código de cupom aleatório
function generateRandomCouponCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Gerar código de 8 caracteres
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return code;
}

// Função para salvar promoção
async function savePromotion() {
    try {
        // Validar formulário
        const form = document.getElementById('promotionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Coletar dados do formulário
        const promotionData = {
            nome: document.getElementById('promotionName').value,
            tipo: document.getElementById('promotionType').value,
            descricao: document.getElementById('promotionDescription').value,
            tipoDesconto: document.getElementById('discountType').value,
            valorDesconto: parseFloat(document.getElementById('discountValue').value),
            dataInicio: document.getElementById('startDate').value,
            dataFim: document.getElementById('endDate').value,
            status: document.getElementById('promotionStatus').value,
            valorMinimoPedido: parseFloat(document.getElementById('minOrderValue').value),
            usosMaximosPorCliente: parseInt(document.getElementById('maxUsesPerCustomer').value),
            usosMaximos: parseInt(document.getElementById('maxUses').value)
        };
        
        // Adicionar campos específicos com base no tipo de promoção
        if (promotionData.tipo === 'coupon') {
            promotionData.codigoCupom = document.getElementById('couponCode').value;
        }
        
        // Adicionar campos específicos com base no tipo de desconto
        if (promotionData.tipoDesconto === 'buy_x_get_y') {
            promotionData.compraQuantidade = parseInt(document.getElementById('buyQuantity').value);
            promotionData.leveQuantidade = parseInt(document.getElementById('getQuantity').value);
        }
        
        // Adicionar produtos aplicáveis
        const productSelector = document.getElementById('productSelector');
        const selectedProducts = Array.from(productSelector.selectedOptions).map(option => option.value);
        promotionData.produtosAplicaveis = selectedProducts;
        
        // Verificar se é edição ou criação
        const saveBtn = document.getElementById('savePromotionBtn');
        const isEdit = saveBtn.hasAttribute('data-action') && saveBtn.getAttribute('data-action') === 'update';
        
        if (isEdit) {
            const promotionId = saveBtn.getAttribute('data-promotion-id');
            
            // Em um sistema real, atualizaríamos a promoção na API
            await window.apiService.atualizarPromocao(promotionId, promotionData);
            
            // Mostrar mensagem de sucesso
            alert('Promoção atualizada com sucesso!');
        } else {
            // Em um sistema real, criaríamos a promoção na API
            await window.apiService.criarPromocao(promotionData);
            
            // Mostrar mensagem de sucesso
            alert('Promoção criada com sucesso!');
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('promotionModal'));
        modal.hide();
        
        // Recarregar promoções
        loadPromotions();
        
    } catch (error) {
        console.error('Erro ao salvar promoç
(Content truncated due to size limit. Use line ranges to read in chunks)