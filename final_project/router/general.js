const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get all books using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBook
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 3 & Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooks = new Promise((resolve, reject) => {
    let matches = [];
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matches.push(books[key]);
      }
    });
    if (matches.length > 0) resolve(matches);
    else reject({ status: 404, message: "No books found for this author" });
  });

  getBooks
    .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 4 & Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooks = new Promise((resolve, reject) => {
    let matches = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matches.push(books[key]);
      }
    });
    if (matches.length > 0) resolve(matches);
    else reject({ status: 404, message: "No books found with this title" });
  });

  getBooks
    .then((result) => res.status(200).send(JSON.stringify(result, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
