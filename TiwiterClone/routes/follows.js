const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  followUser,
  unfollowUser,
  checkFollowStatus,
  getFollowers,
  getFollowing,
  getMutualFollows,
  getFollowStats
} = require('../controllers/followController');

const router = express.Router();

// Rotas protegidas
router.post('/:userId', authenticateToken, followUser);
router.delete('/:userId', authenticateToken, unfollowUser);
router.get('/:userId/status', authenticateToken, checkFollowStatus);
router.get('/followers', authenticateToken, getFollowers);
router.get('/following', authenticateToken, getFollowing);
router.get('/:userId/mutual', authenticateToken, getMutualFollows);
router.get('/stats', authenticateToken, getFollowStats);

module.exports = router;