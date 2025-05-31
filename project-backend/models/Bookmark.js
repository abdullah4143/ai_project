const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: false
  },
  userEmail: {
    type: String,
    required: true
  },
  articleUrl: {
    type: String,
    required: false
  },
  article: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate bookmarks
BookmarkSchema.index({ user: 1, blog: 1 }, { unique: true, sparse: true });
BookmarkSchema.index({ user: 1, articleUrl: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
