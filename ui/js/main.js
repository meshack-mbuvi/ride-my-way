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
	var token = window.localStorage.getItem('token')
	if(window.localStorage.getItem('firstname') === "" || token ==="" || token == undefined){
		redirectUser()
	}
	else{
		var statusCode;
		resolveURL();
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/rides',{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then((result) => {
			statusCode = result.status;
			return result.json()
		})
		.then((data) =>{
			if (statusCode == 401){
				redirectUser();
			}
			else if (data.length == 0){
				document.getElementById('info').innerHTML = "No ride offer at the moment." +
				"Please check again later."

			}else{
				let output = '';
				data.forEach(ride => {
					if(ride['available space'] > 0){
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
					}

				});
				document.getElementById('rides').innerHTML = output;
			}
		})
		.catch(error => alert(error))
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
			if(statusCode == 401){
				redirectUser()
			}
			window.alert(data.message)
			modal.style.display = "none";
		})
		.catch(error => console.log(error))
	}
}

function redirectUser(){
	confirm("You are not logged in. Please not that you will be redirected to login page when you close this dialog.")
	redirect : window.location.replace('../index.html')
}

function resolveURL(){
	var pathArray = window.location.pathname.split('/')
	if(window.localStorage.getItem('user_type') === 'driver' && pathArray[pathArray.length -2] ==='passenger')
	{
		redirect: window.location.replace("../driver/rides.html")
	}
	else if(window.localStorage.getItem('user_type') === 'passenger' && pathArray[pathArray.length -2] ==='driver'){
		redirect: window.location.replace("../passenger/rides.html")
	}
}

function logout(){
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirectUser()
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
			confirm(data.message)
			window.localStorage.removeItem('firstname');
			window.localStorage.removeItem('token');
			window.localStorage.removeItem('user_type')
			redirect: window.location.replace('../index.html');
		})
		.catch(error => alert(error))
	}
}

function myRides(){
	var token = window.localStorage.getItem('token')
	if(window.localStorage.getItem('firstname') === "" || token ==="" || token == null){
		redirectUser()
	}
	else{
		var statusCode;
		resolveURL();
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
			if (result.status == 200){
				return result.json()
			}
			else if (result.status == 401){
				redirectUser()
			}
			})
		.then((data) =>{
			if (statusCode == 404){
				document.getElementById('info').innerHTML =
				 "<span class='label center'>You don't have any active ride offer now.</span>"

			}else{
				let output = `<table><tr>
				    <th>Ride Id</th>
					<th>Start point</th>
					<th>Destination</th>
					<th>Route</th>
					<th>Start Time</th>
					<th>Requests</th>
					<th>Action</th>
				</tr>`;
				var successful = 0;
				data.forEach(ride => {
					console.log(ride)
					output += `
					<tr>
					    <td>${ride.id}</td>
						<td>${ride["start point"]}</td>
						<td>${ride.destination}</td>
						<td>${ride.route}</td>
						<td>${ride.start_time} </td>
						<td><a href="./requests.html?ride_id=${ride.id}" \
						   onclick="viewRequests(${ride.id})">${ride['request count']}</a></td>
						<td><a href="javascript:void(0);" onclick="editRide(${ride.id},'${ride['start point']}', '${ride.destination}','${ride.route}', '${ride.start_time}',${ride['Available space']})">
							<i class="fa fa-edit"></i></a>`
							if(ride.successful === false){
								output += `<a href="javascript:void(0);" onclick="updateRideStatus(${ride.id}, 'successful')">
										<i class="fa fa-times"></i></a>`
								}
							else if(ride.successful === true){
								output += `<a href="javascript:void(0);" onclick="updateRideStatus(${ride.id}, 'unsuccessful')">
										<i class="fa fa-check"></i></a>`
							}
							output +=`<a href="javascript:void(0);" onclick="deleteRide(${ride.id})" class="danger">
							<i class="fa fa-trash"></i></a>
						</td>
					</tr>
					`;
					if(ride.successful == true){
						successful +=1;
					}
				});
				output += '</table>';
				document.getElementById('ridesgiven').innerHTML = `<span class="label">Number of rides given :</span> ${successful}`
				document.getElementById('myoffers').innerHTML = output;

			}
		})
		.catch(error => console.log(error))
	}
}

function updateRideStatus(rideId, status){
	if(status == 'unsuccessful'){
		var status = false
	}
	else{
		var status = true
	}
	console.log(status)
	var statusCode;
	fetch('https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/'+parseInt(rideId) + '?action='+status,{
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + window.localStorage.getItem('token')
		}
	})
	.then(result => result.json())
	.then((data) => {
		alert(data.message)
		window.location.reload()
	})
	.catch(error => console.log(error))
}

function viewRequests(){
	var urlParams = new URLSearchParams(window.location.search);
	var ride_id = urlParams.get('ride_id')
	if (ride_id == null){
		if (window.localStorage.getItem('user_type') === 'driver')
		{
			redirect: window.location.replace("../driver/rides.html")
		}else{
			redirect: window.location.replace("../passenger/rides.html")
		}
	}
	document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
	var url = `https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/${ride_id}/requests`
	if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
		redirect : window.location.replace('../index.html')
	}
	else{
		var statusCode;
		var pathArray = window.location.pathname.split('/')
		if(window.localStorage.getItem('user_type') === 'passenger' && pathArray[pathArray.length -2] ==='driver'){
			confirm("You don't have permission to view this page. \nUpgrade your account to be a driver to have access to this page.")
			redirect: window.location.replace("../passenger/rides.html")
		}
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
			if(statusCode == 404){
				document.getElementById('info').innerHTML = '<span class="label center">There is no request to your ride offer.</span>';
			}
			else if(statusCode == 401){
				redirectUser()
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
							<a href="javascript:void(0);" onclick="actOnRequest(${request['Request Id']},'taken')"><i class="fa fa-check"></i></a>
							<a href="javascript:void(0);" onclick="actOnRequest(${request['Request Id']},'abandoned')"><i class="fa fa-times"></i></a>
							</td></tr>`
						}else if(request['status'] == 'rejected'){
							output += `<a href="javascript:void(0);" onclick="actOnRequest(${request['Request Id']},'accept')"><i class="fa fa-user-plus"></i></a>
							<i class="fa fa-user-times"></i>
							</td></tr>`
						}else if(request['status'] == 'taken'){
							output += `<i class="fa fa-user-plus"></i>
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
		.catch(error => alert(error))
	}
}

function actOnRequest(requestId,action){
	var token = window.localStorage.getItem('token')
	if(window.localStorage.getItem('firstname') === "" || token ==="" || token == null){
		redirectUser()
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
			if (statusCode == 401){
				result = confirm("You are not logged in or your access token expired.\
				\nPress OK to go to login.")
				if(result){
					redirect : window.location.replace('../index.html')
				}
			}
			alert(data.message)
			window.location.reload()
		})
		.catch(error => alert(error))
	}
}

function editRide(ride_id,startPoint, destination,route, startTime, availableSeats){
	// open modal to join ride offer
	var modal = document.getElementById('editRideModal')
	var span = document.getElementsByClassName("close")[0];
	// show modal dialog
	modal.style.display = "block";
	console.log(startPoint)
	document.getElementById('start').value = startPoint
	document.getElementById('destination').value = destination
	document.getElementById('route').value = route
	document.getElementById('avail_space').value = availableSeats
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
		let rideDate = document.getElementById('date').value;
    	let rideTime = document.getElementById('time').value;
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
                'start time': rideDate + " " + rideTime,
                'available space': parseInt(availableSeats)
			})

		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) =>{
			if (statusCode == 401){
				result = confirm("You are not logged in or your access token expired.\
				\nPress OK to go to login.")
				if(result){
					redirect : window.location.replace('../index.html')
				}
			}else{
				window.alert("Ride offer updated")
				modal.style.display = "none";
				window.location.reload()
			}
		})
		.catch(error => alert(error))
	}
}

function deleteRide(ride_id){
	result = confirm("Are you sure you want to delete this offer?\nRemember this action is irreversible")
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
		.catch(error => alert(error))
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
				 "You have not requested to join any ride offer."

			}else{
				let output = `<table><tr>
					<th>#Id</th>
					<th>Date Requested</th>
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
						<td>`
						if(request.status === 'accepted'){
							output += `<i class="fa fa-check"></i>`
						}else if(request.status === 'pending'){
							output += `---
							<td><a href="javascript:void(0);" onclick="manageRequest(${request["Request Id"]},'edit')">
							<i class="fa fa-edit"></i></a>
							<a href="javascript:void(0);" class="danger" onclick="manageRequest(${request["Request Id"]},'del')">
							<i class="fa fa-trash"></i></a>
						</td>
					</tr>`
						}else if(request.status === 'rejected'){
							output += `<i class="fa fa-times"></i>
							<td><a href="javascript:void(0);" class="danger" onclick="manageRequest(${request["Request Id"]},'del')">
							<i class="fa fa-trash"></i></a>
						</td></tr>`
						}else if(request.status === 'taken'){
							output += `<i class="fa fa-check"></i>
							<td>
							<span class="label">No allowed action</span>
						</td></tr>`
						}
						else{
							output += `</td>
						<td><a href="javascript:void(0);" onclick="manageRequest(${request["Request Id"]},'edit')">
							<i class="fa fa-edit"></i></a>
							<a href="javascript:void(0);" class="danger" onclick="manageRequest(${request["Request Id"]},'del')">
							<i class="fa fa-trash"></i></a>
						</td>
					</tr>
					`;
					}
				});
				output += '</table>';
				document.getElementById('myrequests').innerHTML = output;
			}
		})
		.catch(error => alert(error))
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
		.catch(error => alert(error))
	}
}

function myProfile(){
	resolveURL()
	var token = window.localStorage.getItem('token')
	if(window.localStorage.getItem('firstname') === "" || token ==="" || token == undefined){
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
			statusCode = result.status
			return result.json()
		})
		.then(data =>{
			if(statusCode === 401){
				redirectUser()
			}
			let output = `
			<p><span class="label">Full Names : </span> ${data.firstname.toUpperCase()}
					${data.secondname.toUpperCase()}</p>
					<p><span class="label">Phone Contact : </span> ${data["phone number"]}</p>
					<p><span class="label">Email Address</span> : ${data.email}</p>
			`;
			if(data['user type'] === 'passenger'){
				document.getElementById('upgrade').innerHTML = '<h4 class=""><a href="javascript:void(0);" onclick="upgrade()">Click here to upgrade to a driver account</a></h4>'
			}
			document.getElementById('userDetails').innerHTML = output
			document.getElementById('usertype').innerHTML = `<p><span class="label">Account Type : </span> ${data["user type"]}</p>`
			if(window.localStorage.getItem('user_type') === 'driver'){
				myRides();
			}
			getRidesTaken();
		})
		.catch(error => console.log(error))

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
			.catch(error => alert(error))
		}
	}
}

function getRidesTaken(){
	fetch('https://ridemyway-carpool.herokuapp.com/api/v1/users/rides/requests',{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			}

		})
		.then((result) => {
			statusCode = result.status
			console.log(result)
			return result.json()
		})
		.then((data) =>{
			if (statusCode == 404){
				document.getElementById('ridestaken').innerHTML =`<span class='label'>Number of rides taken : </span> 0`

			}else{
				var taken=0;
				data.forEach(request => {
					if(request.status === 'taken'){
						taken += 1
					}
				});
				document.getElementById('ridestaken').innerHTML =`<span class='label'>Number of rides taken : </span> ${taken}`
			}
		})
		.catch(err=>console.log(err))
}
