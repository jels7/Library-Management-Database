/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
PORT = 3325;

// Database
var db = require('./db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



// Render the homepage
app.get('/', function (req, res) {
    res.render('index');
});

// Serve static files AFTER route handlers
app.use(express.static('public_html'));

// Render the patrons page
app.get('/patrons', function (req, res) {
    let query1 = "SELECT * FROM Patrons;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('patrons', { data: rows });
    });
});

// Render the books page
app.get('/books', function (req, res) {
    let query1 = "SELECT * FROM Books;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('books', { data: rows });
    });
});

// Render the genres page
app.get('/genres', function (req, res) {
    let query1 = "SELECT * FROM Genres;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('genres', { data: rows });
    });
});

// Render the donations page
app.get('/donations', function (req, res) {
    let query1 = "SELECT * FROM Donations;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('donations', { data: rows });
    });
});

// Render the borrowed books page
app.get('/borrowed_books', function (req, res) {
    let query1 = "SELECT * FROM BorrowedBooks;";
    db.pool.query(query1, function (error, rows, fields) {
        res.render('borrowed_books', { data: rows });
    });
});

// Add this route to fetch genres
app.get('/get-genres', function (req, res) {
    let query = 'SELECT genreID, genreName FROM Genres';
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});

// Add this route to fetch donations
app.get('/get-donations', function (req, res) {
    let query = 'SELECT donationID, donorName, donationDate FROM Donations';
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});

// Add this route to fetch borrowed books
app.get('/get-borrowed-books', function (req, res) {
    let query = 'SELECT borrowedBookID, patronID, bookID, borrowDate, returnDate, dueDate FROM BorrowedBooks';
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});


// POST ROUTES

// Add a patron via AJAX
app.post('/add-patron-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Patrons (patronName, phoneNum, membershipDate) VALUES ('${data.patronName}', '${data.phoneNum}', '${data.membershipDate}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * on Patrons
            let query2 = `SELECT * FROM Patrons`;
            db.pool.query(query2, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // If all went well, send the results of the query back.
                    res.send(rows);
                }
            });
        }
    });
});

// Add a patron via form submission
app.post('/add-patron-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Patrons (patronName, phoneNum, membershipDate) VALUES ('${data['input-patronName']}', '${data['input-phoneNum']}', '${data['input-membershipDate']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, redirect back to the patrons page
            res.redirect('/patrons');
        }
    });
});

// Add a book via AJAX
app.post('/add-book-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Books (bookTitle, genreID, copiesAvailable) VALUES ('${data.bookTitle}', '${data.genreID}', '${data.copiesAvailable}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * on Books
            let query2 = `SELECT * FROM Books`;
            db.pool.query(query2, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // If all went well, send the results of the query back.
                    res.send(rows);
                }
            });
        }
    });
});

// Add a book via form submission
app.post('/add-book-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Books (bookTitle, genreID, copiesAvailable) VALUES ('${data['input-bookTitle']}', '${data['input-genreID']}', '${data['input-copiesAvailable']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, redirect back to the books page
            res.redirect('/books');
        }
    });
});

// Add a genre via AJAX
app.post('/add-genre-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Genres (genreName) VALUES ('${data.genreName}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, perform a SELECT * on Donations
            let query2 = `SELECT * FROM Genres`;
            db.pool.query(query2, function (error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // If all went well, send the results of the query back.
                    res.send(rows);
                }
            });
        }
    });
});

// Add a genre via form submission
app.post('/add-genre-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Genres (genreName) VALUES ('${data['input-genreName']}')`;
    db.pool.query(query1, function (error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // If there was no error, redirect back to the patrons page
            res.redirect('/genres');
        }
    });
});

// Add donation via AJAX
app.post('/add-donation-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Validate input data
    if (!data.donorName || !data.bookID || !data.donationDate) {
        return res.status(400).send('Invalid input data. Please fill out all fields.');
    }

    // Ensure bookID exists in the Books table
    const checkBookIDQuery = 'SELECT * FROM Books WHERE bookID = ?';
    db.pool.query(checkBookIDQuery, [data.bookID], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            // If bookID does not exist, create a new book entry
            const createBookQuery = 'INSERT INTO Books (bookID, title) VALUES (?, ?)';
            db.pool.query(createBookQuery, [data.bookID, 'Unknown Title'], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Server error');
                }

                // Proceed to add the donation after creating the book entry
                addDonation(data, res);
            });
        } else {
            // Proceed to add the donation if bookID exists
            addDonation(data, res);
        }
    });
});

function addDonation(data, res) {
    // Create the query and run it on the database
    let query1 = `INSERT INTO Donations (donorName, bookID, donationDate) VALUES (?, ?, ?)`;
    db.pool.query(query1, [data.donorName, data.bookID, data.donationDate], function (error, results) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Retrieve the newly added donation
            let query2 = `SELECT * FROM Donations WHERE donationID = ?`;
            db.pool.query(query2, [results.insertId], function (error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Send the newly added donation data back to the client
                    res.json(rows[0]);
                }
            });
        }
    });
}

// Add borrowed book
app.post('/add-borrowed-book-ajax', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Validate input data
    if (!data.patronID || !data.bookID || !data.borrowDate || !data.returnDate || !data.dueDate) {
        return res.status(400).send('Invalid input data. Please fill out all fields.');
    }

    // Ensure bookID exists in the Books table
    const checkBookIDQuery = 'SELECT * FROM Books WHERE bookID = ?';
    db.pool.query(checkBookIDQuery, [data.bookID], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            // If bookID does not exist, create a new book entry
            const createBookQuery = 'INSERT INTO Books (bookID, title) VALUES (?, ?)';
            db.pool.query(createBookQuery, [data.bookID, 'Unknown Title'], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Server error');
                }

                // Proceed to add the borrowed book after creating the book entry
                addBorrowedBook(data, res);
            });
        } else {
            // Proceed to add the borrowed book if bookID exists
            addBorrowedBook(data, res);
        }
    });
});

function addBorrowedBook(data, res) {
    // Create the query and run it on the database
    let query1 = `INSERT INTO BorrowedBooks (patronID, bookID, borrowDate, returnDate, dueDate) VALUES (?, ?, ?, ?, ?)`;
    db.pool.query(query1, [data.patronID, data.bookID, data.borrowDate, data.returnDate, data.dueDate], function (error, results) {
        // Check to see if there was an error
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Retrieve the newly added borrowed book
            let query2 = `SELECT * FROM BorrowedBooks WHERE borrowedBookID = ?`;
            db.pool.query(query2, [results.insertId], function (error, rows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Send the newly added borrowed book data back to the client
                    res.json(rows[0]);
                }
            });
        }
    });
}


// DELETE ROUTE

// Delete a patron via AJAX
app.delete('/delete-patron-ajax', function (req, res) {
    let data = req.body;
    let patronID = parseInt(data.id);
    let deletePatronQuery = `DELETE FROM Patrons WHERE patronID = ?`;

    // Run the delete query
    db.pool.query(deletePatronQuery, [patronID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});
// Delete a book via AJAX
app.delete('/delete-book-ajax', function (req, res) {
    let data = req.body;
    let bookID = parseInt(data.id);
    let deleteBookQuery = `DELETE FROM Books WHERE bookID = ?`;

    // Run the delete query
    db.pool.query(deleteBookQuery, [bookID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Delete a genre via AJAX
app.delete('/delete-genre-ajax', function (req, res) {
    let data = req.body;
    let genreID = parseInt(data.id);
    let deleteGenreQuery = `DELETE FROM Genres WHERE genreID = ?`;

    // Run the delete query
    db.pool.query(deleteGenreQuery, [genreID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Delete a donation via AJAX
app.delete('/delete-donation-ajax', function (req, res) {
    let data = req.body;
    let donationID = parseInt(data.id);
    let deleteDonationQuery = `DELETE FROM Donations WHERE donationID = ?`;

    // Run the delete query
    db.pool.query(deleteDonationQuery, [donationID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Delete a borrowed book via AJAX
app.delete('/delete-borrowed-book-ajax', function (req, res) {
    let data = req.body;
    let borrowedBookID = parseInt(data.id);
    let deleteBorrowedBookQuery = `DELETE FROM BorrowedBooks WHERE borrowedBookID = ?`;

    // Run the delete query
    db.pool.query(deleteBorrowedBookQuery, [borrowedBookID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// PUT ROUTE

// Update a patron via AJAX
app.put('/update-patron-ajax', function (req, res) {
    let data = req.body;

    let patronID = parseInt(data.patronID);
    let patronName = data.patronName;
    let phoneNum = data.phoneNum;
    let membershipDate = data.membershipDate;

    let queryUpdatePatron = `UPDATE Patrons SET patronName = ?, phoneNum = ?, membershipDate = ? WHERE patronID = ?`;
    let selectUpdatedPatron = `SELECT * FROM Patrons WHERE patronID = ?`;

    // Run the update query
    db.pool.query(queryUpdatePatron, [patronName, phoneNum, membershipDate, patronID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to get the updated data
            db.pool.query(selectUpdatedPatron, [patronID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// Update a book via AJAX
app.put('/update-book-ajax', function (req, res) {
    let data = req.body;

    let bookID = parseInt(data.bookID);
    let bookTitle = data.bookTitle;
    let genreID = data.genreID;
    let copiesAvailable = data.copiesAvailable;

    let queryUpdateBook = `UPDATE Books SET bookTitle = ?, genreID = ?, copiesAvailable = ? WHERE bookID = ?`;
    let selectUpdatedBook = `SELECT * FROM Books WHERE bookID = ?`;

    // Run the update query
    db.pool.query(queryUpdateBook, [bookTitle, genreID, copiesAvailable, bookID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to get the updated data
            db.pool.query(selectUpdatedBook, [bookID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// Update a genre via AJAX
app.put('/update-genre-ajax', function (req, res) {
    let data = req.body;

    let genreID = parseInt(data.genreID);
    let genreName = data.genreName;

    let queryUpdateGenre = `UPDATE Genres SET genreName = ? WHERE genreID = ?`;
    let selectUpdatedGenre = `SELECT * FROM Genres WHERE genreID = ?`;

    // Run the update query
    db.pool.query(queryUpdateGenre, [genreName, genreID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to get the updated data
            db.pool.query(selectUpdatedGenre, [genreID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// Update a donation via AJAX
app.put('/update-donation-ajax', function (req, res) {
    let data = req.body;

    let donationID = parseInt(data.donationID);
    let donorName = data.donorName;
    let bookID = data.bookID;
    let donationDate = data.donationDate;

    let queryUpdateDonation = `UPDATE Donations SET donorName = ?, bookID = ?, donationDate = ? WHERE donationID = ?`;
    let selectUpdatedDonation = `SELECT * FROM Donations WHERE donationID = ?`;

    // Run the update query
    db.pool.query(queryUpdateDonation, [donorName, bookID, donationDate, donationID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to get the updated data
            db.pool.query(selectUpdatedDonation, [donationID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// Update a borrowed book via AJAX
app.put('/update-borrowed-book-ajax', function (req, res) {
    let data = req.body;

    let borrowedBookID = parseInt(data.borrowedBookID);
    let patronID = data.patronID;
    let bookID = data.bookID;
    let borrowDate = data.borrowDate;
    let returnDate = data.returnDate;
    let dueDate = data.dueDate;

    let queryUpdateBorrowedBook = `UPDATE BorrowedBooks SET patronID = ?, bookID = ?, borrowDate = ?, returnDate = ?, dueDate = ? WHERE borrowedBookID = ?`;
    let selectUpdatedBorrowedBook = `SELECT * FROM BorrowedBooks WHERE borrowedBookID = ?`;

    // Run the update query
    db.pool.query(queryUpdateBorrowedBook, [patronID, bookID, borrowDate, returnDate, dueDate, borrowedBookID], function (error, rows, fields) {
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the select query to get the updated data
            db.pool.query(selectUpdatedBorrowedBook, [borrowedBookID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
