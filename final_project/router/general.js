const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // Check if user already exists
    let exists = users.find(user => user.username === username);
  
    if (exists) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }
  
    // Add new user
    users.push({
      username: username,
      password: password
    });
  
    return res.status(201).json({
      message: "User registered successfully"
    });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).send(JSON.stringify(books, null, 4));
// });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;

//     const book = books[isbn];
  
//     if (book) {
//       return res.status(200).send(JSON.stringify(book, null, 4));
//     } else {
//       return res.status(404).json({ message: "Book not found" });
//     }
// });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
  
    const allBooks = Object.values(books);
  
    const filteredBooks = allBooks.filter(
      (book) => book.author.toLowerCase() === authorName.toLowerCase()
    );
  
    if (filteredBooks.length > 0) {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
  
    const allBooks = Object.values(books);
  
    const filteredBooks = allBooks.filter(
      (book) => book.title.toLowerCase() === titleName.toLowerCase()
    );
  
    if (filteredBooks.length > 0) {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  
    const book = books[isbn];
  
    if (book) {
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/customer');
  
      return res.status(200).send(
        JSON.stringify(response.data, null, 4)
      );
  
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching books",
        error: error.message
      });
    }
  });

  public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get('http://localhost:5000/customer');
  
      const booksData = response.data;
  
      const book = booksData[isbn];
  
      if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
  
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching book details",
        error: error.message
      });
    }
  });

module.exports.general = public_users;
