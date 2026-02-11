const {createLogger, transports, format} = require('winston');
const isProduction = process.env.NODE_ENV === 'production';

const logger = createLogger({
    level: isProduction ? 'info' : 'debug',
    format: format.combine(
        format.timestamp(),
        format.errors({stack: true}),
        format.printf(({level, message, timestamp, stack, ...meta}) => {
            return JSON.stringify({
                timestamp,
                level,
                message,
                stack,
                ...meta,
            })
        }),
    ),
    transports: [
        new transports.Console({
            silent: process.env.NODE_ENV === 'test',
        }),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),

        new transports.File({
            filename: 'logs/combined.log',
        }),
    ],
    exitOnError: false
});
module.exports = logger;