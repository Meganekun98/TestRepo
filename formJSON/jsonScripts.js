

// var url = 'https://crudcrud.com/api/57bd253b74dc45c497f0d1e50fd80606/formDetails'; //for debugging and testing
var url = 'https://crudcrud.com/api/5aa8a50b4a564b53805ad74c9b7cb0f7/formDetails'; //given for audit
var urlEdit = "";
var selectedRow = null;

//function to run when submit button is pressed
function onSubmit() {
	event.preventDefault();
	if (validate()) {
		var formData = readFormData();
		sendRecord(formData);
		resetForm();
	}
}

//function to load data from server API at first page load
function getTableData() {
	var table = document.getElementById("editTable");
	var rows = document.getElementsByClassName("rowCal");
	fetch(url)
		.then(response => response.json())
		.then(function (obj) {
			var insertText = "";
			if (rows.length < obj.length) {

				for (i = 0; i < obj.length; i++) {

					var row = table.insertRow(i);

					var nameOnJson = row.insertCell(0);
					nameOnJson.innerHTML = obj[i].name;

					var ageOnJson = row.insertCell(1);
					ageOnJson.innerHTML = obj[i].age;

					var genderOnJson = row.insertCell(2);
					genderOnJson.innerHTML = obj[i].gender;

					var skillsOnJson = row.insertCell(3);
					skillsOnJson.innerHTML = obj[i].skills;

					var hobbiesOnJson = row.insertCell(4);
					hobbiesOnJson.innerHTML = obj[i].hobbies;

					var update = row.insertCell(5);
					update.innerHTML = "<a href=# onclick='editEntry(this)'>Edit</a> / <a href =# onclick = 'deleteEntry(this)'> Delete</a >"
					update.value = obj[i]._id;
					row.classList.add("rowCal");
				}
			}
			else {
				console.log("Rows are completely filled")
			}

		})
}
//read data from form
function readFormData() {
	var formDetails = {
		"name": document.getElementById("nameId").value,
		"age": calculateAge(document.getElementById("birthDateId").value),
		"birthDate": document.getElementById("birthDateId").value,
		"gender": checkGender(document.getElementsByName("gender")),
		"skills": checkSkills(document.getElementById("skillsId")),
		"hobbies": checkHobbies(document.getElementsByName("hobbies"))
	};
	return formDetails;
}

//Function to check the gender
function checkGender(element) {
	var genderCheck = "";
	for (i = 0; i < element.length; i++) {
		if (element[i].checked) { genderCheck = element[i].value; }
	}
	return genderCheck;
}

//Function to check selected skills
function checkSkills(element) {
	var selectedCollection = element.selectedOptions
	var skillsCheck = [];
	for (i = 0; i < selectedCollection.length; i++) {
		skillsCheck.push(selectedCollection[i].label);
	}
	return skillsCheck.join(', ');
}

//Function to check hobbies
function checkHobbies(element) {
	var hobCheck = "";
	for (i = 0; i < element.length; i++) {
		if (element[i].checked && hobCheck == "") {
			hobCheck += element[i].value;;
		}
		else if (element[i].checked) {
			hobCheck += ', ' + element[i].value;
		}
	}
	return hobCheck;
}

//Function to calculate age
function calculateAge(dob) {

	var dateOfBirth = new Date(dob);
	var age;

	var monthDiff = Date.now() - dateOfBirth.getTime();

	var ageDate = new Date(monthDiff);

	var year = ageDate.getUTCFullYear();

	age = Math.abs(year - 1970);

	return age
}


//send new data to Server and Update the table on call back from server
async function sendRecord(formData) {

	var table = document.getElementById("editTable");
	var rows = document.getElementsByClassName("rowCal");
	if (document.getElementById("submitButtonId").value == "Add") {

		fetch(url, {
			method: 'POST',
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify(formData)
		}).then(response => response.json())
			.then(function (obj) {

				var row = table.insertRow(table.length);

				var nameOnJson = row.insertCell(0);
				nameOnJson.innerHTML = obj.name;

				var ageOnJson = row.insertCell(1);
				ageOnJson.innerHTML = obj.age;

				var genderOnJson = row.insertCell(2);
				genderOnJson.innerHTML = obj.gender;

				var skillsOnJson = row.insertCell(3);
				skillsOnJson.innerHTML = obj.skills;

				var hobbiesOnJson = row.insertCell(4);
				hobbiesOnJson.innerHTML = obj.hobbies;

				var update = row.insertCell(5);
				update.innerHTML = "<a href=# onclick='editEntry(this)'>Edit</a> / <a href =# onclick = 'deleteEntry(this)'> Delete</a >"
				update.value = obj._id;
				row.classList.add("rowCal");

			})
	}
	else if (document.getElementById("submitButtonId").value == "Update") {
		editRow = selectedRow;
		const response = await fetch(urlEdit, {
			headers: { "Content-Type": "application/json; 	charset=utf-8" },
			method: 'PUT',
			body: JSON.stringify(formData)
		});

		console.log(response);


		populateTableUpdate(editRow);
		document.getElementById("submitButtonId").value = "Add";

	}
}

//function to reset the form
function resetForm() {
	document.getElementById("myForm").reset();
	selectedRow = null;
}

//function to populate the form to edit details
async function editEntry(cellElement) {

	document.getElementById("myForm").reset();
	// selectedRow = cellElement.parentElement.parentElement;
	selectedRow = cellElement.closest("tr");

	urlEdit = url + "/" + selectedRow.cells[5].value;

	//fetch details from json for edit

	const response = await fetch(urlEdit);
	const obj = await response.json();
	populateForm(obj);

	document.getElementById("submitButtonId").value = "Update";
}
function populateForm(obj) {

	document.getElementById("nameId").value = obj.name;


	document.getElementById("birthDateId").value = obj.birthDate;

	var genderValue = obj.gender;
	if (document.getElementById(genderValue).value == genderValue) {
		document.getElementById(genderValue).checked = true; //updating the value to the form for updation
	}

	// document.getElementById("skillsId").value = obj.skills;
	var optionsToSelect = obj.skills;
	var select = document.getElementById('skillsId').options;

	for (var i = 0; i < select.length; i++) {
		if (optionsToSelect.search(select[i].value) != -1) {
			select[i].selected = true;
		}
	}


	var str = obj.hobbies;
	var x = document.getElementsByName("hobbies");
	for (let i = 0; i < x.length; i++) {
		if (str.search(x[i].value) != -1) {
			document.getElementById(x[i].value).checked = true;
		}
	}
}

//async function to update table
async function populateTableUpdate(editRow) {
	const response = await fetch(urlEdit);
	const obj = await response.json();

	editRow.cells[0].innerHTML = obj.name;
	editRow.cells[1].innerHTML = obj.age;
	editRow.cells[2].innerHTML = obj.gender;
	editRow.cells[3].innerHTML = obj.skills;
	editRow.cells[4].innerHTML = obj.hobbies;
}



//function to delete the data in the table
function deleteEntry(cellElement) {
	if (confirm("do you want to delete these details ?")) {
		rowNum = cellElement.parentElement.parentElement;
		document.getElementById("formTable").deleteRow(rowNum.rowIndex);

		document.getElementById("myForm").reset();
		selectedRow = cellElement.parentElement.parentElement;

		urlEdit = url + "/" + selectedRow.cells[5].value;

		fetch(
			urlEdit, {
			method: 'DELETE'
		})
			.then(response => console.log(response))
	}
}

//function to validate the form
function validate() {
	isValid = true;
	if (document.getElementById("nameId").value == "") {
		isValid = false;
		errorStyle(document.getElementById("nameField"));
	} else {
		checkOK(document.getElementById("nameField"));
	}
	if (document.getElementById("birthDateId").value == "") {
		isValid = false;
		errorStyle(document.getElementById("dateField"));
	} else {
		if (!isValidDOB(document.getElementById("birthDateId").value)) {
			isValid = false;
			errorStyle(document.getElementById("dateField"));
		}
		else {
			checkOK(document.getElementById("dateField"));
		}
	}
	if (!isRadioChecked(document.getElementsByName("gender"))) {
		isValid = false;
		errorStyle(document.getElementById("genderField"));
	} else {
		checkOK(document.getElementById("genderField"));
	}
	if (document.getElementById("skillsId").value == "") {
		isValid = false;
		errorStyle(document.getElementById("skillField"));
	} else {
		checkOK(document.getElementById("skillField"));
	}
	if (!isCheckboxChecked(document.getElementsByName("hobbies"))) {
		isValid = false;
		errorStyle(document.getElementById("hobbyField"));
	}
	else {
		checkOK(document.getElementById("hobbyField"));
	}
	return isValid;
}

//function to change style of label on validation error
function errorStyle(element) {
	element.style.color = "#FF2D00";
}

//function to remove validation error
function checkOK(element) {

	element.style.color = "#000000";
}

//function to validate DOB
function isValidDOB(birthDate) {
	var dateOfBirth = new Date(birthDate);
	var todayDate = new Date(new Date().toDateString());


	var state = true;

	if (dateOfBirth.getTime() > todayDate.getTime()) {
		state = false;
	}

	return state;
}

//function to check if radio is validated
function isRadioChecked(radios) {
	for (let i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			return true;
		}
	}
	return false;
}

//function to check if checkbox is validated
function isCheckboxChecked(checkBox) {
	for (let i = 0; i < checkBox.length; i++) {
		if (checkBox[i].checked) {
			return true;
		}
	}
	return false;
}