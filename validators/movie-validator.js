const { celebrate, Joi } = require('celebrate');

const urlRegexp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}(:\d{1,5})?([/?#]\S*)?$/;

module.exports = {
  validateMovie: celebrate({
    body: Joi.object().keys({
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      image: Joi.string().required().regex(urlRegexp),
      trailerLink: Joi.string().required().regex(urlRegexp),
      thumbnail: Joi.string().required().regex(urlRegexp),
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().integer().required().min(0),
      movieId: Joi.number().integer().required().min(0),
      year: Joi.string().required(),
      description: Joi.string().required(),
    }),
  }),
  validateFilmId: celebrate({
    params: Joi.object().keys({
      filmId: Joi.string().alphanum().length(24),
    }),
  }),
};
