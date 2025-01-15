const passport = require('passport');

const authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

const authenticateGoogleCallback = (req, res) => {
    passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
        if (err) return res.redirect('/login');
        req.logIn(user, (err) => {
            if (err) return res.redirect('/login');
            res.redirect('/profile');
        });
    })(req, res);
};

const getProfile = (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.json(`Welcome ${req.user.displayName}`);
};

const logout = (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
};

module.exports = {
    authenticateGoogle,
    authenticateGoogleCallback,
    getProfile,
    logout
};
