const { Client } = require('pg');

const client = new Client({
    user: 'maleehaanamali@gmail.com', // replace with your username
    host: 'localhost',
    database: 'employee_db',
    password: 'codingshiz', // replace with your password
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;
