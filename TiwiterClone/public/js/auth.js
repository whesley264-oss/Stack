// TiwiterClone - Authentication
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('token');
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = data.data.user;
                this.token = data.data.token;
                localStorage.setItem('token', this.token);
                return { success: true, user: this.currentUser };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async register(username, displayName, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, displayName, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = data.data.user;
                this.token = data.data.token;
                localStorage.setItem('token', this.token);
                return { success: true, user: this.currentUser };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    logout() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('token');
        location.reload();
    }

    isLoggedIn() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Funções globais para o HTML
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showError('Preencha todos os campos');
        return;
    }

    const authManager = new AuthManager();
    const result = await authManager.login(email, password);

    if (result.success) {
        showSuccess('Login realizado com sucesso!');
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        showError(result.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const displayName = document.getElementById('register-display-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!username || !displayName || !email || !password) {
        showError('Preencha todos os campos');
        return;
    }

    if (password.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres');
        return;
    }

    const authManager = new AuthManager();
    const result = await authManager.register(username, displayName, email, password);

    if (result.success) {
        showSuccess('Conta criada com sucesso!');
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        showError(result.message);
    }
}

function switchAuthTab(tab) {
    // Remover active de todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    // Ativar tab selecionada
    if (tab === 'login') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('register-form').classList.add('active');
    }
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function showError(message) {
    // Implementar sistema de notificações
    console.error('Error:', message);
    alert(message);
}

function showSuccess(message) {
    // Implementar sistema de notificações
    console.log('Success:', message);
    alert(message);
}

// Inicializar quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há token válido
    const token = localStorage.getItem('token');
    if (token) {
        // Verificar se token é válido
        fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Token válido, mostrar interface principal
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('main-layout').style.display = 'grid';
            } else {
                // Token inválido, mostrar modal de login
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('auth-modal').classList.add('active');
            }
        })
        .catch(error => {
            console.error('Erro ao verificar token:', error);
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('auth-modal').classList.add('active');
        });
    } else {
        // Sem token, mostrar modal de login
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-modal').classList.add('active');
    }
});