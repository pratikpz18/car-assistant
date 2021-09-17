const firebaseConfig = {
  apiKey: "AIzaSyDksCtovcxCP5A2OFr-Yi5HvElEXKNxM-o",
  authDomain: "car-assistant-project.firebaseapp.com",
  databaseURL: "https://car-assistant-project-default-rtdb.firebaseio.com",
  projectId: "car-assistant-project",
  storageBucket: "car-assistant-project.appspot.com",
  messagingSenderId: "261487407022",
  appId: "1:261487407022:web:801e30c795b9350f19e23f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const authPages = ['login','signup']

firebase.auth().onAuthStateChanged((user) => {
    let currentPage = window.location.pathname.split('/')
    currentPage = currentPage[currentPage.length-1].split('.')[0]
    if(!user && !authPages.includes(currentPage)) {
      // User is NOT signed in
      window.location.href = './auth/login.html'
    }
});  

// function for login and matching credentials.
function login(){
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      window.location = "../index.html" ;
      console.log(user);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${errorCode} ${errorMessage}`,
        }).then(
          () => { location.reload() }
        )
    });

    // Update the button description after click
    const button = document.getElementById('loginButton')
    button.disabled = true
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
}

// logout function
function logout(){
  firebase.auth().signOut().then(() => {
    window.location.href='./auth/login.html';
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(`${errorCode} ${errorMessage}`)
  });
}
 
