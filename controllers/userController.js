require('dotenv').config()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '3d' })
}

//login user
const loginUser = async (req, res) => {

    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).send({ email, token })
    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
}

//signup user
const signupUser = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await User.signup(email, password)
        const token = createToken(user._id)
        res.status(200).send({ email, token })
    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
}

module.exports = { loginUser, signupUser }