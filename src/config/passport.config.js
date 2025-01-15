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
            console.log("profile", profile);
            User.findOne({ email: profile.email }, async (err, user) => {
                if (err) return cb(err);
                if (!user) {
                    user = await User.create({
                        oauthId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    });
                }
                console.log("new user created" , user)
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
