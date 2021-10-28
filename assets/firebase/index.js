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

        //for reating canvas dynamically
        var canvas = document.createElement('canvas');
        canvas.id = `canvas-${details[i].carDetails.vehicleNumber}`;
        canvas.width = 700;
        canvas.height = 200;
        canvas.style.zIndex = 8;
        canvas.style.border = "1px solid";
        total.appendChild(canvas);

        setTimeout(() => {
            showMovingAvg(details[i].carDetails.vehicleNumber)
        },0);

        //button to show graph
        // var graph = document.createElement('div');
        // graph.innerHTML = `<div>
        //                     <button onclick='showMovingAvg(${details[i].carDetails.vehicleNumber})'>Show Moving Average</button>
        //                 </div>`;
        // total.appendChild(graph);

        document.getElementById("content").appendChild(total);
    }
}

function changeStats(data,vehicleNumber){
    document.getElementById(`engineTemp-${vehicleNumber}`).innerHTML = data.engineTemp ;
    document.getElementById(`batteryVoltage-${vehicleNumber}`).innerHTML = data.batteryVoltage ;
    document.getElementById(`suspensionLevel-${vehicleNumber}`).innerHTML = data.suspensionLevel ;
}

// let bool = false;
// function showMovingAvg(i){
//     console.log(i.id); //vehiclenumber (unique for all cars)
//     if(bool == false){
//         var canvas = document.createElement('canvas');

//         canvas.id = "myChart";
//         canvas.width = 700;
//         canvas.height = 200;
//         canvas.style.zIndex = 8;
//         canvas.style.border = "1px solid";
//         document.getElementById(i.id).appendChild(canvas);

//         let ctx = document.getElementById('myChart').getContext('2d'); // 2d context

//         let movingAverageDuration = 7;
//         let yRealValuesTwoWeeks = [43, 53, 45.5, 41, 42, 49, 36, 71, 39, 44, 55, 49.9, 55, 56];
//         let yRealValuesOneWeek = [71, 39, 44, 55, 49.9, 55, 56];

//         let days = [1, 2, 3, 4, 5, 6, 7];

//         let yMovingAverageValuesOneWeek = [];
//         let sum = 0;
//         for (let i = 0; i < movingAverageDuration; i++) {
//             sum += yRealValuesTwoWeeks[i];
//         }

//         for (let i = movingAverageDuration; i < yRealValuesTwoWeeks.length; i++) {
//             sum += yRealValuesTwoWeeks[i];
//             sum -= yRealValuesTwoWeeks[i - movingAverageDuration];
//             yMovingAverageValuesOneWeek.push(sum / movingAverageDuration);
//             console.log(sum / movingAverageDuration);
//         }

//         let myChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: days,
//                 datasets: [{
//                         label: 'Real values',
//                         data: yRealValuesOneWeek,
//                         fill: false,
//                         borderColor: 'blue',
//                         tension: 0.1
//                     },
//                     {
//                         label: `Moving Average ${movingAverageDuration} Days`,
//                         data: yMovingAverageValuesOneWeek,
//                         fill: false,
//                         borderColor: 'rgb(75, 192, 192)',
//                         borderWidth: 1.5,
//                         tension: 0.1
//                     }
//                 ]
//             }
//         })
//         bool = true;
//     }else{
//         var  movingavggraph = document.getElementById(i.id);
//         movingavggraph.removeChild(movingavggraph.lastChild); //to remove canvas
//         bool = false;
//     }
// }

function showMovingAvg(i){
    console.log(i)
    let ctx = document.getElementById(`canvas-${i}`).getContext('2d'); // 2d context

    let movingAverageDuration = 7;
    let yRealValuesTwoWeeks = [43, 53, 45.5, 41, 42, 49, 36, 71, 39, 44, 55, 49.9, 55, 56];
    let yRealValuesOneWeek = [71, 39, 44, 55, 49.9, 55, 56];

    let days = [1, 2, 3, 4, 5, 6, 7];

    let yMovingAverageValuesOneWeek = [];
    let sum = 0;
    for (let i = 0; i < movingAverageDuration; i++) {
        sum += yRealValuesTwoWeeks[i];
    }

    for (let i = movingAverageDuration; i < yRealValuesTwoWeeks.length; i++) {
        sum += yRealValuesTwoWeeks[i];
        sum -= yRealValuesTwoWeeks[i - movingAverageDuration];
        yMovingAverageValuesOneWeek.push(sum / movingAverageDuration);
        console.log(sum / movingAverageDuration);
    }

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                    label: 'Real values',
                    data: yRealValuesOneWeek,
                    fill: false,
                    borderColor: 'blue',
                    tension: 0.1
                },
                {
                    label: `Moving Average ${movingAverageDuration} Days`,
                    data: yMovingAverageValuesOneWeek,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1.5,
                    tension: 0.1
                }
            ]
        }
    })
}