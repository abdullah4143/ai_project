const express = require('express');
require('dotenv').config();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const app = express();
const mongoose = require('mongoose');
const articleRouter = require('./routes/articleRoute.js');
const authRoutes = require('./routes/auth.js');
const blogRoutes = require('./routes/blog.routes.js');
const bookmarkRoutes = require('./routes/bookmark.routes.js');
const userRoutes = require('./routes/user.js');
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

const connectdb = async ()=>{
    await mongoose.connect(process.env.MONGO_DB_URL)
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
}

connectdb();

// API Routes
app.use('/api/articles', articleRouter);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/users', userRoutes);

app.get('/', async (req, res) => {
    res.json({
        message: 'Welcome to the News API'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
