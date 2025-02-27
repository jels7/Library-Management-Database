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

// PUT ROUTE

// Update a patron via AJAX
app.put('/update-patron-ajax', function (req, res) {
    let data = req.body;

    let patronID = parseInt(data.patronID);
    let phoneNum = data.phoneNum;
    let membershipDate = data.membershipDate;

    let queryUpdatePatron = `UPDATE Patrons SET phoneNum = ?, membershipDate = ? WHERE patronID = ?`;
    let selectUpdatedPatron = `SELECT * FROM Patrons WHERE patronID = ?`;

    // Run the update query
    db.pool.query(queryUpdatePatron, [phoneNum, membershipDate, patronID], function (error, rows, fields) {
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

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});