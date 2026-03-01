const mongoose = require('mongoose');

const gameScoreSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameName: {
        type: String,
        required: [true, 'Please add a game name']
    },
    score: {
        type: Number,
        required: [true, 'Please add a score']
    },
    playedAt: {
        type: Date,
        default: Date.now
    },
    level: {
        type: String,
        default: 'Normal'
    }
});

module.exports = mongoose.model('GameScore', gameScoreSchema);
