const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const Blog = require('../models/Blog');

// Get all bookmarks
exports.getAllBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find()
      .populate('user', 'email full_name')
      .populate('blog', 'title content authorEmail');
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get bookmark by ID
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id)
      .populate('user', 'email full_name')
      .populate('blog', 'title content authorEmail');
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get bookmarks by user
exports.getBookmarksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await Bookmark.find({ user: userId })
      .populate('user', 'email full_name')
      .populate('blog', 'title content authorEmail');
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all bookmarks for a user
exports.getUserBookmarks = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Fetching bookmarks for user:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all bookmarks for the user
    const bookmarks = await Bookmark.find({ user: user._id })
      .populate('blog', 'title content authorEmail');
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a bookmark
exports.createBookmark = async (req, res) => {
  try {
    const { blogId, articleUrl, article, userEmail } = req.body;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if it's a blog bookmark
    if (blogId) {
      // Find blog
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Check if bookmark already exists
      const existingBookmark = await Bookmark.findOne({
        user: user._id,
        blog: blog._id
      });

      if (existingBookmark) {
        return res.status(400).json({ message: 'Blog already bookmarked' });
      }

      // Create new blog bookmark
      const bookmark = new Bookmark({
        user: user._id,
        blog: blog._id,
        userEmail
      });

      const savedBookmark = await bookmark.save();
      const populatedBookmark = await Bookmark.findById(savedBookmark._id)
        .populate('blog', 'title content authorEmail');

      return res.status(201).json(populatedBookmark);
    }

    // Handle article bookmark
    if (articleUrl) {
      // Check if article bookmark already exists
      const existingBookmark = await Bookmark.findOne({
        user: user._id,
        articleUrl
      });

      if (existingBookmark) {
        return res.status(400).json({ message: 'Article already bookmarked' });
      }

      // Create new article bookmark
      const bookmark = new Bookmark({
        user: user._id,
        userEmail,
        articleUrl,
        article
      });

      const savedBookmark = await bookmark.save();
      return res.status(201).json(savedBookmark);
    }

    return res.status(400).json({ message: 'Either blogId or articleUrl is required' });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a bookmark
exports.deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // Check if the user owns this bookmark
    const user = await User.findOne({ email: req.user.email });
    if (!user || bookmark.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this bookmark' });
    }

    await bookmark.deleteOne();
    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a bookmark
exports.addBookmark = async (req, res) => {
  try {
    const { blogId, userEmail } = req.body;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      user: user._id,
      blog: blog._id
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Blog already bookmarked' });
    }

    // Create new bookmark
    const bookmark = new Bookmark({
      user: user._id,
      blog: blog._id,
      userEmail
    });

    const savedBookmark = await bookmark.save();
    
    // Populate the bookmark with blog and user details
    const populatedBookmark = await Bookmark.findById(savedBookmark._id)
      .populate('blog', 'title content authorEmail')
      .populate('user', 'email full_name');

    res.status(201).json(populatedBookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { userEmail } = req.body;

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and remove the bookmark
    const bookmark = await Bookmark.findOneAndDelete({
      user: user._id,
      blog: blogId
    });

    if (bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 