require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

import User from '../models/user.model'

const secretKey = process.env.JWT_SECRET;

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRECT,
        callbackURL: "http://localhost:8000/oauth/google/callback"
    },
        function (accessToken, refreshToken, profile, cb) {
            User.findOne({ oauthId: profile.id }, async (err, user) => {
                if (err) return cb(err);
                if (!user) {
                    user = await User.create({
                        oauthId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    });
                }

                const token = jwt.sign({ id: user._id, username: user.username }, secretKey);
                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.json({ token });
                return cb(null, user);
            });
        }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};
