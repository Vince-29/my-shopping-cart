const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Blank password by default in Laragon
    database: 'shopping_cart',
    port: 3306
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// API Endpoints

// Get all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM Product', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    db.query(
        'SELECT * FROM Product WHERE product_id = ?',
        [productId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(results[0]);
        }
    );
});

// Gets all sales orders
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            so.order_id,
            so.total_amount,
            so.created_at,
            soi.product_id,
            soi.quantity,
            p.name AS product_name,
            p.price AS unit_price
        FROM SalesOrder so
        JOIN SalesOrderItem soi ON so.order_id = soi.order_id
        JOIN Product p ON soi.product_id = p.product_id
    `;

    db.query(query, (err, results) => {
        // ... error handling
        // Group items by order
        const orders = results.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    total_amount: row.total_amount,
                    created_at: row.created_at,
                    items: []
                };
            }
            acc[row.order_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                unit_price: row.unit_price,
                quantity: row.quantity
            });
            return acc;
        }, {});

        res.json(Object.values(orders));
    });
});

// Create new order
app.post('/api/orders', (req, res) => {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid request format' });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: err.message });

        // Calculate total amount
        let total = 0;
        const productUpdates = [];

        items.forEach(item => {
            db.query(
                'SELECT price, stock_quantity FROM Product WHERE product_id = ?',
                [item.product_id],
                (err, results) => {
                    if (err) return rollback(res, err);
                    if (results.length === 0) return rollback(res, 'Product not found');
                    if (results[0].stock_quantity < item.quantity) return rollback(res, 'Insufficient stock');

                    total += results[0].price * item.quantity;
                    productUpdates.push({
                        product_id: item.product_id,
                        quantity: item.quantity
                    });

                    if (productUpdates.length === items.length) {
                        createOrder(total, productUpdates, res);
                    }
                }
            );
        });
    });
});

function createOrder(total, productUpdates, res) {
    db.query(
        'INSERT INTO SalesOrder (total_amount) VALUES (?)',
        [total],
        (err, results) => {
            if (err) return rollback(res, err);

            const orderId = results.insertId;
            const placeholders = productUpdates.map(() => '(?, ?, ?)').join(',');
            const values = productUpdates.flatMap(p => [orderId, p.product_id, p.quantity]);

            db.query(
                `INSERT INTO SalesOrderItem (order_id, product_id, quantity) VALUES ${placeholders}`,
                values,
                (err) => {
                    if (err) return rollback(res, err);

                    // Update product stock
                    productUpdates.forEach(p => {
                        db.query(
                            'UPDATE Product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
                            [p.quantity, p.product_id],
                            (err) => {
                                if (err) return rollback(res, err);
                            }
                        );
                    });

                    db.commit(err => {
                        if (err) return rollback(res, err);
                        res.json({
                            message: 'Order created successfully',
                            order_id: orderId,
                            total_amount: total
                        });
                    });
                }
            );
        }
    );
}

function rollback(res, err) {
    db.rollback(() => {
        res.status(500).json({ error: err.message || err });
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});