const argon2 = require('argon2');
const repo = require('./signup.repo');

const newUser = async (reqBody) => {
    delete reqBody.confirmPassword;
    const passwordHashed = await hashPassword(reqBody.password);
    delete reqBody.password;
    return await repo.createUser({
        ...reqBody,
        isVerifiedEmail: false,
        isVerifiedPhone: false,
        roles: ['USER'],
        permissions: ['TODO'],
        isBanned: false,
    })
};


async function hashPassword(password) {
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