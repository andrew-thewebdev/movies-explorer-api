const { celebrate, Joi } = require('celebrate');
// prettier-ignore
// const urlRegexp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}(:\d{1,5})?([/?#]\S*)?$/;
const emailRegexp = /\w+@\w+\.\w+/;

module.exports = {
  validateProfile: celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        email: Joi.string().required().regex(emailRegexp),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  validateProfileAtLogin: celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().regex(emailRegexp),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  validateProfileUpdate: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().regex(emailRegexp),
    }),
  }),
};
