function deleteDonation(donationID) {
    // Put sendable data in JS object
    let data = {
        id: donationID
    };

    // Set up AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-donation-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX req how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the deleted row from the table
            deleteRow(donationID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
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
}