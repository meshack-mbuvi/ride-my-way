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
            window.localStorage.setItem('firstname', data.firstname.toUpperCase();)

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