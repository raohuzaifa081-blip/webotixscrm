const app = require('../server/app');

// Vercel serverless function handler
// Export the Express app directly - Vercel will handle routing
module.exports = app;
