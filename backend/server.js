const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173'
}));

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

app.get('/api/orders', (req, res) => {
    const query = `
        SELECT
            so.order_id,
            CAST(so.total_amount AS DECIMAL(10,2)) as total_amount,
            so.created_at,
            GROUP_CONCAT(CONCAT(soi.quantity, 'x ', p.name) SEPARATOR ', ') AS items,
            SUM(soi.quantity) AS total_items
        FROM SalesOrder so
                 JOIN SalesOrderItem soi ON so.order_id = soi.order_id
                 JOIN Product p ON soi.product_id = p.product_id
        GROUP BY so.order_id
        ORDER BY so.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err); // Add logging
            return res.status(500).json({ error: err.message });
        }
        console.log('Orders results:', results); // Debug logging
        const formattedResults = results.map(order => ({
            ...order,
            items: order.items.split(', ').map(item => {
                const [quantity, ...nameParts] = item.split('x ');
                return {
                    quantity: parseInt(quantity),
                    name: nameParts.join('x ')
                };
            })
        }));
        res.json(formattedResults);
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