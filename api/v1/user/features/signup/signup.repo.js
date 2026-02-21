const model = require('@v1user/user.model');

const createUser = async (data) => {
    return await model.create(data);
}

module.exports = {
    createUser,
}