document.addEventListener('DOMContentLoaded', function () {
    fetch('/get-genres')
        .then(response => response.json())
        .then(data => {
            let genreSelect = document.getElementById('input-genreID');
            let updateGenreSelect = document.getElementById('update-genreID');
            data.forEach(genre => {
                let option = document.createElement('option');
                option.value = genre.genreID;
                option.text = genre.genreName;
                genreSelect.appendChild(option);
                updateGenreSelect.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => console.error('Error fetching genres:', error));
});

// Get the objects we need to modify
let addBookForm = document.getElementById('add-book-form-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookTitle = document.getElementById("input-bookTitle");
    let inputGenreID = document.getElementById("input-genreID");
    let inputCopiesAvailable = document.getElementById("input-copiesAvailable");

    // Get the values from the form fields
    let bookTitleValue = inputBookTitle.value;
    let genreIDValue = inputGenreID.value;
    let copiesAvailableValue = inputCopiesAvailable.value;

    // Put our data we want to send in a javascript object
    let data = {
        bookTitle: bookTitleValue,
        genreID: genreIDValue,
        copiesAvailable: copiesAvailableValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBookTitle.value = '';
            inputGenreID.value = '';
            inputCopiesAvailable.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

// Creates a single row from an Object representing a single record from Books
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let genreIDCell = document.createElement("TD");
    let copiesAvailableCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.bookID;
    titleCell.innerText = newRow.bookTitle;
    genreIDCell.innerText = newRow.genreID;
    copiesAvailableCell.innerText = newRow.copiesAvailable;

    // Create the delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
        deleteBook(newRow.bookID);
    };

    // Create the edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
        editBook(newRow.bookID);
    };

    // Add the delete and edit buttons to the actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(genreIDCell);
    row.appendChild(copiesAvailableCell);
    row.appendChild(actionsCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.bookID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Add the new data to the dropdown menu for updating books
    let selectMenu = document.getElementById("select-book");
    let option = document.createElement("option");
    option.text = newRow.bookTitle;
    option.value = newRow.bookID;
    selectMenu.add(option);
}

// Function to delete a book
function deleteBook(bookID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: bookID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the deleted row from the table
            deleteRow(bookID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Function to delete a row from the table
function deleteRow(bookID) {
    let table = document.getElementById("books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        // Rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == bookID) {
            table.deleteRow(i);
            break;
        }
    }

    // Remove the deleted book from the dropdown menu
    let selectMenu = document.getElementById("select-book");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == bookID) {
            selectMenu.remove(i);
            break;
        }
    }
}

// Function to edit a book
function editBook(bookID) {
    // Get the form fields we need to modify
    let selectBook = document.getElementById("select-book");
    let updateBookTitle = document.getElementById("update-bookTitle");
    let updateGenreID = document.getElementById("update-genreID");
    let updateCopiesAvailable = document.getElementById("update-copiesAvailable");

    // Set the form fields with the current values
    let table = document.getElementById("books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == bookID) {
            let cells = table.rows[i].getElementsByTagName("td");
            selectBook.value = bookID;
            updateBookTitle.value = cells[1].innerText;
            updateGenreID.value = cells[2].innerText;
            updateCopiesAvailable.value = cells[3].innerText;
            break;
        }
    }
}
