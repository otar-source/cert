const { pool } = require('./config/db');

async function registerUser(userData) {
    try {
        const { username, email, password, town } = userData;
        
        const connection = await pool.getConnection();
        
        // Insert user
        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password, town) VALUES (?, ?, ?, ?)',
            [username, email, password, town]
        );

        connection.release();
        
        return {
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        };
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return {
                success: false,
                error: 'Username or email already exists'
            };
        }
        
        return {
            success: false,
            error: 'Database error: ' + error.message
            
        };
    }
}

module.exports = { registerUser };