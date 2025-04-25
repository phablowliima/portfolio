/**
 * Serviço de Autenticação para o Sistema de Pizzarias
 * Responsável por gerenciar login, logout e dados do usuário
 */

// Classe principal do serviço de autenticação
class AuthService {
    constructor() {
        // Verificar se já existe um usuário logado
        this.checkAuth();
    }

    /**
     * Verifica se o usuário está autenticado
     * @returns {boolean} - Verdadeiro se o usuário estiver autenticado
     */
    isAuthenticated() {
        return localStorage.getItem('authToken') !== null;
    }

    /**
     * Verifica autenticação e redireciona se necessário
     */
    checkAuth() {
        const currentPath = window.location.pathname;
        
        // Se estiver na página de login e já estiver autenticado, redireciona para o dashboard
        if (currentPath.includes('index.html') && this.isAuthenticated()) {
            window.location.href = 'dashboard/index.html';
            return;
        }
        
        // Se não estiver na página de login e não estiver autenticado, redireciona para o login
        if (!currentPath.includes('index.html') && !this.isAuthenticated()) {
            window.location.href = '../index.html';
            return;
        }
    }

    /**
     * Realiza login no sistema
     * @param {string} email - Email do usuário
     * @param {string} senha - Senha do usuário
     * @returns {Promise} - Promise com os dados do usuário
     */
    async login(email, senha) {
        try {
            // Realizar requisição de login
            const response = await window.apiService.login(email, senha);
            
            // Armazenar dados do usuário
            this.setUserData(response.usuario);
            
            return response.usuario;
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            throw error;
        }
    }

    /**
     * Realiza logout do sistema
     */
    async logout() {
        try {
            // Realizar requisição de logout
            await window.apiService.logout();
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        } finally {
            // Limpar dados do usuário mesmo se a requisição falhar
            this.clearUserData();
            
            // Redirecionar para a página de login
            window.location.href = window.location.pathname.includes('/dashboard/') ? '../index.html' : 'index.html';
        }
    }

    /**
     * Obtém dados do usuário logado
     * @returns {object|null} - Dados do usuário ou null se não estiver logado
     */
    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Define dados do usuário logado
     * @param {object} userData - Dados do usuário
     */
    setUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    /**
     * Limpa dados do usuário logado
     */
    clearUserData() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    /**
     * Atualiza dados do usuário logado
     * @param {object} newData - Novos dados do usuário
     */
    updateUserData(newData) {
        const userData = this.getUserData();
        if (userData) {
            const updatedData = { ...userData, ...newData };
            this.setUserData(updatedData);
        }
    }

    /**
     * Verifica se o usuário tem permissão para acessar um recurso
     * @param {string} permission - Permissão necessária
     * @returns {boolean} - Verdadeiro se o usuário tiver permissão
     */
    hasPermission(permission) {
        const userData = this.getUserData();
        
        if (!userData || !userData.permissoes) {
            return false;
        }
        
        return userData.permissoes.includes(permission);
    }

    /**
     * Verifica se o usuário tem um cargo específico
     * @param {string|array} roles - Cargo ou array de cargos
     * @returns {boolean} - Verdadeiro se o usuário tiver o cargo
     */
    hasRole(roles) {
        const userData = this.getUserData();
        
        if (!userData || !userData.cargo) {
            return false;
        }
        
        if (Array.isArray(roles)) {
            return roles.includes(userData.cargo);
        }
        
        return userData.cargo === roles;
    }
}

// Criar instância global do serviço de autenticação
window.authService = new AuthService();
