function deleteGenre(genreID) {
    // Put data into JS object
    let data = {
        id: genreID
    };

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove deleted row from table
            deleteRow(genreID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
}

// Function to delete a row from the table
function deleteRow(genreID) {
    let table = document.getElementById("genres-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate thru rows
        // Rows are accessed using 'row' variable assigned in for loop
        if (table.rows[i].getAttribute("data-value") == genreID) {
            table.deleteRow(i);
            break;
        }
    }
}