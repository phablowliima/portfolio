/**
 * Arquivo JavaScript para o sistema de gerenciamento de clientes
 * Responsável por gerenciar a listagem, criação, edição e exclusão de clientes
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
    
    // Inicializar sistema de clientes
    initClientsSystem();
    
    // Carregar clientes
    loadClients();
    
    // Inicializar gráfico de clientes
    initClientsChart();
    
    // Configurar eventos para o modal de novo cliente
    setupNewClientModal();
    
    // Configurar eventos para o modal de detalhes do cliente
    setupClientDetailsModal();
    
    // Configurar eventos para o modal de marketing
    setupMarketingModal();
});

// Função para inicializar o sistema de clientes
function initClientsSystem() {
    // Configurar evento para botão de novo cliente
    document.getElementById('newClientBtn').addEventListener('click', function() {
        // Abrir modal de novo cliente
        const newClientModal = new bootstrap.Modal(document.getElementById('newClientModal'));
        newClientModal.show();
    });
    
    // Configurar eventos para botões de visualização de cliente
    const viewButtons = document.querySelectorAll('.view-client-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            showClientDetails(clientId);
        });
    });
    
    // Configurar eventos para botões de edição de cliente
    const editButtons = document.querySelectorAll('.edit-client-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            editClient(clientId);
        });
    });
    
    // Configurar eventos para botões de exclusão de cliente
    const deleteButtons = document.querySelectorAll('.delete-client-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            deleteClient(clientId);
        });
    });
    
    // Configurar evento para filtro de status
    document.getElementById('filterStatus').addEventListener('change', function() {
        filterClients();
    });
    
    // Configurar evento para busca de clientes
    document.getElementById('searchClient').addEventListener('input', function() {
        filterClients();
    });
    
    // Configurar evento para botão de marketing
    document.getElementById('marketingBtn').addEventListener('click', function() {
        // Abrir modal de marketing
        const marketingModal = new bootstrap.Modal(document.getElementById('marketingModal'));
        marketingModal.show();
    });
    
    // Configurar evento para botão de exportação
    document.getElementById('exportBtn').addEventListener('click', function() {
        exportClients();
    });
}

// Função para carregar clientes
async function loadClients() {
    try {
        // Em um sistema real, buscaríamos os clientes da API
        const clients = await window.apiService.getClientes();
        
        // Atualizar tabela com os clientes
        updateClientsTable(clients);
        
        // Atualizar estatísticas de clientes
        updateClientStats(clients);
        
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        
        // Em caso de erro, manter os clientes de demonstração que já estão no HTML
    }
}

// Função para atualizar a tabela de clientes
function updateClientsTable(clients) {
    // Em um sistema real, atualizaríamos a tabela com os dados da API
    // Por enquanto, mantemos os clientes de demonstração que já estão no HTML
}

// Função para atualizar estatísticas de clientes
function updateClientStats(clients) {
    // Em um sistema real, atualizaríamos as estatísticas com os dados da API
    // Por enquanto, mantemos as estatísticas de demonstração que já estão no HTML
}

// Função para inicializar o gráfico de clientes
function initClientsChart() {
    const ctx = document.getElementById('clientsChart').getContext('2d');
    
    // Dados fictícios para o gráfico
    const data = {
        labels: ['Ativos', 'Inativos', 'Novos', 'VIP'],
        datasets: [{
            data: [87, 20, 18, 15],
            backgroundColor: [
                'rgba(76, 175, 80, 0.7)',
                'rgba(158, 158, 158, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(233, 30, 99, 0.7)'
            ],
            borderColor: [
                'rgba(76, 175, 80, 1)',
                'rgba(158, 158, 158, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(233, 30, 99, 1)'
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
        type: 'doughnut',
        data: data,
        options: options
    });
}

// Função para filtrar clientes
function filterClients() {
    const statusFilter = document.getElementById('filterStatus').value;
    const searchTerm = document.getElementById('searchClient').value.toLowerCase();
    
    // Obter todas as linhas da tabela
    const rows = document.querySelectorAll('#clientsTable tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Aplicar filtro de status
        if (statusFilter) {
            const statusCell = row.querySelector('td:nth-child(7)');
            const statusText = statusCell.textContent.toLowerCase();
            
            switch (statusFilter) {
                case 'active':
                    if (!statusText.includes('ativo')) {
                        showRow = false;
                    }
                    break;
                case 'inactive':
                    if (!statusText.includes('inativo')) {
                        showRow = false;
                    }
                    break;
                case 'new':
                    if (!statusText.includes('novo')) {
                        showRow = false;
                    }
                    break;
                case 'vip':
                    if (!statusText.includes('vip')) {
                        showRow = false;
                    }
                    break;
            }
        }
        
        // Aplicar filtro de busca
        if (searchTerm && showRow) {
            const name = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const phone = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const address = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            if (!name.includes(searchTerm) && !phone.includes(searchTerm) && !address.includes(searchTerm)) {
                showRow = false;
            }
        }
        
        // Mostrar ou ocultar a linha
        row.style.display = showRow ? '' : 'none';
    });
}

// Função para exportar clientes
function exportClients() {
    alert('Funcionalidade de exportação será implementada em breve.');
}

// Função para configurar o modal de novo cliente
function setupNewClientModal() {
    // Configurar evento para salvar cliente
    document.getElementById('saveClientBtn').addEventListener('click', function() {
        saveClient();
    });
}

// Função para salvar cliente
async function saveClient() {
    try {
        // Validar formulário
        const form = document.getElementById('newClientForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Coletar dados do formulário
        const clientData = {
            nome: document.getElementById('clientName').value,
            telefone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            dataNascimento: document.getElementById('clientBirthdate').value,
            endereco: {
                rua: document.getElementById('clientStreet').value,
                numero: document.getElementById('clientNumber').value,
                complemento: document.getElementById('clientComplement').value,
                bairro: document.getElementById('clientNeighborhood').value,
                cidade: document.getElementById('clientCity').value,
                estado: document.getElementById('clientState').value
            },
            observacoes: document.getElementById('clientNotes').value,
            aceitaMarketing: document.getElementById('clientMarketing').checked
        };
        
        // Enviar cliente para a API
        const response = await window.apiService.criarCliente(clientData);
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newClientModal'));
        modal.hide();
        
        // Mostrar mensagem de sucesso
        alert('Cliente cadastrado com sucesso!');
        
        // Recarregar clientes
        loadClients();
        
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao salvar cliente. Por favor, tente novamente.');
    }
}

// Função para mostrar detalhes do cliente
async function showClientDetails(clientId) {
    try {
        // Em um sistema real, buscaríamos os detalhes do cliente da API
        const clientDetails = await window.apiService.getClienteById(clientId);
        
        // Preencher modal com os detalhes do cliente
        updateClientDetailsModal(clientDetails);
        
        // Abrir modal de detalhes do cliente
        const clientDetailsModal = new bootstrap.Modal(document.getElementById('clientDetailsModal'));
        clientDetailsModal.show();
        
    } catch (error) {
        console.error(`Erro ao carregar detalhes do cliente ${clientId}:`, error);
        
        // Em caso de erro, mostrar detalhes fictícios
        // Abrir modal de detalhes do cliente
        const clientDetailsModal = new bootstrap.Modal(document.getElementById('clientDetailsModal'));
        clientDetailsModal.show();
    }
}

// Função para atualizar o modal de detalhes do cliente
function updateClientDetailsModal(clientDetails) {
    // Em um sistema real, atualizaríamos o modal com os dados da API
    // Por enquanto, mantemos os detalhes de demonstração que já estão no HTML
}

// Função para configurar o modal de detalhes do cliente
function setupClientDetailsModal() {
    // Configurar evento para editar cliente
    document.getElementById('editClientBtn').addEventListener('click', function() {
        // Fechar modal de detalhes
        const detailsModal = bootstrap.Modal.getInstance(document.getElementById('clientDetailsModal'));
        detailsModal.hide();
        
        // Obter ID do cliente do título do modal
        const clientName = document.getElementById('detailClientName').textContent;
        
        // Buscar cliente pelo nome na tabela
        const rows = document.querySelectorAll('#clientsTable tbody tr');
        let clientId = null;
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(1)').textContent;
            if (name === clientName) {
                const editBtn = row.querySelector('.edit-client-btn');
                clientId = editBtn.getAttribute('data-client-id');
            }
        });
        
        if (clientId) {
            // Editar cliente
            editClient(clientId);
        }
    });
    
    // Configurar evento para excluir cliente
    document.getElementById('deleteClientBtn').addEventListener('click', function() {
        // Obter ID do cliente do título do modal
        const clientName = document.getElementById('detailClientName').textContent;
        
        // Buscar cliente pelo nome na tabela
        const rows = document.querySelectorAll('#clientsTable tbody tr');
        let clientId = null;
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(1)').textContent;
            if (name === clientName) {
                const deleteBtn = row.querySelector('.delete-client-btn');
                clientId = deleteBtn.getAttribute('data-client-id');
            }
        });
        
        if (clientId) {
            // Fechar modal de detalhes
            const detailsModal = bootstrap.Modal.getInstance(document.getElementById('clientDetailsModal'));
            detailsModal.hide();
            
            // Excluir cliente
            deleteClient(clientId);
        }
    });
}

// Função para editar cliente
async function editClient(clientId) {
    try {
        // Em um sistema real, buscaríamos os detalhes do cliente da API
        const clientDetails = await window.apiService.getClienteById(clientId);
        
        // Preencher modal de novo cliente com os detalhes do cliente
        document.getElementById('newClientModalLabel').textContent = 'Editar Cliente';
        
        // Preencher campos do formulário
        document.getElementById('clientName').value = clientDetails?.nome || '';
        document.getElementById('clientPhone').value = clientDetails?.telefone || '';
        document.getElementById('clientEmail').value = clientDetails?.email || '';
        document.getElementById('clientBirthdate').value = clientDetails?.dataNascimento || '';
        document.getElementById('clientStreet').value = clientDetails?.endereco?.rua || '';
        document.getElementById('clientNumber').value = clientDetails?.endereco?.numero || '';
        document.getElementById('clientComplement').value = clientDetails?.endereco?.complemento || '';
        document.getElementById('clientNeighborhood').value = clientDetails?.endereco?.bairro || '';
        document.getElementById('clientCity').value = clientDetails?.endereco?.cidade || '';
        document.getElementById('clientState').value = clientDetails?.endereco?.estado || '';
        document.getElementById('clientNotes').value = clientDetails?.observacoes || '';
        document.getElementById('clientMarketing').checked = clientDetails?.aceitaMarketing || false;
        
        // Alterar botão de salvar para atualizar
        const saveBtn = docu
(Content truncated due to size limit. Use line ranges to read in chunks)