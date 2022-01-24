const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must login');
    return res.redirect('/users/login');
  }
  next();
};
module.exports = { isLoggedIn };
