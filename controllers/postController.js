const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { title, category, publishingDate, authorName, paragraphs,author } = req.body;
        const post = await Post.create({
            title,
            category,
            publishingDate,
            authorName,
            paragraphs,
            author
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    console.log('Delete request received for post ID:', req.params.id);
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {  
    try {
        const postId = req.params.id;
        const post = await Post.findByIdAndDelete(postId); // Replace Post with your model

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

exports.likePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user has already liked the post
      if (post.likedBy.includes(req.user._id)) {
        return res.status(400).json({ message: 'Post already liked' });
      }
  
      // Add the user's ID to the likedBy array
      post.likedBy.push(req.user._id);
      post.likes = post.likedBy.length;  // Update the likes count
      
      await post.save();
  
      res.json({
        likes: post.likes,          // Send updated like count
        likedBy: post.likedBy,      // Send updated likedBy array
        message: 'Post liked successfully',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

exports.unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'Post not liked yet' });
        }

        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ user: req.user._id, content });
        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.remove();
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};