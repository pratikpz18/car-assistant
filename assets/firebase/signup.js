//Signup using email and password.
function signUp() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let contactNo = document.getElementById('contactNo').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (!email || !password || !contactNo || password.length < 6 || password != confirmPassword) {
        let errorMessage = "Please, enter all the details properly";
        Swal.fire({
                icon: 'error',
                title: 'Opps...',
                text: errorMessage
            })
            .then(() => {
                location.reload();
            })
        return;
    }
    
    // Update the button description after click
    const button = document.getElementById('signup-btn');
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            let UID = user.uid;

            let updates = {
                details: {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    contactNo: document.getElementById('contactNo').value,
                }
            };

            firebase.database().ref(`carOwners/${UID}`).set(updates)
                .then(() => {
                    Swal.fire({
                            icon: 'success',
                            title: 'Account created successfully !',
                        })
                        .then(() => {
                            window.location = "../index.html";
                        })
                })
        })
        .catch((error) => {
            let errorMessage = error.message;
            Swal.fire({
                    icon: 'error',
                    title: 'Opps...',
                    text: errorMessage
                })
                .then(() => {
                    location.reload();
                })
        })
}

