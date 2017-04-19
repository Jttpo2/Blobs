let blobManager;
let joystick;
let player;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	joystick = new Joystick();
	blobManager = new BlobManager(joystick);
	player = new Player(blobManager, joystick);
}

function draw() {
	background(255);
	blobManager.update();
	joystick.run();
}