const express = require('express');
const router = express.Router();
const { submitScore, getMyScores, getLeaderboard } = require('../controllers/gameController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/score', protect, submitScore);
router.get('/my-scores', protect, getMyScores);
router.get('/leaderboard/:gameName', getLeaderboard);

module.exports = router;
