const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),

    (req, res) => {
        res.redirect('/oauth/profile');
    });

router.get('/profile', (req, res) => {
    console.log('Session:', req.session);
    if (req.isAuthenticated()) {
        res.json(req.user?._json);
        console.log('user', req.user._json);
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
