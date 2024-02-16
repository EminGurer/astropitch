const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const {
  registerUser,
  showProfile,
  updateProfile,
} = require('../controllers/users');
const { isLoggedIn, validateUser } = require('../middlewares');

//Register
router.get('/register', (req, res, next) => {
  res.render('users/register.ejs');
});
router.post('/register', registerUser);

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
//Profile
router
  .route('/profile')
  .get(showProfile)
  .put(isLoggedIn, validateUser, updateProfile);
// .delete(deleteProfile);

module.exports = router;
