const express = require('express');
const session = require('express-session');
const path = require('path');
const { pool, initializeDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize database on startup
initializeDB();

// Routes
app.get('/form', (req, res) => {
  res.render('index');
});

// Registration route
app.post('/register', async (req, res) => {

    try {
        const { username, email, password, town } = req.body;
        
        // Validate input
        if (!username || !email || !password || !town) {
            return res.status(400).json({ 
                error: 'All fields are required' 
            });
        }

        // Get connection from pool
        const connection = await pool.getConnection();
        
        // Check if user already exists
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            connection.release();
            return res.status(409).json({ 
                error: 'Username or email already exists' 
            });
        }

        // Insert new user
        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password, town) VALUES (?, ?, ?, ?)',
            [username, email, password, town]
        );

        connection.release();

        res.status(201).json({ 
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});