// Login
document.getElementById('frm_sign_in').addEventListener('submit', login);
function login(e){
    e.preventDefault();
    let email = document.getElementById('usr-email').value;
    let password = document.getElementById('usr-password').value;
    var status_code;

    fetch('https://ridemyway-carpool.herokuapp.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email:email,
            password:password
        })
    })
    .then((result) => {
        status_code = result.status;
        return result.json();
    })
    .then((data) =>{
        if(status_code >= 400){
            document.getElementById('error').innerHTML = data['message'];
        }
        else{
            // stores tokens to browser session
            window.localStorage.setItem('token', data.token)
			window.localStorage.setItem('firstname', data.firstname.toUpperCase())
			window.localStorage.setItem('user_type', data.user_type)

            // navigate user depending on user_type
            if(data.user_type === "passenger")
            {
                redirect: window.location.replace("./passenger/rides.html")
            }
            else{
                redirect: window.location.replace("./driver/rides.html")
            }
        }
    })
}

function resetPassword(){
	// open modal to join ride offer
	var modal = document.getElementById('resetPasswordModal')
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
	document.getElementById('frm_reset_password').addEventListener('submit', reset);
	function reset(e){
		e.preventDefault()
		let email = document.getElementById('user_email').value;
		let password = document.getElementById('user_password').value;
		let cnf_password = document.getElementById('cnf_user_password').value;

		var statusCode;
		fetch('https://ridemyway-carpool.herokuapp.com/api/v1/auth/reset_password',{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + window.localStorage.getItem('token')
			},
			body: JSON.stringify({
				email: email,
				password: password,
				"confirm password": cnf_password
			})

		})
		.then((result) => {
			statusCode = result.status
			return result.json()
		})
		.then((data) =>{
			window.alert(data.message)
			if(statusCode == 200){
				modal.style.display = "none";
			}			
		})
		
    }
}
