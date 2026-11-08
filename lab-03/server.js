
const express = require('express');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. GET all books with search, sorting, pagination and price filter
app.get('/books', (req, res) => {
    const {
        search_q = '',
        order_by = 'id',
        order = 'ASC',
        limit = '10',
        offset = '0',
        min_price,
        max_price
    } = req.query;

    const allowedColumns = ['id', 'title', 'author', 'price'];
    const sortOrder = order.toUpperCase();

    if (!allowedColumns.includes(order_by)) {
        return res.status(400).json({
            message: 'Invalid order_by column'
        });
    }

    if (!['ASC', 'DESC'].includes(sortOrder)) {
        return res.status(400).json({
            message: 'Order must be ASC or DESC'
        });
    }

    const limitValue = Number(limit);
    const offsetValue = Number(offset);

    if (!Number.isInteger(limitValue) || limitValue <= 0 ||
        !Number.isInteger(offsetValue) || offsetValue < 0) {
        return res.status(400).json({
            message: 'Invalid limit or offset'
        });
    }

    const conditions = [];
    const params = [];

    if (search_q) {
        conditions.push('title LIKE ?');
        params.push(`%${search_q}%`);
    }

    if (min_price !== undefined) {
        if (min_price.trim() === '' || !Number.isFinite(Number(min_price))) {
            return res.status(400).json({
                message: 'min_price must be a valid number'
            });
        }

        conditions.push('price >= ?');
        params.push(Number(min_price));
    }

    if (max_price !== undefined) {
        if (max_price.trim() === '' || !Number.isFinite(Number(max_price))) {
            return res.status(400).json({
                message: 'max_price must be a valid number'
            });
        }

        conditions.push('price <= ?');
        params.push(Number(max_price));
    }

    if (min_price !== undefined && max_price !== undefined &&
        Number(min_price) > Number(max_price)) {
        return res.status(400).json({
            message: 'min_price cannot be greater than max_price'
        });
    }

    let sql = 'SELECT * FROM books';

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

    params.push(limitValue, offsetValue);

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to fetch books'
            });
        }

        res.status(200).json(rows);
    });
});

// 2. GET a single book by ID
app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid book ID'
        });
    }

    db.get('SELECT * FROM books WHERE id = ?', [id], (err, book) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to fetch book'
            });
        }

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json(book);
    });
});

// 3. POST a new book
app.post('/books', (req, res) => {
    const { title, author, price } = req.body || {};

    if (typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === undefined || price === null ||
        (typeof price !== 'number' && typeof price !== 'string') ||
        String(price).trim() === '' || !Number.isFinite(Number(price))) {

        return res.status(400).json({
            message: 'Title, author and a valid numeric price are required'
        });
    }

    db.run(
        'INSERT INTO books (title, author, price) VALUES (?, ?, ?)',
        [title.trim(), author.trim(), Number(price)],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Failed to create book'
                });
            }

            res.status(201).json({
                message: 'Book created successfully',
                id: this.lastID
            });
        }
    );
});

// 4. PUT update an existing book
app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, author, price } = req.body || {};

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid book ID'
        });
    }

    if (typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === undefined || price === null ||
        (typeof price !== 'number' && typeof price !== 'string') ||
        String(price).trim() === '' || !Number.isFinite(Number(price))) {

        return res.status(400).json({
            message: 'Title, author and a valid numeric price are required'
        });
    }

    db.run(
        'UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?',
        [title.trim(), author.trim(), Number(price), id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Failed to update book'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.status(200).json({
                message: 'Book updated successfully'
            });
        }
    );
});

// 5. DELETE a book
app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid book ID'
        });
    }

    db.run('DELETE FROM books WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({
                message: 'Failed to delete book'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json({
            message: 'Book deleted successfully'
        });
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON body'
        });
    }

    res.status(500).json({
        message: 'Internal server error'
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
