const serviceUUID = "6a5a09f8-e39f-11eb-ba80-0242ac130004";

const gestureCharacteristicUUID = "9c8b9f98-e3a1-11eb-ba80-0242ac130004";

var playerOneBLE = new p5ble();
var playerTwoBLE = new p5ble();

var playerOneConnected = false;
var playerTwoConnected = false;

var previousPlayerOneConnected = false;
var previousPlayerTwoConnected = false;

var playerOneCharacteristic;
var playerTwoCharacteristic;
var counter = setInterval(timer, 1000);

var firstIntroDone = false;
var secondIntroDone = false;
var thirdIntroDone = false;

var firstCountdownDone = false;
var secondCountdownDone = false;
var thirdCountdownDone = false;

var firstGameDone = false;
var secondGameDone = false;
var thirdGameDone = false;

var playerOneThirdGameLevel = 0;
var playerTwoThirdGameLevel = 0;

var thirdGameGestures;

var playerOneScore = 0;
var playerTwoScore = 0;

var canvas;

var count = 0;

var gameStarted = false;

var firstGameGesture;
var secondGameGesture;

var firstGameWinners = [false, false];
var secondGameWinners = [false, false];
var thirdGameWinners = [false, false];

var finalScreenDone = false;

var playerOneData = null;
var playerTwoData = null;

function init() {
  previousPlayerOneConnected = playerOneConnected;
  previousPlayerTwoConnected = playerTwoConnected;

  playerOneConnected = playerOneBLE.isConnected();
  playerTwoConnected = playerTwoBLE.isConnected();

  previousPlayerOneConnected = false;
  previousPlayerTwoConnected = false;

  playerOneCharacteristic = null;
  playerTwoCharacteristic = null;

  playerOneData = null;
  playerTwoData = null;

  gameStarted = false;

  playerOneScore = 0;
  playerTwoScore = 0;

  firstIntroDone = false;
  secondIntroDone = false;
  thirdIntroDone = false;

  firstCountdownDone = false;
  secondCountdownDone = false;
  thirdCountdownDone = false;

  firstGameDone = false;
  secondGameDone = false;
  thirdGameDone = false;

  playerOneThirdGameLevel = 0;
  playerTwoThirdGameLevel = 0;

  firstGameWinners = [false, false];
  secondGameWinners = [false, false];

  firstGameGesture = Math.round(Math.random() * 4);
  secondGameGesture = Math.round(Math.random() * 4);

  let temp = shuffle([0, 1, 2, 3, 4]);
  thirdGameGestures = temp.slice(0, 3);

  for (let i = 0; i < thirdGameGestures.length - 1; i++) {
    if (thirdGameGestures[i] == thirdGameGestures[i + 1]) {
      thirdGameGestures[i] = Math.round(Math.random() * 4);
    }
  }

  showAllElements();
  hideHowToPlay();

  $("#connectPlayerOneButton").click(function () {
    connectToPlayerOneBLE();
  });
  $("#connectPlayerTwoButton").click(function () {
    connectToPlayerTwoBLE();
  });

  $("#startButton").hover(
    function () {
      if (playerOneConnected && playerTwoConnected) {
        $(this).css("color", "#e6e6e6");
        $(this).css("background-color", "#2f2f2f");
      }
    },
    function () {
      $(this).css("color", "#2f2f2f");
      $(this).css("background-color", "#e6e6e6");
    }
  );

  $("#connectPlayerOneButton").hover(
    function () {
      $(this).css("color", "#e6e6e6");
      $(this).css("background-color", "#2f2f2f");
    },
    function () {
      console.log(playerOneConnected);
      if (playerOneConnected) {
        $(this).css("color", "#e6e6e6");
        $(this).css("background-color", "#2f2f2f");
      } else {
        $(this).css("color", "#2f2f2f");
        $(this).css("background-color", "#e6e6e6");
      }
    }
  );

  $("#connectPlayerTwoButton").hover(
    function () {
      $(this).css("color", "#e6e6e6");
      $(this).css("background-color", "#2f2f2f");
    },
    function () {
      console.log(playerTwoConnected);
      if (playerTwoConnected) {
        $(this).css("color", "#e6e6e6");
        $(this).css("background-color", "#2f2f2f");
      } else {
        $(this).css("color", "#2f2f2f");
        $(this).css("background-color", "#e6e6e6");
      }
    }
  );

  $("#startButton").attr("disabled", "disabled");
  if (!playerTwoConnected) {
    $("#connectPlayerTwoButton").removeAttr("disabled");
  }

  if (!playerOneConnected) {
    $("#connectPlayerOneButton").removeAttr("disabled");
  }

  $("#startButton").click(function () {
    hideAllElements();
    canvas.show();
    gameStarted = true;
    count = 0;
  });

  $("#HowToPlay").click(function () {
    hideAllElements();
    showHowToPlay();
  });

  $("#BackToMain").click(function () {
    showAllElements();
    hideHowToPlay();
  });
}



var circleImage;
var greaterThanImage;
var lessThanImage;
var n3Image;
var r3Image;
var imageArray;

var startSound;
var rightSound;
var wrongSound;

function preload() {
  circleImage = loadImage("images/circle.png");
  greaterThanImage = loadImage("images/greaterthan.png");
  lessThanImage = loadImage("images/lessthan.png");
  n3Image = loadImage("images/n3.png");
  r3Image = loadImage("images/r3.png");

  imageArray = [circleImage, greaterThanImage, lessThanImage, n3Image, r3Image];

  startSound = loadSound("sounds/start.mp3");
  rightSound = loadSound("sounds/correct.wav");
  wrongSound = loadSound("sounds/wrong.wav");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.hide();

  init();
  frameRate(30);
}

function draw() {
  background(230, 230, 230);

  //console.log(frameRate());
  if (gameStarted) {
    if (!firstIntroDone && count <= 4) {
      drawFirstIntro();
      if (count == 4) {
        firstIntroDone = true;
        count = 0;
      }
    } else if (!firstCountdownDone && count <= 3) {
      var time = 3 - count;
      if (time >= 1) {
        drawCountDown();
      } else {
        firstCountdownDone = true;
        count = 0;
      }
    } else if (!firstGameDone) {
      drawFirstGame();
      if (playerOneData != null) {
        if (playerOneData == firstGameGesture) {
          firstGameWinners[0] = true;
          playerOneScore += 1;
          rightSound.play();
        } else {
          wrongSound.play();
        }
        playerOneData = null;
      }
      if (playerTwoData != null) {
        if (playerTwoData == firstGameGesture) {
          firstGameWinners[1] = true;
          playerTwoScore += 1;
          rightSound.play();
        } else {
          wrongSound.play();
        }
        playerTwoData = null;
      }
      if (firstGameWinners[0] || firstGameWinners[1]) {
        firstGameDone = true;
        count = 0;
      }
    } else if (!secondIntroDone && count <= 3) {
      drawSecondIntro();
      if (count == 3) {
        secondIntroDone = true;
        count = 0;
      }
    } else if (!secondCountdownDone && count <= 3) {
      var time = 3 - count;
      if (time >= 1) {
        drawCountDown();
      } else {
        secondCountdownDone = true;
        count = 0;
      }
    } else if (!secondGameDone) {
      drawSecondGame();
      if (playerOneData != null) {
        if (playerOneData == secondGameGesture) {
          secondGameWinners[0] = true;
          playerOneScore += 1;
          rightSound.play();
        } else {
          wrongSound.play();
        }
        playerOneData = null;
      }
      if (playerTwoData != null) {
        if (playerTwoData == secondGameGesture) {
          secondGameWinners[1] = true;
          playerTwoScore += 1;
          rightSound.play();
        } else {
          wrongSound.play();
        }
        playerTwoData = null;
      }
      if (secondGameWinners[0] || secondGameWinners[1]) {
        secondGameDone = true;
        count = 0;
      }
    } else if (!thirdIntroDone && count <= 3) {
      drawThirdIntro();
      if (count == 3) {
        thirdIntroDone = true;
        count = 0;
      }
    } else if (!thirdCountdownDone && count <= 3) {
      var time = 3 - count;
      if (time >= 1) {
        drawCountDown();
      } else {
        thirdCountdownDone = true;
        count = 0;
      }
    } else if (!thirdGameDone) {
      drawThirdGame();
      if (playerOneData != null) {
        if (
          playerOneData == thirdGameGestures[0] &&
          playerOneThirdGameLevel == 0
        ) {
          rightSound.play();
          playerOneThirdGameLevel += 1;
        } else if (
          playerOneData == thirdGameGestures[1] &&
          playerOneThirdGameLevel == 1
        ) {
          rightSound.play();
          playerOneThirdGameLevel += 1;
        } else if (
          playerOneData == thirdGameGestures[2] &&
          playerOneThirdGameLevel == 2
        ) {
          rightSound.play();
          playerOneThirdGameLevel += 1;
        } else {
          wrongSound.play();
        }
        playerOneData = null;
      }
      if (playerTwoData != null) {
        if (
          playerTwoData == thirdGameGestures[0] &&
          playerTwoThirdGameLevel == 0
        ) {
          rightSound.play();
          playerTwoThirdGameLevel += 1;
        } else if (
          playerTwoData == thirdGameGestures[1] &&
          playerTwoThirdGameLevel == 1
        ) {
          rightSound.play();
          playerTwoThirdGameLevel += 1;
        } else if (
          playerTwoData == thirdGameGestures[2] &&
          playerTwoThirdGameLevel == 2
        ) {
          rightSound.play();
          playerTwoThirdGameLevel += 1;
        } else {
          wrongSound.play();
        }
        playerTwoData = null;
      }

      if (playerOneThirdGameLevel == 3 || playerTwoThirdGameLevel == 3) {
        thirdGameWinners = [
          playerOneThirdGameLevel == 3,
          playerTwoThirdGameLevel == 3,
        ];

        if (playerOneThirdGameLevel == 3) {
          playerOneScore += 1;
        } else {
          playerTwoScore += 1;
        }
        count = 0;
        thirdGameDone = true;
      }
    } else if (!finalScreenDone) {
      drawFinalScreen();
    }
    playerOneData = null;
    playerTwoData = null;
  }

  if (previousPlayerOneConnected != playerOneConnected) {
    if (playerOneConnected) {
      $("#connectPlayerOneButton").css("color", "#e6e6e6");
      $("#connectPlayerOneButton").css("background-color", "#2f2f2f");
      $("#connectPlayerOneButton").html("Player One Connected");
      $("#connectPlayerOneButton").attr("disabled", "disabled");
    } else {
      $("#connectPlayerOneButton").css("color", "#2f2f2f");
      $("#connectPlayerOneButton").css("background-color", "#e6e6e6");
      $("#connectPlayerOneButton").html("Connect Player One");
      $("#connectPlayerOneButton").removeAttr("disabled");
    }
    if (playerOneConnected && playerTwoConnected) {
      $("#startButton").removeAttr("disabled");
    }
    if (!playerOneConnected) {
      init();
      canvas.hide();
    }
  }

  if (previousPlayerTwoConnected != playerTwoConnected) {
    if (playerTwoConnected) {
      $("#connectPlayerTwoButton").css("color", "#e6e6e6");
      $("#connectPlayerTwoButton").css("background-color", "#2f2f2f");
      $("#connectPlayerTwoButton").html("Player Two Connected");
      $("#connectPlayerTwoButton").attr("disabled", "disabled");
    } else {
      $("#connectPlayerTwoButton").css("color", "#2f2f2f");
      $("#connectPlayerTwoButton").css("background-color", "#e6e6e6");
      $("#connectPlayerTwoButton").html("Connect Player Two");
      $("#connectPlayerTwoButton").removeAttr("disabled");
    }
    if (playerOneConnected && playerTwoConnected) {
      $("#startButton").removeAttr("disabled");
    } else if (!playerTwoConnected) {
      init();
      canvas.hide();
    }
  }

  previousPlayerOneConnected = playerOneConnected;
  previousPlayerTwoConnected = playerTwoConnected;
}

function connectToPlayerOneBLE() {
  if (!playerOneConnected) {
    playerOneBLE.connect(serviceUUID, gotPlayerOneCharacteristics);
    playerOneConnected = playerOneBLE.isConnected();
  }
}

function connectToPlayerTwoBLE() {
  if (!playerTwoConnected) {
    playerTwoBLE.connect(serviceUUID, gotPlayerTwoCharacteristics);
    playerTwoConnected = playerTwoBLE.isConnected();
  }
}

function connectToAllBLE() {
  if (!playerOneConnected) {
    connectToPlayerOneBLE();
  } else if (!playerTwoConnected) {
    connectToPlayerTwoBLE();
  }
}

function disconnectToBLE() {
  playerOneBLE.disconnect();
  playerTwoBLE.disconnect();

  playerOneConnected = playerOneBLE.isConnected();
  playerTwoConnected = playerTwoBLE.isConnected();
}

function handlePlayerOneDisconnected() {
  playerOneConnected = playerOneBLE.isConnected();
}

function handlePlayerTwoDisconnected() {
  playerTwoConnected = playerTwoBLE.isConnected();
}

function gotPlayerOneCharacteristics(error, characteristics) {
  if (error) {
    console.log("Error: " + error);
  }

  playerOneConnected = playerOneBLE.isConnected();
  console.log(characteristics[0]);

  playerOneCharacteristic = characteristics[0];

  playerOneBLE.startNotifications(
    playerOneCharacteristic,
    handlePlayerOneNotifications
  );

  playerOneBLE.onDisconnected(handlePlayerOneDisconnected);
}

function gotPlayerTwoCharacteristics(error, characteristics) {
  if (error) {
    console.log("Error: " + error);
  }

  playerTwoConnected = playerTwoBLE.isConnected();

  playerTwoCharacteristic = characteristics[0];

  playerTwoBLE.startNotifications(
    playerTwoCharacteristic,
    handlePlayerTwoNotifications
  );

  playerTwoBLE.onDisconnected(handlePlayerTwoDisconnected);

  console.log("Connected 2");
}

function handlePlayerOneNotifications(data) {
  console.log("Player one: ", data);
  playerOneData = data;
}

function handlePlayerTwoNotifications(data) {
  console.log("Player two: ", data);
  playerTwoData = data;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function hideAllElements() {
  var allElements = document.getElementById("allElements");
  allElements.style.display = "none";
}

function showAllElements() {
  var allElements = document.getElementById("allElements");
  allElements.style.display = "block";
}

function showHowToPlay() {
  var howToPlay = document.getElementById("HowToPlayElements");
  howToPlay.style.display = "block";
}

function hideHowToPlay() {
  var howToPlay = document.getElementById("HowToPlayElements");
  howToPlay.style.display = "none";
}

//all the screens

function drawFirstIntro(opacity) {
  var firstIntroText = "Get ready to draw!";

  stroke(47, 47, 47);
  fill(47, 47, 47);
  if (opacity) {
    stroke(47, 47, 47, opacity);
    fill(47, 47, 47, opacity);
  }

  textFont("Oswald");

  textAlign(CENTER, CENTER);

  textSize((150 * width) / 2000);

  imageMode(CENTER, CENTER);

  text(firstIntroText, width / 2, height / 2);
}

function drawSecondIntro(opacity) {
  var secondIntroText;
  if (firstGameWinners[0] && firstGameWinners[1]) {
    secondIntroText = "Tie \n Get ready for round 2!";
  } else if (firstGameWinners[0]) {
    secondIntroText = "Player one won \n Get ready for round 2!";
  } else if (firstGameWinners[1]) {
    secondIntroText = "Player Two won \n Get ready for round 2!";
  }

  textAlign(CENTER, CENTER);
  textSize((150 * width) / 2000);
  text(secondIntroText, width / 2, height / 2);
}

function drawThirdIntro(opacity) {
  var thirdIntroText;
  if (secondGameWinners[0] && secondGameWinners[1]) {
    thirdIntroText = "Tie \n Get ready for round 2!";
  } else if (secondGameWinners[0]) {
    thirdIntroText = "Player one won \n Get ready for the final round!";
  } else if (secondGameWinners[1]) {
    thirdIntroText = "Player Two won \n Get ready for the final round!";
  }
  textAlign(CENTER, CENTER);
  textSize((150 * width) / 2000);
  text(thirdIntroText, width / 2, height / 2);
}

function drawFinalScreen() {
  //canvas.hide();

  let finalText;
  if (playerOneScore > playerTwoScore) {
    finalText = "Player One Won";
  }
  if (playerOneScore < playerTwoScore) {
    finalText = "Player Two Won";
  }
  if (playerOneScore == playerTwoScore) {
    finalText = "Tie";
  }

  fill(43, 43, 43);
  stroke(43, 43, 43);
  textAlign(CENTER, CENTER);
  textSize((120 * width) / 2000);
  text(finalText, width / 2, height / 3);

  textSize((55 * width) / 2000);
  text("P1 Score: " + playerOneScore, (5 * width) / 12, height / 2);
  text("P2 Score: " + playerTwoScore, (7 * width) / 12, height / 2);

  if (
    Math.abs(mouseX - width / 2) <= width / 6 &&
    Math.abs(mouseY - (2 * height) / 3) <= height / 12
  ) {
    fill(47, 47, 47);
    stroke(47, 47, 47);

    rectMode(CENTER, CENTER);
    rect(width / 2, (2 * height) / 3, width / 3, height / 6, 30);
    textSize((50 * width) / 2000);
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    fill(230, 230, 230);
    stroke(230, 230, 230);
    text("Restart", width / 2, (2 * height) / 3);
  } else {
    fill(230, 230, 230);
    stroke(47, 47, 47);
    strokeWeight(5);
    rectMode(CENTER, CENTER);
    rect(width / 2, (2 * height) / 3, width / 3, height / 6, 30);
    textSize((50 * width) / 2000);
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    fill(47, 47, 47);
    text("Restart", width / 2, (2 * height) / 3);
  }
}

function drawCountDown(opacity) {
  if (!startSound.isPlaying()) {
    startSound.play();
  }
  stroke(47, 47, 47);
  fill(47, 47, 47);

  textFont("Oswald");
  textAlign(CENTER, CENTER);
  textSize((450 * width) / 2000);

  var time = 3 - count;

  if (time >= 1) {
    text(time.toString(), width / 2, height / 2);
  }
}

function drawFirstGame() {
  image(
    imageArray[firstGameGesture],
    width / 2,
    height / 2,
    imageArray[firstGameGesture].width / 2.5,
    imageArray[firstGameGesture].height / 2.5
  );
  textSize((100 * width) / 2000);
  textAlign(LEFT, BOTTOM);
  text("Player One Score: " + playerOneScore, 0, height);
  textAlign(RIGHT, BOTTOM);
  text("Player Two Score: " + playerTwoScore, width, height);
}

function drawSecondGame() {
  image(
    imageArray[secondGameGesture],
    width / 2,
    height / 2,
    imageArray[secondGameGesture].width / 2.5,
    imageArray[secondGameGesture].height / 2.5
  );
  textSize((100 * width) / 2000);
  textAlign(LEFT, BOTTOM);
  text("Player One Score: " + playerOneScore, 0, height);
  textAlign(RIGHT, BOTTOM);
  text("Player Two Score: " + playerTwoScore, width, height);
}

function drawThirdGame() {
  if (playerOneThirdGameLevel == 0) {
    image(
      imageArray[thirdGameGestures[0]],
      width / 4,
      height / 2,
      imageArray[thirdGameGestures[0]].width / 3,
      imageArray[thirdGameGestures[0]].height / 3
    );
  } else if (playerOneThirdGameLevel == 1) {
    image(
      imageArray[thirdGameGestures[1]],
      width / 4,
      height / 2,
      imageArray[thirdGameGestures[1]].width / 3,
      imageArray[thirdGameGestures[1]].height / 3
    );
  } else if (playerOneThirdGameLevel == 2) {
    image(
      imageArray[thirdGameGestures[2]],
      width / 4,
      height / 2,
      imageArray[thirdGameGestures[2]].width / 3,
      imageArray[thirdGameGestures[2]].height / 3
    );
  }

  if (playerTwoThirdGameLevel == 0) {
    image(
      imageArray[thirdGameGestures[0]],
      (3 * width) / 4,
      height / 2,
      imageArray[thirdGameGestures[0]].width / 3,
      imageArray[thirdGameGestures[0]].height / 3
    );
  } else if (playerTwoThirdGameLevel == 1) {
    image(
      imageArray[thirdGameGestures[1]],
      (3 * width) / 4,
      height / 2,
      imageArray[thirdGameGestures[1]].width / 3,
      imageArray[thirdGameGestures[1]].height / 3
    );
  } else if (playerTwoThirdGameLevel == 2) {
    image(
      imageArray[thirdGameGestures[2]],
      (3 * width) / 4,
      height / 2,
      imageArray[thirdGameGestures[2]].width / 3,
      imageArray[thirdGameGestures[2]].height / 3
    );
  }

  textSize((100 * width) / 2000);
  textAlign(LEFT, BOTTOM);
  text("Player One Score: " + playerOneScore, 0, height);
  textAlign(RIGHT, BOTTOM);
  text("Player Two Score: " + playerTwoScore, width, height);
}

//functions

function timer() {
  count++;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function mousePressed() {
  if (thirdGameDone) {
    if (
      Math.abs(mouseX - width / 2) <= width / 6 &&
      Math.abs(mouseY - (2 * height) / 3) <= height / 12
    ) {
      init();
    }
  }
}
