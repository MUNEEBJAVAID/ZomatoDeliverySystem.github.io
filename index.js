let isOrderAccepted = false;
let hasResturantSeenYourOrder = false;
let resturantTimer = null;
let isValetFound = false
let ValetTimer = null;
let isOrderDeliverd = false;
let deliveryTimer = null;



// Zomato App - Start / power up
window.addEventListener('load', function () {
    document.getElementById("acceptOrder").addEventListener('click', function () {
        askResturantToAcceptOrRejectOrder();
    });

    // return promise 
    checkIfOrderAcceptedFromResturant().
        then(isOrderAccept => {
            isOrderAccept === true ? startPreparingOrder() : alert("sorry!resturant couldn't accept your order Returning your amount with zomato shares");
        })
        .catch(err => {
            console.log(err);
            alert("Somtething is wrong please!Try agian")
        });

    // Searching valet
    document.getElementById("findValet").addEventListener('click', function () {
        startSearchingforVallet();
    });

    //   Order Deliverd 
    document.getElementById("deliverOrder").addEventListener('click', function () {
        isOrderDeliverd = true;
    });
});

// Step 1 --> Check whether resturant accepted order or not
function askResturantToAcceptOrRejectOrder() {
    // CallBack
    setTimeout(() => {
        isOrderAccepted = confirm("Should resturant accept order?");
        hasResturantSeenYourOrder = true;
    }, 1000);
}

// Step 2 --> Check if order has accepted
function checkIfOrderAcceptedFromResturant() {

    // Promise ->  resolved/accept or reject
    return new Promise((resolved, reject) => {
        let auotamticRejectAfterOneMinute = 0;
        resturantTimer = setInterval(() => {
            console.log("Checking if order accepted or not");
            auotamticRejectAfterOneMinute += 1;
            // after one minutes checking Order Cancell
            if (auotamticRejectAfterOneMinute === 30) {
                isOrderAccepted = resolved(false);
                clearInterval(resturantTimer);
            }
            if (!hasResturantSeenYourOrder) return;
            isOrderAccepted === true ? resolved(true) : resolved(false);
            clearInterval(resturantTimer);
        }, 2000);
    });

}

// start Preparing
function startPreparingOrder() {
    document.getElementById("findValet").classList.remove("none");
    Promise.all([
        updateOrderStatus(),
        updateMapView(),
        checkIfValetFound(),
        checkIfOrderDelivery()
    ]).then(res => {
        setTimeout(() => {
            alert("How was your food? Rate you food and delivery");
        }, 5000);
    })
        .catch(err => {
            console.error(err);
        })
}

// Helper Function --> pure function --> just aek kam karen gain use for just one logic 

function updateOrderStatus() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById("currentStatus").innerText = isOrderDeliverd ? 'Order Delivered successfully' : 'Preparing your order';
            resolve("Status Update");
        }, 2000);
    });
}

function updateMapView() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById("mapview").style.opacity = "1";
            resolve("Map Update");
        }, 1500);
    })
}

function startSearchingforVallet() {

    // Step 1: Get Valets
    const valuePromises = [];
    for (let i = 0; i < 5; i++) {
        valuePromises.push(getRandomDriver());
    }

    Promise.any(valuePromises).
        then(selectedValet => {
            console.log('Selected a valet => ', selectedValet);
            isValetFound = true;
            document.getElementById("deliverOrder").classList.remove("none");
        }).
        catch(err => {
            console.log(err);
        })

}

function getRandomDriver() {
    return new Promise((resolve, reject) => {
        let timeOut = Math.random() * 1000;
        setTimeout(() => {
            resolve(`Valet ${timeOut}`);
        }, timeOut);
    });
}

function checkIfValetFound() {
    return new Promise((resolve, reject) => {
        ValetTimer = setInterval(() => {
            console.log('searching for valet');
            if (isValetFound) {
                updateValetDetail();
                resolve('updated valet details');
                clearInterval(ValetTimer);
            }
        }, 1000);
    });
}

function checkIfOrderDelivery() {
    return new Promise((resolved, rejected) => {
        deliveryTimer = setInterval(() => {
            if (isValetFound) console.log('is order delivered by valet');
            if (isOrderDeliverd) {
                updateOrderStatus();
                resolved('order delivered valet details');
                clearInterval(deliveryTimer);
            }
        }, 1000);
    })
}

function updateValetDetail() {
    document.getElementById("found-driver").classList.remove("none");
    document.getElementById("call").classList.remove("none");
    document.getElementById("finding-driver").classList.add("none");
}

