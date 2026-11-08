
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./books.db', (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            price REAL NOT NULL
        )
    `);

    db.get('SELECT COUNT(*) AS count FROM books', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row.count === 0) {
            const books = [
                ['Wings of Fire', 'A.P.J. Abdul Kalam', 250],
                ['The Alchemist', 'Paulo Coelho', 300],
                ['Atomic Habits', 'James Clear', 450],
                ['Rich Dad Poor Dad', 'Robert Kiyosaki', 350],
                ['Think Like a Monk', 'Jay Shetty', 400]
            ];

            const statement = db.prepare(
                'INSERT INTO books (title, author, price) VALUES (?, ?, ?)'
            );

            books.forEach((book) => {
                statement.run(book);
            });

            statement.finalize();
            console.log('Sample books inserted');
        }
    });
});

module.exports = db;
