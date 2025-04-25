/**
 * Praia & Sabor - JavaScript
 * Responsável pelas interações e animações do site do restaurante
 */

// Aguarda o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // Controle da Navbar - Muda a cor ao rolar
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.padding = '.5rem 1rem';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.padding = '1rem';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Implementação de Smooth Scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70; // Compensação para a altura da navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile após clicar (se estiver aberto)
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Validação básica para o formulário de reserva
    const reservationForm = document.querySelector('.reservation__form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            const email = document.getElementById('email').value;
            const data = document.getElementById('data').value;
            const horario = document.getElementById('horario').value;
            const pessoas = document.getElementById('pessoas').value;
            
            let isValid = true;
            let errorMessage = '';
            
            // Validações simples
            if (!nome.trim()) {
                isValid = false;
                errorMessage += 'Nome é obrigatório.\n';
            }
            
            if (!telefone.trim()) {
                isValid = false;
                errorMessage += 'Telefone é obrigatório.\n';
            }
            
            if (!email.trim()) {
                isValid = false;
                errorMessage += 'Email é obrigatório.\n';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Email inválido.\n';
            }
            
            if (!data) {
                isValid = false;
                errorMessage += 'Data é obrigatória.\n';
            }
            
            if (!horario) {
                isValid = false;
                errorMessage += 'Horário é obrigatório.\n';
            }
            
            if (!pessoas) {
                isValid = false;
                errorMessage += 'Número de pessoas é obrigatório.\n';
            }
            
            if (isValid) {
                // Aqui você pode adicionar o código para enviar os dados para o servidor
                // Como é apenas uma demonstração, vamos simular um envio bem-sucedido
                
                alert('Reserva recebida com sucesso! Entraremos em contato para confirmar em breve.');
                reservationForm.reset();
            } else {
                alert('Por favor, corrija os seguintes erros:\n' + errorMessage);
            }
        });
    }
    
    // Validação básica para o formulário de contato
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome-contato').value;
            const email = document.getElementById('email-contato').value;
            const telefone = document.getElementById('telefone-contato').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem-contato').value;
            
            let isValid = true;
            let errorMessage = '';
            
            // Validações simples
            if (!nome.trim()) {
                isValid = false;
                errorMessage += 'Nome é obrigatório.\n';
            }
            
            if (!email.trim()) {
                isValid = false;
                errorMessage += 'Email é obrigatório.\n';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Email inválido.\n';
            }
            
            if (!telefone.trim()) {
                isValid = false;
                errorMessage += 'Telefone é obrigatório.\n';
            }
            
            if (!assunto) {
                isValid = false;
                errorMessage += 'Assunto é obrigatório.\n';
            }
            
            if (!mensagem.trim()) {
                isValid = false;
                errorMessage += 'Mensagem é obrigatória.\n';
            }
            
            if (isValid) {
                // Aqui você pode adicionar o código para enviar os dados para o servidor
                // Como é apenas uma demonstração, vamos simular um envio bem-sucedido
                
                alert('Mensagem enviada com sucesso! Responderemos em breve.');
                contactForm.reset();
            } else {
                alert('Por favor, corrija os seguintes erros:\n' + errorMessage);
            }
        });
    }
    
    // Função auxiliar para validar email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Inicialização do carrossel se existir
    const carousel = document.getElementById('spaceCarousel');
    if (carousel) {
        // O Bootstrap 5 inicializa automaticamente os carrosséis,
        // mas podemos adicionar opções adicionais se necessário
        /*
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true,
            keyboard: true
        });
        */
    }
    
    // Efeito parallax para as seções com imagem de fundo
    function parallaxEffect() {
        const hero = document.querySelector('.hero');
        const reservation = document.querySelector('.reservation');
        const location = document.querySelector('.location__overlay');
        
        if (hero) {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
        
        if (reservation) {
            const rect = reservation.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPosition = rect.top;
                reservation.style.backgroundPositionY = (scrollPosition * 0.15) + 'px';
            }
        }
        
        if (location) {
            const rect = location.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPosition = rect.top;
                location.style.backgroundPositionY = (scrollPosition * 0.15) + 'px';
            }
        }
    }
    
    // Aplica o efeito parallax ao rolar
    window.addEventListener('scroll', parallaxEffect);
    
    // Animações de fade-in para os elementos ao rolar
    function fadeInElements() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Aplicar classe fade-in programaticamente
    const sectionsToAnimate = document.querySelectorAll('section > .container > h2, .menu__card, .space__feature, .about__img-container, .reservation__card, .location__info, .contact__form, .contact__info');
    
    sectionsToAnimate.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Verificar elementos ao carregar a página e ao rolar
    window.addEventListener('load', fadeInElements);
    window.addEventListener('scroll', fadeInElements);
    
    // Adicionar DatePicker e validações mais avançadas para a data de reserva
    const dataInput = document.getElementById('data');
    
    if (dataInput) {
        // Definir data mínima como hoje
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const yyyy = today.getFullYear();
        const todayFormatted = yyyy + '-' + mm + '-' + dd;
        
        dataInput.setAttribute('min', todayFormatted);
        
        // Impedir que datas passadas sejam selecionadas
        dataInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            if (selectedDate < today) {
                alert('Por favor, selecione uma data futura para sua reserva.');
                this.value = '';
            }
        });
    }
    
    // Adicionar máscaras para inputs de telefone
    const telefoneInputs = document.querySelectorAll('input[type="tel"]');
    
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                // Formato (00) 00000-0000
                if (value.length > 2) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                }
                if (value.length > 10) {
                    value = value.substring(0, 10) + '-' + value.substring(10);
                }
            }
            
            e.target.value = value;
        });
    });
    
    // Botão "Voltar ao topo" que aparece quando rolamos para baixo
    const createTopButton = () => {
        const topButton = document.createElement('button');
        topButton.innerHTML = '<i class="bi bi-arrow-up-circle-fill"></i>';
        topButton.className = 'back-to-top';
        topButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--wood-dark);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(topButton);
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                topButton.style.opacity = '1';
            } else {
                topButton.style.opacity = '0';
            }
        });
        
        topButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    createTopButton();
});
