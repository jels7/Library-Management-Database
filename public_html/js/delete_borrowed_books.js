// Citation
// Based on the CS 340 Node.js Starter Guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// 3/12/2025
// Group 7
// Meredith Baker & Anjelica Cucchiara



function deleteBorrowedBook(borrowedBookID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: borrowedBookID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the deleted row from the table
            deleteRow(borrowedBookID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(borrowedBookID) {
    let table = document.getElementById("borrowed-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        // Rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == borrowedBookID) {
            table.deleteRow(i);
            break;
        }
    }

    // Remove the deleted borrowed book from the dropdown menu
    let selectMenu = document.getElementById("select-borrowed-book");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == borrowedBookID) {
            selectMenu.remove(i);
            break;
        }
    }
}
