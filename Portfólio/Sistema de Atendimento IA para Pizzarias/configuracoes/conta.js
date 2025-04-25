/**
 * Arquivo JavaScript para o sistema de configurações da conta
 * Responsável por gerenciar perfil, segurança, notificações, aparência, integrações e usuários
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
        
        // Preencher campos do perfil
        document.getElementById('profileName').value = userData.nome || '';
        document.getElementById('profileEmail').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.telefone || '';
        document.getElementById('profileRole').value = userData.cargo || 'Administrador';
        document.getElementById('profileBio').value = userData.biografia || '';
        
        // Carregar foto de perfil se disponível
        if (userData.foto) {
            document.getElementById('profilePhotoPreview').src = userData.foto;
        }
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
    
    // Configurar eventos para as abas
    setupTabEvents();
    
    // Configurar eventos para o perfil
    setupProfileEvents();
    
    // Configurar eventos para segurança
    setupSecurityEvents();
    
    // Configurar eventos para notificações
    setupNotificationsEvents();
    
    // Configurar eventos para aparência
    setupAppearanceEvents();
    
    // Configurar eventos para integrações
    setupIntegrationsEvents();
    
    // Configurar eventos para usuários
    setupUsersEvents();
});

// Função para configurar eventos para as abas
function setupTabEvents() {
    // Verificar se há um hash na URL para ativar a aba correspondente
    const hash = window.location.hash;
    if (hash) {
        const tabId = hash.replace('#', '');
        const tab = document.querySelector(`#configTabs button[data-bs-target="#${tabId}-tab-pane"]`);
        if (tab) {
            const tabInstance = new bootstrap.Tab(tab);
            tabInstance.show();
        }
    }
    
    // Atualizar hash na URL quando uma aba for clicada
    const tabs = document.querySelectorAll('#configTabs button[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetId = e.target.getAttribute('data-bs-target').replace('#', '').replace('-tab-pane', '');
            window.location.hash = targetId;
        });
    });
}

// Função para configurar eventos para o perfil
function setupProfileEvents() {
    // Configurar evento para alterar foto de perfil
    document.getElementById('changePhotoBtn').addEventListener('click', function() {
        document.getElementById('profilePhotoInput').click();
    });
    
    // Configurar evento para pré-visualização de foto de perfil
    document.getElementById('profilePhotoInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                document.getElementById('profilePhotoPreview').src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Configurar evento para salvar perfil
    document.getElementById('saveProfileBtn').addEventListener('click', function() {
        saveProfile();
    });
}

// Função para configurar eventos para segurança
function setupSecurityEvents() {
    // Configurar evento para alterar senha
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        changePassword();
    });
    
    // Configurar evento para ativar/desativar autenticação de dois fatores
    document.getElementById('enable2FA').addEventListener('change', function() {
        const setup2FAContainer = document.getElementById('setup2FAContainer');
        
        if (this.checked) {
            setup2FAContainer.style.display = 'block';
            // Em um sistema real, aqui seria gerado o QR Code para o 2FA
        } else {
            setup2FAContainer.style.display = 'none';
        }
    });
    
    // Configurar evento para verificar e ativar 2FA
    document.getElementById('verify2FABtn').addEventListener('click', function() {
        verify2FA();
    });
    
    // Configurar evento para encerrar todas as sessões
    document.getElementById('logoutAllBtn').addEventListener('click', function() {
        logoutAllSessions();
    });
}

// Função para configurar eventos para notificações
function setupNotificationsEvents() {
    // Configurar evento para salvar preferências de notificação
    document.getElementById('saveNotificationsBtn').addEventListener('click', function() {
        saveNotificationPreferences();
    });
}

// Função para configurar eventos para aparência
function setupAppearanceEvents() {
    // Configurar evento para salvar preferências de aparência
    document.getElementById('saveAppearanceBtn').addEventListener('click', function() {
        saveAppearancePreferences();
    });
    
    // Configurar evento para restaurar padrão de aparência
    document.getElementById('resetAppearanceBtn').addEventListener('click', function() {
        resetAppearancePreferences();
    });
    
    // Configurar eventos para seleção de tema
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            const radioInput = this.querySelector('input[type="radio"]');
            
            radioInput.checked = true;
            
            // Aplicar tema imediatamente para visualização
            applyTheme(theme);
        });
    });
    
    // Configurar eventos para seleção de cor
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const radioInput = this.querySelector('input[type="radio"]');
            
            radioInput.checked = true;
            
            // Aplicar cor imediatamente para visualização
            applyColor(color);
        });
    });
    
    // Configurar evento para tamanho da fonte
    document.getElementById('fontSize').addEventListener('change', function() {
        const fontSize = this.value;
        
        // Aplicar tamanho da fonte imediatamente para visualização
        applyFontSize(fontSize);
    });
    
    // Configurar evento para modo compacto
    document.getElementById('compactMode').addEventListener('change', function() {
        const compactMode = this.checked;
        
        // Aplicar modo compacto imediatamente para visualização
        applyCompactMode(compactMode);
    });
}

// Função para configurar eventos para integrações
function setupIntegrationsEvents() {
    // Configurar eventos para ativar/desativar integrações
    const integrationSwitches = document.querySelectorAll('#integrations-tab-pane .form-check-input');
    integrationSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const integrationId = this.id;
            const isEnabled = this.checked;
            
            // Em um sistema real, aqui seria atualizado o status da integração na API
            console.log(`Integração ${integrationId} ${isEnabled ? 'ativada' : 'desativada'}`);
        });
    });
}

// Função para configurar eventos para usuários
function setupUsersEvents() {
    // Configurar evento para adicionar usuário
    document.getElementById('addUserBtn').addEventListener('click', function() {
        openUserModal();
    });
    
    // Configurar eventos para editar usuário
    const editUserButtons = document.querySelectorAll('.edit-user-btn');
    editUserButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });
    
    // Configurar eventos para excluir usuário
    const deleteUserButtons = document.querySelectorAll('.delete-user-btn');
    deleteUserButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            deleteUser(userId);
        });
    });
    
    // Configurar evento para salvar usuário
    document.getElementById('saveUserBtn').addEventListener('click', function() {
        saveUser();
    });
}

// Função para salvar perfil
async function saveProfile() {
    try {
        // Validar formulário
        const form = document.getElementById('profileForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Coletar dados do formulário
        const profileData = {
            nome: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            telefone: document.getElementById('profilePhone').value,
            biografia: document.getElementById('profileBio').value
        };
        
        // Em um sistema real, enviaríamos os dados para a API
        await window.apiService.atualizarPerfil(profileData);
        
        // Verificar se há foto para upload
        const photoInput = document.getElementById('profilePhotoInput');
        if (photoInput.files.length > 0) {
            const photoFile = photoInput.files[0];
            
            // Em um sistema real, enviaríamos o arquivo para a API
            await window.apiService.uploadFotoPerfil(photoFile);
        }
        
        // Atualizar dados do usuário no localStorage
        const userData = window.authService.getUserData();
        userData.nome = profileData.nome;
        userData.email = profileData.email;
        userData.telefone = profileData.telefone;
        userData.biografia = profileData.biografia;
        
        if (photoInput.files.length > 0) {
            userData.foto = document.getElementById('profilePhotoPreview').src;
        }
        
        window.authService.setUserData(userData);
        
        // Atualizar nome do usuário na interface
        document.getElementById('userName').textContent = userData.nome;
        
        // Mostrar mensagem de sucesso
        alert('Perfil atualizado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        alert('Erro ao salvar perfil. Por favor, tente novamente.');
    }
}

// Função para alterar senha
async function changePassword() {
    try {
        // Validar formulário
        const form = document.getElementById('passwordForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Coletar dados do formulário
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Verificar se as senhas coincidem
        if (newPassword !== confirmPassword) {
            alert('A nova senha e a confirmação não coincidem.');
            return;
        }
        
        // Verificar requisitos de segurança da senha
        if (newPassword.length < 8) {
            alert('A nova senha deve ter pelo menos 8 caracteres.');
            return;
        }
        
        // Em um sistema real, enviaríamos os dados para a API
        await window.apiService.alterarSenha({
            senhaAtual: currentPassword,
            novaSenha: newPassword
        });
        
        // Limpar formulário
        form.reset();
        
        // Mostrar mensagem de sucesso
        alert('Senha alterada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        alert('Erro ao alterar senha. Por favor, verifique sua senha atual e tente novamente.');
    }
}

// Função para verificar e ativar 2FA
async function verify2FA() {
    try {
        // Coletar código de verificação
        const verificationCode = document.getElementById('verificationCode').value;
        
        if (!verificationCode) {
            alert('Digite o código de verificação.');
            return;
        }
        
        // Em um sistema real, enviaríamos o código para a API
        await window.apiService.verificar2FA(verificationCode);
        
        // Mostrar mensagem de sucesso
        alert('Autenticação de dois fatores ativada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao verificar código 2FA:', error);
        alert('Código de verificação inválido. Por favor, tente novamente.');
    }
}

// Função para encerrar todas as sessões
async function logoutAllSessions() {
    try {
        // Confirmar ação
        if (confirm('Tem certeza que deseja encerrar todas as sessões? Você será desconectado e precisará fazer login novamente.')) {
            // Em um sistema real, enviaríamos a solicitação para a API
            await window.apiService.encerrarTodasSessoes();
            
            // Fazer logout
            window.authService.logout();
        }
    } catch (error) {
        console.error('Erro ao encerrar sessões:', error);
        alert('Erro ao encerrar sessões. Por favor, tente novamente.');
    }
}

// Função para salvar preferências de notificação
async function saveNotificationPreferences() {
    try {
        // Coletar dados do formulário
        const notificationPreferences = {
            sistema: {
                novosPedidos: document.getElementById('notifyNewOrders').checked,
                alteracoesStatusPedidos: document.getElementById('notifyOrderStatus').checked,
                novosClientes: document.getElementById('notifyNewCustomers').checked,
                estoqueBaixo: document.getElementById('notifyLowStock').checked,
                atualizacoesSistema: document.getElementById('notifySystemUpdates').checked
            },
            canais: {
                email: document.getElementById('notifyEmail').checked,
                navegador: document.getElementById('notifyBrowser').checked,
                sms: document.getElementById('notifySMS').checked,
                whatsapp: document.getElementById('notifyWhatsApp').checked
            }
        };
        
        // Em um sistema real, enviaríamos os dados para a API
        await window.apiService.atualizarPreferenciasNotificacao(notificationPreferences);
        
        // Mostrar mensagem de sucesso
        alert('Preferências de notificação salvas com sucesso!');
        
    } catch (error) {
        console.error('Erro ao salvar preferências de notificação:', error);
        alert('Erro ao salvar preferências de notificação. Por favor, tente novamente.');
    }
}

// Função para salvar preferências de aparência
async function saveAppearancePreferences() {
    try {
        // Coletar dados do f
(Content truncated due to size limit. Use line ranges to read in chunks)