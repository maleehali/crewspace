require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg'); // Import pg Client to connect to PostgreSQL

// Create a new client using the DATABASE_URL from .env
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Reference the DATABASE_URL from the .env file
  ssl: {
    rejectUnauthorized: false // Enables SSL without verifying the server's certificate
  }
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Export the client so other parts of your app can use it
module.exports = client;
