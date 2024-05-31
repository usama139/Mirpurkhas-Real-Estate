import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

import { body, validationResult } from 'express-validator';

// Middleware to validate signup request
export const validateSignup = [
    body('username')
        .isAlphanumeric().withMessage('Username must contain only alphabets and numbers.')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/\d/).withMessage('Password must contain at least one number.'),
    body('email').isEmail().withMessage('Email is not valid.'),
];

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, message: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Check for existing email or username
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
            return res.status(409).json({ status: false, message: 'Email already exists.' });
        }

        const existingUsernameUser = await User.findOne({ username });
        if (existingUsernameUser) {
            return res.status(409).json({ status: false, message: 'Username already exists.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = bcryptjs.hashSync(password, saltRounds);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Send a success response
        return res.status(201).json({ status: true, message: 'User created successfully.' });
    } catch (error) {
        // Handle server error
        return res.status(500).json({ status: false, message: error.message });
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Validation: Check for empty fields
    if (!email || !password ) {
        return next(errorHandler(400, 'Kindly Enter Email and Password.'));
    }
    

    try {
        // Find user by email
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found.'));
        }

        // Compare password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong credentials.'));
        }

        // Generate JWT token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Omit password from response
        const { password: _, ...userData } = validUser._doc;

        // Set cookie with token
        res.cookie('access_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
           .status(200)
           .json(userData);

    } catch (error) {
        // Catch and handle errors
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res 
                .cookie('access_token', token, { httpOnly: true})
                .status(200)
                .json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4) , email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

        }
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error)
    }
}