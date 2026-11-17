
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = "my_secret_key";

app.use(express.json());

let db;

// Register API
app.post("/register/", async (req, res) => {
    try {
        const { username, name, password } = req.body;

        // Validate input
        if (!username || !name || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing username
        const existingUser = await db.get(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        await db.run(
            `INSERT INTO users (username, name, password)
             VALUES (?, ?, ?)`,
            [username, name, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Login API
app.post("/login/", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user
        const user = await db.get(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (!user) {
            return res.status(400).json({
                message: "Invalid username"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { username: username },
            JWT_SECRET
        );

        res.status(200).json({
            jwt_token: jwtToken
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// Start server after database connection
async function startServer() {
    try {
        db = await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
    }
}

startServer();
