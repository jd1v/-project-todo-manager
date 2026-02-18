const router = require('express').Router();
const controller = require('./signup.controller');

router.post('/', controller.newUser);

module.exports = router;