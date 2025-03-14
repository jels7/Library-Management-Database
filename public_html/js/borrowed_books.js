// Citation
// Based on the CS 340 Node.js Starter Guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// 3/12/2025
// Group 7
// Meredith Baker & Anjelica Cucchiara



document.addEventListener('DOMContentLoaded', function () {
    fetch('/get-patrons')
        .then(response => response.json())
        .then(data => {
            let patronSelect = document.getElementById('input-patronId');
            let updatePatronSelect = document.getElementById('update-patronId');
            data.forEach(patron => {
                let option = document.createElement('option');
                option.value = patron.patronID;
                option.text = patron.patronID; // Set patronID as the text content
                patronSelect.appendChild(option);
                updatePatronSelect.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => console.error('Error fetching patrons:', error));

    fetch('/get-books')
        .then(response => response.json())
        .then(data => {
            let bookSelect = document.getElementById('input-bookId');
            let updateBookSelect = document.getElementById('update-bookId');
            data.forEach(book => {
                let option = document.createElement('option');
                option.value = book.bookID;
                option.text = book.bookID; // Set bookID as the text content
                bookSelect.appendChild(option);
                updateBookSelect.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => console.error('Error fetching books:', error));
});

// Get the form element
let addBorrowedBookForm = document.getElementById('add-borrowed-book-form-ajax');

// Creates a single row from an Object representing a single record from BorrowedBooks
addRowToTable = (data) => {

    // Get reference to current table on the page
    let currentTable = document.getElementById("borrowed-books-table");

    // Get location where we should insert the new row
    let newRowIndex = currentTable.rows.length;

    // Get reference to new row from the db query
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Crete row and cells
    let borrowedBookIDCell = document.createElement("TR");
    let patronIDCell = document.createElement("TD");
    let bookIDCell = document.createElement("TD");
    let borrowDateCell = document.createElement("TD");
    let returnDateCell = document.createElement("TD");
    let dueDateCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill the cells with the appropriate data
    borrowedBookIDCell.innerText = newRow.borrowedBookID;
    patronIDCell.innerText = newRow.patronID;
    bookIDCell.innerText = newRow.bookID;
    borrowDateCell.innerText = new Date(data.borrowDate).toLocaleDateString();
    returnDateCell.innerText = new Date(data.returnDate).toLocaleDateString();
    dueDateCell.innerText = new Date(data.dueDate).toLocaleDateString();

    // Create the Edit and Delete buttons
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", function () {
        editBorrowedBook(data.borrowedBookID);    
    });

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", function () {
        deleteBorrowedBook(data.borrowedBookID);
    });

    // Append the buttons to the actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add cells to the row
    row.appendChild(borrowedBookIDCell);
    row.appendChild(patronIDCell);
    row.appendChild(bookIDCell);
    row.appendChild(borrowDateCell);
    row.appendChild(returnDateCell);
    row.appendChild(dueDateCell);
    row.appendChild(actionsCell);

    // Add row attribute so deleteRow can find a new row
    row.setAttribute('data-value', newRow.borrowedBookID);

    // Add row to the table
    currentTable.appendChild(row);
}

// Modify the AJAX request to handle the response correctly
addBorrowedBookForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    // Get form fields that we need to get data from
    let inputPatronId = document.getElementById("input-patronId");
    let inputBookId = document.getElementById("input-bookId");
    let inputBorrowDate = document.getElementById("input-borrowDate");
    let inputReturnDate = document.getElementById("input-returnDate");
    let inputDueDate = document.getElementById("input-dueDate");

    // Get the values from the form fields
    let patronIdValue = inputPatronId.value;
    let bookIdValue = inputBookId.value;
    let borrowDateValue = inputBorrowDate.value;
    let returnDateValue = inputReturnDate.value;
    let dueDateValue = inputDueDate.value;

    // Validate input data
    if (!patronIdValue || !bookIdValue || !borrowDateValue || !returnDateValue || !dueDateValue) {
        console.log("Invalid input data. Please fill out all fields.");
        return;
    }

    // Put sendable data into JS object
    let data = {
        patronID: patronIdValue,
        bookID: bookIdValue,
        borrowDate: borrowDateValue,
        returnDate: returnDateValue,
        dueDate: dueDateValue
    }
    console.log('Sending data:', data); // Log the data being sent

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse the response data
            let responseData = JSON.parse(xhttp.responseText);

            // Add new data to table
            addRowToTable(responseData);

            // Clear input fields for another transaction
            inputPatronId.value = '';
            inputBookId.value = '';
            inputBorrowDate.value = '';
            inputReturnDate.value = '';
            inputDueDate.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input. Status:", xhttp.status, "Response:", xhttp.responseText);
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
});

function deleteBorrowedBook(borrowedBookID) {
    // Put sendable data into JS object
    let data = {
        id: borrowedBookID
    };

    // AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 204) {
            deleteRow(borrowedBookID);
        }
        else if (xhttp.readyState === 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }
    // Send request
    xhttp.send(JSON.stringify(data));
}

function deleteRow(borrowedBookID) {
    let table = document.getElementById("borrowed-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate thru rows
        if (table.rows[i].getAttribute("data-value") == borrowedBookID) {
            table.deleteRow(i);
            break;
        }
    }

    // Remove deleted borrowed book from dropdown menu
    let selectMenu = document.getElementById("select-borrowed-book");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == borrowedBookID) {
            selectMenu.remove(i);
            break;
        }
    }
}

// Function to edit a borrowed book
function editBorrowedBook(borrowedBookID) {
    // Get the form fields that we need to modify
    let selectBorrowedBook = document.getElementById("select-borrowed-book");
    let updatePatronId = document.getElementById("update-patronId");
    let updateBookId = document.getElementById("update-bookId");
    let updateBorrowDate = document.getElementById("update-borrowDate");
    let updateReturnDate = document.getElementById("update-returnDate");
    let updateDueDate = document.getElementById("update-dueDate");

    // Set form fields with current values
    let table = document.getElementById("borrowed-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == borrowedBookID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            selectBorrowedBook.value = borrowedBookID;
            updatePatronId.value = cells[1].innerText;
            updateBookId.value = cells[2].innerText;
            updateBorrowDate.value = new Date(cells[3].innerText).toISOString().split('T')[0];
            updateReturnDate.value = new Date(cells[4].innerText).toISOString().split('T')[0];
            updateDueDate.value = new Date(cells[5].innerText).toISOString().split('T')[0];
            break;
        }
    }
}
