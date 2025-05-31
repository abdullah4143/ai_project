const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// All routes are public (no authentication required)
router.get('/headlines', async (req, res) => {
  try {
    const headlines = await articleController.getHeadlines();
    res.json(headlines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const articles = await articleController.getArticlesByCategory(category);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category/:pagesize', async (req, res) => {
  try {
    const { category, pagesize } = req.params;
    const articles = await articleController.getLimitArticlesByCategory(category, parseInt(pagesize));
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic CRUD operations - no auth required
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router; 