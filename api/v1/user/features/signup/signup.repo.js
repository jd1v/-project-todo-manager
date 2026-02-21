const model = require('@v1user/user.model');

const createUser = async (data) => {
    // noinspection JSCheckFunctionSignatures
    return await model.create(data);
}

const existPhone = async (phone) => {
    return !!(await model.exists({phone}));
}

const existEmail = async (email) => {
    return !!(await model.exists({email}));
}

const nationalCode = async (nationalCode) => {
    return !!(await model.exists({nationalCode}));
}

module.exports = {
    createUser,
}