const wrapAsync = require('../errorUtilities/wrapAsync');
const User = require('../models/user');

const registerUser = wrapAsync(async (req, res, next) => {
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
});
const showProfile = (req, res, next) => {
  res.render('users/profile');
};
const updateProfile = wrapAsync(async (req, res, next) => {
  const { id } = req.user;
  const { email, username, password, passwordnew } = req.body;
  const user = await User.findById(id);
  const authResult = await user.authenticate(password);
  if (authResult.error) {
    req.flash('error', authResult.error.message);
    return res.redirect('/users/profile');
  } else {
    if (passwordnew) {
      await user.changePassword(password, passwordnew);
    }
    user.email = email;
    user.username = username;
    user.save();
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash('success', 'User is updated');
      return res.redirect('/pitches');
    });
  }
});

module.exports = {
  registerUser,
  showProfile,
  updateProfile,
};
