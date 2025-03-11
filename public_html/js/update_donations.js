// Get the objects we need to modify
let updateDonationForm = document.getElementById('update-donation-form-ajax');

// Modify the objects we need
updateDonationForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields that we need data from
    let selectDonation = document.getElementById("select-donation");
    let updateDonorName = document.getElementById("update-donorName");
    let updateDonationDate = document.getElementById("update-donationDate");

    // Get values from form fields
    let donationID = selectDonation.value;
    let donorNameValue = updateDonorName.value;
    let donationDateValue = updateDonationDate.value;

    // Ensure that donor name and donation date are not empty
    if (!donorNameValue || !donationDateValue) {
        return;
    }

    // Put sendable data into JS object
    let data = {
        donationID: donationID,
        donorName: donorNameValue,
        donationDate: donationDateValue
    }

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-donation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX req how to resolve
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
    let updatedDonation = parsedData[0];

    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedDonation.donationID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            cells[2].innerText = updatedDonation.donorName;
            cells[3].innerText = updatedDonation.donationDate;
            break;
        }
    }
}