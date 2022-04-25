var snap, data, idNumber;
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const UID = user.uid;
    const snapshot = await firebase.database().ref(`carOwners/${UID}`).once('value');
    snap = await firebase.database().ref(`carOwners/${UID}/allCars`);
    data = snapshot.val();
    idNumber = Object.keys(data.allCars ? data.allCars : 0).length;
    showCars(data);
  }
})

var details = [];

function showCars(data) {
  //to add data dynamically
  console.log(data.allCars)
  for (let i = 0; i < idNumber; i++) {
    details.push(Object.values(data.allCars)[i]);

    var total = document.createElement('div');
    total.classList.add("card-body");
    total.setAttribute('id', `${details[i].carDetails.vehicleNumber}`);

    var contentdiv = document.createElement('div');
    contentdiv.innerHTML = `<div class="card-body">
                            <div class="card-body">
                              <p class="text-primary">${details[i].carDetails.brand} ${details[i].carDetails.model}</p>
                            </div>
                            <div class="d-flex justify-content-end">
                              <button type="submit" onclick="removeCar(${i})" id="btn" class="btn btn-danger">Remove Car</button>
                            </div>
                          </div>`;

    total.appendChild(contentdiv);
    document.getElementById("carDetails").appendChild(total);
  }
}

async function removeCar(i) {
  console.log(details[i].carDetails.vehicleNumber);
  await snap.child(details[i].carDetails.vehicleNumber).remove();
  let element = document.getElementById(details[i].carDetails.vehicleNumber);
  element.parentNode.removeChild(element);
};

function AddNewCarDetails() {
  let brand = document.getElementById("brand").value;
  let model = document.getElementById("model").value;
  let vehicleNumber = document.getElementById("vehicleNumber").value;
  console.log(brand, model);
  let cardetails = {
    allStatus: {
      batteryVoltage: {
        currentValue: 14,
        previousValues: [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
      },
      engineTemp: {
        currentValue: 50,
        previousValues: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
      },
      toeLevel: {
        currentValue: 44,
        previousValues: [44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44]
      }
    },
    carDetails: {
      brand: brand,
      model: model,
      vehicleNumber: vehicleNumber,
    }
  }
  if (brand.value != "" && model.value != "") {
    snap.child(`${vehicleNumber}`).set(cardetails);
  } else {
    console.log("put values")
  }
  brand.value = "";
  model.value = "";
  location.reload();
}
