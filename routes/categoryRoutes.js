const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// Public routes - view categories
router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategoryById));

// Protected routes - create/modify categories (admin only)
router.post('/', auth, roleCheck(['admin']), asyncHandler(createCategory));
router.put('/:id', auth, roleCheck(['admin']), asyncHandler(updateCategory));
router.delete('/:id', auth, roleCheck(['admin']), asyncHandler(deleteCategory));

module.exports = router;
