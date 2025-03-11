// Get objects we need to modify
let updateGenreForm = document.getElementById('update-genre-form-ajax');

// Modify objects we need
updateGenreForm.addEventListener("submit", function (e) {

    // Prevent form from submitting
    e.preventDefault();

    // Get form fields we need data from
    let selectGenre = document.getElementById("select-genre");
    let updateGenreName = document.getElementById("update-genreName");

    // Get values from form fields
    let genreID = selectGenre.value;
    let genreNameValue = updateGenreName.value;

    // Ensure the genre name is not empty
    if (!genreNameValue) {
        return;
    }

    // Put data we want to send into JS object
    let data = {
        genreID: genreID,
        genreName: genreNameValue
    }

    // Set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update row in table
            updateRowInTable(xhttp.response);
        } 
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
});

function updateRowInTable(data) {
    let parsedData = JSON.parse(data);
    let updatedGenre = parsedData[0];

    let table = document.getElementById("genres-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedGenre.genreID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            cells[2].innerText = updatedGenre.genreName;
            break;
        }
    }

    // Update the genre in the select dropdown
    let selectGenre = document.getElementById("select-genre");
    let option = selectGenre.querySelector(`option[value='${updatedGenre.genreID}']`);
    option.textContent = updatedGenre.genreName;

    // Clear the form
    document.getElementById('update-genreName').value = '';
    selectGenre.value = '';
}