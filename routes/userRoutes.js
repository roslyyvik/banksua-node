const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController')
const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests this IP, please try again after 15 minutes',
})
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

router
  .route('/')
  .get(apiLimiter, authenticateUser,authorizePermissions('admin'), getAllUsers )

router
  .route('/showMe')
  .get(apiLimiter, authenticateUser, showCurrentUser)

router
  .route('/updateUser')
  .patch(apiLimiter, authenticateUser, updateUser)

router
  .route('/updateUserPassword')
  .patch(apiLimiter, authenticateUser, updateUserPassword)

router
  .route('/:id')
  .get(apiLimiter, authenticateUser, getSingleUser)

module.exports = router