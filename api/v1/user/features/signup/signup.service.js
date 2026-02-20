const argon2 = require('argon2');

const newUser = async (reqBody) => {
    delete reqBody.confirmPassword;
    const passwordHashed = await hashPassword(reqBody.password);
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
    newUser: newUser,
};