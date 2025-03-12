// Get objects we need to modify
const updateBorrowedBookForm = document.getElementById('update-borrowed-book-form-ajax');

// Modify objects we need
updateBorrowedBookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form fields
    const selectBorrowedBook = document.getElementById("select-borrowed-book");
    const updatePatronId = document.getElementById("update-patronId");
    const updateBookId = document.getElementById("update-bookId");
    const updateBorrowDate = document.getElementById("update-borrowDate");
    const updateReturnDate = document.getElementById("update-returnDate");
    const updateDueDate =  document.getElementById("update-dueDate");

    // Ensure selected value is valid before parsing
    if (!selectBorrowedBook.value) {
        alert("Please select a valid borrowed book to update.");
        return;
    }

    // Get values
    const borrowedBookId = Number(selectBorrowedBook.value);
    const patronIdValue = Number(updatePatronId.value);
    const bookIdValue = Number(updateBookId.value);
    const borrowDateValue = updateBorrowDate.value;
    const returnDateValue = updateReturnDate.value;
    const dueDateValue = updateDueDate.value;

    // Input validation
    if (isNaN(borrowedBookId) || borrowedBookId <= 0) {
        alert("Invalid selection. Please choose a valid book.");
        return;
    }
    if (isNaN(patronIdValue) || patronIdValue <= 0 || isNaN(bookIdValue) || bookIdValue <= 0 || !borrowDateValue || !returnDateValue || !dueDateValue) {
        alert("Invalid input. Please ensure all fields are correctly filled.");
        return;
    }
    if (new Date(returnDateValue) < new Date(borrowDateValue)) {
        alert("Return date cannot be earlier than borrow date.");
        return;
    }
    

    // Prepare data object
    const data = {
        borrowedBookId,
        patronId: patronIdValue,
        bookId: bookIdValue,
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
        if (table.rows[i].getAttribute("data-value") == updatedBorrowedBook.borrowedBookId) {
            let cells = table.rows[i].getElementsByTagName("TD");
            cells[1].innerText = updatedBorrowedBook.patronId;
            cells[2].innerText = updatedBorrowedBook.bookId;
            cells[3].innerText = updatedBorrowedBook.borrowDate;
            cells[4].innerText = updatedBorrowedBook.returnDate;
            cells[5].innerText = updatedBorrowedBook.dueDate;
            break;
        }
    }
}