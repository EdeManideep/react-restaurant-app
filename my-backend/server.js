const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12728938',
    password: '2JxXpelIlK',
    database: 'sql12728938'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

// Define a route to fetch items from the database
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM `Item\'s Data For React Food App`'; // Adjust the table name if necessary
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching items from MySQL database:', err);
            res.status(500).send('Error fetching items');
            return;
        }
        res.json(results); // Send the results as JSON
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
