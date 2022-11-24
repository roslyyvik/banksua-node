const express = require('express')
const router = express.Router()

const rateLimiter = require('express-rate-limit')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from require this IP, please try again after 15 minutes',
})
const { register, login, logout } = require('../controllers/authController.js')
// const {authenticateUser} = require('../middleware/authentication')

router
  .route('/register')
  .post(apiLimiter, register)

router
  .route('/login')
  .post(apiLimiter, login)

router
  .route('/logout')
  .get(logout)
  // .delete(authenticateUser, logout)

module.exports = router
