var h1Element = document.querySelector('h1');
var h2Element = document.querySelector('h2');
var h3Element = document.querySelector('h3');

// imperio.gyroTimer = (socket, room, callback) => {
//   window.ondeviceorientation = event => {
//     const alpha = Math.round(event.alpha);
//     const beta = Math.round(event.beta);
//     const gamma = Math.round(event.gamma);
//     const gyroObject = {
//       alpha,
//       beta,
//       gamma,
//     };
//     socket.emit('gyroscopeTime', room, gyroObject, Date.now());
//     if (callback) callback(gyroObject);
//   };
// }

imperio.mobileRoomSetup(imperio.socket, imperio.room, showRoomName);

// handle gyro using our library
imperio.mobileGyroShare(imperio.socket, imperio.room, printGyroscopeData);

function printGyroscopeData(gyroObj) {
  h3Element.innerHTML = `alpha is ${gyroObj.alpha},
    beta is ${gyroObj.beta}, gamma is ${gyroObj.gamma}`;
}

function showRoomName() {
  h1Element.innerHTML = `inside socket connection, room is good`;
}
