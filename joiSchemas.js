const Joi = require('joi');
module.exports.pitchJoiSchema = Joi.object({
  pitch: Joi.object({
    title: Joi.string().required(),
    images: Joi.object({
      url: String,
      filename: String,
    }),
    price: Joi.number().required().min(0),
    description: Joi.string(),
    location: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewJoiSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
