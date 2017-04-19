let blobManager;
let manualInput;
let joystick;
let player;
let followCam;
let gameboard;
let gamesize = 2000;
let backgroundColor;

let respawnPopup;

// Makes sure resources are loaded before initiatin sketch
function preload() {
}

function setup() {
	let canvas = createCanvas(
		window.innerWidth * 5/7,
		window.innerHeight * 5/7
		);

	// frameRate(1);

	canvas.parent('sketch-holder');

	backgroundColor = color(50);
	gameboard = new Gameboard(gamesize, gamesize, backgroundColor);
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
	player.update();
	blobManager.update();
	manualInput.update();
	followCam.update();
	joystick.run();
	respawnPopup.run();
}