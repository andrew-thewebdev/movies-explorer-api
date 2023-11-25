const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

module.exports = router;
