let blobManager;
let manualInput;
let joystick;
let player;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	joystick = new Joystick();
	manualInput = new ManualInput(joystick);
	blobManager = new BlobManager();
	player = new Player(blobManager, manualInput);
}

function draw() {
	background(50);
	player.update();
	blobManager.update();
	manualInput.update();
	joystick.run();
}