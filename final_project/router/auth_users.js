const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // Check if username or password is missing
        if (!username || !password) {
            return res.status(404).json({ message: "Error logging in" });
        }

        // Authenticate user
        if (authenticatedUser(username, password)) {
            // Generate JWT access token
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });

            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        const requiredIsbn = req.params.isbn;
        const { review } = req.query; // Get review from query parameter
        const username = req.session.authorization.username; // Get username from session

        // Ensure the user is logged in
        if (!username) {
            return res.status(403).json({ success: false, message: "User not logged in." });
        }

        // Check if the book exists
        if (!books[requiredIsbn]) {
            return res.status(404).json({ success: false, message: "Book not found." });
        }

        // Check if the user already has a review for this book
        const existingReview = Object.keys(books[requiredIsbn].reviews).find(user => user === username);
        books[requiredIsbn].reviews[username] = review;

        if (existingReview) {
            return res.status(200).json({
                success: true,
                message: "Review updated successfully.",
                book: books[requiredIsbn]
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Review added successfully.",
                book: books[requiredIsbn]
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const requiredIsbn = req.params.isbn;
    const username = req.session.authorization.username; // Get username from session

    // Ensure the user is logged in
    if (!username) {
        return res.status(403).json({ success: false, message: "User not logged in." });
    }

    // Check if the book exists
    if (!books[requiredIsbn]) {
        return res.status(404).json({ success: false, message: "Book not found." });
    }

    // Check if the user has a review for this book
    if (!books[requiredIsbn].reviews[username]) {
        return res.status(404).json({ success: false, message: "Review not found for this user." });
    }

    // Delete the review
    delete books[requiredIsbn].reviews[username];

    return res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
        book: books[requiredIsbn]
    });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
