
function toggleResponsive(){
	// Add responsive class to navbar when user clicks the icon
	var elem = document.getElementById("myNav")
	if (elem.className ==="row navbar") {
		elem.className += " responsive";
	}else{
		elem.className = "row navbar";
	}

}

//Join ride here
function joinRide(){
	if (confirm("Are you sure you want to join this ride ?"))
	{
		location.href = "./user.html";
	}
}

function accept(username){
	alert(username + "'s request has been approved!");
 }

function rejectRequest(username){
	alert(username + "'s request has been rejected!");
}