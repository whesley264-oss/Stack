const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  likeTweet,
  unlikeTweet,
  getLikedTweets,
  checkLikeStatus
} = require('../controllers/likeController');

const router = express.Router();

// Rotas protegidas
router.post('/:tweetId', authenticateToken, likeTweet);
router.delete('/:tweetId', authenticateToken, unlikeTweet);
router.get('/all', authenticateToken, getLikedTweets);
router.get('/:tweetId/status', authenticateToken, checkLikeStatus);

module.exports = router;