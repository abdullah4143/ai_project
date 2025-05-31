const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  authorEmail: {
    type: String,
    required: true
  }
}, { 
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Blog', BlogSchema);
