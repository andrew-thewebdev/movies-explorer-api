const movieRoutes = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const {
  validateMovie,
  validateFilmId,
} = require('../validators/movie-validator');

movieRoutes.get('/', getMovies);
movieRoutes.delete('/:filmId', validateFilmId, deleteMovieById);
movieRoutes.post('/', validateMovie, createMovie);

module.exports = movieRoutes;
