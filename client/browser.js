// Add nonce code to screen for mobile users to enter
document.getElementById('nonce-container').innerHTML = `Mobile code: <span>${imperio.nonce}</span>`;

// Use roomId from cookies to create a room
imperio.desktopRoomSetup(imperio.socket, imperio.room);

let alphaAvg = 0;
let betaAvg = 0;
let gammaAvg = 0;

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

let counter = 0;
const alphaElement = document.getElementById('alpha-angle');
const betaElement = document.getElementById('beta-angle');
const gammaElement = document.getElementById('gamma-angle');
const bodyElement = document.querySelector('body');
const cube = document.getElementById('cube');

// Removes and adds one data point to each dataset in the chart
function addData() {
  counter++;
  if (counter % 20 === 0) {
    bodyElement.style['background-color'] = 'yellow';
  }
  if (counter % 40 === 0) {
    bodyElement.style['background-color'] = 'yellow';
    counter = 0;
  }
  cube.style.transform = `translateZ(-100px) rotateX(${gammaAvg}deg) rotateY(${alphaAvg}deg) rotateZ(${betaAvg}deg)`;
  // $('#cube').css('transform', `translateZ(-100px) rotateZ(${counter}deg)`);
  alphaElement.innerHTML = `${alphaAvg}`;
  betaElement.innerHTML = `${betaAvg}`;
  gammaElement.innerHTML = `${gammaAvg}`;
}

// Set interval to re-render chart
setInterval(addData, 30);
