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
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Public routes
router.get('/', asyncHandler(getAllBlogs));
router.get('/slug/:slug', asyncHandler(getBlogBySlug));
router.get('/:id', asyncHandler(getBlogById));
router.get('/author/:authorId', asyncHandler(getAuthorBlogs));

// Protected routes (require authentication)
router.post('/', auth, asyncHandler(createBlog));
router.put('/:id', auth, asyncHandler(updateBlog));
router.delete('/:id', auth, asyncHandler(deleteBlog));

// View tracking
router.post('/:id/view', asyncHandler(incrementView));

module.exports = router;
