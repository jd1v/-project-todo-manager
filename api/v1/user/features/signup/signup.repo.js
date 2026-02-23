const model = require('@v1user/user.model');
const { isDuplicateKeyError } = require('@errors/infrastructure/database/is-duplicate-key-error');
const ConflictError = require('@errors/ConflictError');
const logger = require('@utils/logger');

const createUser = async (data) => {
    try {
        // noinspection JSCheckFunctionSignatures
        return model.create(data);
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            logger.error("SequelizeUniqueConstraintError", {
                errors: error,
                code: error.code,
                message: "Conflict UniqueConstraintError",
            });
            throw new ConflictError(
                "CONFLICT_ERROR",
                409,
                "RACE_CONDITIONAL_ERROR",
                {
                    layer: "repo",
                    error: error.message,
                }
            );
        }
        throw error;
    }
}

const existPhone = async (phone) => {
    return !!(await model.exists({phone}));
}

const existEmail = async (email) => {
    return !!(await model.exists({email}));
}

const existNationalCode = async (nationalCode) => {
    return !!(await model.exists({nationalCode}));
}

module.exports = {
    createUser,
    existPhone,
    existEmail,
    existNationalCode,
}