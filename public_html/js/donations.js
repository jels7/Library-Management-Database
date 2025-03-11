// Get the objects we need to modify
let addDonationForm = document.getElementById('add-donation-form-ajax');

// Modify the objects that we need
addDonationForm.addEventListener("submit)", function (e) {

    // Prevent form from submitting
    e.preventDefault();

    // Get form fields that we need to get data from
    let inputDonorName = document.getElementById("input-donorName");
    let inputDonationDate = document.getElementById("input-donationDate");

    // Get the values from the form fields
    let donorNameValue = inputDonorName.value;
    let donationDateValue = inputDonationDate.value;

    // Put sendable data into JS object
    let data = {
        donorName: donorNameValue,
        donationDate: donationDateValue
    }

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-donation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add new data to table
            addRowToTable(xhttp.response);

            // Clear input fields for another transaction
            inputDonorName.value = '';
            inputDonationDate.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from Donations
addRowToTable = (data) => {

    // Get reference to current table on the page
    let currentTable = document.getElementById("donations-table");

    // Get location where we will insert new row
    let newRowIndex = currentTable.rows.length;

    // Get reference to new row from the db query
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let donorCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill cells with data
    idCell.innerText = newRow.donationID;
    donorCell.innerText = newRow.donorName;
    dateCell.innerText = newRow.donationDate;

    // Create the delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
        deleteDonation(newRow.donationID);
    };

    // Create the edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
        editDonation(newRow.donationID);
    };

    // Add buttons to actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add cells to row
    row.appendChild(idCell);
    row.appendChild(donorCell);
    row.appendChild(dateCell);
    row.appendChild(actionsCell);

    // Add row attribute so the deleteRow func can find newly added row
    row.setAttribute('data-value', newRow.donationID);

    // Add row to table
    currentTable.appendChild(row);

    // Add new data to dropdown menu for updating donations
    let selectMenu = document.getElementById("select-donation");
    let option = document.createElement("option");
    option.text = newRow.donorName;
    option.value = newRow.donationID;
    selectMenu.add(option);
}

// Function to delete a donation
function deleteDonation(donationID) {
    // Put sendable data in JS object
    let data = {
        id: donationID
    };

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-donation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove deleted row from the table
            deleteRow(donationID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
}

function deleteRow(donationID) {
    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate thru rows
        if (table.rows[i].getAttribute("data-value") == donationID) {
            table.deleteRow(i);
            break;
        }
    }

    // Remove deleted donation from dropdown menu
    let selectMenu = document.getElementById("select-donation");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == donationID) {
            selectMenu.remove(i);
            break;
        }
    }
}

// Function to edit a donation
function editDonation(donationID) {
    // Get the form fields that we need to modify
    let selectDonation = document.getElementById("select-donation");
    let updateDonorName = document.getElementById("update-donorName");
    let updateDonationDate = document.getElementById("update-donationDate");

    // Set form fields with current values
    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("date-value") == donationID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            selectDonation.value = donationID;
            updateDonorName.value = cells[2].innerText;
            updateDonationDate.value = cells[3].innerText;
            break;
        }
    }
}