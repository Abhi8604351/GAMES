const User = require('../models/User');
const GameScore = require('../models/GameScore');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({ _id: user._id });
        await GameScore.deleteMany({ userId: user._id });
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Get all scores
// @route   GET /api/admin/all-scores
// @access  Private/Admin
const getAllScores = async (req, res) => {
    const scores = await GameScore.find({})
        .populate('userId', 'name email')
        .sort({ playedAt: -1 });
    res.status(200).json(scores);
};

module.exports = {
    getUsers,
    deleteUser,
    getAllScores
};
