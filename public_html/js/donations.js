// Citation
// Based on the CS 340 Node.js Starter Guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// 3/12/2025
// Group 7
// Meredith Baker & Anjelica Cucchiara



document.addEventListener('DOMContentLoaded', function () {
    fetch('/get-books')
        .then(response => response.json())
        .then(data => {
            let bookSelect = document.getElementById('input-bookID');
            let updateBookSelect = document.getElementById('update-bookID');
            data.forEach(book => {
                let option = document.createElement('option');
                option.value = book.bookID;
                option.text = book.bookID; // Set bookID as the text content
                bookSelect.appendChild(option);
                updateBookSelect.appendChild(option.cloneNode(true));
            });
        })
        .catch(error => console.error('Error fetching books:', error));
});

// Get the form element
let addDonationForm = document.getElementById('add-donation-form-ajax');

// Creates a single row from an Object representing a single record from Donations
addRowToTable = (data) => {
    // Get reference to current table on the page
    let currentTable = document.getElementById("donations-table");

    // Create a new row and cells
    let newRow = currentTable.insertRow();
    newRow.setAttribute("data-value", data.donationID); // Set data-value attribute

    let donationIDCell = newRow.insertCell(0);
    let donorNameCell = newRow.insertCell(1);
    let bookIDCell = newRow.insertCell(2);
    let donationDateCell = newRow.insertCell(3);
    let actionsCell = newRow.insertCell(4);

    // Fill the cells with the appropriate data
    donationIDCell.innerText = data.donationID;
    donorNameCell.innerText = data.donorName;
    bookIDCell.innerText = data.bookID;
    donationDateCell.innerText = new Date(data.donationDate).toLocaleDateString();

    // Create the Edit and Delete buttons
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("edit-btn");
    editButton.dataset.id = data.donationID;

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.dataset.id = data.donationID;

    // Append the buttons to the actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add the new row to the table
    currentTable.appendChild(newRow);

    // Add the new data to the dropdown menu for updating donations
    let selectMenu = document.getElementById("select-donation");
    let option = document.createElement("option");
    option.text = data.donationID;
    option.value = data.donationID;
    selectMenu.add(option);
}

// Modify the AJAX request to handle the response correctly
addDonationForm.addEventListener("submit", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    // Get form fields that we need to get data from
    let inputDonorName = document.getElementById("input-donorName");
    let inputBookID = document.getElementById("input-bookID");
    let inputDonationDate = document.getElementById("input-donationDate");

    // Get the values from the form fields
    let donorNameValue = inputDonorName.value;
    let bookIDValue = inputBookID.value;
    let donationDateValue = inputDonationDate.value;

    // Validate input data
    if (!donorNameValue || !bookIDValue || !donationDateValue) {
        console.log("Invalid input data. Please fill out all fields.");
        return;
    }

    // Put sendable data into JS object
    let data = {
        donorName: donorNameValue,
        bookID: bookIDValue,
        donationDate: donationDateValue
    }
    console.log('Sending data:', data); // Log the data being sent

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-donation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse the response data
            let responseData = JSON.parse(xhttp.responseText);

            // Add new data to table
            addRowToTable(responseData);

            // Clear input fields for another transaction
            inputDonorName.value = '';
            inputBookID.value = '';
            inputDonationDate.value = '';
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input. Status:", xhttp.status, "Response:", xhttp.responseText);
        }
    }

    // Send request
    xhttp.send(JSON.stringify(data));
});

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
    let updateBookID = document.getElementById("update-bookID");
    let updateDonationDate = document.getElementById("update-donationDate");

    // Set form fields with current values
    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == donationID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            selectDonation.value = donationID;
            updateDonorName.value = cells[1].innerText;
            updateBookID.value = cells[2].innerText;
            updateDonationDate.value = new Date(cells[3].innerText).toISOString().split('T')[0];
            break;
        }
    }
}

// Apply event delegation for edit and delete buttons

document.addEventListener("DOMContentLoaded", function () {
    const donationsTable = document.getElementById("donations-table");

    donationsTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-btn")) {
            const donationId = event.target.dataset.id;
            editDonation(donationId);
        } else if (event.target.classList.contains("delete-btn")) {
            const donationId = event.target.dataset.id;
            deleteDonation(donationId);
        }
    });
});
