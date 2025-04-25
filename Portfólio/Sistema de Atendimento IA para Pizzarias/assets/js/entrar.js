// entrar.js - Script para autenticação do Sistema de Atendimento para Pizzarias

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o formulário de login
    const loginForm = document.getElementById('loginForm');
    
    // Verifica se o usuário já está autenticado
    if(localStorage.getItem('userId') && localStorage.getItem('userName')) {
        window.location.href = '/dashboard/index.html';
        return;
    }
    
    // Adiciona evento de submit ao formulário
    loginForm.addEventListener('submit', function(event) {
        // Previne o comportamento padrão do formulário
        event.preventDefault();
        
        // Coleta os dados do formulário
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validação básica no lado do cliente
        if (!email || !password) {
            showErrorMessage('Por favor, preencha todos os campos');
            return;
        }
        
        // Desativa o botão para evitar múltiplos envios
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Entrando...';
        
        // Cria o objeto com os dados para envio
        const userData = {
            email: email,
            password: password
        };
        
        // Realiza a requisição HTTP para a API
        fetch('https://api.astrodev.com.br/webhook/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            // Reativa o botão
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
            
            // Verifica se a resposta da API foi bem-sucedida
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Login ou senha incorreta');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta da API:', data); // Log para debug
            
            // Verifica se o retorno é um array e contém dados
            if (Array.isArray(data) && data.length > 0 && data[0].resultado) {
                const userInfo = data[0].resultado;
                
                // Verifica se temos um ID e nome válidos
                if (!userInfo.id || !userInfo.nome) {
                    throw new Error('Dados de usuário incompletos');
                }
                
                // Limpa quaisquer dados antigos
                localStorage.clear();
                
                // Armazena as informações no localStorage
                localStorage.setItem('userId', userInfo.id);
                localStorage.setItem('userName', userInfo.nome);
                localStorage.setItem('userEmail', userInfo.email);
                localStorage.setItem('userCargo', userInfo.cargo);
                localStorage.setItem('userTelefone', userInfo.telefone);
                localStorage.setItem('userAtivo', userInfo.ativo ? 'true' : 'false');
                localStorage.setItem('userDataCadastro', userInfo.data_cadastro);
                
                // Se a opção "lembrar-me" estiver marcada, armazena a credencial
                if (rememberMe) {
                    localStorage.setItem('rememberEmail', email);
                } else {
                    localStorage.removeItem('rememberEmail');
                }
                
                console.log('Dados salvos no localStorage:', {
                    userId: localStorage.getItem('userId'),
                    userName: localStorage.getItem('userName')
                }); // Log para debug
                
                // Verifica se os dados foram salvos corretamente
                if (!localStorage.getItem('userId') || !localStorage.getItem('userName')) {
                    throw new Error('Falha ao salvar dados de usuário');
                }
                
                // Redireciona para a página do dashboard
                window.location.href = '/dashboard/index.html';
            } else {
                throw new Error('Formato de resposta inválido ou credenciais incorretas');
            }
        })
        .catch(error => {
            console.error('Erro:', error); // Log para debug
            
            // Exibe mensagem de erro
            showErrorMessage(error.message || 'Ocorreu um erro durante o login. Tente novamente.');
            
            // Reativa o botão se ainda estiver desativado
            if (submitButton.disabled) {
                submitButton.disabled = false;
                submitButton.textContent = 'Entrar';
            }
        });
    });
    
    // Função para exibir mensagem de erro
    function showErrorMessage(message) {
        // Verifica se já existe uma mensagem de erro
        let errorDiv = document.querySelector('.login-error');
        
        if (!errorDiv) {
            // Cria um elemento para a mensagem de erro
            errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3 login-error';
            errorDiv.role = 'alert';
            
            // Insere antes do primeiro elemento do formulário
            loginForm.insertBefore(errorDiv, loginForm.firstChild);
        }
        
        // Define a mensagem de erro
        errorDiv.textContent = message;
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Verifica se há email salvo para preencher automaticamente
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});