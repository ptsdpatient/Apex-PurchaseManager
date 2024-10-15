const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const secretKey='apex_live_auth'
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'purchase_manager.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');


app.use(express.json());
app.options("*",cors());
app.use(cors())

app.get("/",async(req,res)=>{
    printLog("hello")
})







function initializeDatabase() {
    // Open a connection to the SQLite database (creates the file if it doesn't exist)
    const db = new sqlite3.Database(dbPath, (err) => {
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

                    // Close the database after the initialization
                    db.close((closeErr) => {
                        if (closeErr) {
                            console.error('Error closing the database:', closeErr.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                });
            });
        }
    });
}

// Check if the database file exists
if (!fs.existsSync(dbPath)) {
    console.log('Database file not found, creating and initializing...');
    initializeDatabase();
} else {
    console.log('Database already exists.');
}


app.listen(2000,'0.0.0.0', () => {
    initializeDatabase()
    console.log(`\n\n\t\t\x1b[37m[+] Apex Purchase Manager server has started on \x1b[36mhttp://0.0.0.0:${2000}\n\x1b[37m`);
});
