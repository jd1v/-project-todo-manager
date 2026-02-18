require('module-alias/register');
require('dotenv').config();
const app = require('./app');
const database = require('./configs/database');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;
const db = database.createDb();
const url = process.env.DB_URL || 'mongodb://localhost:27017';

(async () => {
   logger.info('Starting Application', {
       env: process.env.NODE_ENV,
       pid: process.pid
   });
   try {
       await db.connect(url);
       logger.info('Database connected successfully', {
           dbUrl: process.env.DB_URL.replace(/\/\/.*@/, '//***@'),
       });
       const server = app.listen(port, () => {
           logger.info('HTTP server started', {
               port: process.env.PORT,
           });
       });
       let shuttingDown = false;
       const shutdown = async (signal) => {
           if (shuttingDown) return null;
           shuttingDown = true;
           logger.warn('Graceful shutdown initiated', {
               signal,
           });
           await new Promise(resolve => server.close(resolve));
           logger.info('HTTP server closed');
           await db.disconnect();
           logger.info('Database disconnected');
           logger.info('Shutdown completed');
           process.exit(0);
       }
       process.on('SIGINT', shutdown);
       process.on('SIGTERM', shutdown);
   } catch (err) {
       logger.error('Error during shutdown', {
           error: err,
       });
       process.exit(1);
   }
})()

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
    process.exit(1);
});