const Joi = require('joi');
module.exports.pitchJoiSchema = Joi.object({
  pitch: Joi.object({
    title: Joi.string().required(),
    image: Joi.string(),
    price: Joi.number().required().min(0),
    description: Joi.string(),
    location: Joi.string().required(),
  }).required(),
});
