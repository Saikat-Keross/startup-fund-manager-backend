const express = require('express');
const passport = require('passport');
const router = express.Router();
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;


router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),

    (req, res) => {
        res.redirect('/oauth/profile');
    });

router.get('/profile', (req, res) => {
    //console.log("req",req);
    //console.log('Session:', req.session);

    //console.log("req",req);
    //console.log('Session:', req.session);

    if (req.isAuthenticated()) {
        let user = req?.user;
        
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , path: '/',  sameSite : process.env.NODE_ENV === 'production' ? "none" : "lax" ,maxAge: 3600000 });
        res.json({ token });
        //res.redirect('http://localhost:8000/');
    } else {
        res.redirect('/oauth/profile');
    }
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.clearCookie('token');
            res.redirect('/');
        })
        res.redirect('/oauth');
    });
});

module.exports = router;
