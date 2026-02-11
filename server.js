require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;

(async () => {
   logger.info('Starting Application', {
       env: process.env.NODE_ENV,
       pid: process.pid
   });
   try {
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