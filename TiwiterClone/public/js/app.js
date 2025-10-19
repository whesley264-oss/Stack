// TiwiterClone - Main App
class TiwiterClone {
    constructor() {
        this.currentUser = null;
        this.socket = null;
        this.currentSection = 'home';
        this.tweets = [];
        this.page = 1;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        // Verificar se usuário está logado
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await this.verifyToken(token);
                this.showMainLayout();
            } catch (error) {
                console.error('Token inválido:', error);
                this.showAuthModal();
            }
        } else {
            this.showAuthModal();
        }

        // Inicializar Socket.IO
        this.initSocket();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Carregar dados iniciais
        if (this.currentUser) {
            this.loadInitialData();
        }
    }

    async verifyToken(token) {
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token inválido');
        }

        const data = await response.json();
        this.currentUser = data.data.user;
        this.updateUserInfo();
    }

    showAuthModal() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-modal').classList.add('active');
    }

    showMainLayout() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('main-layout').style.display = 'grid';
    }

    initSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Conectado ao servidor');
            if (this.currentUser) {
                this.socket.emit('join-user', this.currentUser._id);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('Desconectado do servidor');
        });

        this.socket.on('tweet-created', (tweet) => {
            this.addTweetToFeed(tweet);
        });

        this.socket.on('like-added', (data) => {
            this.updateTweetLikes(data.tweetId, data.likesCount);
        });

        this.socket.on('retweet-added', (data) => {
            this.updateTweetRetweets(data.tweetId, data.retweetsCount);
        });

        this.socket.on('comment-added', (data) => {
            this.updateTweetComments(data.tweetId, data.commentsCount);
        });

        this.socket.on('message-received', (message) => {
            this.showNotification('Nova mensagem recebida');
        });
    }

    setupEventListeners() {
        // Tweet textarea character count
        const tweetText = document.getElementById('tweet-text');
        const modalTweetText = document.getElementById('modal-tweet-text');
        
        if (tweetText) {
            tweetText.addEventListener('input', this.updateCharCount.bind(this));
        }
        
        if (modalTweetText) {
            modalTweetText.addEventListener('input', this.updateCharCount.bind(this));
        }

        // Infinite scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 500));
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('user-avatar').src = this.currentUser.avatar;
            document.getElementById('user-name').textContent = this.currentUser.displayName;
            document.getElementById('user-username').textContent = `@${this.currentUser.username}`;
            document.getElementById('composer-avatar').src = this.currentUser.avatar;
            document.getElementById('modal-composer-avatar').src = this.currentUser.avatar;
        }
    }

    async loadInitialData() {
        if (this.currentSection === 'home') {
            await this.loadFeed();
        }
        await this.loadTrends();
        await this.loadSuggestions();
    }

    async loadFeed() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingMore();

        try {
            const response = await fetch(`/api/tweets/feed?page=${this.page}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar feed');
            }

            const data = await response.json();
            
            if (data.success) {
                if (this.page === 1) {
                    this.tweets = data.data.tweets;
                    this.renderTweets();
                } else {
                    this.tweets.push(...data.data.tweets);
                    this.renderTweets(data.data.tweets);
                }
                this.page++;
            }
        } catch (error) {
            console.error('Erro ao carregar feed:', error);
            this.showError('Erro ao carregar tweets');
        } finally {
            this.isLoading = false;
            this.hideLoadingMore();
        }
    }

    async loadTrends() {
        try {
            const response = await fetch('/api/search/trends');
            const data = await response.json();
            
            if (data.success) {
                this.renderTrends(data.data.trends);
            }
        } catch (error) {
            console.error('Erro ao carregar trends:', error);
        }
    }

    async loadSuggestions() {
        try {
            const response = await fetch('/api/users/suggestions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                this.renderSuggestions(data.data.users);
            }
        } catch (error) {
            console.error('Erro ao carregar sugestões:', error);
        }
    }

    renderTweets(newTweets = null) {
        const feed = document.getElementById('tweet-feed');
        
        if (newTweets) {
            // Adicionar novos tweets
            newTweets.forEach(tweet => {
                const tweetElement = this.createTweetElement(tweet);
                feed.appendChild(tweetElement);
            });
        } else {
            // Renderizar todos os tweets
            feed.innerHTML = '';
            this.tweets.forEach(tweet => {
                const tweetElement = this.createTweetElement(tweet);
                feed.appendChild(tweetElement);
            });
        }
    }

    createTweetElement(tweet) {
        const tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet';
        tweetDiv.dataset.tweetId = tweet._id;

        const timeAgo = this.getTimeAgo(tweet.createdAt);
        const isLiked = tweet.likes && tweet.likes.includes(this.currentUser._id);
        const isRetweeted = tweet.retweets && tweet.retweets.some(rt => rt.user === this.currentUser._id);

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

        // Marcar ações ativas
        if (isLiked) {
            tweetDiv.querySelector('.tweet-action:first-child').classList.add('liked');
            tweetDiv.querySelector('.tweet-action:first-child i').className = 'fas fa-heart';
        }

        if (isRetweeted) {
            tweetDiv.querySelector('.tweet-action:nth-child(2)').classList.add('retweeted');
        }

        return tweetDiv;
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

    updateCharCount(event) {
        const text = event.target.value;
        const charCount = text.length;
        const isModal = event.target.id === 'modal-tweet-text';
        
        const charCountElement = isModal ? 
            document.getElementById('modal-char-count') : 
            document.getElementById('char-count');
        
        const submitButton = isModal ?
            event.target.parentElement.querySelector('.btn-primary') :
            event.target.parentElement.querySelector('.btn-primary');

        charCountElement.textContent = `${charCount}/280`;
        
        if (charCount > 0 && charCount <= 280) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    async postTweet() {
        const tweetText = document.getElementById('tweet-text') || document.getElementById('modal-tweet-text');
        const content = tweetText.value.trim();

        if (!content) return;

        try {
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Erro ao postar tweet');
            }

            const data = await response.json();
            
            if (data.success) {
                tweetText.value = '';
                this.updateCharCount({ target: tweetText });
                this.closeTweetModal();
                this.showNotification('Tweet postado com sucesso!');
                
                // Adicionar tweet ao feed via socket
                this.socket.emit('new-tweet', data.data.tweet);
            }
        } catch (error) {
            console.error('Erro ao postar tweet:', error);
            this.showError('Erro ao postar tweet');
        }
    }

    async likeTweet(tweetId) {
        try {
            const response = await fetch(`/api/likes/${tweetId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao curtir tweet');
            }

            const data = await response.json();
            
            if (data.success) {
                this.socket.emit('new-like', {
                    tweetId: tweetId,
                    likesCount: data.data.likesCount
                });
            }
        } catch (error) {
            console.error('Erro ao curtir tweet:', error);
        }
    }

    async retweet(tweetId) {
        try {
            const response = await fetch(`/api/retweets/${tweetId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao retweetar');
            }

            const data = await response.json();
            
            if (data.success) {
                this.socket.emit('new-retweet', {
                    tweetId: tweetId,
                    retweetsCount: data.data.retweetsCount
                });
            }
        } catch (error) {
            console.error('Erro ao retweetar:', error);
        }
    }

    async comment(tweetId) {
        // Implementar modal de comentário
        console.log('Comentar tweet:', tweetId);
    }

    async bookmark(tweetId) {
        try {
            const response = await fetch(`/api/tweets/${tweetId}/bookmark`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar tweet');
            }

            const data = await response.json();
            
            if (data.success) {
                this.showNotification('Tweet salvo!');
            }
        } catch (error) {
            console.error('Erro ao salvar tweet:', error);
        }
    }

    addTweetToFeed(tweet) {
        const tweetElement = this.createTweetElement(tweet);
        const feed = document.getElementById('tweet-feed');
        feed.insertBefore(tweetElement, feed.firstChild);
    }

    updateTweetLikes(tweetId, likesCount) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const likeAction = tweetElement.querySelector('.tweet-action:first-child span');
            likeAction.textContent = likesCount;
        }
    }

    updateTweetRetweets(tweetId, retweetsCount) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const retweetAction = tweetElement.querySelector('.tweet-action:nth-child(2) span');
            retweetAction.textContent = retweetsCount;
        }
    }

    updateTweetComments(tweetId, commentsCount) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const commentAction = tweetElement.querySelector('.tweet-action:nth-child(3) span');
            commentAction.textContent = commentsCount;
        }
    }

    handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
            if (this.currentSection === 'home' && !this.isLoading) {
                this.loadFeed();
            }
        }
    }

    handleSearch(event) {
        const query = event.target.value.trim();
        if (query.length > 2) {
            this.performSearch(query);
        }
    }

    async performSearch(query) {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro na busca');
            }

            const data = await response.json();
            
            if (data.success) {
                this.renderSearchResults(data.data.results);
            }
        } catch (error) {
            console.error('Erro na busca:', error);
        }
    }

    renderSearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            resultElement.innerHTML = `
                <div class="result-content">
                    <h3>${result.title}</h3>
                    <p>${result.description}</p>
                </div>
            `;
            resultsContainer.appendChild(resultElement);
        });
    }

    renderTrends(trends) {
        const trendsList = document.getElementById('trends-list');
        trendsList.innerHTML = '';

        trends.forEach(trend => {
            const trendElement = document.createElement('div');
            trendElement.className = 'trend-item';
            trendElement.innerHTML = `
                <div class="trend-content">
                    <div class="trend-category">${trend.category}</div>
                    <div class="trend-name">${trend.name}</div>
                    <div class="trend-count">${trend.count} tweets</div>
                </div>
            `;
            trendsList.appendChild(trendElement);
        });
    }

    renderSuggestions(users) {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'suggestion-item';
            userElement.innerHTML = `
                <img src="${user.avatar}" alt="Avatar" class="suggestion-avatar">
                <div class="suggestion-content">
                    <div class="suggestion-name">${user.displayName}</div>
                    <div class="suggestion-username">@${user.username}</div>
                </div>
                <button class="btn btn-primary" onclick="app.followUser('${user._id}')">
                    Seguir
                </button>
            `;
            suggestionsList.appendChild(userElement);
        });
    }

    showLoadingMore() {
        document.getElementById('loading-more').style.display = 'block';
    }

    hideLoadingMore() {
        document.getElementById('loading-more').style.display = 'none';
    }

    showNotification(message) {
        // Implementar sistema de notificações
        console.log('Notification:', message);
    }

    showError(message) {
        // Implementar sistema de erros
        console.error('Error:', message);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        this.socket.disconnect();
        location.reload();
    }
}

// Inicializar app quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TiwiterClone();
});