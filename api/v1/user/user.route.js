// noinspection JSCheckFunctionSignatures

const router = require('express').Router();
const signupLimiter = require('@configs/limiter/signup-user');

console.log(signupLimiter);

router.use('/signup', signupLimiter, require('./features/signup'));

module.exports = router;