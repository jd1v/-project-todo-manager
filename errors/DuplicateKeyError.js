import AppError from "@errors/AppError";

class DuplicateKeyError extends AppError {
    constructor(
        message = "Duplicate value for unique field",
        statusCode = 409,
        code = "DUPLICATE_KEY",
        details = null,
        ) {
        super(message, statusCode, code, details);
    }
}

module.exports = DuplicateKeyError;