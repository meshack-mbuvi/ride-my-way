
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
		console.log(result)
		if (result.status === 200){
			return result.json()
		}		
		else if (result.status >= 400){
			redirect : window.location.replace('../index.html')
		}
		})
	.then((data) =>{
		console.log(data)
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
	console.log(ride_id);
}