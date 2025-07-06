const express = require('express');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
const bcrypt = require('bcrypt'); // Fixed typo from 'bcyrpt' to 'bcrypt'
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin (your React app)
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    credentials: true // Allow credentials (if needed)
}));

app.use(express.json()); // Middleware to parse JSON bodies

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "movie",
    port: 5432,
});

client.connect()
    .then(() => {
        return client.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        `);
    })
    .catch(err => console.log(err.stack));

// Registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);

        const storeDetails = await client.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, hashPassword]
        );
        const newUser  = storeDetails.rows[0];
        res.status(201).json({ id: newUser .id, name: newUser .name, email: newUser .email });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error registering user" });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            // User found and password matches
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            // User not found or password does not match
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// const express = require('express');
// const bcrypt = require('bcrypt');
// const { Client } = require('pg');

// const router = express.Router();
// const client = new Client({
//     host: "localhost",
//     user: "postgres",
//     password: "password",
//     database: "movie",
//     port: 5432,
// });

// // Registration endpoint
// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const hashPassword = await bcrypt.hash(password, 10);
//         const storeDetails = await client.query(
//             `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
//             [name, email, hashPassword]
//         );
//         const newUser  = storeDetails.rows[0];
//         res.status(201).json({ id: newUser .id, name: newUser .name, email: newUser .email });
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ message: "Error registering user" });
//     }
// });

// module.exports = router;