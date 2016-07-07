// Add nonce code to screen for mobile users to enter
document.getElementById('nonce-container').innerHTML = `Mobile code: <span>${imperio.nonce}</span>`;

// Use roomId from cookies to create a room
imperio.desktopRoomSetup(imperio.socket, imperio.room);

let alphaDiff = 0;
let betaDiff = 0;
let gammaDiff = 0;

function initializeArray(length) {
  let newArray = [];
  for (let i = 0; i < length; i++) {
    newArray.push(0);
  }
  return newArray;
}

const runningDataSize = 3;
let alphaDataArray = initializeArray(runningDataSize);
let betaDataArray = initializeArray(runningDataSize);
let gammaDataArray = initializeArray(runningDataSize);
let gyroscopeDataStore = [alphaDataArray, betaDataArray, gammaDataArray];
let gyroscopeAverages = initializeArray(3);

function runningAverage(newData, dataArray) {
  const length = dataArray.length;
  dataArray.shift();
  dataArray.push(newData);
  return (dataArray.reduce((a, b) => {return a + b;})) / length;
}

// Running average function stacks most recent acceleration points and calcs avg
function calculateRunningAverages(dataObject, dataArray) {
  let i = 0;
  for(let key in dataObject) {
    gyroscopeAverages[i] = runningAverage(dataObject[key], dataArray[i]);
    i++;
  }
}

const timeTable = document.getElementById('time-table');

function handleDates(emitDate, serverDate, listenDate) {
  const emitToServer = serverDate - emitDate;
  const serverToListen = listenDate - serverDate;
  const tripTime = emitToServer + serverToListen;
  const row = timeTable.insertRow(-1);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  cell1.innerHTML = emitToServer;
  cell2.innerHTML = serverToListen;  
  cell3.innerHTML = tripTime;
}

function gyroFunctions(gyroDataObject, emitDate, serverDate) {
  let listenDate = Date.now();
  calculateRunningAverages(gyroDataObject, gyroscopeDataStore);
  handleDates(emitDate, serverDate, listenDate);
}

// Instantiate gyroscope handler
imperio.desktopGyroTimer(imperio.socket, gyroFunctions);

const alphaElement = document.getElementById('alpha-angle');
const betaElement = document.getElementById('beta-angle');
const gammaElement = document.getElementById('gamma-angle');
const bodyElement = document.querySelector('body');
const cube = document.getElementById('cube');

// Removes and adds one data point to each dataset in the chart
function addData() {
  let alphaAvg = gyroscopeAverages[0], betaAvg = gyroscopeAverages[1], gammaAvg = gyroscopeAverages[2];
  cube.style.transform = `translateZ(-100px) rotateX(${gammaAvg + gammaDiff}deg) rotateY(${alphaAvg + alphaDiff}deg) rotateZ(${betaAvg + betaDiff}deg)`;
  alphaElement.innerHTML = `${alphaAvg + alphaDiff}`;
  betaElement.innerHTML = `${betaAvg + betaDiff}`;
  gammaElement.innerHTML = `${gammaAvg + gammaDiff}`;
}

// Set interval to re-render chart
setInterval(addData, 33);

function calibrateGyro() {
  alphaDiff = 0 - gyroscopeAverages[0];
  betaDiff = 0 - gyroscopeAverages[1];
  gammaDiff = 0 - gyroscopeAverages[2];
}

cube.addEventListener('click', calibrateGyro);
