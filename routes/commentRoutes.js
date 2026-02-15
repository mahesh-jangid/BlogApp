const express = require('express');
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/', auth, asyncHandler(createComment));
router.get('/:blogId', asyncHandler(getComments));
router.put('/:id', auth, asyncHandler(updateComment));
router.delete('/:id', auth, asyncHandler(deleteComment));
router.post('/:id/like', auth, asyncHandler(likeComment));

module.exports = router;
