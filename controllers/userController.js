require('dotenv').config()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')

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

//forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).send({ error: "Email not registered" })
        }
        else {
            //create a password reset link valid for 15mins
            const payload = {
                email: user.email,
                id: user._id
            }
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '15m' })
            const [header, payload1, signature] = token.split(".")
            const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${header}/${payload1}/${signature}`

            var transporter = nodemailer.createTransport({
                service: 'outlook',
                auth: {
                    user: 'shreyassp17@outlook.com',
                    pass: '2491972Ab#'
                }
            });

            var mailOptions = {
                from: 'shreyassp17@outlook.com',
                to: email,
                subject: 'Password reset link',
                text: `Your password reset link is ${link}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(400).send({ error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).send({ message: 'Password reset link valid for 15 minutes has been sent to your email. ' })
                }
            });
        }
    }
    catch (error) {
        res.status(400).send({ error })
    }
}

const resetPassword = async (req, res) => {
    const { id, token } = req.params
    const { newPassword } = req.body
    try {
        const user = await User.findById(id)
        if (!user) {
            res.status(400).send({ error: "User not found" })
        }
        else {
            const payload = jwt.verify(token, process.env.SECRET)

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            user.password = hashedPassword
            await user.save()
            res.status(200).send({ message: "Password changed successfully" })
        }
    }
    catch (err) {
        res.status(400).send({ error: err })
    }




    // res.status(200).send({ message: { id, token } })
}

module.exports = { loginUser, signupUser, forgotPassword, resetPassword }