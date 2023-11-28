// const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const router = require('./routes/index');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const {
  validateProfile,
  validateProfileAtLogin,
} = require('./validators/user-validator');
const NotFoundError = require('./errors/NotFoundError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateProfileAtLogin, login);
app.post('/signup', validateProfile, createUser);

app.use(router); // Все роуты подключены в файле index.js, который находится в папке routes

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка.' : message,
  });
  next();
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('connected to Database!');
  })
  .catch(() => {
    console.log('connection to database failed');
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
