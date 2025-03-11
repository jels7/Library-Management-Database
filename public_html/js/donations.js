// Get the form element
let addDonationForm = document.getElementById('add-donation-form-ajax');

// Creates a single row from an Object representing a single record from Donations
addRowToTable = (data) => {
    // Get reference to current table on the page
    let currentTable = document.getElementById("donations-table");

    // Create a new row and cells
    let newRow = currentTable.insertRow();

    let donationIDCell = newRow.insertCell(0);
    let donorNameCell = newRow.insertCell(1);
    let bookIDCell = newRow.insertCell(2);
    let donationDateCell = newRow.insertCell(3);
    let actionsCell = newRow.insertCell(4);

    // Fill the cells with the appropriate data
    donationIDCell.innerText = data.donationID;
    donorNameCell.innerText = data.donorName;
    bookIDCell.innerText = data.bookID;
    donationDateCell.innerText = data.donationDate;

    // Create the Edit and Delete buttons
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.setAttribute("onclick", `editDonation(${data.donationID})`);

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("onclick", `deleteDonation(${data.donationID})`);

    // Append the buttons to the actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
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
    let updateDonationDate = document.getElementById("update-donationDate");

    // Set form fields with current values
    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == donationID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            selectDonation.value = donationID;
            updateDonorName.value = cells[1].innerText;
            updateDonationDate.value = cells[3].innerText;
            break;
        }
    }
}
