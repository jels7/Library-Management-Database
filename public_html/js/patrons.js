// Citation
// Based on the CS 340 Node.js Starter Guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// 3/12/2025
// Group 7
// Meredith Baker & Anjelica Cucchiara


// Get the objects we need to modify
let addPatronForm = document.getElementById('add-patron-form-ajax');

// Modify the objects we need
addPatronForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPatronName = document.getElementById("input-patronName");
    let inputPhoneNum = document.getElementById("input-phoneNum");
    let inputMembershipDate = document.getElementById("input-membershipDate");

    // Get the values from the form fields
    let patronNameValue = inputPatronName.value;
    let phoneNumValue = inputPhoneNum.value;
    let membershipDateValue = inputMembershipDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        patronName: patronNameValue,
        phoneNum: phoneNumValue,
        membershipDate: membershipDateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patron-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPatronName.value = '';
            inputPhoneNum.value = '';
            inputMembershipDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from Patrons
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("patrons-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let phoneNumCell = document.createElement("TD");
    let membershipDateCell = document.createElement("TD");
    let actionsCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.patronID;
    nameCell.innerText = newRow.patronName;
    phoneNumCell.innerText = newRow.phoneNum;
    membershipDateCell.innerText = newRow.membershipDate;

    // Create the delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
        deletePatron(newRow.patronID);
    };

    // Create the edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
        editPatron(newRow.patronID);
    };

    // Add the delete and edit buttons to the actions cell
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(phoneNumCell);
    row.appendChild(membershipDateCell);
    row.appendChild(actionsCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.patronID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Add the new data to the dropdown menu for updating patrons
    let selectMenu = document.getElementById("select-patron");
    let option = document.createElement("option");
    option.text = newRow.patronName;
    option.value = newRow.patronID;
    selectMenu.add(option);
}

// Function to delete a patron
function deletePatron(patronID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: patronID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patron-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the deleted row from the table
            deleteRow(patronID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Function to delete a row from the table
function deleteRow(patronID) {
    let table = document.getElementById("patrons-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        // Rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == patronID) {
            table.deleteRow(i);
            break;
        }
    }

    // Remove the deleted patron from the dropdown menu
    let selectMenu = document.getElementById("select-patron");
    for (let i = 0; i < selectMenu.options.length; i++) {
        if (selectMenu.options[i].value == patronID) {
            selectMenu.remove(i);
            break;
        }
    }
}

// Function to edit a patron
function editPatron(patronID) {
    // Get the form fields we need to modify
    let selectPatron = document.getElementById("select-patron");
    let updatePhoneNum = document.getElementById("update-phoneNum");
    let updateMembershipDate = document.getElementById("update-membershipDate");

    // Set the form fields with the current values
    let table = document.getElementById("patrons-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == patronID) {
            let cells = table.rows[i].getElementsByTagName("td");
            selectPatron.value = patronID;
            updatePhoneNum.value = cells[2].innerText;
            updateMembershipDate.value = cells[3].innerText;
            break;
        }
    }
}
