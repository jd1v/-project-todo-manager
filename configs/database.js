const mongoose = require('mongoose');

const createDb = () => {
    async function connect(url, options = {}) {
        if (!url || typeof url !== 'string') {
            throw new Error('MongoDB URI must be a non-empty string.');
        }

        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        const defaultOptions = {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        };

        await mongoose.connect(url, { ...defaultOptions, ...options });
        return mongoose.connection;
    }

    async function disconnect() {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }

    function getDb() {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database is not connected. Call connect() first.');
        }
        return mongoose.connection;
    }

    return {connect, disconnect, getDb};
}
module.exports = {createDb};