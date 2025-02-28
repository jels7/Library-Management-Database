// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let selectBook = document.getElementById("select-book");
    let updateBookTitle = document.getElementById("update-bookTitle");
    let updateGenreID = document.getElementById("update-genreID");
    let updateCopiesAvailable = document.getElementById("update-copiesAvailable");

    // Get the values from the form fields
    let bookID = selectBook.value;
    let bookTitleValue = updateBookTitle.value;
    let genreIDValue = updateGenreID.value;
    let copiesAvailableValue = updateCopiesAvailable.value;

    // Ensure that the book title, genre ID, and copies available are not empty
    if (!bookTitleValue || !genreIDValue || !copiesAvailableValue) {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        bookID: bookID,
        bookTitle: bookTitleValue,
        genreID: genreIDValue,
        copiesAvailable: copiesAvailableValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the row in the table
            updateRowInTable(xhttp.response);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRowInTable(data) {
    let parsedData = JSON.parse(data);
    let updatedBook = parsedData[0];

    let table = document.getElementById("books-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedBook.bookID) {
            let cells = table.rows[i].getElementsByTagName("td");
            cells[1].innerText = updatedBook.bookTitle;
            cells[2].innerText = updatedBook.genreID;
            cells[3].innerText = updatedBook.copiesAvailable;
            break;
        }
    }
}