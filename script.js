let rover = {}
let rocks = [];
const step = 50;
const printedInput = document.getElementById("console-input")
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//classList.add

window.onload = function (step) {
  rover = {
    x: 250,
    y: 250,
    angle: -90,
    direction: 'N',
    image: new Image()
  }

  rover.image.src = "img/roversml.svg";

  window.addEventListener("keydown", keypress_handler, false);
  window.addEventListener("keyup", keyup_handler(step), false);

  drawStats(rover)
  createRocks(10, rover)

  const moveInterval = setInterval(function () {
    draw();
  }, 50);

};

function setRockNumber() {
  let rockNumber = document.getElementById("rock-number").value
  rocks = []
  createRocks(rockNumber, rover)
}

function getInput() {
  inputText = document.getElementById("input").value;
  return inputText.split("");
}
const inputForm = document.getElementById("form");

function getRandomRange(min, max, step) {
  const maxStep = max / step
  return step * Math.floor((Math.random() * ((maxStep - min) + min)));
}

inputForm.addEventListener("submit", (e => {
  e.preventDefault();
  listCommands = getInput()
  listCommands.forEach((command, i) => {
    setTimeout(() => {
      printedInput.classList.remove('red-background')
      drawConsole(">" + listCommands.join(""))
      parseMovements(command)
      listCommands.shift();
      console.log(command);
    }, i * 1000);
  });
  setTimeout(() => {
    drawConsole("DONE")
  }, (listCommands.length) * 1000)
  })
)

function parseMovements(instruction) {
  switch (instruction) {
    case "f":
      moveForward(rover, rocks)
      break;
    case 'b':
      moveBackward(rover, rocks)
      break;
    case 'r':
      turnRight(rover)
      break;
    case 'l':
      turnLeft(rover)
      break;
    default:
      drawConsole("Invalid command: " + instruction)
      break;
  }
}

function drawStats(rover) {
  const directionConsole = document.getElementById("direction")
  const xConsole = document.getElementById("x-coordinate")
  const yConsole = document.getElementById("y-coordinate")
  directionConsole.innerHTML = "Dir: " + rover.direction
  xConsole.innerHTML = "X: " + rover.x / step
  yConsole.innerHTML = "Y: " + rover.y / step
}

function Rock(x, y) {
  this.x = x;
  this.y = y;

  this.draw = () => {
    img = new Image();
    img.src = "img/rock.svg";
    context.drawImage(img, (this.x), (this.y), 50, 50);
  }

}


function createRocks(numberOFRocks, rover) {
  for (let i = 0; i < numberOFRocks; i++) {
    let x = getRandomRange(25, canvas.width - (step + step / 2), 50) + (step / 2);
    let y = getRandomRange(25, canvas.height - (step + step / 2), 50) + (step / 2);
    if ((x + (step / 2) === rover.x) && (y + (step / 2) === rover.y)) {
      i--
    } else {
      rocks.push(new Rock(x, y));
    }
  }
}


function drawConsole(text) {
  printedInput.innerHTML = text
}

function toRadian(degree) {
  return Math.PI / 180 * degree
}

function drawrover(rover) {
  context.save();
  context.translate(rover.x, rover.y);
  context.rotate(toRadian(rover.angle));
  context.shadowOffsetX = 7;
  context.shadowOffsetY = 7;
  context.shadowColor = "rgba(94, 44, 8, 0.7)";
  context.drawImage(rover.image, -(rover.image.width / 2), -(rover.image.height / 2), 50, 35);
  context.restore();
}

function drawGrid() {
  displayGrid = document.getElementById("display-grid")
  if (displayGrid.checked) {
    for (let i = 25; i < canvas.height; i += step) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, canvas.height);
      context.strokeStyle = "rgba(88, 89, 91, 0.9)";
      context.stroke();
    }
    for (let i = 25; i < canvas.width; i += step) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(canvas.width, i);
      context.strokeStyle = "rgba(88, 89, 91, 0.9)";
      context.stroke();
    }
  }

}

function draw() {

  context.clearRect(0, 0, 800, 800);
  drawGrid()
  drawrover(rover);
  drawStats(rover)
  rocks.forEach(rock => {
    rock.draw()
  })
}


//Border colission
function borderCollision(nextX, nextY) {
  if (nextX >= canvas.width || nextX <= 0 || nextY >= canvas.height || nextY <= 0) {
    return true
  } else {
    return false
  }
}

//Rock colission
function rockCollision(nextX, nextY) {
  rockFoundFunction = (rock => {
    return (nextX === (rock.x + (step / 2))) && ((nextY === (rock.y + step / 2)))
  })
  const rockFound = rocks.some(rockFoundFunction)
  return rockFound
}


function degToCompass(num) {
  var val = Math.floor((num / 90) + 0.5);
  var arr = ["E", "S", "W", "N"];
  return arr[(val % 4)];
}


function moveRover(rover, step) {
  nextX = rover.x + Math.round(step * Math.cos(toRadian(rover.angle)));
  nextY = rover.y + Math.round(step * Math.sin(toRadian(rover.angle)));
  if (borderCollision(nextX, nextY)) {
    printedInput.classList.add('red-background')
    drawConsole('OUT OF BOUNDARIES')
  } else if (rockCollision(nextX, nextY)) {
    printedInput.classList.add('red-background')
    drawConsole('OBSTACLE DETECTED')
  } else {
    rover.x = nextX;
    rover.y = nextY;
  }

}

//DIRECTIONAL FUNCTIONS

function turnLeft(rover) {
  console.log('turnLeft was called!');
  rover.angle = (rover.angle + 270) % 360
  rover.direction = degToCompass(rover.angle)
}

function turnRight(rover) {
  console.log('turnRight was called!');
  rover.angle = (rover.angle + 90) % 360
  rover.direction = degToCompass(rover.angle)
}

function moveForward(rover, rocks) {
  console.log('moveForward was called');
  moveRover(rover, step, rocks)
}

function moveBackward(rover) {
  moveRover(rover, -step)
  console.log('moveBackward was called');
}

function keyup_handler(event) {
  if (event.keyCode == 38 || event.keyCode == 40) {
    step = 0;
  }
}

/*
37 LEFT
38 UP
39 RIGHT
40 DOWN
*/

function keypress_handler(event, step, rocks) {
  printedInput.classList.remove('red-background')
  drawConsole('MANUAL OVERRIDE')
  if (event.keyCode == 38) {
    moveForward(rover);
  }
  if (event.keyCode == 40) {
    moveBackward(rover);
  }
  if (event.keyCode == 37) {
    turnLeft(rover);
  }
  if (event.keyCode == 39) {
    turnRight(rover);
  }

}






