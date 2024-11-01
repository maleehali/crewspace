require('dotenv').config();
const { Client } = require('pg');

// Determine if SSL is required
const ssl = process.env.DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: ssl,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
