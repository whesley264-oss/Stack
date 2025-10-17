// TiwiterClone - Tweet Management
class TweetManager {
    constructor() {
        this.tweets = [];
        this.page = 1;
        this.isLoading = false;
    }

    async postTweet(content) {
        try {
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (data.success) {
                return { success: true, tweet: data.data.tweet };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao postar tweet:', error);
            return { success: false, message: 'Erro de conexão' };
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

            const data = await response.json();

            if (data.success) {
                this.updateTweetLikes(tweetId, data.data.likesCount);
                return { success: true, liked: data.data.liked };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao curtir tweet:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async unlikeTweet(tweetId) {
        try {
            const response = await fetch(`/api/likes/${tweetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.updateTweetLikes(tweetId, data.data.likesCount);
                return { success: true, liked: data.data.liked };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao descurtir tweet:', error);
            return { success: false, message: 'Erro de conexão' };
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

            const data = await response.json();

            if (data.success) {
                this.updateTweetRetweets(tweetId, data.data.retweetsCount);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao retweetar:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async unretweet(tweetId) {
        try {
            const response = await fetch(`/api/retweets/${tweetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.updateTweetRetweets(tweetId, data.data.retweetsCount);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao desretweetar:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async comment(tweetId, content) {
        try {
            const response = await fetch(`/api/comments/${tweetId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (data.success) {
                this.updateTweetComments(tweetId, data.data.comment);
                return { success: true, comment: data.data.comment };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao comentar:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async bookmark(tweetId) {
        try {
            const response = await fetch(`/api/tweets/${tweetId}/bookmark`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                return { success: true, bookmarked: data.data.bookmarked };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao salvar tweet:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async deleteTweet(tweetId) {
        try {
            const response = await fetch(`/api/tweets/${tweetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                this.removeTweetFromFeed(tweetId);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao deletar tweet:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async editTweet(tweetId, content) {
        try {
            const response = await fetch(`/api/tweets/${tweetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();

            if (data.success) {
                this.updateTweetContent(tweetId, content);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro ao editar tweet:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    updateTweetLikes(tweetId, likesCount) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const likeAction = tweetElement.querySelector('.tweet-action:first-child span');
            if (likeAction) {
                likeAction.textContent = likesCount;
            }
        }
    }

    updateTweetRetweets(tweetId, retweetsCount) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const retweetAction = tweetElement.querySelector('.tweet-action:nth-child(2) span');
            if (retweetAction) {
                retweetAction.textContent = retweetsCount;
            }
        }
    }

    updateTweetComments(tweetId, comment) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const commentAction = tweetElement.querySelector('.tweet-action:nth-child(3) span');
            if (commentAction) {
                const currentCount = parseInt(commentAction.textContent) || 0;
                commentAction.textContent = currentCount + 1;
            }
        }
    }

    updateTweetContent(tweetId, content) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const tweetText = tweetElement.querySelector('.tweet-text');
            if (tweetText) {
                tweetText.innerHTML = this.formatTweetText(content);
            }
        }
    }

    removeTweetFromFeed(tweetId) {
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            tweetElement.remove();
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

    // Funções para adicionar mídia
    addImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            this.handleImageUpload(files);
        };
        input.click();
    }

    addGif() {
        // Implementar integração com GIPHY
        console.log('Adicionar GIF');
    }

    addPoll() {
        // Implementar criação de enquete
        console.log('Adicionar enquete');
    }

    addEmoji() {
        // Implementar seletor de emoji
        console.log('Adicionar emoji');
    }

    async handleImageUpload(files) {
        // Implementar upload de imagens
        console.log('Upload de imagens:', files);
    }
}

// Funções globais para o HTML
async function postTweet() {
    const tweetText = document.getElementById('tweet-text') || document.getElementById('modal-tweet-text');
    const content = tweetText.value.trim();

    if (!content) return;

    const tweetManager = new TweetManager();
    const result = await tweetManager.postTweet(content);

    if (result.success) {
        tweetText.value = '';
        updateCharCount({ target: tweetText });
        closeTweetModal();
        showSuccess('Tweet postado com sucesso!');
        
        // Adicionar tweet ao feed
        if (window.app) {
            window.app.addTweetToFeed(result.tweet);
        }
    } else {
        showError(result.message);
    }
}

async function likeTweet(tweetId) {
    const tweetManager = new TweetManager();
    const result = await tweetManager.likeTweet(tweetId);

    if (result.success) {
        // Atualizar UI
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const likeAction = tweetElement.querySelector('.tweet-action:first-child');
            if (likeAction) {
                likeAction.classList.toggle('liked');
                const icon = likeAction.querySelector('i');
                if (icon) {
                    icon.className = likeAction.classList.contains('liked') ? 'fas fa-heart' : 'far fa-heart';
                }
            }
        }
    } else {
        showError(result.message);
    }
}

async function retweet(tweetId) {
    const tweetManager = new TweetManager();
    const result = await tweetManager.retweet(tweetId);

    if (result.success) {
        // Atualizar UI
        const tweetElement = document.querySelector(`[data-tweet-id="${tweetId}"]`);
        if (tweetElement) {
            const retweetAction = tweetElement.querySelector('.tweet-action:nth-child(2)');
            if (retweetAction) {
                retweetAction.classList.toggle('retweeted');
            }
        }
    } else {
        showError(result.message);
    }
}

async function comment(tweetId) {
    // Implementar modal de comentário
    console.log('Comentar tweet:', tweetId);
}

async function bookmark(tweetId) {
    const tweetManager = new TweetManager();
    const result = await tweetManager.bookmark(tweetId);

    if (result.success) {
        showSuccess(result.bookmarked ? 'Tweet salvo!' : 'Tweet removido dos salvos!');
    } else {
        showError(result.message);
    }
}

function addImage() {
    if (window.tweetManager) {
        window.tweetManager.addImage();
    }
}

function addGif() {
    if (window.tweetManager) {
        window.tweetManager.addGif();
    }
}

function addPoll() {
    if (window.tweetManager) {
        window.tweetManager.addPoll();
    }
}

function addEmoji() {
    if (window.tweetManager) {
        window.tweetManager.addEmoji();
    }
}

function showSuccess(message) {
    // Implementar sistema de notificações
    console.log('Success:', message);
    alert(message);
}

function showError(message) {
    // Implementar sistema de notificações
    console.error('Error:', message);
    alert(message);
}

// Inicializar Tweet Manager quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.tweetManager = new TweetManager();
});