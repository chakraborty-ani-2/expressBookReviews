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
            success: false,
            message: "Error registering user!",
            error: error.message
        });
    }

});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await new Promise((resolve) => {
            resolve(books); 
        });

        return res.status(200).json({
            success: true,
            message: "All books fetched successfully!",
            data: allBooks
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching books!",
            error: error.message
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const requestedIsbn = req.params.isbn;

    try {
        // Use a Promise to handle the fetching logic
        const book = await new Promise((resolve, reject) => {
            const foundBook = books[requestedIsbn];

            if (!foundBook) {
                reject({ status: 404, message: "Book not found." });
            } else {
                resolve(foundBook);
            }
        });

        return res.status(200).json({
            success: true,
            message: "Book fetched successfully!",
            data: book
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: "Error fetching book!",
            error: error.message
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const requestedAuthor = req.params.author;

    try {
        const result = await new Promise((resolve) => {
            const matchedBooks = [];

            for (const key in books) {
                if (books[key].author.toLowerCase() === requestedAuthor.toLowerCase()) {
                    matchedBooks.push(books[key]);
                }
            }

            resolve(matchedBooks);
        });

        return res.status(200).json({
            success: true,
            message: "Books fetched successfully!",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching books!",
            error: error.message
        });
    }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const requestedTitle = req.params.title;

    try {
        const result = await new Promise((resolve) => {
            const matchedBooks = [];

            for (const key in books) {
                if (books[key].title.toLowerCase() === requestedTitle.toLowerCase()) {
                    matchedBooks.push(books[key]);
                }
            }

            resolve(matchedBooks);
        });

        return res.status(200).json({
            success: true,
            message: "Books fetched successfully!",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching books!",
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
            success: false,
            message: "Error fetching reviews!",
            error: error.message
        });
    }
});

module.exports.general = public_users;
