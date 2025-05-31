const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const authenticateToken = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/', bookmarkController.getAllBookmarks);
router.get('/:id', bookmarkController.getBookmarkById);

// Protected routes (authentication required)
router.get('/user/:email', authenticateToken, bookmarkController.getUserBookmarks);
router.post('/', authenticateToken, bookmarkController.createBookmark);
router.delete('/:id', authenticateToken, bookmarkController.deleteBookmark);

module.exports = router; 