const UserModel = require('../Schema/UsersSchema');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SignUp = async (req, res) => {
    try {
        // Prepare user data
        const userData = {
            ...req.body,
            resume: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : undefined
        };

        // Handle user registration
        const data = await UserModel.SignUp(userData);

        // Generate JWT token
        const token = createToken(data._id);

        // Respond with user data and token
        res.status(200).json({
            data: data,
            token: token
        });
    } catch (err) {
        // Handle errors
        res.status(400).json({
            error: err.message
        });
    }
};


const Login = async (req, res) => {
    try {
        const data = await UserModel.Login(req.body);
        const token = createToken(data._id);
        res.status(200).json({
            data: data,
            token: token
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
};

module.exports = { SignUp, Login };
