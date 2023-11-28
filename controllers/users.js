const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateError = require('../errors/DuplicateError');
const AuthenticationError = require('../errors/AuthenticationError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }

    return res.send(user);
  } catch (error) {
    return next(error);
  }
};

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SAULT_ROUNDS = 10;

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, password, email,
    } = req.body;
    const hash = await bcrypt.hash(password, SAULT_ROUNDS);
    const newUser = await new User({
      name,
      password: hash,
      email,
    });
    await newUser.save();
    return res.status(201).send({
      email: newUser.email,
      avatar: newUser.avatar,
    });
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new DuplicateError('Такой пользователь уже существует.'));
    }
    if (error.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        ),
      );
    }
    return next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError('Пользователь c указанным _id не найден.');
    }
    return res.status(200).send(
      await User.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          email: req.body.email,
        },
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
        },
      ),
    );
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new DuplicateError('Такой пользователь уже существует.'));
    }
    if (error.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        ),
      );
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { password, email } = req.body;
  const { JWT_SECRET, NODE_ENV } = process.env;
  // console.log('NODE_ENV', NODE_ENV);
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(() => new AuthenticationError('Неправильный email или password'));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthenticationError('Неправильный email или password');
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV ? JWT_SECRET : 'super-strong-secret',
      {
        expiresIn: '7d',
      },
    );

    return res.status(200).send({ token, email: user.email });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные.'));
    }
    return next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id }).orFail(
      new AuthenticationError('Неправильный email или password'),
    );
    return res.status(200).send({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные.'));
    }
    return next(error);
  }
};
