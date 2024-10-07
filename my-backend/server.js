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


// PUT route to update an item by ID
app.put('/update-item/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, price, image, description, count_products_available } = req.body;

    if (!name || !category || !price || !image || !description || !count_products_available || !id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const queryStr = `
            UPDATE Items
            SET name = $1, category = $2, price = $3, image = $4, description = $5, count_products_available = $6
            WHERE id = $7`;
        const values = [name, category, price, image, description, count_products_available, id];
        await query(queryStr, values);
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Route to delete an item by ID
app.delete('/delete-item/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const queryStr = 'DELETE FROM Items WHERE id = $1';
        await query(queryStr, [id]);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Route to add items to the cart
app.post('/add-cart-item', async (req, res) => {
    const { user_id, user_name, order_status, cart_items } = req.body;

    // Check if all required fields are provided
    if (!user_id || !user_name || !order_status || !cart_items || !Array.isArray(cart_items)) {
        return res.status(400).json({ error: 'Invalid input: All fields are required and cart_items must be an array' });
    }

    try {
        // Loop through the items in the cart and insert each one into the Orders table
        for (const item of cart_items) {
            const { item_name, quantity, itemId } = item;

            if (!item_name || !quantity || !itemId) {
                return res.status(400).json({ error: 'Invalid input: Each cart item must contain item_name, quantity, and itemId' });
            }

            const queryStr = `INSERT INTO orders (user_id, user_name, order_status, item_name, quantity, item_id) VALUES ($1, $2, $3, $4, $5, $6)`;
            const values = [user_id, user_name, order_status, item_name, quantity, itemId];

            // Execute the query for each item
            await pool.query(queryStr, values); // Make sure to use 'pool.query' for executing the query
        }

        // Clear the cart after adding items to the database (can be handled client-side)
        res.status(200).json({ message: 'Cart items added successfully' });
    } catch (err) {
        console.error('Error adding cart items:', err.message || err);
        res.status(500).json({ error: 'Failed to add cart items', details: err.message });
    }
});


// Route to fetch orders
app.get('/orders', async (req, res) => {
    try {
        const queryStr = 'SELECT * FROM orders';
        const results = await query(queryStr);
        res.json(results);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Error fetching orders');
    }
});

// Route to update order status
app.put('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
        return res.status(400).json({ error: 'Order status is required' });
    }

    try {
        const queryStr = 'UPDATE orders SET order_status = $1 WHERE order_id = $2';
        await query(queryStr, [order_status, id]);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// GET route to fetch available quantity by item name
app.get('/item-availability/:item_id', async (req, res) => {
    const { item_id } = req.params;

    try {
        const queryStr = 'SELECT count_products_available FROM Items WHERE id = $1';
        const values = [item_id];

        const result = await pool.query(queryStr, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const availableCount = result.rows[0].count_products_available;
        res.status(200).json({ available_count: availableCount });
    } catch (error) {
        console.error('Error fetching available quantity:', error);
        res.status(500).json({ error: 'Failed to fetch available quantity' });
    }
});

// PUT route to update available count by item name
app.put('/update-available-count/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const { count_products_available } = req.body;

    // Ensure that count_products_available is provided and is a valid number
    if (count_products_available == null || isNaN(count_products_available)) {
        return res.status(400).json({ error: 'Valid count_products_available is required' });
    }

    try {
        const queryStr = `
            UPDATE Items
            SET count_products_available = $1
            WHERE id = $2
        `;
        const values = [count_products_available, item_id];

        const result = await pool.query(queryStr, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Available count updated successfully' });
    } catch (error) {
        console.error('Error updating available count:', error);
        res.status(500).json({ error: 'Failed to update available count' });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});