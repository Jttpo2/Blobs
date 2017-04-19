let blobManager;
let manualInput;
let joystick;
let player;
let gameboard;
let gamesize = 2000;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	gameboard = new Gameboard(gamesize, gamesize);
	joystick = new Joystick();
	manualInput = new ManualInput(joystick);
	blobManager = new BlobManager(gameboard);
	player = new Player(blobManager, manualInput);
}

function draw() {
	background(50);
	player.update();
	blobManager.update();
	manualInput.update();
	joystick.run();
}