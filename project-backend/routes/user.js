const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.post('/signup', (req,res)=>{
    const {email,username,password} = req.body;

    res.json({
        msg:'User Registered',
        email,
        username,
        password
    })
})

router.get('/login', )

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    res.json({
      msg: 'User Details',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookmarks
router.get('/bookmarks', authenticateToken, (req, res) => {
  try {
    res.json({
      userId: req.user.id,
      msg: 'User Bookmarks'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;