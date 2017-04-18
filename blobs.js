let blobManager;
let joystick;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	joystick = new Joystick();
	blobManager = new BlobManager(joystick);
}

function draw() {
	background(255);
	blobManager.update();
	joystick.run();
}