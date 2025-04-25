/**
 * Arquivo JavaScript para o dashboard do sistema de atendimento de pizzarias
 * Responsável por carregar dados e gerenciar a interface do dashboard
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
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Inicializar gráfico de vendas
    initSalesChart();
});

// Função para carregar dados do dashboard
async function loadDashboardData() {
    try {
        const token = window.authService.getAuthToken();
        
        // Fazer requisição para a API
        const response = await fetch(`${window.apiService.API_BASE_URL}dashboard/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Se a resposta não for ok, lançar erro
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do dashboard');
        }
        
        // Converter resposta para JSON
        const data = await response.json();
        
        // Atualizar elementos da interface com os dados recebidos
        updateDashboardUI(data);
        
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        
        // Em caso de erro, usar dados fictícios para demonstração
        const mockData = getMockDashboardData();
        updateDashboardUI(mockData);
    }
}

// Função para atualizar a interface do dashboard com os dados recebidos
function updateDashboardUI(data) {
    // Atualizar cards de resumo
    document.getElementById('pedidosHoje').textContent = data.pedidosHoje || 0;
    document.getElementById('faturamentoHoje').textContent = formatCurrency(data.faturamentoHoje || 0);
    document.getElementById('clientesNovos').textContent = data.clientesNovos || 0;
    document.getElementById('tempoMedio').textContent = `${data.tempoMedio || 0} min`;
    
    // Atualizar lista de pedidos recentes (opcional, pois já temos dados estáticos no HTML)
    if (data.pedidosRecentes && data.pedidosRecentes.length > 0) {
        updateRecentOrders(data.pedidosRecentes);
    }
    
    // Atualizar tabela de produtos populares (opcional, pois já temos dados estáticos no HTML)
    if (data.produtosPopulares && data.produtosPopulares.length > 0) {
        updatePopularProducts(data.produtosPopulares);
    }
    
    // Atualizar tabela de clientes ativos (opcional, pois já temos dados estáticos no HTML)
    if (data.clientesAtivos && data.clientesAtivos.length > 0) {
        updateActiveCustomers(data.clientesAtivos);
    }
    
    // Atualizar dados do gráfico (opcional, pois já inicializamos com dados estáticos)
    if (data.vendasPorHora) {
        updateSalesChart(data.vendasPorHora);
    }
}

// Função para inicializar o gráfico de vendas
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Dados fictícios para o gráfico
    const labels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    const data = [5, 8, 12, 15, 10, 7, 9, 11, 14, 18, 20, 16, 10];
    
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vendas por Hora',
                data: data,
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                borderColor: '#e53935',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#e53935',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#e53935',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Vendas: ${context.raw} pedidos`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 2]
                    },
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

// Função para atualizar o gráfico de vendas com novos dados
function updateSalesChart(vendasPorHora) {
    if (window.salesChart) {
        window.salesChart.data.labels = vendasPorHora.map(item => item.hora);
        window.salesChart.data.datasets[0].data = vendasPorHora.map(item => item.quantidade);
        window.salesChart.update();
    }
}

// Função para atualizar a lista de pedidos recentes
function updateRecentOrders(pedidosRecentes) {
    const container = document.getElementById('recentOrdersList');
    
    // Limpar conteúdo atual
    container.innerHTML = '';
    
    // Adicionar novos pedidos
    pedidosRecentes.forEach(pedido => {
        const statusClass = getStatusClass(pedido.status);
        
        const html = `
            <div class="list-group-item p-3">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">Pedido #${pedido.id}</h6>
                    <small class="text-muted">${pedido.hora}</small>
                </div>
                <p class="mb-1">${pedido.itens}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">${pedido.cliente}</small>
                    <span class="badge ${statusClass}">${pedido.status}</span>
                </div>
            </div>
        `;
        
        container.innerHTML += html;
    });
}

// Função para atualizar a tabela de produtos populares
function updatePopularProducts(produtosPopulares) {
    const tbody = document.getElementById('popularProductsTable');
    
    // Limpar conteúdo atual
    tbody.innerHTML = '';
    
    // Adicionar novos produtos
    produtosPopulares.forEach(produto => {
        const html = `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.vendas}</td>
                <td>${formatCurrency(produto.valor)}</td>
            </tr>
        `;
        
        tbody.innerHTML += html;
    });
}

// Função para atualizar a tabela de clientes ativos
function updateActiveCustomers(clientesAtivos) {
    const tbody = document.getElementById('activeCustomersTable');
    
    // Limpar conteúdo atual
    tbody.innerHTML = '';
    
    // Adicionar novos clientes
    clientesAtivos.forEach(cliente => {
        const html = `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.pedidos}</td>
                <td>${cliente.ultimoPedido}</td>
                <td>${formatCurrency(cliente.totalGasto)}</td>
            </tr>
        `;
        
        tbody.innerHTML += html;
    });
}

// Função para obter a classe CSS do status do pedido
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'pendente':
            return 'bg-secondary';
        case 'em preparo':
            return 'bg-warning';
        case 'em entrega':
            return 'bg-info';
        case 'entregue':
            return 'bg-success';
        case 'cancelado':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Função para formatar valores monetários
function formatCurrency(value) {
    return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
}

// Função para obter dados fictícios para o dashboard (usado em caso de erro na API)
function getMockDashboardData() {
    return {
        pedidosHoje: 42,
        faturamentoHoje: 2345.67,
        clientesNovos: 8,
        tempoMedio: 35,
        pedidosRecentes: [
            {
                id: 1234,
                hora: '12:30',
                itens: '1x Pizza Calabresa, 1x Refrigerante',
                cliente: 'João Silva',
                status: 'Em Preparo'
            },
            {
                id: 1233,
                hora: '12:15',
                itens: '1x Pizza Portuguesa, 2x Refrigerante',
                cliente: 'Maria Oliveira',
                status: 'Entregue'
            },
            {
                id: 1232,
                hora: '11:45',
                itens: '2x Pizza Margherita, 1x Refrigerante',
                cliente: 'Pedro Santos',
                status: 'Cancelado'
            }
        ],
        produtosPopulares: [
            {
                nome: 'Pizza Calabresa',
                categoria: 'Pizzas',
                vendas: 42,
                valor: 45.90
            },
            {
                nome: 'Pizza Portuguesa',
                categoria: 'Pizzas',
                vendas: 38,
                valor: 49.90
            },
            {
                nome: 'Pizza Margherita',
                categoria: 'Pizzas',
                vendas: 35,
                valor: 42.90
            },
            {
                nome: 'Refrigerante Cola',
                categoria: 'Bebidas',
                vendas: 67,
                valor: 8.90
            }
        ],
        clientesAtivos: [
            {
                nome: 'João Silva',
                pedidos: 12,
                ultimoPedido: 'Hoje, 12:30',
                totalGasto: 587.80
            },
            {
                nome: 'Maria Oliveira',
                pedidos: 8,
                ultimoPedido: 'Hoje, 12:15',
                totalGasto: 423.50
            },
            {
                nome: 'Pedro Santos',
                pedidos: 5,
                ultimoPedido: 'Hoje, 11:45',
                totalGasto: 289.70
            },
            {
                nome: 'Ana Souza',
                pedidos: 3,
                ultimoPedido: 'Ontem, 19:20',
                totalGasto: 156.30
            }
        ],
        vendasPorHora: [
            { hora: '10:00', quantidade: 5 },
            { hora: '11:00', quantidade: 8 },
            { hora: '12:00', quantidade: 12 },
            { hora: '13:00', quantidade: 15 },
            { hora: '14:00', quantidade: 10 },
            { hora: '15:00', quantidade: 7 },
            { hora: '16:00', quantidade: 9 },
            { hora: '17:00', quantidade: 11 },
            { hora: '18:00', quantidade: 14 },
            { hora: '19:00', quantidade: 18 },
            { hora: '20:00', quantidade: 20 },
            { hora: '21:00', quantidade: 16 },
            { hora: '22:00', quantidade: 10 }
        ]
    };
}
