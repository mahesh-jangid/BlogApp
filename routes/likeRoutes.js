const express = require('express');
const {
  toggleLike,
  checkLike,
  getLikeCount,
} = require('../controllers/likeController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/', auth, asyncHandler(toggleLike));
router.get('/check/:blogId', auth, asyncHandler(checkLike));
router.get('/count/:blogId', asyncHandler(getLikeCount));

module.exports = router;
