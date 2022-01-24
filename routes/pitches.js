const express = require('express');
const router = express.Router();
const wrapAsync = require('../errorUtilities/wrapAsync');
const AppError = require('../errorUtilities/customError');
const Pitch = require('../models/pitches');

//Middlewares
const {
  validatePitch,
  isLoggedIn,
  isOwnerOfPitch,
} = require('../middlewares.js');
//Controllers
const {
  showAllPitches,
  showCreateForm,
  createPitch,
  showUpdateForm,
  updatePitch,
  deletePitch,
  showOnePitch,
} = require('../controllers/pitches');

router
  .route('/')
  .get(showAllPitches)
  .post(isLoggedIn, validatePitch, createPitch);

router.get('/new', isLoggedIn, showCreateForm);

router
  .route('/:id')
  .get(showOnePitch)
  .put(isLoggedIn, isOwnerOfPitch, validatePitch, updatePitch)
  .delete(isLoggedIn, isOwnerOfPitch, deletePitch);

router.get('/:id/edit', isLoggedIn, isOwnerOfPitch, showUpdateForm);

module.exports = router;
