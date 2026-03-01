const GameScore = require('../models/GameScore');

// @desc    Submit score
// @route   POST /api/game/score
// @access  Private
const submitScore = async (req, res) => {
    const { gameName, score, level } = req.body;

    if (!gameName || score === undefined) {
        res.status(400);
        throw new Error('Please provide game name and score');
    }

    const gameScore = await GameScore.create({
        userId: req.user.id,
        gameName,
        score,
        level: level || 'Normal'
    });

    res.status(201).json(gameScore);
};

// @desc    Get my scores
// @route   GET /api/game/my-scores
// @access  Private
const getMyScores = async (req, res) => {
    const scores = await GameScore.find({ userId: req.user.id }).sort({ playedAt: -1 });
    res.status(200).json(scores);
};

// @desc    Get leaderboard for a specific game
// @route   GET /api/game/leaderboard/:gameName
// @access  Public (or Private, depending on requirement)
const getLeaderboard = async (req, res) => {
    const { gameName } = req.params;
    const scores = await GameScore.find({ gameName })
        .populate('userId', 'name')
        .sort({ score: -1 })
        .limit(10);

    res.status(200).json(scores);
};

module.exports = {
    submitScore,
    getMyScores,
    getLeaderboard
};
