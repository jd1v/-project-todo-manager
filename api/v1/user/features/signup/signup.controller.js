const {ZodError} = require('zod');
const ConflicateError = require('@errors/ConflictError');
const dto = require('./signup.dto');
const service = require('./signup.service');
const logger = require('@utils/logger');

const newUser = async (req, res) => {
    try {
        const cleanBody = dto.sanitizeSignupDTO.parse(req.body);
        delete cleanBody.confirmPassword;
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
        if (err instanceof ConflicateError) {
            logger.warn("Duplicate signup attempt", {
                path: req.originalUrl,
                ip: req.ip,
                error: err.details
            });
            return res.status(409).json({
                message: "Duplicate signup attempt",
                errors: err.details
            });
        }
    }
}

module.exports = {
    newUser
};