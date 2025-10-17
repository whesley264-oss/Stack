const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  retweet,
  unretweet,
  getRetweets,
  getUserRetweets,
  checkRetweetStatus
} = require('../controllers/retweetController');

const router = express.Router();

// Rotas públicas
router.get('/:tweetId', getRetweets);

// Rotas protegidas
router.post('/:tweetId', authenticateToken, retweet);
router.delete('/:tweetId', authenticateToken, unretweet);
router.get('/user/:userId', authenticateToken, getUserRetweets);
router.get('/:tweetId/status', authenticateToken, checkRetweetStatus);

module.exports = router;