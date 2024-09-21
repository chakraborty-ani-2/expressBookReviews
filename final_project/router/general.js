const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // Check if both username and password are provided
        if (username && password) {
            // Check if the user does not already exist
            if (!doesExist(username)) {
                // Add the new user to the users array
                users.push({ "username": username, "password": password });
                return res.status(200).json({ message: "User successfully registered. Now you can login" });
            } else {
                return res.status(404).json({ message: "User already exists!" });
            }
        }
        // Return error if username or password is missing
        return res.status(404).json({ message: "Unable to register user." });
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    try {
        return res.status(200).json({
            success: true,
            message: "All books fetched successfully!",
            data: books
        });
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const requestedIsbn = req.params.isbn
        const book = books[requestedIsbn]

        // Check if the book exists
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found." });
        }

        return res.status(200).json({
            success: true,
            message: "Book fetched successfully!",
            data: book
        });
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
        const requestedAuthor = req.params.author
        const result = [];
        for (const key in books) {
            if (books[key].author.toLowerCase() === requestedAuthor.toLowerCase()) {
                result.push(books[key]);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Books fetched successfully!",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    try {
        const requestedTitle = req.params.title
        const result = [];
        for (const key in books) {
            if (books[key].title.toLowerCase() === requestedTitle.toLowerCase()) {
                result.push(books[key]);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Books fetched successfully!",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    try {
        const requestedIsbn = req.params.isbn
        const book = books[requestedIsbn]

        // Check if the book exists
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found." });
        }

        const reviews = book.reviews
        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully!",
            data: reviews
        });
    } catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message
        });
    }
});

module.exports.general = public_users;
