const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../config/keys")
const User = require("../models/user")
const errorHandler = require("../utils/errorHandler")


module.exports.login = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        // Password check, user is exsists
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // Token generation
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {
                expiresIn: "1h"
            })
            
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: "Пароли не совпали. Попробуйте снова"
            })
        }
    } else {
        // user not exists
        res.status(404).json({
            message: "Пользователь не найден, такого email не существует"
        })
    }
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    })

    if (candidate) {
        // user already exists
        res.status(409).json({
            message: "Такой email уже занят. Попробуйте другой"
        })
    } else {
        // creating new user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}




