const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const secretKey = 'apex_purchase_manager';
const dbPath = path.resolve(__dirname, 'purchase_manager.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

app.use(express.json());
app.use(cors());

let db; // Database variable

// Initialize the database connection
function initializeDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');

            // Read the schema.sql file
            fs.readFile(schemaPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading schema file:', err.message);
                    return;
                }

                // Execute the schema SQL
                db.exec(data, (execErr) => {
                    if (execErr) {
                        console.error('Error executing schema SQL:', execErr.message);
                    } else {
                        console.log('Database initialized with schema.');
                    }
                });
            });
        }
    });
}


app.get('/getPurchases', authenticateToken, (req, res) => {
    const query = `
        SELECT 
            purchases.id, 
            purchases.date_of_purchase, 
            companies.company_name, 
            items.item_name, 
            purchases.quantity, 
            purchases.delivery_memo_number,
            purchases.cost, 
            customers.customer_name, 
            purchases.purchase_description
        FROM 
            purchases
        JOIN 
            companies ON purchases.company = companies.id
        JOIN 
            items ON purchases.item = items.id
        JOIN 
            customers ON purchases.customer = customers.id
        WHERE 
            companies.id = (SELECT company FROM users WHERE id = ?)
    `;

    db.all(query, [req.user.id], (err, rows) => { 
        if (err) {
            console.error('Error fetching purchases:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(rows);
    });
});



// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is missing' }); // No token, unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' }); // Token is invalid
        }
        req.user = user; // Store the user info in the request object
        next(); // Proceed to the next middleware/route handler
    });
}

// Route to authenticate token
app.get('/authenticateToken', authenticateToken, (req, res) => {
    return res.status(200).json({ done: true, admin: req.user.isAdmin });
});

// Route to register a user
app.post('/registerUser', (req, res) => {
    const { username, pass, is_admin, phone_number, email, company } = req.body;
    const query = `INSERT INTO users (username, pass, is_admin, phone_number, email, company) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [username, pass, is_admin, phone_number, email, company], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route to register a company
app.post('/registerCompany', (req, res) => {
    const { name, address, mobile, email } = req.body;

    if (!name || !address || !mobile || !email) {
        return res.status(400).json({ error: 'All fields are required' }); // Validation
    }

    const query = `INSERT INTO companies (company_name, company_address, mobile, email) VALUES (?, ?, ?, ?)`;

    db.run(query, [name, address, mobile, email], function (err) {
        if (err) {
            console.error('Error inserting company:', err.message);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        res.status(201).json({ message: 'Company registered successfully', companyId: this.lastID });
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ?";
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error('Error querying the database:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (user.pass !== password) {
            console.log("Password incorrect");
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, isAdmin: user.is_admin },
            secretKey,
            { expiresIn: '4h' }
        );

        return res.status(200).json({ message: 'Login successful', token });
    });
});

// Start the server and initialize the database
app.listen(2000, '0.0.0.0', () => {
    initializeDatabase();
    console.log(`\n\n\t\t\x1b[37m[+] Apex Purchase Manager server has started on \x1b[36mhttp://0.0.0.0:2000\n\x1b[37m`);
});

// Handle graceful shutdown
process.on('exit', () => {
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing the database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    }
});
