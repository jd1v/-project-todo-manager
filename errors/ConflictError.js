const AppError = require('./AppError');

class ConflictError extends AppError {
    constructor(
        message = "ConflictError",
        statusCode = 409,
        code = "DUPLICATE_FIELD",
        details = null) {
        super(message, statusCode, code, details);
    }
}

module.exports = ConflictError;