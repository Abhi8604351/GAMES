const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getAllScores } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/user/:id', protect, authorize('admin'), deleteUser);
router.get('/all-scores', protect, authorize('admin'), getAllScores);

module.exports = router;
