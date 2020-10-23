const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/checkAuth')

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
                            // transporter.sendMail({
                            //     to:user.email,
                            //     from:"no-reply@insta.com",
                            //     subject:"signup success",
                            //     html:"<h1>welcome to instagram</h1>"
                            // })
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

module.exports = router