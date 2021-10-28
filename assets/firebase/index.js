var snap, idNumber;
var details = [];
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        const UID = user.uid;
        const snapshot = await firebase.database().ref(`carOwners/${UID}`).once('value');
        let data = snapshot.val();
        idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
        showStats(data)
        var arr = [];
        await firebase.database().ref(`carOwners/${UID}/allCars/`).on('child_changed', snapshot => {
            snapshot.forEach(element => {
                arr.push(element.val())
            });
            changeStats(arr[0], arr[1].vehicleNumber)
            arr = [];
        })
        console.log(data);
    }
})

function showStats(data) {
    console.log(Object.values(data.allCars))
    for (let i = 0; i < idNumber; i++) {
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
                    <span class="card-title h3" id=batteryVoltage-${details[i].carDetails.vehicleNumber}>${details[i].allStatus.batteryVoltage.currentValue} V</span>
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
                    <span class="card-title h3" id=engineTemp-${details[i].carDetails.vehicleNumber}>${details[i].allStatus.engineTemp.currentValue} °C</span>
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
                    <span class="card-title h3" id=suspensionLevel-${details[i].carDetails.vehicleNumber}>${details[i].allStatus.suspensionLevel.currentValue}</span>
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

        var values = ["Engine Temperature", "Suspension Level", "Battery Voltage"];

        var select = document.createElement("select");

        for (const val of values) {
            var option = document.createElement("option");
            option.value = val;
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            select.appendChild(option);
        }

        select.onchange = function () {
            showMovingAvg(details[i].carDetails.vehicleNumber, this.value, i);
        };

        var label = document.createElement("label");
        label.innerHTML = "Choose which graph to show : ";

        total.appendChild(label).appendChild(select);

        //for creating canvas dynamically
        var canvas = document.createElement('canvas');
        canvas.id = `canvas-${details[i].carDetails.vehicleNumber}`;
        canvas.width = 700;
        canvas.height = 200;
        canvas.style.zIndex = 8;
        canvas.style.border = "1px solid";
        total.appendChild(canvas);

        setTimeout(() => {
            showMovingAvg(details[i].carDetails.vehicleNumber, 'Engine Temperature', i);
        }, 0);

        document.getElementById("content").appendChild(total);
    }
}

function changeStats(data, vehicleNumber) {
    document.getElementById(`engineTemp-${vehicleNumber}`).innerHTML = data.engineTemp;
    document.getElementById(`batteryVoltage-${vehicleNumber}`).innerHTML = data.batteryVoltage;
    document.getElementById(`suspensionLevel-${vehicleNumber}`).innerHTML = data.suspensionLevel;
}

async function getLabel() {
    let allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dt = new Date();
    let currentDayIndex = dt.getDay();
    let label = [];
    for (let i = currentDayIndex + 1; i < 7; i++) {
        label.push(allDays[i]);
    }
    for (let i = 0; i <= currentDayIndex; i++) {
        label.push(allDays[i]);
    }
    return label;
}

async function showMovingAvg(vehicleNumber, dropdownValue, carIndex) {
    let ctx = document.getElementById(`canvas-${vehicleNumber}`).getContext('2d'); // 2d context

    let movingAverageDuration = 7;
    let parameter = "";
    switch (dropdownValue) {
        case "Battery Voltage":
            parameter = "batteryVoltage"
            break;

        case "Engine Temperature":
            parameter = "engineTemp"
            break;

        case "Suspension Level":
            parameter = "suspensionLevel"
            break;

        default:
            break;
    }

    let yRealValuesTwoWeeks = details[carIndex].allStatus[parameter].previousValues;
    let yRealValuesOneWeek = yRealValuesTwoWeeks.slice(yRealValuesTwoWeeks.length - movingAverageDuration, yRealValuesTwoWeeks.length);

    let labelDays = await getLabel();

    let yMovingAverageValuesOneWeek = [];
    let sum = 0;
    for (let i = 0; i < movingAverageDuration; i++) {
        sum += yRealValuesTwoWeeks[i];
    }

    for (let i = movingAverageDuration; i < yRealValuesTwoWeeks.length; i++) {
        sum += yRealValuesTwoWeeks[i];
        sum -= yRealValuesTwoWeeks[i - movingAverageDuration];
        yMovingAverageValuesOneWeek.push(sum / movingAverageDuration);
    }

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelDays,
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
