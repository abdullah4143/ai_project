const Blog = require('../models/Blog');
const User = require('../models/User');

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log('Received blog creation request:', { title, content });

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Get user from token data
    const { id, email } = req.user;
    console.log('User data from token:', { id, email });

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      console.error('User not found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify email matches
    if (user.email !== email) {
      console.error('Token email does not match user email');
      return res.status(403).json({ message: 'Invalid user token' });
    }

    const blog = new Blog({
      title,
      content,
      author: user._id,
      authorEmail: user.email
    });

    const savedBlog = await blog.save();
    console.log('Blog created successfully:', savedBlog);
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'email full_name');
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get blogs by user email
exports.getBlogsByUser = async (req, res) => {
  try {
    const { email } = req.params;
    const blogs = await Blog.find({ authorEmail: email }).populate('author', 'email full_name');
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single blog by id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'email full_name');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog by id:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get user from token data
    const { id, email } = req.user;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      console.error('User not found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify email matches
    if (user.email !== email) {
      console.error('Token email does not match user email');
      return res.status(403).json({ message: 'Invalid user token' });
    }

    // Check if the user is the author of the blog
    if (blog.authorEmail !== user.email) {
      return res.status(403).json({ message: 'User not authorized to update this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    const updatedBlog = await blog.save();
    console.log('Blog updated successfully:', updatedBlog);
    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get user from token data
    const { id, email } = req.user;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      console.error('User not found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify email matches
    if (user.email !== email) {
      console.error('Token email does not match user email');
      return res.status(403).json({ message: 'Invalid user token' });
    }

    // Check if the user is the author of the blog
    if (blog.authorEmail !== user.email) {
      return res.status(403).json({ message: 'User not authorized to delete this blog' });
    }

    await blog.deleteOne();
    console.log('Blog deleted successfully:', req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: error.message });
  }
}; 