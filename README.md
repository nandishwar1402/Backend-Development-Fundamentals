# Lab 3 – REST API

**Name:** H. Nandishwar Reddy
**Section:** AIML 2B
**Registration Number:** 252U1R6097

## Project Description

This project demonstrates REST API development using Node.js, Express.js and SQLite. It supports book management operations such as creating, reading, updating and deleting books.

## Technologies Used

- Node.js
- Express.js
- SQLite
- Postman

## Installation

```bash
npm install
```

## Run the Project

```bash
npm start
```

Server URL: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | /books   | Get all books    |
| GET    | /books/  | Get a book by ID |
| POST   | /books   | Add a new book   |
| PUT    | /books/  | Update a book    |
| DELETE | /books/  | Delete a book    |

## Query Parameters

- `search_q` – Search books by title
- `order_by` – Sort by a field
- `order` – ASC or DESC
- `limit` – Number of records
- `offset` – Starting position
- `min_price` – Minimum price
- `max_price` – Maximum price

## Validation and Error Handling

- 200 – Successful request
- 201 – Book created
- 400 – Invalid input
- 404 – Book not found
- 500 – Server error

## Screenshots

Postman testing screenshots are available in the `screenshots` folder.

## Deployment

**Live URL:** https://backend-development-fundamentals-n5a8.onrender.com/
**Books API:** https://backend-development-fundamentals-n5a8.onrender.com/books
