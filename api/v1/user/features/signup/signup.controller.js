const {ZodError} = require('zod');
const dto = require('./signup.dto');
const service = require('./signup.service');
const logger = require('@utils/logger');

const newUser = async (req, res) => {
    try {
        const cleanBody = dto.sanitizeSignupDTO.parse(req.body);
        const result = await service.newUser(cleanBody);
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