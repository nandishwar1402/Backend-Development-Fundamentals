# LAB 04 – USER REGISTRATION, LOGIN AND JWT AUTHENTICATION

## 1. Project Overview

This project implements a User Registration and Login Authentication System using Node.js and Express.js. It allows users to create accounts, securely store their passwords, and log in using their registered credentials.

The application uses SQLite as its database to store user information. Passwords are encrypted using bcrypt hashing before being stored in the database. JSON Web Token (JWT) is used to generate authentication tokens after successful login.

The main objective of this lab is to understand backend development concepts, REST API creation, database connectivity, password security, and token-based authentication.

## 2. Student Details

- **Name:** H. Nandishwar Reddy
- **Registration Number:** 252U1R6097
- **Section:** AIML 2B
- **Subject:** Backend Development Fundamentals
- **Lab Number:** 04
- **Project Title:** User Registration, Login and JWT Authentication

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Backend web framework |
| SQLite | Database management |
| sqlite3 | SQLite database driver |
| sqlite | Promise-based SQLite interface |
| bcrypt | Password hashing |
| jsonwebtoken | JWT token generation |
| Postman | API testing |
| Git | Version control |
| GitHub | Source code hosting |
| Render | Application deployment |

## 4. Project Objectives

1. To understand Node.js and Express.js.
2. To create RESTful API endpoints.
3. To implement user registration functionality.
4. To store user information in an SQLite database.
5. To understand password hashing using bcrypt.
6. To implement user login functionality.
7. To generate JWT authentication tokens.
8. To validate user credentials.
9. To test APIs using Postman.
10. To deploy a backend application using Render.

## 5. Project Structure

```text
lab-04/
│
├── server.js
├── database.js
├── package.json
├── package-lock.json
├── README.md
│
├── screenshots/
│   ├── registration.png
│   ├── login.png
│   └── wrong-password.png
│
├── .gitignore
│
└── users.db
```
![alt text](<Screenshot 2026-11-17 073917.png>) ![alt text](<Screenshot 2026-11-17 074209.png>) ![alt text](<Screenshot 2026-11-17 074356.png>) ![alt text](<Screenshot 2026-11-17 075334.png>) ![alt text](<Screenshot 2026-11-17 075632.png>) ![alt text](<Screenshot 2026-11-17 075808.png>) ![alt text](<Screenshot 2026-11-17 080035.png>)
![alt text](<Screenshot 2026-11-17 080641.png>) ![alt text](<Screenshot 2026-11-17 081628.png>) ![alt text](<Screenshot 2026-11-17 081712.png>)

**File Description:**

- `server.js` – Contains the Express server and API endpoint implementations.
- `database.js` – Establishes the SQLite database connection and creates the users table.
- `package.json` – Contains project details, scripts, and dependencies.
- `package-lock.json` – Maintains exact dependency versions.
- `README.md` – Provides project documentation.
- `screenshots/` – Stores screenshots of API testing.
- `.gitignore` – Prevents unnecessary files from being uploaded to GitHub.
- `users.db` – Local SQLite database file created when the application runs.

## 6. Database Design

The project uses SQLite to store registered user information.

**Database Name:** users.db

**Table Name:** users

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| username | TEXT | Unique username |
| name | TEXT | User's full name |
| password | TEXT | Hashed password |

### Database Operations

1. Connects to the SQLite database.
2. Creates the users table if it does not already exist.
3. Checks whether a username already exists.
4. Inserts new user information.
5. Retrieves user information during login.

## 7. Installation and Setup

### Prerequisites

Install the following software:

- Node.js
- npm
- Visual Studio Code or any text editor
- Postman

### Step 1: Clone the Repository

```bash
git clone https://github.com/nandishwar1402/Backend-Development-Fundamentals.git
```

### Step 2: Navigate to the Project

```bash
cd Backend-Development-Fundamentals/lab-04
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Server

```bash
npm start
```

### Expected Output

```text
Database connected successfully
Server running at http://localhost:3000
```

The application is now running locally.

## 8. API Documentation

The project contains three main API endpoints.

### 8.1 Home API

**Endpoint:** `/`

**Method:** GET

**Description:** Checks whether the backend application is running successfully.

**Response:**

```text
Lab 04 JWT Authentication API is running successfully!
```

**Status Code:** 200 OK

### 8.2 User Registration API

**Endpoint:** `/register/`

**Method:** POST

**Description:** Registers a new user by accepting username, name, and password.

**Request Body:**

```json
{
    "username": "nandishwar",
    "name": "Nandishwar Reddy",
    "password": "test123"
}
```

**Successful Response:**

```json
{
    "message": "User registered successfully"
}
```

**Status Code:** 201 Created

**Other Possible Responses:**

Missing fields:

```json
{
    "message": "All fields are required"
}
```

Existing username:

```json
{
    "message": "Username already exists"
}
```

**Registration Process:**

1. The user submits registration details.
2. The server receives the request.
3. It checks whether all required fields are provided.
4. It checks whether the username already exists.
5. The password is hashed using bcrypt.
6. User information is inserted into the SQLite database.
7. A success response is returned.

### 8.3 User Login API

**Endpoint:** `/login/`

**Method:** POST

**Description:** Authenticates a registered user using their username and password.

**Request Body:**

```json
{
    "username": "nandishwar",
    "password": "test123"
}
```

**Successful Response:**

```json
{
    "jwt_token": "generated_jwt_token"
}
```

**Status Code:** 200 OK

**Invalid Username Response:**

```json
{
    "message": "Invalid username"
}
```

**Invalid Password Response:**

```json
{
    "message": "Invalid password"
}
```

**Login Process:**

1. The user submits their username and password.
2. The server searches for the username in SQLite.
3. It retrieves the stored hashed password.
4. bcrypt compares the entered password with the stored hash.
5. If the credentials are correct, JWT generates an authentication token.
6. The server returns the generated token as a JSON response.

## 9. Password Hashing Using bcrypt

Password hashing is an important security feature in this project.

The application uses bcrypt to convert the original password into a hashed value before storing it in the database.

Example:

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

During login, the entered password is compared with the stored hashed password.

```javascript
const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);
```

This approach avoids storing original passwords directly in the database.

## 10. JSON Web Token (JWT)

JSON Web Token is used to generate a token after successful user authentication.

The project uses the `jsonwebtoken` package.

Example:

```javascript
const jwtToken = jwt.sign(
    { username: username },
    JWT_SECRET
);
```

The generated JWT contains the username in its payload.

### JWT Structure

A JWT contains three parts:

1. Header – Contains the token type and signing algorithm.
2. Payload – Contains the information stored in the token.
3. Signature – Used to verify the token's integrity.

These three parts are separated by dots.

JWT helps implement token-based authentication in backend applications.

**Security Note:** In a production application, the JWT secret should be stored in an environment variable and tokens should have an appropriate expiration time.

## 11. API Testing Using Postman

Postman was used to test the application endpoints.

The following test cases were performed:

| Test Case | Request | Expected Result | Status |
|---|---|---|---|
| Home API | GET `/` | Homepage success message | Passed |
| User Registration | POST `/register/` | User registered successfully | Passed |
| Valid Login | POST `/login/` | JWT token generated | Passed |
| Invalid Password | POST `/login/` | Invalid password | Passed |

### Testing Results

- The homepage returned a successful response.
- A new user was registered successfully.
- The registered user logged in successfully.
- A JWT token was generated after successful authentication.
- Login with an incorrect password returned an error message.

## 12. Deployment Using Render

The backend application was deployed using Render.

**Deployment Platform:** Render

**GitHub Repository:**

https://github.com/nandishwar1402/Backend-Development-Fundamentals

**Live Application URL:**

https://backend-development-fundamentals-1-l01w.onrender.com

### Deployment Configuration

| Setting | Value |
|---|---|
| Service Type | Web Service |
| Runtime | Node.js |
| Branch | main |
| Root Directory | lab-04 |
| Build Command | npm install |
| Start Command | npm start |

### Deployment Steps

1. The project was pushed to GitHub.
2. A new Web Service was created on Render.
3. The GitHub repository was connected.
4. The root directory was configured as `lab-04`.
5. The build command was configured as `npm install`.
6. The start command was configured as `npm start`.
7. Render installed the required dependencies.
8. The application was successfully deployed.
9. The live URL was tested using a browser and Postman.

### Live Deployment Verification

The deployed homepage returned:

```text
Lab 04 JWT Authentication API is running successfully!
```

The registration and login endpoints were also tested successfully on the deployed application.

**Note:** The SQLite database used in this deployment is stored in the service's local filesystem. On Render's free instance, database data may not persist across restarts or redeployments. Persistent storage or a managed database is recommended for production use.

## 13. Important Concepts Learned

### Node.js
Learned how to execute JavaScript code on the server side using Node.js.

### Express.js
Learned how to create an Express application and define routes for handling HTTP requests.

### REST APIs
Understood how GET and POST methods are used to communicate between clients and servers.

### SQLite
Learned how to connect an application to an SQLite database and perform database operations.

### bcrypt
Understood the importance of password hashing and