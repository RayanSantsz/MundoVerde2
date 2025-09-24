/**
 * Script para transições suaves entre páginas e animações de entrada de elementos
 * Mundo Verde 2 - Sistema de Chás
 */

// Função para observar elementos e ativar animações quando entram na viewport
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observa todos os elementos com classes de animação
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-down, .slide-left, .slide-right');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Força a ativação dos elementos do footer para garantir visibilidade
    setTimeout(() => {
        const footerElements = document.querySelectorAll('footer .fade-in, footer .slide-up, footer .slide-down, footer .slide-left, footer .slide-right');
        footerElements.forEach(element => {
            element.classList.add('active');
        });
    }, 500);
}

// Função para criar overlay de transição entre páginas
function createPageOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-overlay';
    document.body.appendChild(overlay);
    return overlay;
}

// Função para transição suave entre páginas
function initPageTransitions() {
    const overlay = createPageOverlay();
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Verifica se é um link interno (não âncora)
            if (href && href.startsWith('/') && !href.startsWith('#')) {
                e.preventDefault();
                
                // Ativa o overlay
                overlay.classList.add('active');
                
                // Navega após a animação
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // Remove overlay quando a página carrega
    window.addEventListener('load', () => {
        overlay.classList.remove('active');
        document.body.classList.add('page-transition');
    });
}

// Função para animação de entrada sequencial de elementos
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * delay}ms`;
    });
}

// Função para animação suave do header quando a página carrega
function animateHeader() {
    const header = document.querySelector('.header');
    if (header) {
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            header.style.transform = 'translateY(0)';
        }, 200);
    }
}

// Função para scroll suave melhorado
function improveScrollBehavior() {
    // Intercepta cliques em links âncora para scroll mais suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para criar e gerenciar menu hamburger mobile
function initMobileMenu() {
    // Criar botão hamburger se não existir
    const header = document.querySelector('.header section');
    if (!header) return;

    // Verifica se já existe o botão
    let hamburgerBtn = document.querySelector('.hamburger-menu');
    if (!hamburgerBtn) {
        hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-menu';
        hamburgerBtn.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        hamburgerBtn.setAttribute('aria-label', 'Abrir menu');
        
        // Adiciona o botão após o logo
        const logo = header.querySelector('.logo');
        if (logo) {
            logo.insertAdjacentElement('afterend', hamburgerBtn);
        } else {
            header.prepend(hamburgerBtn);
        }
    }

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Adiciona classe para identificar o menu mobile
    navbar.classList.add('mobile-nav');

    // Função para alternar menu
    function toggleMenu() {
        const isOpen = navbar.classList.contains('nav-open');
        
        if (isOpen) {
            // Fechar menu
            navbar.classList.remove('nav-open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-label', 'Abrir menu');
            document.body.classList.remove('menu-open');
        } else {
            // Abrir menu
            navbar.classList.add('nav-open');
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-label', 'Fechar menu');
            document.body.classList.add('menu-open');
        }
    }

    // Event listener para o botão hamburger
    hamburgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Fechar menu ao clicar em um link
    const navLinks = navbar.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('nav-open')) {
                toggleMenu();
            }
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navbar.contains(e.target);
        const isClickOnHamburger = hamburgerBtn.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navbar.classList.contains('nav-open')) {
            toggleMenu();
        }
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
            toggleMenu();
        }
    });

    // Gerenciar menu baseado no tamanho da tela
    function handleResize() {
        const isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            hamburgerBtn.style.display = 'flex';
            navbar.classList.add('mobile-nav');
        } else {
            hamburgerBtn.style.display = 'none';
            navbar.classList.remove('mobile-nav', 'nav-open');
            hamburgerBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    // Inicializar baseado no tamanho atual
    handleResize();

    // Listener para redimensionamento
    window.addEventListener('resize', handleResize);
}

// Função principal que inicializa tudo
function initTransitions() {
    // Aguarda o DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollAnimations();
            initPageTransitions();
            animateHeader();
            improveScrollBehavior();
            initMobileMenu();
        });
    } else {
        initScrollAnimations();
        initPageTransitions();
        animateHeader();
        improveScrollBehavior();
        initMobileMenu();
    }
}

// Inicializa as transições
initTransitions();

// Função utilitária para adicionar animação a elementos específicos
function addAnimation(selector, animationType, delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        element.classList.add(animationType);
        if (delay > 0) {
            element.style.animationDelay = `${index * delay}ms`;
        }
    });
}

// Função para resetar animações (útil para debugging)
function resetAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-down, .slide-left, .slide-right');
    animatedElements.forEach(element => {
        element.classList.remove('active');
    });
}

// Exporta funções para uso global
window.MundoVerdeTransitions = {
    addAnimation,
    resetAnimations,
    staggerAnimation,
    initTransitions
};