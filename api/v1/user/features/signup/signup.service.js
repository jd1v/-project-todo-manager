const argon2 = require('argon2');
const defaultValue = require('@configs/defualt-user-value');
const logger = require('@utils/logger');
const ConflictError = require('@errors/ConflictError');
const repo = require('./signup.repo');

const newUser = async (safeData) => {
    const {password, ...safeInformation} = safeData;
    logger.info('Starting Signup New User', {
        safeInformation
    });
    const [
        phoneExists,
        emailExists,
        nationalCodeExists
    ] = await Promise.all([
        repo.existPhone(safeInformation.phone),
        safeInformation.email
            ? repo.existEmail(safeInformation.email)
            : false,
        safeInformation.nationalCode
            ? repo.existNationalCode(safeInformation.nationalCode)
            : false
    ])
    if (phoneExists || emailExists || nationalCodeExists) {
        logger.warn("duplicate field signup", {
            phone: safeInformation.phone,
            email: safeInformation.email,
            nationalCode: safeInformation.nationalCode,
        })
        throw new ConflictError(
            "CONFLICT_ERROR",
            409,
            "DUPLICATE_FIELD_ERROR",
            {
                phone: phoneExists,
                email: emailExists,
                nationalCode: nationalCodeExists,
            }
        );
    }
    try {
        const passwordHash = await hashedPassword(password);
        logger.info('successfuly hash password', {
            safeInformation
        })
        return await repo.createUser({
            ...safeInformation,
            passwordHash,
            ...defaultValue,
        })
    } catch (error) {
        logger.error("hashing error", {
            layar: "service",
            method: "POST",
            path: "signup",
            errors: error,
            safeInformation
        });
        throw error;
    }
};


async function hashedPassword(password) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
    });
}

module.exports = {
    newUser,
};