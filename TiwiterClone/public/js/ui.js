// TiwiterClone - UI Management
class UIManager {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupUserMenu();
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.showSection(section);
            });
        });

        // User menu
        document.querySelector('.user-info')?.addEventListener('click', this.toggleUserMenu.bind(this));

        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.closeUserMenu();
            }
        });
    }

    setupUserMenu() {
        const userInfo = document.querySelector('.user-info');
        if (userInfo) {
            userInfo.addEventListener('click', this.toggleUserMenu.bind(this));
        }
    }

    showSection(sectionName) {
        // Remover active de todas as seções
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Ativar seção selecionada
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Ativar item de navegação correspondente
        const navItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Carregar dados da seção
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'home':
                if (window.app) {
                    window.app.loadFeed();
                }
                break;
            case 'explore':
                this.loadExploreData();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
            case 'messages':
                this.loadMessages();
                break;
            case 'bookmarks':
                this.loadBookmarks();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    async loadExploreData() {
        try {
            const response = await fetch('/api/search/trends');
            const data = await response.json();
            
            if (data.success) {
                this.renderTrends(data.data.trends);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de exploração:', error);
        }
    }

    async loadNotifications() {
        try {
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.renderNotifications(data.data.notifications);
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    }

    async loadMessages() {
        try {
            const response = await fetch('/api/messages/conversations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.renderMessages(data.data.conversations);
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    }

    async loadBookmarks() {
        try {
            const response = await fetch('/api/tweets/bookmarks/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.renderBookmarks(data.data.tweets);
            }
        } catch (error) {
            console.error('Erro ao carregar itens salvos:', error);
        }
    }

    async loadProfile() {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.renderProfile(data.data.user);
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    renderTrends(trends) {
        const trendsList = document.getElementById('trends-list');
        if (!trendsList) return;

        trendsList.innerHTML = '';

        trends.forEach(trend => {
            const trendElement = document.createElement('div');
            trendElement.className = 'trend-item';
            trendElement.innerHTML = `
                <div class="trend-content">
                    <div class="trend-category">Tendência</div>
                    <div class="trend-name">#${trend.hashtag}</div>
                    <div class="trend-count">${trend.count} tweets</div>
                </div>
            `;
            trendsList.appendChild(trendElement);
        });
    }

    renderNotifications(notifications) {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        notificationsList.innerHTML = '';

        if (notifications.length === 0) {
            notificationsList.innerHTML = '<div class="empty-state">Nenhuma notificação</div>';
            return;
        }

        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification ${notification.isRead ? 'read' : 'unread'}`;
            notificationElement.innerHTML = `
                <img src="${notification.from.avatar}" alt="Avatar" class="notification-avatar">
                <div class="notification-content">
                    <div class="notification-text">${this.formatNotificationText(notification)}</div>
                    <div class="notification-time">${this.getTimeAgo(notification.createdAt)}</div>
                </div>
            `;
            notificationsList.appendChild(notificationElement);
        });
    }

    renderMessages(conversations) {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;

        messagesList.innerHTML = '';

        if (conversations.length === 0) {
            messagesList.innerHTML = '<div class="empty-state">Nenhuma conversa</div>';
            return;
        }

        conversations.forEach(conversation => {
            const conversationElement = document.createElement('div');
            conversationElement.className = 'conversation-item';
            conversationElement.innerHTML = `
                <img src="${conversation.user.avatar}" alt="Avatar" class="conversation-avatar">
                <div class="conversation-content">
                    <div class="conversation-header">
                        <div class="conversation-name">${conversation.user.displayName}</div>
                        <div class="conversation-time">${this.getTimeAgo(conversation.lastMessage.createdAt)}</div>
                    </div>
                    <div class="conversation-preview">${conversation.lastMessage.content}</div>
                    ${conversation.unreadCount > 0 ? `<div class="unread-badge">${conversation.unreadCount}</div>` : ''}
                </div>
            `;
            messagesList.appendChild(conversationElement);
        });
    }

    renderBookmarks(tweets) {
        const bookmarksList = document.getElementById('bookmarks-list');
        if (!bookmarksList) return;

        bookmarksList.innerHTML = '';

        if (tweets.length === 0) {
            bookmarksList.innerHTML = '<div class="empty-state">Nenhum item salvo</div>';
            return;
        }

        tweets.forEach(tweet => {
            const tweetElement = this.createTweetElement(tweet);
            bookmarksList.appendChild(tweetElement);
        });
    }

    renderProfile(user) {
        const profileContent = document.getElementById('profile-content');
        if (!profileContent) return;

        profileContent.innerHTML = `
            <div class="profile-header">
                <div class="profile-cover">
                    <img src="${user.coverPhoto || 'https://via.placeholder.com/600x200/1DA1F2/FFFFFF?text=Cover'}" alt="Cover">
                </div>
                <div class="profile-info">
                    <img src="${user.avatar}" alt="Avatar" class="profile-avatar">
                    <div class="profile-details">
                        <h2>${user.displayName}</h2>
                        <p>@${user.username}</p>
                        <p>${user.bio || 'Sem bio'}</p>
                        <div class="profile-stats">
                            <span><strong>${user.followersCount}</strong> Seguidores</span>
                            <span><strong>${user.followingCount}</strong> Seguindo</span>
                            <span><strong>${user.tweetsCount}</strong> Tweets</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createTweetElement(tweet) {
        const tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet';
        tweetDiv.dataset.tweetId = tweet._id;

        const timeAgo = this.getTimeAgo(tweet.createdAt);

        tweetDiv.innerHTML = `
            <img src="${tweet.author.avatar}" alt="Avatar" class="tweet-avatar">
            <div class="tweet-content">
                <div class="tweet-header">
                    <a href="#" class="tweet-author">${tweet.author.displayName}</a>
                    <a href="#" class="tweet-username">@${tweet.author.username}</a>
                    <span class="tweet-time">${timeAgo}</span>
                </div>
                <div class="tweet-text">${this.formatTweetText(tweet.content)}</div>
                <div class="tweet-actions">
                    <a href="#" class="tweet-action" onclick="app.likeTweet('${tweet._id}')">
                        <i class="far fa-heart"></i>
                        <span>${tweet.likesCount || 0}</span>
                    </a>
                    <a href="#" class="tweet-action" onclick="app.retweet('${tweet._id}')">
                        <i class="fas fa-retweet"></i>
                        <span>${tweet.retweetsCount || 0}</span>
                    </a>
                    <a href="#" class="tweet-action" onclick="app.comment('${tweet._id}')">
                        <i class="far fa-comment"></i>
                        <span>${tweet.repliesCount || 0}</span>
                    </a>
                    <a href="#" class="tweet-action" onclick="app.bookmark('${tweet._id}')">
                        <i class="far fa-bookmark"></i>
                    </a>
                </div>
            </div>
        `;

        return tweetDiv;
    }

    formatNotificationText(notification) {
        const from = notification.from.displayName;
        
        switch (notification.type) {
            case 'like':
                return `${from} curtiu seu tweet`;
            case 'retweet':
                return `${from} retweetou seu tweet`;
            case 'comment':
                return `${from} comentou em seu tweet`;
            case 'follow':
                return `${from} começou a seguir você`;
            case 'mention':
                return `${from} mencionou você`;
            case 'reply':
                return `${from} respondeu seu tweet`;
            case 'quote':
                return `${from} citou seu tweet`;
            default:
                return 'Nova notificação';
        }
    }

    formatTweetText(text) {
        // Formatar hashtags
        text = text.replace(/#(\w+)/g, '<a href="#" class="hashtag">#$1</a>');
        
        // Formatar menções
        text = text.replace(/@(\w+)/g, '<a href="#" class="mention">@$1</a>');
        
        // Formatar URLs
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="url">$1</a>');
        
        return text;
    }

    getTimeAgo(date) {
        const now = new Date();
        const tweetDate = new Date(date);
        const diffInSeconds = Math.floor((now - tweetDate) / 1000);

        if (diffInSeconds < 60) {
            return 'agora';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d`;
        }
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    closeUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    openTweetModal() {
        document.getElementById('tweet-modal').classList.add('active');
    }

    closeTweetModal() {
        document.getElementById('tweet-modal').classList.remove('active');
    }

    refreshFeed() {
        if (window.app) {
            window.app.page = 1;
            window.app.tweets = [];
            window.app.loadFeed();
        }
    }

    showError(message) {
        // Implementar sistema de notificações
        console.error('Error:', message);
        alert(message);
    }

    showSuccess(message) {
        // Implementar sistema de notificações
        console.log('Success:', message);
        alert(message);
    }
}

// Funções globais para o HTML
function showSection(sectionName) {
    if (window.uiManager) {
        window.uiManager.showSection(sectionName);
    }
}

function openTweetModal() {
    if (window.uiManager) {
        window.uiManager.openTweetModal();
    }
}

function closeTweetModal() {
    if (window.uiManager) {
        window.uiManager.closeTweetModal();
    }
}

function refreshFeed() {
    if (window.uiManager) {
        window.uiManager.refreshFeed();
    }
}

function toggleUserMenu() {
    if (window.uiManager) {
        window.uiManager.toggleUserMenu();
    }
}

function logout() {
    if (window.app) {
        window.app.logout();
    }
}

// Inicializar UI Manager quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});