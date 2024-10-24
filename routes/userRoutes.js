const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/block', protect, admin, blockUser);
router.put('/:id/unblock', protect, admin, unblockUser);
router.get('/me', protect, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
