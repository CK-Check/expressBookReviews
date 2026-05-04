const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username & password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // Check if user is valid
  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!validUser) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }

  // Create JWT token
  const accessToken = jwt.sign(
    { username: username },
    "access",
    { expiresIn: "1h" }
  );

  // Store token in session
  req.session.authorization = {
    accessToken: accessToken,
    username: username
  };

  return res.status(200).json({
    message: "Login successful",
    token: accessToken
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    // Check if review is provided
    if (!review) {
      return res.status(400).json({
        message: "Review is required"
      });
    }
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    // Initialize reviews object if not present
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    // Check if reviews exist for the book
    if (!books[isbn].reviews) {
      return res.status(404).json({
        message: "No reviews found for this book"
      });
    }
  
    // Check if user has written a review
    if (!books[isbn].reviews[username]) {
      return res.status(403).json({
        message: "You can only delete your own review or no review exists"
      });
    }
  
    // Delete user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
