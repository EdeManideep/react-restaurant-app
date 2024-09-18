const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import the pg module

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json()); // To parse JSON bodies

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: 'manideep',
    host: 'react-food-app-items-cluster-16204.8nj.gcp-europe-west1.cockroachlabs.cloud',
    database: 'react_food_app_db',
    password: 'Y17GIeZgvBGntlrNu9n8VA',
    port: 26257,
    ssl: {
        rejectUnauthorized: false, // Set to true in production for security
    },
});

// Function to query the database using promises
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.rows); // PostgreSQL returns rows in 'results.rows'
        });
    });
};

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

// Define a route to fetch items from the database
app.get('/items', async (req, res) => {
    try {
        const queryStr = 'SELECT * FROM Items'; // Adjust the table name if necessary
        const results = await query(queryStr);
        res.json(results); // Send the results as JSON
    } catch (err) {
        console.error('Error fetching items from PostgreSQL database:', err);
        res.status(500).send('Error fetching items');
    }
});

// Define a route to add a new item to the database
app.post('/add-item', async (req, res) => {
    const { name, category, price, image, description, count_products_available } = req.body;
    
    // Check if all required fields are provided
    if (!name || !category || !price || !image || !description || !count_products_available) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        const queryStr = `INSERT INTO Items (name, category, price, image, description, count_products_available)
                          VALUES ($1, $2, $3, $4, $5, $6)`;
        const values = [name, category, price, image, description, count_products_available];
        
        await query(queryStr, values);
        res.status(200).json({ message: 'Item added successfully' });
    } catch (err) {
        console.error('Error inserting item:', err);
        res.status(500).json({ error: 'Failed to insert item' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
