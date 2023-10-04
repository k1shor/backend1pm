const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const sendEmail = require('../utils/EmailSender')
const crypto = require('crypto')
const jwt = require('jsonwebtoken') //authentication
const { expressjwt } = require('express-jwt')


// register
exports.register = async (req, res) => {
    let userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
        return res.status(400).json({ error: "Email already exists." })
    }
    userExists = await User.findOne({ username: req.body.username })
    if (userExists) {
        return res.status(400).json({ error: "Username not available." })
    }

    let newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    if (!newUser) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    let token = await Token.create({
        token: crypto.randomBytes(16).toString('hex'),
        user: newUser._id
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    const url = `http://localhost:5000/verifyEmail/${token.token}`
    sendEmail({
        from: "noreply@something.com",
        to: req.body.email,
        subject: "verification email",
        text: "Please click on the given link to verify your account. " + url,
        html: `<a href= '${url}'><button>Click to Verify</button></a>`
    })
    res.send(newUser)
}


// to verify email
exports.verifyEmail = async (req, res) => {
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified. Login to continue" })
    }
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ message: "User verified successfully" })
}

// forget password
exports.forgetPassword = async (req, res) => {
    // check if email exists or not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // generate token
    let token = await Token.create({
        user: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send password reset link in email
    const url = `http://localhost:5000/resetPassword/${token.token}`
    sendEmail({
        from: "noreply@something.com",
        to: req.body.email,
        subject: "Password reset Link",
        text: "Click on the following link to reset password" + url,
        html: `<a href='${url}'><button>Reset Password</button></a>`
    })
    res.send({ message: "Password reset link has been sent to your email." })
}

// reset password
exports.resetPassword = async (req, res) => {
    // check if token is valid or not
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user
    let user = await User.findById(token.user)
    if (!user) {
        res.status(400).json({ error: "User not found." })
    }
    // reset password
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send msg to user
    res.send({ message: "Password changed successfully." })
}


// login
exports.signin = async (req, res) => {
    let { email, password } = req.body

    // check if email is registered
    let user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: "User not registered" })
    }

    // check if password is correct
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Email and password donot match" })
    }

    // check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified." })
    }

    // generate login token
    let token = jwt.sign({
        user: user._id,
        role: user.role,
        email: user.email,
        username: user.username
    }, process.env.SECRET_KEY)

    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // set info in cookies
    res.cookie('myCookie', token, { expire: Date.now() + 86400 })

    const { _id, role, username } = user
    // send info to frontend
    res.send({ token, user: { _id, role, email, username } })
}

// signout
exports.signout = async (req, res) => {
    let response = await res.clearCookie('myCookie')
    if (!response) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ message: "Signed out successfully" })
}


// for authorization
exports.requireSignin = expressjwt({
    algorithms: ['HS256'],
    secret: process.env.SECRET_KEY
})

// resent verification
exports.resendVerification = async (req, res) => {
    // check if email exists
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered" })
    }
    // check if password is correct
    if (!user.isAuthenticated(req.body.password)) {
        return res.status(400).json({ error: "Password incorrect" })
    }
    // check if already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }
    // generate token if not verified
    let token = await Token.create({
        user: user._id,
        token: crypto.randomBytes(16).tostring('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send token in email
    const url = `http://localhost:5000/verifyEmail/${token.token}`
    sendEmail({
        from: "noreply@something.com",
        to: user.email,
        subject: "Verification Email",
        text: "Click on the following link to verify.",
        html: `<a href= '${url}'><button>Click to Verify</button></a>`
    })
    res.send({message:"Verification link has been sent to your email"})
}