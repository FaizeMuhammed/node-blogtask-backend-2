const express = require('express');
const { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment
} = require('../controllers/postController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;