const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const authenticateToken = require('../middleware/auth.js');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, full_name, age, gender, interests, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      full_name,
      age,
      gender,
      interests,
      password: hashedPassword,
    });

    
    await newUser.save();
    
    const accessToken = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const resUser = {
      email,
      full_name,
      age,
      gender,
      interests,
      accessToken
    };

    res.status(201).json({ resUser });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      user:{
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        age: user.age,
        gender: user.gender,
        interests: user.interests,
        accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
