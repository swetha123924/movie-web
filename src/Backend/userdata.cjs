const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

const router = express.Router();
const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "movie",
    port: 5432,
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to add a movie to the user's wishlist
router.post('/wishlist', async (req, res) => {
    const { userId, movieId } = req.body;

    try {
        const result = await client.query(
            `INSERT INTO wishlists (user_id, movie_id) VALUES ($1, $2) RETURNING *`,
            [userId, movieId]
        );
        res.status(201).json({ message: 'Movie added to wishlist', movie: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Error adding movie to wishlist' });
    }
});

// Endpoint to get the user's wishlist
router.get('/wishlist/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await client.query('SELECT * FROM wishlists WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;