/**
 * Gestión del header/navbar
 * Includes: menu responsive, actualización de botones según sesión
 */

class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.menuToggle = document.getElementById('menuToggle');
        this.nav = document.querySelector('.nav');
        this.loginBtn = document.getElementById('loginBtn');
        this.registerBtn = document.getElementById('registerBtn');
        
        this.init();
    }

    init() {
        // Menu toggle para móviles
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Cerrar menú al hacer click en un link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Botones de autenticación
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => showAuthModal('login'));
        }
        if (this.registerBtn) {
            this.registerBtn.addEventListener('click', () => showAuthModal('register'));
        }

        // Actualizar estado del usuario
        this.updateAuthUI();

        // Escuchar cambios en localStorage
        window.addEventListener('storage', () => this.updateAuthUI());
    }

    toggleMenu() {
        if (!this.nav) return;
        this.nav.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
    }

    closeMenu() {
        if (!this.nav) return;
        this.nav.classList.remove('active');
        if (this.menuToggle) {
            this.menuToggle.classList.remove('active');
        }
    }

    updateAuthUI() {
        const user = auth.getCurrentUser();
        const authButtons = document.querySelector('.auth-buttons');
        
        if (!authButtons) return;

        if (user) {
            authButtons.innerHTML = `
                <button class="btn-profile" onclick="goToProfile()">
                    ${user.profile.avatar} ${user.username}
                </button>
                <button class="btn-logout" onclick="handleLogout()">Salir</button>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="btn-login" id="loginBtn">Iniciar Sesión</button>
                <button class="btn-register" id="registerBtn">Registrarse</button>
            `;
            
            if (this.loginBtn) {
                this.loginBtn.addEventListener('click', () => showAuthModal('login'));
            }
            if (this.registerBtn) {
                this.registerBtn.addEventListener('click', () => showAuthModal('register'));
            }
        }
    }
}

// Funciones globales
function goToProfile() {
    window.location.href = 'pages/profile.html';
}

function handleLogout() {
    auth.logout();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeaderManager();
    });
} else {
    new HeaderManager();
}

// Estilos CSS para el header responsive
const headerStyles = `
.nav {
    display: flex;
}

.btn-profile {
    padding: var(--spacing-xs) var(--spacing-md);
    background: transparent;
    border: 2px solid var(--neon-cyan);
    color: var(--neon-cyan);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: var(--font-primary);
    font-weight: bold;
}

.btn-profile:hover {
    background: var(--neon-cyan);
    color: var(--bg-dark);
    box-shadow: 0 0 20px var(--neon-cyan);
}

.btn-logout {
    padding: var(--spacing-xs) var(--spacing-md);
    background: linear-gradient(135deg, var(--neon-pink), var(--neon-purple));
    border: none;
    color: white;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: var(--font-primary);
    font-weight: bold;
}

.btn-logout:hover {
    box-shadow: 0 0 20px var(--neon-pink);
}

@media (max-width: 768px) {
    .nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(10, 6, 6, 0.95);
        border-bottom: 2px solid var(--neon-blue);
        padding: var(--spacing-lg);
        gap: var(--spacing-lg);
    }

    .nav.active {
        display: flex;
    }

    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(10px, 10px);
    }

    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
    }
}
`;

// Inyectar estilos
const styleElement = document.createElement('style');
styleElement.textContent = headerStyles;
document.head.appendChild(styleElement);