const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const {secret} = require("./config")
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}
class authController {
    async registration(req, res){
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({ where: { username } });
            if (candidate) {
                return res.status(400).json({message: "User with such name already exists"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: "User successfully registered"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }
    async login(req, res){
        try {
            const {username, password} = req.body
            const user = await User.findOne({
                where: { username: username }
            });
            if (!user) {
                return res.status(400).json({message: `User ${username} is not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Password incorrect`})
            }
            const token = generateAccessToken(user.id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (e) {
            console.error(e);
        }
    }

}
module.exports = new authController()