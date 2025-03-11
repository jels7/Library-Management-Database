// Get the objects we need to modify
const updateDonationForm = document.getElementById('update-donation-form-ajax');

// Modify the objects we need
updateDonationForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get the form fields
    const selectDonation = document.getElementById("select-donation");
    const updateDonorName = document.getElementById("update-donorName");
    const updateBookID = document.getElementById("update-bookID");
    const updateDonationDate = document.getElementById("update-donationDate");

    // Ensure the selected value is valid before parsing
    if (!selectDonation.value) {
        alert("Please select a valid donation to update.");
        return;
    }

    // Get values
    const donationID = Number(selectDonation.value);
    const donorNameValue = updateDonorName.value.trim();
    const bookIDValue = Number(updateBookID.value);
    const donationDateValue = updateDonationDate.value;

    // Input validation
    if (isNaN(donationID) || donationID <= 0) {
        alert("Invalid donation selection. Please choose a valid donation.");
        return;
    }
    if (!donorNameValue || isNaN(bookIDValue) || bookIDValue <= 0 || !donationDateValue) {
        alert("Invalid input. Please ensure all fields are correctly filled.");
        return;
    }

    // Prepare data object
    const data = {
        donationID,
        donorName: donorNameValue,
        bookID: bookIDValue,
        donationDate: donationDateValue
    };

    // Set up AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-donation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                try {
                    updateRowInTable(xhttp.responseText);
                } catch (error) {
                    console.error("Error updating table:", error);
                }
            } else {
                alert("There was an error updating the donation. Please try again.");
            }
        }
    };

    // Send request
    xhttp.send(JSON.stringify(data));
});

function updateRowInTable(data) {
    let parsedData = JSON.parse(data);
    let updatedDonation = parsedData[0];

    let table = document.getElementById("donations-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedDonation.donationID) {
            let cells = table.rows[i].getElementsByTagName("TD");
            cells[1].innerText = updatedDonation.donorName;
            cells[2].innerText = updatedDonation.bookID;
            cells[3].innerText = updatedDonation.donationDate;
            break;
        }
    }
}
