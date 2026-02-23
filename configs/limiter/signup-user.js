// noinspection JSUnresolvedReference

const limiter = require('express-rate-limit');
const logger = require('@utils/logger');


const signupLimiter = limiter({
    windowMs: 60 * 1000,
    max: 2,
    statusCode: 429,
    standardHeaders: false,
    legacyHeaders: false,
    skip: req => req.ip === '127.0.0.1' || req.ip === '::1',
    handler: (req, res) => {
        logger.warn("SIGNUP_RATE_LIMIT", {
            error: "RATE_LIMIT_DETECTED",
            message: "Too many requests, please try again later",
            ip: req.ip,
        })
        res.status(429).send({
            error: "RATE_LIMIT",
            message: "Please, try again later",
        })
    }
})

module.exports = signupLimiter;
