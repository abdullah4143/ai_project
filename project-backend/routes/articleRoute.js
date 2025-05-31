const express = require('express');
const router = express.Router();
const {getHeadlines, getArticlesByCategory,getLimitArticlesByCategory} = require('../controllers/articleController.js');

router.get('/headlines',async (req,res)=>{

    const headlines = await getHeadlines();
    res.status(200).json(headlines)
})

// router.get('/articles' , )

router.get('/:category',async (req,res)=>{
    const {category} = req.params;
    
    const headlines = await getArticlesByCategory(category);
    res.status(200).json(headlines)
})

router.get('/:category/:limit',async (req,res)=>{
    const {category,limit} = req.params;
    
    const headlines = await getLimitArticlesByCategory(category,limit);
    res.status(200).json(headlines)
})

module.exports = router;




