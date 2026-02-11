const mongoose = require('mongoose');

const createDb = () => {
    let connection = null;

    async function connect(url, options = {}) {
        if (!url || typeof url !== 'string') {
            throw new Error('MongoDB URI must be a non-empty string.');
        }
        if (connection) return connection;
        const defaultOptions = {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000
        }
        const m = new mongoose.Mongoose();
        await m.connect(url, {...defaultOptions, ...options});
        connection = m.connection;
        return connection;
    }

    async function disconnect() {
        if (!connection) return null;
        await connection.close();
        connection = null;
    }

    function getDb() {
        if (!connection) {
            throw new Error('Database is not connected. Call connect() first.');
        }
        return connection;
    }

    return {connect, disconnect, getDb};
}
module.exports = {createDb};