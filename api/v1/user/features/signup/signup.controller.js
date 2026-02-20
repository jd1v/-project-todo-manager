const dto = require('./signup.dto');
const logger = require('@utils/logger');
const {ZodError: ZodError} = require('zod');

const newUser = async (req, res) => {
    try {
        const cleanBody = dto.sanitizeSignupDTO.parse(req.body);
    } catch (err) {
        if (err instanceof ZodError) {
            logger.warn("Signup validation failed", {
                path: req.originalUrl,
                ip: req.ip,
                error: err.issues.map(issue => issue.message)
            });
            return res.status(400).json({
                message: "Validation failed",
                errors: err.issues.map(issue => issue.message)
            });
        }
    }
}

module.exports = {
    newUser
};