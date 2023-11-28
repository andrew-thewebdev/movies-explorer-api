const { celebrate, Joi } = require('celebrate');

const emailRegexp = /\w+@\w+\.\w+/;

module.exports = {
  validateProfile: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().regex(emailRegexp),
      password: Joi.string().required(),
    }),
  }),
  validateProfileAtLogin: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().regex(emailRegexp),
      password: Joi.string().required(),
    }),
  }),
  validateProfileUpdate: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().regex(emailRegexp),
    }),
  }),
};
