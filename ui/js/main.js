
function toggleResponsive(){
	// Add responsive class to navbar when user clicks the icon
	var elem = document.getElementById("myNav")
	if (elem.className ==="row navbar") {
		elem.className += " responsive";
	}else{
		elem.className = "row navbar";
	}
}
// load rides 
function retrieveRides(){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/rides',{		
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then((result) => {
			if (result.status === 200){
				return result.json()
			}		
			else if (result.status >= 400){
				redirect : window.location.replace('../index.html')
			}
			})
		.then((data) =>{
			if (data.length == 0){
				document.getElementById('info').innerHTML = "No ride offer at the moment." +  
				"Please check again later."

			}else{
				let output = '';
				data.forEach(ride => {			
					output += `
					<div class="col-sm-12 col-md-3">
						<div class="details">
							<p><span class="label">Start point : </span><span> ${ride["start point"]}</span></p>
							<p><span class="label">Destination : </span><span> ${ride.destination}</span></p>
							<p><span class="label">Route : </span><span> ${ride.route}</span></p>					
							<p><span class="label">Start time : </span><span>${ride["start_time"]} </span></p>
							<p><span class="label">Available seats : </span><span>${ride["available space"]} </span></p>
							<button onclick="joinRide(${ride.id})" class="center btn-primary">Join offer</button>												
						</div>
					</div>
					`;

				});
				document.getElementById('rides').innerHTML = output;
			}
		})
	}
	
}

function joinRide(ride_id){
	// open modal to join ride offer
	var modal = document.getElementById('joinRideModal')
	var span = document.getElementsByClassName("close")[0];
	// show modal dialog
	modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	document.getElementById('joinOffer').addEventListener('submit', joinOffer);
	function joinOffer(e){
		e.preventDefault()
		let pickUpPoint = document.getElementById('pickUpPoint').value;
		let destination = document.getElementById('destination').value;
		let seats = document.getElementById('seatsBooked').value;

		var statusCode;
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/rides/'+parseInt(ride_id) +'/requests',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			},
			body: JSON.stringify({
				"pick-up point": pickUpPoint,
				"drop-off point": destination,
				"seats_booked": parseInt(seats)
			})

		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) =>{
			window.alert(data.message)
			modal.style.display = "none";
		})
		
	}
}

function logout(){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		alert("Your not logged in yet.");
	}
	else{
		window.localStorage.getItem('firstname');
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/auth/logout',{		
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then((result) => result.json())
		.then((data) => {
			window.localStorage.removeItem('firstname');
			window.localStorage.removeItem('token');
			redirect: window.location.replace('../index.html');
		})
	}
}

function myRides(){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		var statusCode;
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/users/rides',{		
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then((result) => {
			statusCode = result.status
			if (result.status === 200){
				return result.json()
			}		
			else if (result.status === 401){
				result = confirm("You are not logged in or your access token expired.\
				\nPress OK to go to login.")
				redirect : window.location.replace('../index.html')
			}
			})
		.then((data) =>{
			if (statusCode == 404){
				document.getElementById('info').innerHTML =
				 "You don't have any active ride offer now."

			}else{
				let output = `<table><tr>
				    <th>Ride Id</th>
					<th>Start point</th>
					<th>Destination</th>
					<th>Route</th>
					<th>Start Time</th>
					<th>Request count</th>
					<th>Action</th>
				</tr>`;
				data.forEach(ride => {			
					output += `
					<tr>
					    <td>${ride.id}</td>
						<td>${ride["start point"]}</td>
						<td>${ride.destination}</td>
						<td>${ride.route}</td>					
						<td>${ride["start_time"]} </td>
						<td><a href="./requests.html?ride_id=${ride.id}" \
						   onclick="viewRequests(${ride.id})">${ride['request count']}</a></td>
						<td><a href="javascript:void(0);" onclick="editRide(${ride.id})">
							<i class="fa fa-edit"></i></a>
							<a href="javascript:void(0);" onclick="deleteRide(${ride.id})" class="danger">
							<i class="fa fa-trash"></i></a>

						</td>
					</tr>
					`;
				});
				output += '</table>';
				document.getElementById('myoffers').innerHTML = output;
			}
		})
	}	
}

function viewRequests(ride_id =""){
	var urlParams = new URLSearchParams(window.location.search);
	var ride_id = urlParams.get('ride_id')
	document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
	var url = `https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/${ride_id}/requests`
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		var statusCode;
		fetch(url,{
			method: 'GET',
			headers:({
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+window.localStorage.getItem('token')
			})
		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) => {
			if(statusCode === 404){
				document.getElementById('info').innerHTML = 'There is no request to your ride offer.';
			}
			else if(statusCode === 401){
				redirect : window.location.replace('../index.html')
			}
			else{
				let output = '';
				output = `<table>
				<tr>
				    <th>#ID</th>
					<th>User</th>
					<th>Contact</th>
					<th>pick up point</th>
					<th>Drop off point</th>
					<th>Seats booked</th>
					<th>Status</th>
					<th>Accept/Reject</th>
				</tr>`;
				data.forEach(request => {
					output += `
					<tr>
					    <td>${request['Request Id']}</td>
						<td>${request['name of user']}</td>
						<td>${request['user phone contact']}</td>
						<td>${request['pick up point']}</td>
						<td>${request['drop-off point']}</td>
						<td>${request['seats booked']}</td>
						<td>${request['status']}</td>
						<td>`
						if(request['status'] == 'accepted'){
							output += `<i class="fa fa-user-plus"></i>
							<a href="javascript:void(0);" class="danger" onclick="actOnRequest(${request['Request Id']},'reject')"><i class="fa fa-user-times"></i></a>
							</td></tr>`
							
						}else if(request['status'] == 'rejected'){
							output += `<a href="javascript:void(0);" onclick="actOnRequest(${request['Request Id']},'accept')"><i class="fa fa-user-plus"></i></a>
							<i class="fa fa-user-times"></i>
							</td></tr>`
						}						
						else{
							output += `<a href="javascript:void(0);" onclick="actOnRequest(${request['Request Id']},'accept')"><i class="fa fa-user-plus"></i></a>
							<a href="javascript:void(0);" class="danger" onclick="actOnRequest(${request['Request Id']},'reject')"><i class="fa fa-user-times"></i></a>
							</td></tr>`							
						}
				});
				output += `</table>`
				document.getElementById('requests').innerHTML = output;
			}
		})
	}
}

function actOnRequest(requestId,action){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
		var url = `https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/requests/${requestId}?action=${action}`
		var statusCode
		console.log(url)
		fetch(url,{
			method: 'PUT',
			headers: ({
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			})
		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) => {
			alert(data.message)
			window.location.reload()
		})
	
	}
}

function editRide(ride_id){
	// open modal to join ride offer
	var modal = document.getElementById('editRideModal')
	var span = document.getElementsByClassName("close")[0];
	// show modal dialog
	modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	document.getElementById('frm_edit_offer').addEventListener('submit', editOffer);
	function editOffer(e){
		e.preventDefault()
		let startPoint = document.getElementById('start').value;
		let destination = document.getElementById('destination').value;
		let route = document.getElementById('route').value;
		let startTime = document.getElementById('time').value;
		let availableSeats = document.getElementById('avail_space').value;

		var statusCode;
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/'+parseInt(ride_id),{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			},
			body: JSON.stringify({
				'start point':startPoint,
                destination:destination,
                route: route,
                'start time': startTime,
                'available space': parseInt(availableSeats)
			})

		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) =>{
			window.alert("Ride offer updated")
			modal.style.display = "none";
			window.location.reload()
		})
		
	}
}

function deleteRide(ride_id){
	result = confirm("Are you sure you want to delete this offer?\nRemeber this action is irreversible")
	if (result){
		var statusCode;
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/'+parseInt(ride_id),{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}
		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) =>{
			window.alert("Ride offer has been deleted.")
			window.location.reload()
		})
	}
}

function myRequests(){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		var statusCode;
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/requests',{		
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then((result) => {
			statusCode = result.status
			if (result.status == 200){
				return result.json()
			}		
			else if (result.status === 401){
				result = confirm("You are not logged in or your access token expired.\
				\nPress OK to go to login.")
				redirect : window.location.replace('../index.html')
			}
			})
		.then((data) =>{
			
			if (statusCode == 404){
				document.getElementById('info').innerHTML =
				 "You don't have any request now."

			}else{
				let output = `<table><tr>
					<th>#Id</th>
					<th>Data Requested</th>
					<th>Pick up point</th>
					<th>Drop-off point</th>
					<th>Status</th>
					<th>Action</th>
				</tr>`;
				data.forEach(request => {			
					output += `
					<tr>
						<td>${request["Request Id"]}</td>
						<td>${request['Date Requested']}</td>
						<td>${request["pick up point"]}</td>
						<td>${request["drop-off point"]}</td>
						<td>${request.status} </td>
						<td><a href="javascript:void(0);" onclick="manageRequest(${request["Request Id"]},'edit')">
							<i class="fa fa-edit"></i></a>
							<a href="javascript:void(0);" onclick="manageRequest(${request["Request Id"]},'del')">
							<i class="fa fa-times"></i></a>
						</td>
					</tr>
					`;
				});
				output += '</table>';
				document.getElementById('myrequests').innerHTML = output;
			}
		})
		.catch(error => console.log(error))
	}	
}

function manageRequest(requestId, action){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		res = confirm("Your session has expired.\nClick OK to go to login.")
		if(res){
			redirect : window.location.replace('../index.html')
		}
	}
	else{
		if(action ==='del'){
			var method = 'DELETE'
		}
		else{
			var method = 'PUT'
		}
		var url = `https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/requests/${requestId}`
		fetch(url, {
			method: method,
			headers: ({
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			})
		})
		.then((result) => {
			if(result.status == 401){
				res = confirm("Your session has expired.\nClick OK to go to login.")
				if(res){
					redirect : window.location.replace('../index.html')
				}
			}
			else if(result.status == 200){
				return result.json()
			}
		})
		.then(data => {
			alert(data.message)
			window.location.reload()
		})
		.catch(err =>{
			console.log(err)
		})
		
	}
}

function myProfile(){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		var statusCode;
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/auth/profile',{		
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then(result => {
			if(result.status == 401){
				res = confirm("Your session has expired.\nClick OK to go to login.")
				if(res){
					redirect : window.location.replace('../index.html')
				}
			}
			else if(result.status == 200){
				return result.json()
			}
		})
		.then(data =>{
			var name =  + data.secondname.toUpperCase()
			let output = `
			<p><span class="label">Full Names : </span> ${data.firstname.toUpperCase()} 
					${data.secondname.toUpperCase()}</p>
					<p><span class="label">Email</span> : ${data.email}</p>
					<p><span class="label">Type : </span> ${data["user type"]}</p>
					<p><span class="label">Phone Contact : </span> +254${data["phone number"]}</p>
			`;
			if(data['user type'] === 'passenger'){
				output += '<h3><a href="javascript:void(0);" onclick="upgrade()">Click to upgrade to be a driver</a></h3>'
			}
			document.getElementById('userDetails').innerHTML = output
		})
		.catch(err => {
			console.log(err)
		})

	}
}

function upgrade(){
	res = confirm("Are you sure you want to upgrade your account?")
	if (res){
		if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
			redirect : window.location.replace('../index.html')
		}
		else{
			var statusCode;
			document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
			fetch('https://ridemyway-carpool.herokuapp.com/api/v1/auth/upgrade?query=upgrade',{		
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + window.localStorage.getItem('token')
				}
	
			})
			.then(result => {
				statusCode = result.status
				return result.json()
			})
			.then(data => {
				if(statusCode == 401){
					res = confirm("Request not completed becaues your session has expired.\nClick OK to go to login.")
					if(res){
						redirect : window.location.replace('../index.html')
					}
				}else if(statusCode == 200){
					alert("Your account has been upgraded.\nYou can now start offering rides.")
					redirect : window.location.replace('../driver/profile.html')
				}
			})
		}
	}
}
