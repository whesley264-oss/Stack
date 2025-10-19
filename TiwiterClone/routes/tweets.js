const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createTweet,
  getFeed,
  getTweet,
  getUserTweets,
  editTweet,
  deleteTweet,
  bookmarkTweet,
  getBookmarkedTweets,
  getTweetsByHashtag,
  getTweetsByMention,
  pinTweet,
  unpinTweet
} = require('../controllers/tweetController');

const router = express.Router();

// Validações
const createTweetValidation = [
  body('content')
    .isLength({ min: 1, max: 280 })
    .withMessage('Tweet deve ter entre 1 e 280 caracteres')
    .trim(),
  body('replyTo')
    .optional()
    .isMongoId()
    .withMessage('ID do tweet pai inválido'),
  body('quotedTweet')
    .optional()
    .isMongoId()
    .withMessage('ID do tweet citado inválido')
];

const editTweetValidation = [
  body('content')
    .isLength({ min: 1, max: 280 })
    .withMessage('Tweet deve ter entre 1 e 280 caracteres')
    .trim()
];

// Rotas públicas
router.get('/hashtag/:hashtag', getTweetsByHashtag);

// Rotas protegidas
router.post('/', authenticateToken, createTweetValidation, createTweet);
router.get('/feed', authenticateToken, getFeed);
router.get('/:tweetId', authenticateToken, getTweet);
router.get('/user/:userId', authenticateToken, getUserTweets);
router.put('/:tweetId', authenticateToken, editTweetValidation, editTweet);
router.delete('/:tweetId', authenticateToken, deleteTweet);
router.post('/:tweetId/bookmark', authenticateToken, bookmarkTweet);
router.get('/bookmarks/all', authenticateToken, getBookmarkedTweets);
router.get('/mentions/all', authenticateToken, getTweetsByMention);
router.post('/:tweetId/pin', authenticateToken, pinTweet);
router.delete('/:tweetId/pin', authenticateToken, unpinTweet);

module.exports = router;