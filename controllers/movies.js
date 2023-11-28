const Movie = require('../models/Movie');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const PermissionError = require('../errors/PermissionError');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner }).sort({ _id: -1 })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      nameRU, nameEN, image, country, director,
      duration, year, description, trailerLink, thumbnail, movieId,
    } = req.body;
    const ownerID = req.user._id;
    const newMovie = await new Movie({
      nameRU,
      nameEN,
      image,
      country,
      owner: ownerID,
      director,
      duration,
      year,
      description,
      trailerLink,
      thumbnail,
      movieId,
    });
    await Movie.populate(newMovie, 'owner');
    return res.status(201).send(await newMovie.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки фильма.',
        ),
      );
    }
    return next(error);
  }
};

module.exports.deleteMovieById = async (req, res, next) => {
  try {
    const { filmId } = req.params;
    const movie = await Movie.findById(filmId);

    if (!movie) {
      throw new NotFoundError('Карточка фильма с указанным _id не найдена.');
    }

    if (String(movie.owner._id) !== req.user._id) {
      throw new PermissionError(
        'У вас нет прав для удаления чужих карточек фильмов',
      );
    }

    await Movie.deleteOne({ _id: filmId });

    return res.send({ message: 'Пост удалён' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(
        new BadRequestError('Передан не валидный ID карточки фильма'),
      );
    }
    return next(error);
  }
};
