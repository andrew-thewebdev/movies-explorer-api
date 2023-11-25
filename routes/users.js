const userRoutes = require('express').Router();
const { getCurrentUser } = require('../controllers/users');
const { updateUser } = require('../controllers/users');
const { validateProfileUpdate } = require('../validators/user-validator');

userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', validateProfileUpdate, updateUser);

module.exports = userRoutes;
