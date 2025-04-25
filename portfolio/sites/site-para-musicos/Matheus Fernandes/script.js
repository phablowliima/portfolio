document.addEventListener("DOMContentLoaded", function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        }
    });
    
    // Close navbar collapse when clicking outside
    document.addEventListener('click', function(event) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(event.target) && 
            !navbarToggler.contains(event.target)) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
    
    // Close offcanvas when clicking outside
    document.addEventListener('click', function(event) {
        const offcanvasElements = document.querySelectorAll('.offcanvas');
        
        offcanvasElements.forEach(function(offcanvas) {
            if (offcanvas.classList.contains('show') && 
                !offcanvas.contains(event.target) && 
                !event.target.hasAttribute('data-bs-toggle')) {
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Scroll to element with offset for navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const form = document.querySelector('.contato__form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            
            let isValid = true;
            
            // Simple validation
            if (nome === '') {
                isValid = false;
                document.getElementById('nome').classList.add('is-invalid');
            } else {
                document.getElementById('nome').classList.remove('is-invalid');
            }
            
            if (email === '' || !isValidEmail(email)) {
                isValid = false;
                document.getElementById('email').classList.add('is-invalid');
            } else {
                document.getElementById('email').classList.remove('is-invalid');
            }
            
            if (mensagem === '') {
                isValid = false;
                document.getElementById('mensagem').classList.add('is-invalid');
            } else {
                document.getElementById('mensagem').classList.remove('is-invalid');
            }
            
            if (isValid) {
                // Here you would typically send the form data to a server
                alert('Mensagem enviada com sucesso!');
                form.reset();
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Initialize tooltips and popovers if needed
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});
