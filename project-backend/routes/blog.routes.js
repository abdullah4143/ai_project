const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const authenticateToken = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.get('/user/:email', blogController.getBlogsByUser);

// Protected routes (authentication required)
router.post('/', authenticateToken, blogController.createBlog);
router.put('/:id', authenticateToken, blogController.updateBlog);
router.delete('/:id', authenticateToken, blogController.deleteBlog);

module.exports = router; 