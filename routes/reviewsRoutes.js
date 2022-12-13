const express = require('express')
const router = express.Router()
const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests this IP, please try again after 15 minutes',
})
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController.js')
const {
  authenticateUser
} = require('../middleware/authentication')

router
  .route('/')
  .post(apiLimiter, authenticateUser,createReview )
  .get(apiLimiter, getAllReviews)

router
  .route('/:id')
  .get(apiLimiter, getSingleReview)
  .patch(authenticateUser, updateReview )
  .delete(authenticateUser, deleteReview)

module.exports = router
