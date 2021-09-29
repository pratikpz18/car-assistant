firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const UID = user.uid;
        const snapshot = await firebase.database().ref(`carOwners/${UID}`).once('value')
        snap = await firebase.database().ref(`carOwners/${UID}/allCars`);
        data = snapshot.val();
        idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
        showStats(data);
    }
})

var details=[];
function showStats(data){
    for(let i=0;i<idNumber;i++){
        details.push(Object.values(data.allCars)[i])

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
                    <span class="card-title h3" id="batteryVoltage">${details[i].allStatus.batteryVoltage}</span>
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
                    <span class="card-title h3" id="engineTemp">${details[i].allStatus.engineTemp}</span>
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
                    <span class="card-title h3" id="suspensionLevel">${details[i].allStatus.suspensionLevel}</span>
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