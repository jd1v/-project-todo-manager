const AppError = require('./AppError');

class ConflicateError extends AppError {
    constructor(
        message = "ConflicateError",
        statusCode = 409,
        code = "Duplicate field",
        details = null) {
        super(message, statusCode, code, details);
    }
}

module.exports = ConflicateError;