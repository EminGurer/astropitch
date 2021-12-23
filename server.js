const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//Database
const DB_URL = 'mongodb://localhost:27017/astroPitch';
const mongoose = require('mongoose');
mongoose
  .connect(DB_URL)
  .then((res) => {
    console.log('Mongo DB connection is successful');
  })
  .catch((err) => {
    console.log('Mongo DB connection failed');
    console.log(err);
  });

//Static assets and body parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//View engine and views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Fallback route
app.get('*', (req, res) => {
  res.send("This page doesn't exist");
});

app.listen(PORT, () => {
  console.log(`Express app is listening on http://localhost:${PORT}`);
});
