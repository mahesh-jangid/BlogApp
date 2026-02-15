const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', auth, asyncHandler(getMe));
router.put('/update', auth, asyncHandler(updateProfile));
router.post('/logout', auth, asyncHandler(logout));

module.exports = router;
