document.getElementById('new_offer').addEventListener('submit', newRide);
function profile(){
    document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
}

function newRide(e){
    e.preventDefault();
    let startPoint = document.getElementById('start').value;
    let destination = document.getElementById('destination').value;
    let route = document.getElementById('route').value;
    let rideDate = document.getElementById('date').value;
    let rideTime = document.getElementById('time').value;
    let availableSeats = document.getElementById('avail_space').value;

    var statusCode;

    if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
        result = confirm("You need to log in first.\nPress Ok to go to login");
        if(result){
            redirect : window.location.replace('../index.html')
        }
	}
	else{
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
        fetch('http://0.0.0.0:5000/api/v1/users/rides',{
            method: 'POST',
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
        .then((data) => {
            if(statusCode == 401){
                redirectUser()
            }
            else {
                result = alert(data['message'])
                redirect: window.location.replace('./rides.html')
            }
        })
        .catch(error => alert(error))
    }

}

