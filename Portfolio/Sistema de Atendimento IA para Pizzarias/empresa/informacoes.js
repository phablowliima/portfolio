/**
 * Arquivo JavaScript para o sistema de gerenciamento de informações da empresa
 * Responsável por gerenciar os dados da empresa, endereço, horários, entrega, pagamento e redes sociais
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
    
    // Inicializar sistema de informações da empresa
    initCompanyInfoSystem();
    
    // Carregar informações da empresa
    loadCompanyInfo();
    
    // Configurar eventos para os botões de salvar
    setupSaveButtons();
    
    // Configurar eventos para os campos de horário
    setupHoursFields();
    
    // Configurar eventos para os campos de entrega
    setupDeliveryFields();
    
    // Configurar eventos para os campos de pagamento
    setupPaymentFields();
});

// Função para inicializar o sistema de informações da empresa
function initCompanyInfoSystem() {
    // Configurar evento para upload de logo
    document.getElementById('companyLogo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                document.getElementById('logoPreview').src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Configurar evento para upload de QR Code PIX
    document.getElementById('paymentPixQRCode').addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                document.getElementById('pixQRCodePreview').src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Configurar evento para busca de CEP
    document.getElementById('searchCEPBtn').addEventListener('click', function() {
        const cep = document.getElementById('companyCEP').value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            alert('CEP inválido. Digite um CEP com 8 dígitos.');
            return;
        }
        
        searchCEP(cep);
    });
    
    // Configurar evento para busca no mapa
    document.getElementById('searchMapBtn').addEventListener('click', function() {
        const latitude = document.getElementById('companyLatitude').value;
        const longitude = document.getElementById('companyLongitude').value;
        
        if (!latitude || !longitude) {
            alert('Digite a latitude e longitude para localizar no mapa.');
            return;
        }
        
        // Em um sistema real, aqui seria carregado o mapa com a localização
        alert(`Localização: ${latitude}, ${longitude}\nEm um sistema real, o mapa seria carregado aqui.`);
    });
    
    // Configurar evento para adicionar horário especial
    document.getElementById('addSpecialHoursBtn').addEventListener('click', function() {
        addSpecialHours();
    });
    
    // Configurar eventos para remover horário especial
    const removeSpecialBtns = document.querySelectorAll('.remove-special-btn');
    removeSpecialBtns.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    });
    
    // Configurar evento para adicionar taxa por distância
    document.getElementById('addDistanceFeeBtn').addEventListener('click', function() {
        addDistanceFee();
    });
    
    // Configurar eventos para remover taxa por distância
    const removeDistanceBtns = document.querySelectorAll('.remove-distance-btn');
    removeDistanceBtns.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    });
    
    // Configurar evento para adicionar taxa por bairro
    document.getElementById('addNeighborhoodFeeBtn').addEventListener('click', function() {
        addNeighborhoodFee();
    });
    
    // Configurar eventos para remover taxa por bairro
    const removeNeighborhoodBtns = document.querySelectorAll('.remove-neighborhood-btn');
    removeNeighborhoodBtns.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('tr').remove();
        });
    });
}

// Função para carregar informações da empresa
async function loadCompanyInfo() {
    try {
        // Em um sistema real, buscaríamos as informações da empresa da API
        const companyInfo = await window.apiService.getEmpresaInfo();
        
        // Atualizar campos com as informações da empresa
        updateCompanyInfoFields(companyInfo);
        
    } catch (error) {
        console.error('Erro ao carregar informações da empresa:', error);
        
        // Em caso de erro, manter as informações de demonstração que já estão no HTML
    }
}

// Função para atualizar campos com as informações da empresa
function updateCompanyInfoFields(companyInfo) {
    // Em um sistema real, atualizaríamos os campos com os dados da API
    // Por enquanto, mantemos as informações de demonstração que já estão no HTML
}

// Função para configurar eventos para os botões de salvar
function setupSaveButtons() {
    // Botão de salvar informações básicas
    document.getElementById('saveInfoBtn').addEventListener('click', function() {
        saveCompanyInfo();
    });
    
    // Botão de salvar endereço
    document.getElementById('saveAddressBtn').addEventListener('click', function() {
        saveCompanyAddress();
    });
    
    // Botão de salvar horários
    document.getElementById('saveHoursBtn').addEventListener('click', function() {
        saveCompanyHours();
    });
    
    // Botão de salvar entrega
    document.getElementById('saveDeliveryBtn').addEventListener('click', function() {
        saveCompanyDelivery();
    });
    
    // Botão de salvar pagamento
    document.getElementById('savePaymentBtn').addEventListener('click', function() {
        saveCompanyPayment();
    });
    
    // Botão de salvar redes sociais
    document.getElementById('saveSocialBtn').addEventListener('click', function() {
        saveCompanySocial();
    });
}

// Função para configurar eventos para os campos de horário
function setupHoursFields() {
    // Configurar evento para ativar/desativar controle de horários
    document.getElementById('hoursEnabled').addEventListener('change', function() {
        const hoursTable = document.getElementById('hoursTable');
        const specialHoursTable = document.getElementById('specialHoursTable');
        
        if (this.checked) {
            hoursTable.classList.remove('disabled');
            specialHoursTable.classList.remove('disabled');
        } else {
            hoursTable.classList.add('disabled');
            specialHoursTable.classList.add('disabled');
        }
    });
    
    // Configurar eventos para ativar/desativar dias da semana
    const dayOpenSwitches = document.querySelectorAll('.day-open-switch');
    dayOpenSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const row = this.closest('tr');
            const timeInputs = row.querySelectorAll('input[type="time"]');
            
            timeInputs.forEach(input => {
                input.disabled = !this.checked;
            });
        });
    });
    
    // Configurar eventos para ativar/desativar horários especiais
    const specialOpenSwitches = document.querySelectorAll('.special-open-switch');
    specialOpenSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const row = this.closest('tr');
            const timeInputs = row.querySelectorAll('input[type="time"]');
            
            timeInputs.forEach(input => {
                input.disabled = !this.checked;
            });
        });
    });
}

// Função para configurar eventos para os campos de entrega
function setupDeliveryFields() {
    // Configurar evento para ativar/desativar entrega
    document.getElementById('deliveryEnabled').addEventListener('change', function() {
        const deliveryForm = document.getElementById('companyDeliveryForm');
        const deliveryInputs = deliveryForm.querySelectorAll('input:not(#deliveryEnabled), select');
        
        deliveryInputs.forEach(input => {
            input.disabled = !this.checked;
        });
        
        const deliveryButtons = deliveryForm.querySelectorAll('button:not(#saveDeliveryBtn)');
        deliveryButtons.forEach(button => {
            button.disabled = !this.checked;
        });
    });
    
    // Configurar evento para tipo de taxa de entrega
    const deliveryFeeTypeRadios = document.querySelectorAll('input[name="deliveryFeeType"]');
    deliveryFeeTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const fixedFeeContainer = document.getElementById('fixedFeeContainer');
            const distanceFeeContainer = document.getElementById('distanceFeeContainer');
            const neighborhoodFeeContainer = document.getElementById('neighborhoodFeeContainer');
            
            // Ocultar todos os containers
            fixedFeeContainer.style.display = 'none';
            distanceFeeContainer.style.display = 'none';
            neighborhoodFeeContainer.style.display = 'none';
            
            // Mostrar container correspondente ao tipo selecionado
            switch (this.value) {
                case 'fixed':
                    fixedFeeContainer.style.display = 'block';
                    break;
                case 'distance':
                    distanceFeeContainer.style.display = 'block';
                    break;
                case 'neighborhood':
                    neighborhoodFeeContainer.style.display = 'block';
                    break;
            }
        });
    });
}

// Função para configurar eventos para os campos de pagamento
function setupPaymentFields() {
    // Configurar evento para ativar/desativar ambiente de testes
    document.getElementById('paymentOnlineSandbox').addEventListener('change', function() {
        const apiKeyInput = document.getElementById('paymentOnlineApiKey');
        const secretKeyInput = document.getElementById('paymentOnlineSecretKey');
        
        if (this.checked) {
            apiKeyInput.value = apiKeyInput.value.replace('LIVE_', 'TEST_');
            secretKeyInput.value = secretKeyInput.value.replace('LIVE_', 'TEST_');
        } else {
            apiKeyInput.value = apiKeyInput.value.replace('TEST_', 'LIVE_');
            secretKeyInput.value = secretKeyInput.value.replace('TEST_', 'LIVE_');
        }
    });
}

// Função para buscar CEP
async function searchCEP(cep) {
    try {
        // Em um sistema real, buscaríamos o CEP de uma API
        const cepData = await window.apiService.buscarCEP(cep);
        
        if (cepData) {
            document.getElementById('companyStreet').value = cepData.logradouro || '';
            document.getElementById('companyNeighborhood').value = cepData.bairro || '';
            document.getElementById('companyCity').value = cepData.localidade || '';
            document.getElementById('companyState').value = cepData.uf || '';
            
            // Focar no campo de número
            document.getElementById('companyNumber').focus();
        } else {
            alert('CEP não encontrado. Verifique o CEP digitado.');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Por favor, tente novamente.');
    }
}

// Função para adicionar horário especial
function addSpecialHours() {
    const specialHoursTable = document.getElementById('specialHoursTable').querySelector('tbody');
    
    // Criar nova linha
    const newRow = document.createElement('tr');
    
    // Definir data para amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Definir conteúdo da linha
    newRow.innerHTML = `
        <td>
            <input type="date" class="form-control form-control-sm" value="${tomorrowStr}">
        </td>
        <td>
            <input type="text" class="form-control form-control-sm" value="">
        </td>
        <td>
            <div class="form-check form-switch">
                <input class="form-check-input special-open-switch" type="checkbox" checked>
            </div>
        </td>
        <td>
            <input type="time" class="form-control form-control-sm" value="18:00">
        </td>
        <td>
            <input type="time" class="form-control form-control-sm" value="23:00">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-outline-danger remove-special-btn">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    // Adicionar linha à tabela
    specialHoursTable.appendChild(newRow);
    
    // Configurar evento para remover horário especial
    newRow.querySelector('.remove-special-btn').addEventListener('click', function() {
        newRow.remove();
    });
    
    // Configurar evento para ativar/desativar horário especial
    newRow.querySelector('.special-open-switch').addEventListener('change', function() {
        const timeInputs = newRow.querySelectorAll('input[type="time"]');
        
        timeInputs.forEach(input => {
            input.disabled = !this.checked;
        });
    });
}

// Função para adicionar taxa por distância
function addDistanceFee() {
    const distanceFeeTable = document.getElementById('distanceFeeTable').querySelector('tbody');
    
    // Criar nova linha
    const newRow = document.createElement('tr');
    
    // Definir conteúdo da linha
    newRow.innerHTML = `
        <td>
            <input type="number" class="form-control form-control-sm" value="10" min="0" step="0.1">
        </td>
        <td>
            <input type="number" class="form-control form-control-sm" value="8.00" min="0" step="0.01">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-outline-danger remove-distance-btn">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    // Adicionar linha à tabela
    distanceFeeTable.appendChild(newRow);
    
    // Configurar evento para remover taxa por distância
    newRow.querySelector('.remove-distance-btn').addEventListener('click', function() {
        newRow.remove();
    });
}

// Função para adicionar taxa por bairro
function addNeighborhoodFee() {
    const neighborhoodFeeTable = document.getElementById('neighborhoodFeeTable').querySelector('tbody');
    
    // Criar nova linha
    const newRow = document.createElement('tr');
    
    // Definir conteúdo da linha
    newRow.innerHTML = `
        <td>
            <input type="text" class="form-control form-control-sm" value="">
        </td>
        <td>
            <input type="number" class="form-control form-control-sm" value="5.00" min="0" step="0.01">
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-outline-danger remove-neighborhood-btn">
            
(Content truncated due to size limit. Use line ranges to read in chunks)