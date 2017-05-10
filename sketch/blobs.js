// blobs.js

let canvasToWindowWidthRatio = 5/7;
let canvasToWindowHeightRatio = 5/7;

let blobManager;
let manualInput;
let joystick;
let player;
let followCam;
let gameboard;
let gamesize = Constants.GAME_SIZE;
let backgroundColor;
let patternColor;

let respawnPopup;

let isTouchDevice = false; // Start with the assumption that we are on desktop

// Makes sure resources are loaded before initiatin sketch
function preload() {
}

function setup() {
	let canvas = createCanvas(
		window.innerWidth, // * canvasToWindowWidthRatio,
		window.innerHeight //* canvasToWindowHeightRatio
		); 

	// frameRate(1);

	backgroundColor = color(50);
	patternColor = color(100);
	gameboard = new Gameboard(gamesize, gamesize, backgroundColor, patternColor);
	joystick = new Joystick();
	manualInput = new ManualInput(joystick);
	blobManager = new BlobManager(gameboard);
	let playerStartPos = createVector(gameboard.width/2, gameboard.height/2);
	player = new Player(playerStartPos, blobManager, manualInput);
	followCam = new FollowCam(gameboard, blobManager.allBlobs);
	followCam.follow(player);

	respawnPopup = new RespawnPopup();
	player.attach(respawnPopup);
}

function draw() {
	detectIfTouchDevice();

	player.update();
	blobManager.update();
	manualInput.update();
	followCam.update();
	joystick.run();
	respawnPopup.run();
}

function windowResized() {
	resizeCanvas(
		window.innerWidth * canvasToWindowWidthRatio,
		window.innerHeight * canvasToWindowHeightRatio);
	onResize();
}

function onResize() {
	respawnPopup.reposition();
}

// Hack to check whether we're on a touch device. 
// Must be called every frame
function detectIfTouchDevice() {
	if (touches.length > 0) {
		isTouchDevice = true;
	}
}

