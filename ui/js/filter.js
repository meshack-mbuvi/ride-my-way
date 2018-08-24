document.getElementById('frm_filter').addEventListener('submit', filter);
function filter(e){
    e.preventDefault();
	var statusCode;
    if(window.localStorage.getItem('firstname') === "" || window.localStorage.getItem('token') ===""){
        result = confirm("You need to log in first.\nPress Ok to go to login");
        if(result){
            redirect : window.location.replace('../index.html')
        }
	}
	else{
		document.getElementById("profile").innerHTML = window.localStorage.getItem('firstname');
        var filter_key = document.getElementById("key");
        filter_key = filter_key.options[filter_key.selectedIndex].value;
        var filter_value = document.getElementById('key_value').value;
        var url = `https://ridemyway-carpool.herokuapp.com/api/v1/rides?key=${filter_key}&${filter_key}=${filter_value}`
        fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }
        })
        .then((result) => {
            statusCode = result.status
            return result.json()
        })
        .then((data) => {
            console.log(data)
            if(statusCode == 401){
                result = confirm('Your authorization ' + data['msg'] + '\nClick Ok to go to login')
                if(result){
                    redirect: window.location.replace('../index.html')
                }
            }
            else {
                if (data.length == 0){
                    document.getElementById('info').innerHTML = "No ride offer which meets your filter conditions."
                    document.getElementById('rides').innerHTML = "";
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
                    document.getElementById('info').innerHTML = "";
                    document.getElementById('rides').innerHTML = output;
                }
            }
        })
    }

}