document.addEventListener('DOMContentLoaded', function () {
    fetch('/get-patrons')
        .then(response => response.json())
        .then(data => {
            let patronSelect = document.getElementById('input-patronId');
            let updatePatronSelect = document.getElementById('update-patronId');
            data.forEach(patron => {
                let option = document.createElement('option');
                option.value = patron.patronID;
                option.text = patron.patronName;
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
                option.text = book.bookTitle;
                bookSelect.appendChild(option);
                updateBookSelect.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => console.error('Error fetching books:', error));
});

// Get the objects we need to modify
let addBorrowedBookForm = document.getElementById('add-borrowed-book-form-ajax');

// Modify the objects we need
addBorrowedBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
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

    // Put our data we want to send in a javascript object
    let data = {
        patronID: patronIdValue,
        bookID: bookIdValue,
        borrowDate: borrowDateValue,
        returnDate: returnDateValue,
        dueDate: dueDateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(JSON.parse(xhttp.responseText));

            // Clear the input fields for another transaction
            inputPatronId.value = '';
            inputBookId.value = '';
            inputBorrowDate.value = '';
            inputReturnDate.value = '';
            inputDueDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

// Creates a single row from an Object representing a single record from BorrowedBooks
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("borrowed-books-table");

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let patronIDCell = document.createElement("TD");
    let bookIDCell = document.createElement("TD");
    let borrowDateCell = document.createElement("TD");
    let returnDateCell = document.createElement("TD");
    let dueDateCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = data.borrowedBookID;
    patronIDCell.innerText = data.patronID;
    bookIDCell.innerText = data.bookID;
    borrowDateCell.innerText = data.borrowDate;
    returnDateCell.innerText = data.returnDate;
    dueDateCell.innerText = data.dueDate;

    // Create the delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
        deleteBorrowedBook(data.borrowedBookID);
    };

    // Create the edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
        editBorrowedBook(data.borrowedBookID);
    };

    // Add the delete and edit buttons to the actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(patronIDCell);
    row.appendChild(bookIDCell);
    row.appendChild(borrowDateCell);
    row.appendChild(returnDateCell);
    row.appendChild(dueDateCell);
    row.appendChild(actionsCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', data.borrowedBookID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Add the new data to the dropdown menu for updating borrowed books
    let selectMenu = document.getElementById("select-borrowed-book");
    let option = document.createElement("option");
    option.text = data.borrowedBookID;
    option.value = data.borrowedBookID;
    selectMenu.add(option);
}

// Function to delete a borrowed book
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

// Function to delete a row from the table
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

// Function to edit a borrowed book
function editBorrowedBook(borrowedBookID) {
    // Get the form fields we need to modify
    let selectBorrowedBook = document.getElementById("select-borrowed-book");
    let updatePatronId = document.getElementById("update-patronId");
    let updateBookId = document.getElementById("update-bookId");
    let updateBorrowDate = document.getElementById("update-borrowDate");
    let updateReturnDate = document.getElementById("update-returnDate");
    let updateDueDate = document.getElementById("update-dueDate");

    // Set the form fields with the current values
    let table = document.getElementById("borrowed-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == borrowedBookID) {
            let cells = table.rows[i].getElementsByTagName("td");
            selectBorrowedBook.value = borrowedBookID;
            updatePatronId.value = cells[1].innerText;
            updateBookId.value = cells[2].innerText;
            updateBorrowDate.value = cells[3].innerText;
            updateReturnDate.value = cells[4].innerText;
            updateDueDate.value = cells[5].innerText;
            break;
        }
    }
}
