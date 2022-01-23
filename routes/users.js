const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const User = require('../models/user');
const passport = require('passport');

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
      req.flash('success', 'User is created');
      res.redirect('/pitches');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/users/register');
    }
  })
);

module.exports = router;
