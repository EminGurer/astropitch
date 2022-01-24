const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const User = require('../models/user');
const passport = require('passport');

//Register
router.get('/register', (req, res, next) => {
  res.render('users/register.ejs');
});
router.post(
  '/register',
  wrapAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'User is created');
        res.redirect('/pitches');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/users/register');
    }
  })
);
//Login
router.get('/login', (req, res) => {
  res.render('users/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/users/login',
  }),
  (req, res) => {
    const redirectURL = req.session.returnTo || '/pitches';
    delete req.session.returnTo;
    req.flash('success', 'Welcome to AstroPitch');
    res.redirect(redirectURL);
  }
);
//Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/pitches');
});

module.exports = router;
