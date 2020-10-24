const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/checkAuth')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:process.env.SENDGRID_API_KEY
    }
}))

// signup
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    })

                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to:user.email,
                                from:"nonoumasy@gmail.com",
                                subject:"signup success",
                                html: 
                                `
                                <h1>Hello ${user.name}, Welcome to Nonogram.</h1> 
                                <p>https://nono-gram.herokuapp.com/</p>
                                `
                            })
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

// login
router.post('/login', (req, res) =>{
    const {email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: 'pls add fields' })} 
    User.findOne({email})
    .then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: 'Invalid Email or password' })}
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch) {
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)
                const { _id, name, email, followers, following, pic } = savedUser
                res.json({ token, user: { _id, name, email, followers, following, pic } })
            }
            else {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
        })
            .catch(err => {
                console.log(err)
            })
    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(422).json({error:  'User doesnt exist with that email.'})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save()
            .then(result => {
                transporter.sendMail({
                    to: user.mail,
                    from: 'nonoumasy@gmail.com',
                    subject:'password-reset',
                    html: `
                    <p>You requested for password reset.</p>
                    <h5>Click this link <a href='http://https://nono-gram.herokuapp.com//reset/${token}'> to reset your password.</h5>
                    `
                })
                res.json({message: 'Check your email.'})
            })

        })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((saveduser) => {
                    res.json({ message: "password updated success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})

module.exports = router