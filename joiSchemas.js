const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);
module.exports.pitchJoiSchema = Joi.object({
  pitch: Joi.object({
    title: Joi.string().required().escapeHTML(),
    images: Joi.object({
      url: String,
      filename: String,
    }),
    price: Joi.number().required().min(0),
    description: Joi.string().escapeHTML(),
    geometry: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewJoiSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.userJoiSchema = Joi.object({
  email: Joi.string().email().required().escapeHTML(),
  username: Joi.string().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
  passwordnew: Joi.string().allow(null, '').escapeHTML(),
});
