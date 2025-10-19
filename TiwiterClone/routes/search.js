const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const {
  search,
  getTrends,
  searchByHashtag,
  searchByMention,
  getSuggestedUsers
} = require('../controllers/searchController');

const router = express.Router();

// Rotas públicas
router.get('/', optionalAuth, search);
router.get('/trends', getTrends);
router.get('/hashtag/:hashtag', optionalAuth, searchByHashtag);
router.get('/mention/:username', optionalAuth, searchByMention);
router.get('/suggestions', getSuggestedUsers);

module.exports = router;