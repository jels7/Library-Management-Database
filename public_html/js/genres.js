// Get the objects we need to modify
let addGenreForm = document.getElementById('add-genre-form-ajax')

// Modify the objects that we need
addGenreForm.addEventListener("submit", function (e) {

    // Prevent form from submitting
    e.preventDefault();

    // Get the form fields that we need to get data from
    let inputGenreName = document.getElementById("input-genreName");

    // Get the values from the form fields
    let genreNameValue = inputGenreName.value;

    // Put data we want to send into JS object
    let data = {
        genreName: genreNameValue
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add data to table
            addRowToTable(xhttp.response);

            // Clear input fields for another transaction
            inputGenreName.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from Genres
addRowToTable = (data) => {

    // Get ref to the current table on the page
    let currentTable = document.getElementById("genres-table");

    // Get location where new row should be inserted
    let newRowIndex = currentTable.rows.length;

    // Get ref to the new row from db query
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");

    // Fill cells with correct data
    idCell.innerText = newRow.genreID;
    nameCell.innerText = newRow.genreName;

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
        deleteGenre(newRow.genreID);
    };

    // Create edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
        editGenre(newRow.genreID);
    };

    // Add buttons to actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add cells to row
    row.appendChild(idCell);
    row.appendChild(nameCell);

    // Add row attribute so delete function can find a newly added row
    row.setAttribute('data-value', newRow.genreID);

    // Add that row to the table
    currentTable.appendChild(row);

    // Add new data to the dropdown menu for updating genres
    let selectMenu = document.getElementById("select-genre");
    let option = document.createElement("option");
    option.text = newRow.genreName;
    option.value = newRow.genreID;
    selectMenu.add(option);
}


// Function to delete a genre
function deleteGenre(genreID) {
    // data into JS object
    let data = {
        id: genreID
    };

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // remove deleted row from table
            deleteRow(genreID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send req
    xhttp.send(JSON.stringify(data));
}


// Function to delete a row from the table
function deleteRow(genreID) {
    let table = document.getElementById("genres-table");
    for (let i=0, row; row=table.rows[i]; i++) {
        // Iterate thru rows
        // Rows are accessed using 'row' variable assigned in for loop
        if (table.rows[i].getAttribute("data-value") == genreID) {
            table.deleteRow(i);
            break;
        }
    }

    // Remove deleted genre from dropdown menu
    let selectMenu = document.getElementById("select-genre");
    for (let i=0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == genreID) {
            selectMenu.remove(i);
            break;
        }
    }
}


// Function to edit a genre
function editGenre(genreID) {
    // Get the form fields we need to modify
    let selectGenre = document.getElementById("select-genre");
    let updateGenreName = document.getElementById("update-genreName");

    // Set form fields with current values
    let table = document.getElementById("genres-table");
    for (let i=0, row; row=table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == genreID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            selectGenre.value = genreID;
            updateGenreName.value = cells[1].innerText;
            break;
        }
    }
}