const DEFAULT_USER_VALUES = {
    isVerifiedEmail: false,
    isVerifiedPhone: false,
    roles: ['USER'],
    permissions: ['TODO'],
    isBanned: false,
};

const deepFreeze = (obj) => {
    Object.freeze(obj);
    Object.values(obj).forEach(value => {
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    })
    return obj;
}

module.exports = deepFreeze(DEFAULT_USER_VALUES);