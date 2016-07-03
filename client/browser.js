// Add nonce code to screen for mobile users to enter
document.getElementById('nonce-container').innerHTML = `Mobile code: <span>${imperio.nonce}</span>`;

// Use roomId from cookies to create a room
imperio.desktopRoomSetup(imperio.socket, imperio.room);

let alphaAvg = 0;
let betaAvg = 0;
let gammaAvg = 0;
let alphaDiff = 0;
let betaDiff = 0;
let gammaDiff = 0;

let alphaDataArray = [0, 0, 0];
let betaDataArray = [0, 0, 0];
let gammaDataArray = [0, 0, 0];

// Running average function stacks most recent acceleration points and calcs avg
function calculateRunningAverage(gyroscopeDataObject) {
  alphaDataArray.shift();
  alphaDataArray.push(gyroscopeDataObject.alpha);
  alphaAvg = Math.round(alphaDataArray.reduce((a, b) => {return a + b; }) / 3);
  betaDataArray.shift();
  betaDataArray.push(gyroscopeDataObject.beta);
  betaAvg = Math.round(betaDataArray.reduce((a, b) => {return a + b; }) / 3);
  gammaDataArray.shift();
  gammaDataArray.push(gyroscopeDataObject.gamma);
  gammaAvg = Math.round(gammaDataArray.reduce((a, b) => {return a + b; }) / 3);
}

// Instantiate acceleration handler
imperio.desktopGyroHandler(imperio.socket, calculateRunningAverage);

const alphaElement = document.getElementById('alpha-angle');
const betaElement = document.getElementById('beta-angle');
const gammaElement = document.getElementById('gamma-angle');
const bodyElement = document.querySelector('body');
const cube = document.getElementById('cube');

// Removes and adds one data point to each dataset in the chart
function addData() {
  cube.style.transform = `translateZ(-100px) rotateX(${gammaAvg + gammaDiff}deg) rotateY(${alphaAvg + alphaDiff}deg) rotateZ(${betaAvg + betaDiff}deg)`;
  // $('#cube').css('transform', `translateZ(-100px) rotateZ(${counter}deg)`);
  alphaElement.innerHTML = `${alphaAvg + alphaDiff}`;
  betaElement.innerHTML = `${betaAvg + betaDiff}`;
  gammaElement.innerHTML = `${gammaAvg + gammaDiff}`;
}

function calibrateGyro() {
  console.log('calibrating cube!');
  alphaDiff = 0 - alphaAvg;
  betaDiff = 0 - betaAvg;
  gammaDiff = 0 - gammaAvg;
}

// Set interval to re-render chart
setInterval(addData, 40);

cube.addEventListener('click', calibrateGyro);
