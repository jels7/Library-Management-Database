// Get objects we need to modify
const updateBorrowedBookForm = document.getElementById('update-borrowed-book-form-ajax');

// Modify objects we need
updateBorrowedBookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields
    const selectBorrowedBook = document.getElementById("select-borrowed-book");
    const updatePatronID = document.getElementById("update-patronID");
    const updateBookID = document.getElementById("update-bookID");
    const updateBorrowDate = document.getElementById("update-borrowDate");
    const updateReturnDate = document.getElementById("update-returnDate");
    const updateDueDate =  document.getElementById("update-dueDate");

    // Ensure selected value is valid before parsing
    if (!selectBorrowedBook.value) {
        alert("Please select a valid borrowed book to update.");
        return;
    }

    // Get values
    const borrowedBookID = Number(selectBorrowedBook.value);
    const patronIDValue = Number(updatePatronID.value);
    const bookIDValue = Number(updateBookID.value);
    const borrowDateValue = updateBorrowDate.value;
    const returnDateValue = updateReturnDate.value;
    const dueDateValue = updateDueDate.value;

    // Input validation
    if (isNaN(borrowedBookID) || borrowedBookID <= 0) {
        alert("Invalid selection. Please choose a valid book.");
        return;
    }
    if (isNaN(patronIDValue) || patronIDValue <= 0 || isNaN(bookIDValue) || bookIDValue <= 0 || !borrowDateValue || !returnDateValue || !dueDateValue) {
        alert("Invalid input. Please ensure all fields are correctly filled.");
        return;
    }
    if (new Date(returnDateValue) < new Date(borrowDateValue)) {
        alert("Return date cannot be earlier than borrow date.");
        return;
    }
    

    // Prepare data object
    const data = {
        borrowedBookID,
        patronID: patronIDValue,
        bookID: bookIDValue,
        borrowDate: borrowDateValue,
        returnDate: returnDateValue,
        dueDate: dueDateValue
    };

    // Set up AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                try {
                    updateRowInTable(xhttp.responseText);
                } catch (error) {
                    console.error("Error updating table:", error);
                }
            } else {
                alert("There was an error updating the borrowed book. Please try again.");
            }
        }
    };

    // Send request
    xhttp.send(JSON.stringify(data));
});

function updateRowInTable(data) {
    let parsedData = JSON.parse(data);
    let updatedBorrowedBook = parsedData[0];

    let table = document.getElementById("borrowed-books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedBorrowedBook.borrowedBookID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            cells[1].innerText = updatedBorrowedBook.patronID;
            cells[2].innerText = updatedBorrowedBook.bookID;
            cells[3].innerText = updatedBorrowedBook.borrowDate;
            cells[4].innerText = updatedBorrowedBook.returnDate;
            cells[5].innerText = updatedBorrowedBook.dueDate;
            break;
        }
    }
}