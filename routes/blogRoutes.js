const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getAuthorBlogs,
  incrementView,
} = require('../controllers/blogController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Optional auth middleware - doesn't fail if no token, but validates if token exists
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (token) {
      // If token exists, validate it
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
      try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
      } catch (err) {
        console.warn('⚠️ Invalid token in optional auth:', err.message);
        // Don't fail, just skip user context
      }
    }
    next();
  } catch (err) {
    console.error('❌ Optional auth error:', err.message);
    next();
  }
};

const router = express.Router();

// Public routes - view blogs
// Important: More specific routes must come before wildcard :id route
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/author/:authorId', getAuthorBlogs);
router.post('/:id/view', optionalAuth, incrementView); // Track views (with optional auth for logged-in users)
router.get('/:id', getBlogById);

// Protected routes - create/modify blogs (requires authentication)
router.post('/', auth, roleCheck(['author', 'admin']), createBlog);
router.put('/:id', auth, roleCheck(['author', 'admin']), updateBlog);
router.delete('/:id', auth, roleCheck(['author', 'admin']), deleteBlog);

module.exports = router;
