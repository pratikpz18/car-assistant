firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const UID = user.uid
    }
})

function errorMessage(msg = '') {
    msg = (msg == '') ? 'Something went wrong, please try again' : msg
    Swal.fire({
            icon: 'error',
            title: 'Opps...',
            text: `${msg}`
        })
        .then(() => {
            location.reload();
        })
}
