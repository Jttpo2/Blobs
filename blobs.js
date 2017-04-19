let blobManager;
let manualInput;
let joystick;
let player;
let followCam;
let gameboard;
let gamesize = 1000;

function setup() {
	let canvas = createCanvas(
		window.innerWidth * 5/7,
		window.innerHeight * 5/7
		);

	// frameRate(1);

	canvas.parent('sketch-holder');

	gameboard = new Gameboard(gamesize, gamesize);
	joystick = new Joystick();
	manualInput = new ManualInput(joystick);
	blobManager = new BlobManager(gameboard);
	player = new Player(blobManager, manualInput);
	followCam = new FollowCam(blobManager);
	followCam.follow(player);
}

function draw() {
	background(50);
	player.update();
	blobManager.update();
	manualInput.update();
	joystick.run();
	followCam.update();
}