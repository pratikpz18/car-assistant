var snap,idNumber;
var details=[];
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const UID = user.uid;
        // var starCountRef = firebase.database().ref(`carOwners/${UID}`);
        // starCountRef.on('value', (snapshot) => {
        //     console.log(snapshot.val())
        //     data = snapshot.val();
        //     console.log(data)
        //     showStats(data);
        //     idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
        // });

        const snapshot = await firebase.database().ref(`carOwners/${UID}`).once('value');
        let data = snapshot.val();
        idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
        showStats(data)
        // details.push(Object.values(data.allCars)[0])
        var arr=[];
        await firebase.database().ref(`carOwners/${UID}/allCars/`).on('child_changed',snapshot => {
            snapshot.forEach(element => {
                arr.push(element.val())
            });
            // data = snapshot.val();
            changeStats(arr[0],arr[1].vehicleNumber)
            arr=[];
            // idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
        })
        console.log(data);
        // snapchanged();
    }
})

function showStats(data){
    console.log(Object.values(data.allCars))
    for(let i=0;i<idNumber;i++){
        details.push(Object.values(data.allCars)[i]);
        var total = document.createElement('div');
        total.classList.add("card-body");
        total.setAttribute('id', `${details[i].carDetails.vehicleNumber}`);

        var contentdiv = document.createElement('div');
        contentdiv.innerHTML = `
        <h3 class="text-primary"><u>${details[i].carDetails.brand} ${details[i].carDetails.model}</u></h3>
        <div class="card card-body mb-3 mb-lg-5 border-secondary shadow-lg">
            <div class="row gx-lg-4">
            <div class="col-sm-6 col-lg-3">
                <div class="media">
                <div class="media-body">
                    <h6 class="card-subtitle">Battery Voltage</h6>
                    <span class="card-title h3" id=batteryVoltage-${details[i].carDetails.vehicleNumber}>${details[i].allStatus.batteryVoltage}</span>
                </div>
                <span class="icon icon-sm icon-soft-secondary icon-circle ml-3">
                    <i class="tio-book" aria-hidden="true"></i>
                </span>
                </div>
                <div class="d-lg-none">
                <hr>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3 column-divider-sm">
                <div class="media">
                <div class="media-body">
                    <h6 class="card-subtitle">Engine Temperature</h6>
                    <span class="card-title h3" id=engineTemp-${details[i].carDetails.vehicleNumber}>${details[i].allStatus.engineTemp}</span>
                </div>
                <span class="icon icon-sm icon-soft-secondary icon-circle ml-3">
                    <i class="tio-website"></i>
                </span>
                </div>
                <div class="d-lg-none">
                <hr>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3 column-divider-lg">
                <div class="media">
                <div class="media-body">
                    <h6 class="card-subtitle">Suspension Level</h6>
                    <span class="card-title h3" id=suspensionLevel-${details[i].carDetails.vehicleNumber}>${details[i].allStatus.suspensionLevel}</span>
                </div>
                <span class="icon icon-sm icon-soft-secondary icon-circle ml-3">
                    <i class="tio-trending-up"></i>
                </span>
                </div>
                <div class="d-sm-none">
                <hr>
                </div>
            </div>
            <div class="col-sm-6 col-lg-3 column-divider-sm">
                <div class="media">
                <div class="media-body">
                    <h6 class="card-subtitle">Status</h6>
                    <span class="card-title h3" id="status">Good</span>
                </div>
                <span class="icon icon-sm icon-soft-secondary icon-circle ml-3">
                    <i class="tio-trending-up"></i>
                </span>
                </div>
            </div>
        </div>`;

        total.appendChild(contentdiv);
        document.getElementById("content").appendChild(total);
    }
}

function changeStats(data,vehicleNumber){
    document.getElementById(`engineTemp-${vehicleNumber}`).innerHTML = data.engineTemp ;
    document.getElementById(`batteryVoltage-${vehicleNumber}`).innerHTML = data.batteryVoltage ;
    document.getElementById(`suspensionLevel-${vehicleNumber}`).innerHTML = data.suspensionLevel ;
}