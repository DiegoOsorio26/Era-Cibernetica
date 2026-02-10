/**
 * Sistema de Autenticación con localStorage
 * Gestiona: registro, login, logout y datos de usuario
 */

class AuthSystem {
    constructor() {
        this.storageKey = 'cybernetic_users';
        this.currentUserKey = 'cybernetic_current_user';
        this.initStorageIfEmpty();
    }

    /**
     * Inicializar almacenamiento con usuario de prueba
     */
    initStorageIfEmpty() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@cybernetic.com',
                    password: this.hashPassword('admin123'),
                    profile: {
                        fullName: 'Administrator',
                        bio: 'Sistema Cibernético Avanzado',
                        avatar: '◆',
                        joinDate: new Date().toISOString()
                    }
                }
            ];
            localStorage.setItem(this.storageKey, JSON.stringify(defaultUsers));
        }
    }

    /**
     * Hash simple de contraseña (en producción usar bcrypt)
     */
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * Registrar nuevo usuario
     */
    register(username, email, password) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        
        // Validar que el usuario no exista
        if (users.some(u => u.username === username || u.email === email)) {
            return { success: false, message: 'Usuario o email ya existe' };
        }

        // Validar contraseña
        if (password.length < 6) {
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: this.hashPassword(password),
            profile: {
                fullName: username,
                bio: 'Explorador de la Era Cibernética',
                avatar: '◇',
                joinDate: new Date().toISOString()
            }
        };

        users.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        
        return { success: true, message: 'Registro exitoso', user: newUser };
    }

    /**
     * Iniciar sesión
     */
    login(username, password) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        const user = users.find(u => u.username === username);

        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Contraseña incorrecta' };
        }

        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        return { success: true, message: 'Sesión iniciada', user };
    }

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem(this.currentUserKey);
        window.location.href = 'index.html';
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Verificar si hay sesión activa
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Actualizar perfil de usuario
     */
    updateProfile(updates) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'No hay sesión activa' };

        const users = JSON.parse(localStorage.getItem(this.storageKey));
        const index = users.findIndex(u => u.id === user.id);

        users[index].profile = {
            ...users[index].profile,
            ...updates
        };

        localStorage.setItem(this.storageKey, JSON.stringify(users));
        localStorage.setItem(this.currentUserKey, JSON.stringify(users[index]));

        return { success: true, message: 'Perfil actualizado', user: users[index] };
    }

    /**
     * Obtener todos los usuarios (solo para admin)
     */
    getAllUsers() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }
}

// Instancia global
const auth = new AuthSystem();

// Funciones de utilidad para formularios
function showAuthModal(type = 'login') {
    const modal = document.createElement('div');
    modal.className = 'auth-modal-overlay';
    modal.id = 'authModal';

    const formHTML = type === 'login' ? 
        `
        <div class="auth-modal">
            <button class="modal-close" onclick="closeAuthModal()">✕</button>
            <h2>Iniciar Sesión</h2>
            <form id="loginForm" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <input type="text" id="loginUsername" placeholder="Usuario" required>
                    <span class="input-highlight"></span>
                </div>
                <div class="form-group">
                    <input type="password" id="loginPassword" placeholder="Contraseña" required>
                    <span class="input-highlight"></span>
                </div>
                <button type="submit" class="btn-primary">Entrar</button>
                <p class="auth-switch">¿No tienes cuenta? <a href="#" onclick="switchAuthForm('register')">Registrarse</a></p>
            </form>
        </div>
        ` :
        `
        <div class="auth-modal">
            <button class="modal-close" onclick="closeAuthModal()">✕</button>
            <h2>Registrarse</h2>
            <form id="registerForm" onsubmit="handleRegister(event)">
                <div class="form-group">
                    <input type="text" id="registerUsername" placeholder="Usuario" required>
                    <span class="input-highlight"></span>
                </div>
                <div class="form-group">
                    <input type="email" id="registerEmail" placeholder="Email" required>
                    <span class="input-highlight"></span>
                </div>
                <div class="form-group">
                    <input type="password" id="registerPassword" placeholder="Contraseña (min 6)" required>
                    <span class="input-highlight"></span>
                </div>
                <button type="submit" class="btn-primary">Registrarse</button>
                <p class="auth-switch">¿Ya tienes cuenta? <a href="#" onclick="switchAuthForm('login')">Iniciar Sesión</a></p>
            </form>
        </div>
        `;

    modal.innerHTML = formHTML;
    document.body.appendChild(modal);

    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAuthModal();
    });
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.remove();
}

function switchAuthForm(type) {
    closeAuthModal();
    showAuthModal(type);
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const result = auth.login(username, password);

    if (result.success) {
        showNotification(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'pages/dashboard.html';
        }, 1000);
    } else {
        showNotification(result.message, 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const result = auth.register(username, email, password);

    if (result.success) {
        showNotification(result.message, 'success');
        setTimeout(() => {
            switchAuthForm('login');
        }, 1001);
    } else {
        showNotification(result.message, 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}