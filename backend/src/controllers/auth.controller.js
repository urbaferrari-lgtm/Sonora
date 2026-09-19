const userModel= require('../models/user.model')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

async function registerUser(req,res){
    try {
        const { username, email, password, role = "user" } = req.body || {};
        if (!username?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Username, email and password are required" });
        }
        if (!['user', 'artist'].includes(role)) {
            return res.status(400).json({ message: "Role must be user or artist" });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }]
        });
        if (isUserAlreadyExists) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hash,
            role
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions());
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Register error:", error.message);
        return res.status(500).json({ message: "Registration failed", error: error.message });
    }
}


async function loginUser(req,res){
    const { username, email, password } = req.body || {};
    const identifier = (username || email || '').trim();
    if (!identifier || !password) {
        return res.status(400).json({ message: "Username or email and password are required" });
    }
    const user = await userModel.findOne({ $or: [{ username: identifier }, { email: identifier.toLowerCase() }] });
    if(!user){
        return res.status(401).json({message: "Invalid credentials"})
    }
    const isPasswordValid= await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
    return res.status(401).json({message: "Invalid credentials"})
    }

    const token = jwt.sign({
        id:user._id,
        role: user.role,

    },process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token, cookieOptions())

    res.status(200).json({
        message:"User logged in successfully",
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })

}

async function logoutUser(req,res){
    res.clearCookie("token", cookieOptions())
    res.status(200).json({message:"User Logout"})
}

function cookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    return { httpOnly: true, sameSite: isProduction ? 'none' : 'lax', secure: isProduction, maxAge: 7 * 24 * 60 * 60 * 1000 };
}

module.exports = {registerUser, loginUser, logoutUser}