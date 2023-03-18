const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadUserImage,
  updateUserImage,
} = require('../controllers/userController')
// const { uploadUserImage } = require('../controllers/uploadsController')
const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many requests this IP, please try again after 15 minutes',
})
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const { getSingleUserReviews } = require('../controllers/reviewController')

router
  .route('/')
  .get(apiLimiter, authenticateUser,authorizePermissions('admin'), getAllUsers )

router
  .route('/showMe')
  .get(authenticateUser, showCurrentUser)


router
  .route('/updateUser')
  .put(apiLimiter, authenticateUser, updateUser)

router
  .route('/updateUserImage')
  .put(apiLimiter, authenticateUser, updateUserImage)

router
  .route('/uploadUserImage')
  .post(apiLimiter, authenticateUser, uploadUserImage)

router
  .route('/updateUserPassword')
  .patch(apiLimiter, authenticateUser, updateUserPassword)

router
  .route('/:id')
  .get(apiLimiter, authenticateUser, getSingleUser)

router
  .route('/:id/reviews')
  .get(authenticateUser, getSingleUserReviews)


module.exports = router
