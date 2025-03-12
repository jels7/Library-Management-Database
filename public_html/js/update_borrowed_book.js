// Citation
// Based on the CS 340 Node.js Starter Guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// 3/12/2025
// Group 7
// Meredith Baker & Anjelica Cucchiara



// Get the objects we need to modify
let updateBorrowedBookForm = document.getElementById('update-borrowed-book-form-ajax');

// Modify the objects we need
updateBorrowedBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let selectBorrowedBook = document.getElementById("select-borrowed-book");
    let updatePatronId = document.getElementById("update-patronId");
    let updateBookId = document.getElementById("update-bookId");
    let updateBorrowDate = document.getElementById("update-borrowDate");
    let updateReturnDate = document.getElementById("update-returnDate");
    let updateDueDate = document.getElementById("update-dueDate");

    // Get the values from the form fields
    let borrowedBookID = selectBorrowedBook.value;
    let patronIdValue = updatePatronId.value;
    let bookIdValue = updateBookId.value;
    let borrowDateValue = updateBorrowDate.value;
    let returnDateValue = updateReturnDate.value;
    let dueDateValue = updateDueDate.value;

    // Ensure that the patron ID, book ID, borrow date, return date, and due date are not empty
    if (!patronIdValue || !bookIdValue || !borrowDateValue || !returnDateValue || !dueDateValue) {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        borrowedBookID: borrowedBookID,
        patronID: patronIdValue,
        bookID: bookIdValue,
        borrowDate: borrowDateValue,
        returnDate: returnDateValue,
        dueDate: dueDateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the row in the table
            updateRowInTable(JSON.parse(xhttp.responseText));
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRowInTable(data) {
    let updatedBorrowedBook = data;

    let table = document.getElementById("borrowed-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedBorrowedBook.borrowedBookID) {
            let cells = table.rows[i].getElementsByTagName("td");
            cells[1].innerText = updatedBorrowedBook.patronID;
            cells[2].innerText = updatedBorrowedBook.bookID;
            cells[3].innerText = updatedBorrowedBook.borrowDate;
            cells[4].innerText = updatedBorrowedBook.returnDate;
            cells[5].innerText = updatedBorrowedBook.dueDate;
            break;
        }
    }
}
