require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from '../models/user.model'
module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRECT,
        callbackURL: "http://localhost:8000/oauth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
        console.log("Profile:", profile);
        try {
            const email = profile.emails[0].value;
            let user = await User.findOne({ email: email });

            if (!user) {
                user = await User.create({
                    oauthId: profile.id,
                    username: profile.displayName,
                    email: email,
                    avatar: profile.photos[0].value
                });
                console.log("New user created:", user);
            } else {
                console.log("User already exists:", user);
            }

            return cb(null, user);
        } catch (error) {
            console.error("Error during Google authentication:", error);
            return cb(error, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            if (err) {
                console.error("Error deserializing user:", err);
                return done(err);
            }
            done(null, user);
        });
    });
};
