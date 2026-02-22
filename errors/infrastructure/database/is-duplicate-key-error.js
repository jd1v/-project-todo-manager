const isDuplicateKeyError = (error) => {
    return (
        error?.code === 11000 ||
        error?.code === "23505" ||
        error?.name === 'SequelizeUniqueConstraintError'
    )
};

module.exports = {
    isDuplicateKeyError,
}