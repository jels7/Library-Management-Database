function deleteBorrowedBook(borrowedBookID) {
    // Put sendable data in JS object
    let data = {
        id: borrowedBookID
    };

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-borrowed-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 204) {
            deleteRow(borrowedBookID);
        }

        else if (xhttp.readyState === 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send request and wait for the response
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
}