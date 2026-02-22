const AppError = require('./AppError');

class ConflictError extends AppError {
    constructor(
        message = "ConflictError",
        statusCode = 409,
        code = "Duplicate field",
        details = null) {
        super(message, statusCode, code, details);
    }
}

module.exports = ConflictError;