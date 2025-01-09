import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import  User from '../models/user.model'; // Adjust the path as necessary

const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

interface User {
    //userId: string;
    username: string;
    password: string;
}

// Dummy user for demonstration purposes
/* const dummyUser: User = {
    userId: '1',
    username: 'testuser',
    password: bcrypt.hashSync('password123', 10) // Hash the password
}; */

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if the user exists and the password matches
    if (username === user.username && await bcrypt.compare(password, user.password)) {
        // Create a JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        
         // Send the token as a cookie
         res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
         
        // Send the token to the client
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey as string);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.send({ message: 'Logged out successfully' });
};

