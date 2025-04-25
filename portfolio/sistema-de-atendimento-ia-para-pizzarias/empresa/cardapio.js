/**
 * Arquivo JavaScript para o sistema de gerenciamento de cardápio
 * Responsável por gerenciar a listagem, criação, edição e exclusão de produtos
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
    
    // Inicializar sistema de cardápio
    initMenuSystem();
    
    // Carregar produtos
    loadProducts();
    
    // Inicializar gráfico de categorias
    initCategoriesChart();
    
    // Configurar eventos para o modal de produto
    setupProductModal();
    
    // Configurar eventos para o modal de categorias
    setupCategoriesModal();
});

// Função para inicializar o sistema de cardápio
function initMenuSystem() {
    // Configurar evento para botão de novo produto
    document.getElementById('newProductBtn').addEventListener('click', function() {
        // Limpar formulário
        document.getElementById('productForm').reset();
        document.getElementById('productModalLabel').textContent = 'Novo Produto';
        document.getElementById('imagePreviewContainer').style.display = 'none';
        
        // Remover atributos de edição
        const saveBtn = document.getElementById('saveProductBtn');
        saveBtn.removeAttribute('data-product-id');
        saveBtn.removeAttribute('data-action');
        
        // Abrir modal de produto
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();
    });
    
    // Configurar eventos para botões de visualização de produto
    const viewButtons = document.querySelectorAll('.view-product-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            viewProduct(productId);
        });
    });
    
    // Configurar eventos para botões de edição de produto
    const editButtons = document.querySelectorAll('.edit-product-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            editProduct(productId);
        });
    });
    
    // Configurar eventos para botões de exclusão de produto
    const deleteButtons = document.querySelectorAll('.delete-product-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            deleteProduct(productId);
        });
    });
    
    // Configurar evento para filtro de categoria
    document.getElementById('filterCategory').addEventListener('change', function() {
        filterProducts();
    });
    
    // Configurar evento para busca de produtos
    document.getElementById('searchProduct').addEventListener('input', function() {
        filterProducts();
    });
    
    // Configurar evento para botão de categorias
    document.getElementById('categoriesBtn').addEventListener('click', function() {
        // Abrir modal de categorias
        const categoriesModal = new bootstrap.Modal(document.getElementById('categoriesModal'));
        categoriesModal.show();
    });
    
    // Configurar evento para botão de visualização
    document.getElementById('previewBtn').addEventListener('click', function() {
        // Abrir visualização do cardápio em nova aba
        window.open('../public/cardapio.html', '_blank');
    });
}

// Função para carregar produtos
async function loadProducts() {
    try {
        // Em um sistema real, buscaríamos os produtos da API
        const products = await window.apiService.getProdutos();
        
        // Atualizar tabela com os produtos
        updateProductsTable(products);
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        
        // Em caso de erro, manter os produtos de demonstração que já estão no HTML
    }
}

// Função para atualizar a tabela de produtos
function updateProductsTable(products) {
    // Em um sistema real, atualizaríamos a tabela com os dados da API
    // Por enquanto, mantemos os produtos de demonstração que já estão no HTML
}

// Função para inicializar o gráfico de categorias
function initCategoriesChart() {
    const ctx = document.getElementById('categoriesChart').getContext('2d');
    
    // Dados fictícios para o gráfico
    const data = {
        labels: ['Pizzas', 'Bebidas', 'Sobremesas', 'Combos'],
        datasets: [{
            data: [12, 8, 5, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
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

// Função para filtrar produtos
function filterProducts() {
    const categoryFilter = document.getElementById('filterCategory').value;
    const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
    
    // Obter todas as linhas da tabela
    const rows = document.querySelectorAll('#productsTable tbody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Aplicar filtro de categoria
        if (categoryFilter) {
            const categoryCell = row.querySelector('td:nth-child(3)');
            const categoryText = categoryCell.textContent.toLowerCase();
            
            if (categoryText !== categoryFilter.toLowerCase()) {
                showRow = false;
            }
        }
        
        // Aplicar filtro de busca
        if (searchTerm && showRow) {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const description = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            
            if (!name.includes(searchTerm) && !description.includes(searchTerm)) {
                showRow = false;
            }
        }
        
        // Mostrar ou ocultar a linha
        row.style.display = showRow ? '' : 'none';
    });
}

// Função para configurar o modal de produto
function setupProductModal() {
    // Configurar evento para pré-visualização de imagem
    document.getElementById('productImage').addEventListener('change', function(e) {
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
    
    // Configurar evento para adicionar variação
    document.getElementById('addVariationBtn').addEventListener('click', function() {
        addVariationRow();
    });
    
    // Configurar eventos para remover variação
    setupRemoveVariationButtons();
    
    // Configurar evento para salvar produto
    document.getElementById('saveProductBtn').addEventListener('click', function() {
        saveProduct();
    });
}

// Função para adicionar linha de variação
function addVariationRow() {
    const tbody = document.querySelector('#variationsTable tbody');
    
    // Criar nova linha
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <input type="text" class="form-control form-control-sm" placeholder="Ex: Pequena, Grande, 2L..." required>
        </td>
        <td>
            <input type="number" class="form-control form-control-sm" step="0.01" min="0" required>
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-outline-danger remove-variation-btn">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    // Adicionar à tabela
    tbody.appendChild(newRow);
    
    // Configurar evento para remover variação
    const removeBtn = newRow.querySelector('.remove-variation-btn');
    removeBtn.addEventListener('click', function() {
        // Verificar se há mais de uma variação antes de remover
        const variationCount = document.querySelectorAll('#variationsTable tbody tr').length;
        
        if (variationCount > 1) {
            newRow.remove();
        } else {
            alert('O produto deve ter pelo menos uma variação.');
        }
    });
}

// Função para configurar botões de remoção de variações
function setupRemoveVariationButtons() {
    const removeButtons = document.querySelectorAll('.remove-variation-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Verificar se há mais de uma variação antes de remover
            const variationCount = document.querySelectorAll('#variationsTable tbody tr').length;
            
            if (variationCount > 1) {
                this.closest('tr').remove();
            } else {
                alert('O produto deve ter pelo menos uma variação.');
            }
        });
    });
}

// Função para salvar produto
async function saveProduct() {
    try {
        // Validar formulário
        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Coletar dados do formulário
        const productData = {
            nome: document.getElementById('productName').value,
            categoria: document.getElementById('productCategory').value,
            descricao: document.getElementById('productDescription').value,
            status: document.getElementById('productStatus').value,
            ordem: parseInt(document.getElementById('productOrder').value),
            destaque: document.getElementById('productFeatured').checked,
            variacoes: []
        };
        
        // Coletar variações
        const rows = document.querySelectorAll('#variationsTable tbody tr');
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            
            productData.variacoes.push({
                nome: inputs[0].value,
                preco: parseFloat(inputs[1].value)
            });
        });
        
        // Verificar se é edição ou criação
        const saveBtn = document.getElementById('saveProductBtn');
        const isEdit = saveBtn.hasAttribute('data-action') && saveBtn.getAttribute('data-action') === 'update';
        
        if (isEdit) {
            const productId = saveBtn.getAttribute('data-product-id');
            
            // Em um sistema real, atualizaríamos o produto na API
            await window.apiService.atualizarProduto(productId, productData);
            
            // Mostrar mensagem de sucesso
            alert('Produto atualizado com sucesso!');
        } else {
            // Em um sistema real, criaríamos o produto na API
            await window.apiService.criarProduto(productData);
            
            // Mostrar mensagem de sucesso
            alert('Produto criado com sucesso!');
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
        
        // Recarregar produtos
        loadProducts();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Por favor, tente novamente.');
    }
}

// Função para visualizar produto
async function viewProduct(productId) {
    try {
        // Em um sistema real, buscaríamos os detalhes do produto da API
        const productDetails = await window.apiService.getProdutoById(productId);
        
        // Preencher modal com os detalhes do produto
        document.getElementById('productModalLabel').textContent = 'Visualizar Produto';
        
        // Preencher campos do formulário
        document.getElementById('productName').value = productDetails?.nome || '';
        document.getElementById('productCategory').value = productDetails?.categoria || '';
        document.getElementById('productDescription').value = productDetails?.descricao || '';
        document.getElementById('productStatus').value = productDetails?.status || 'active';
        document.getElementById('productOrder').value = productDetails?.ordem || 0;
        document.getElementById('productFeatured').checked = productDetails?.destaque || false;
        
        // Desabilitar campos para visualização
        document.querySelectorAll('#productForm input, #productForm select, #productForm textarea').forEach(input => {
            input.disabled = true;
        });
        
        // Limpar variações existentes
        const tbody = document.querySelector('#variationsTable tbody');
        tbody.innerHTML = '';
        
        // Adicionar variações do produto
        if (productDetails?.variacoes && productDetails.variacoes.length > 0) {
            productDetails.variacoes.forEach(variation => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>
                        <input type="text" class="form-control form-control-sm" value="${variation.nome}" disabled>
                    </td>
                    <td>
                        <input type="number" class="form-control form-control-sm" value="${variation.preco}" disabled>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-variation-btn" disabled>
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(newRow);
            });
        }
        
        // Desabilitar botões de ação
        document.g
(Content truncated due to size limit. Use line ranges to read in chunks)