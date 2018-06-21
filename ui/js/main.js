
function toggleResponsive(){
	// Add responsive class to navbar when user clicks the icon
	var elem = document.getElementById("myNav")
	if (elem.className ==="row navbar") {
		elem.className += " responsive";
	}else{
		elem.className = "row navbar";
	}

}
// show license field when driver checkbox is checked,hide license field otherwise
function showHideLicense(){
	var elem = document.getElementById("driver_license");
	var elem1 = document.getElementById("chk_driver").checked;
	var licenseInput = document.getElementById("dr-license");
	var car_reg_number = document.getElementById("car_reg");
	if (elem1) {
		elem.className = "row show";
		licenseInput.required = true;
		car_reg_number.required = true;
	}else {
		elem.className = "row hide";
		licenseInput.required = false;
		car_reg_number.required = false;
	}
}

//Join ride here
function joinRide(){
	if (confirm("Are you sure you want to join this ride ?"))
	{
		location.href = "./user.html";
	}
}