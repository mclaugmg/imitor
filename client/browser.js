// Add nonce code to screen for mobile users to enter
document.getElementById('nonce-container').innerHTML = `Mobile code: <span>${imperio.nonce}</span>`;

// Use roomId from cookies to create a room
imperio.desktopRoomSetup(imperio.socket, imperio.room);

let alphaAvg = 0;
let betaAvg = 0;
let gammaAvg = 0;

let alphaDataArray = [0, 1, 2];
let betaDataArray = [0, 1, 2];
let gammaDataArray = [0, 1, 2];

// Running average function stacks most recent acceleration points and calcs avg
function calculateRunningAverage(gyroscopeDataObject) {
  alphaDataArray.shift();
  alphaDataArray.push(gyroscopeDataObject.alpha);
  alphaAvg = alphaDataArray.reduce((a, b) => {return a + b; }) / 3;
  betaDataArray.shift();
  betaDataArray.push(gyroscopeDataObject.beta);
  betaAvg = betaDataArray.reduce((a, b) => {return a + b; }) / 3;
  gammaDataArray.shift();
  gammaDataArray.push(gyroscopeDataObject.gamma);
  gammaAvg = gammaDataArray.reduce((a, b) => {return a + b; }) / 3;
}

// Instantiate acceleration handler
imperio.desktopGyroHandler(imperio.socket, calculateRunningAverage);

let counter = 0;
let alphaElement = document.getElementById('alpha-angle');
let betaElement = document.getElementById('beta-angle');
let gammaElement = document.getElementById('gamma-angle');
let bodyElement = document.querySelector('body');

// Removes and adds one data point to each dataset in the chart
function addData() {
  counter++;
  if (counter % 20 === 0) {
    bodyElement.css('background-color', 'yellow');
  }
  if (counter % 40 === 0) {
    bodyElement.css('background-color', 'white');
    counter = 0;
  }
  $('#cube').css('transform', `translateZ(-100px) rotateX(${gammaAvg}deg) rotateY(${alphaAvg}deg) rotateZ(${betaAvg}deg)`);
  // $('#cube').css('transform', `translateZ(-100px) rotateZ(${counter}deg)`);
  alphaElement.innerHTML = `${alphaAvg}`;
  betaElement.innerHTML = `${betaAvg}`;
  gammaElement.innerHTML = `${gammaAvg}`;
}

// Set interval to re-render chart
setInterval(addData, 30);
