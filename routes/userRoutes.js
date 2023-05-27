const express = require('express')
const { loginUser, signupUser, forgotPassword, resetPassword } = require('../controllers/userController')
const router = express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:id/:token', resetPassword)


module.exports = router