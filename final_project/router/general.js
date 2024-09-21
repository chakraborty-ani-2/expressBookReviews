const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
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
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    try {
        return res.status(200).json({
            message: "success",
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
        return res.status(200).json({
            message: "success",
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
            message: "success",
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
            message: "success",
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
        const reviews = books[requestedIsbn].reviews
        return res.status(200).json({
            message: "success",
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
