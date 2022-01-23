const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./errorUtilities/customError');
const pitchesRouter = require('./routes/pitches');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Database
const DB_URL = 'mongodb://localhost:27017/astroPitch';
const mongoose = require('mongoose');
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error'));
db.once('open', () => {
  console.log('mongoDB connection is open');
});

//Static assets and body parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//View engine and views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Session and cookies
app.use(
  session({
    secret: 'devsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

//Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

//Routes
app.use('/pitches', pitchesRouter);
app.use('/pitches/:pitchID/reviews', reviewsRouter);
app.use('/users', usersRouter);
//404 fallback
app.all('*', (req, res, next) => {
  next(new AppError('Page does not exist', 404));
});

//Error handler middleware
app.use((err, req, res, next) => {
  const { message = 'Something went wrong', status = 500 } = err;
  res.status(status).render('pitches/error.ejs', { message, status });
});

//App start
app.listen(PORT, () => {
  console.log(`Express app is listening on port:${PORT}`);
  console.log(`Go to http://localhost:${PORT}/pitches`);
});
