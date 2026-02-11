const router = require('express').Router();

router.use('/user', require('./user/user.route'));

module.exports = router;