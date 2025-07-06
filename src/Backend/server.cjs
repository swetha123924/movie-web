const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const registrationRoutes = require('./registration.cjs');
const userDataRoutes = require('./userdata.cjs');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "movie",
    port: 5432,
});

// Connect to the database and create the users and wishlists tables if they don't exist
client.connect()
    .then(() => {
        return Promise.all([
            client.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )
            `),
            client.query(`
                CREATE TABLE IF NOT EXISTS wishlists(
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    movie_id VARCHAR(255) NOT NULL
                )
            `)
        ]);
    })
    .catch(err => console.log(err.stack));

// Use the routes
app.use('/api', registrationRoutes);
app.use('/api', userDataRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});