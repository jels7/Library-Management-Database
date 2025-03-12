// Citation
// Based on the CS 340 Node.js Starter Guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// 3/12/2025
// Group 7
// Meredith Baker & Anjelica Cucchiara



// Get the objects we need to modify
let updatePatronForm = document.getElementById('update-patron-form-ajax');

// Modify the objects we need
updatePatronForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let selectPatron = document.getElementById("select-patron");
    let updatePatronName = document.getElementById("update-patronName");
    let updatePhoneNum = document.getElementById("update-phoneNum");
    let updateMembershipDate = document.getElementById("update-membershipDate");

    // Get the values from the form fields
    let patronID = selectPatron.value;
    let patronNameValue = updatePatronName.value;
    let phoneNumValue = updatePhoneNum.value;
    let membershipDateValue = updateMembershipDate.value;

    // Ensure that the phone number and membership date are not empty
    if (!phoneNumValue || !membershipDateValue) {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        patronID: patronID,
        patronName: patronNameValue,
        phoneNum: phoneNumValue,
        membershipDate: membershipDateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-patron-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
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
    let updatedPatron = parsedData[0];

    let table = document.getElementById("patrons-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == updatedPatron.patronID) {
            let cells = table.rows[i].getElementsByTagName("td");
            cells[1].innerText = updatedPatron.patronName; // Update the name
            cells[2].innerText = updatedPatron.phoneNum;
            cells[3].innerText = updatedPatron.membershipDate;
            break;
        }
    }
}
