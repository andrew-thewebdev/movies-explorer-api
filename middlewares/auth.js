const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/AuthenticationError');

// export default function (req, res, next) {
module.exports = (req, res, next) => {
  const { JWT_SECRET, NODE_ENV } = process.env;
  let payload;
  try {
    if (!req.headers.authorization) {
      throw new AuthenticationError('Ошибка аутентификации');
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      throw new AuthenticationError('Ошибка аутентификации');
    }

    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'super-strong-secret');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Ошибка аутентификации'));
    }

    return next(error);
  }

  req.user = payload;
  return next();
};
