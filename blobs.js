let blobManager;
let joystick;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	blobManager = new BlobManager();
	// joystick = new Joystick();
}

function draw() {
	background(255);
	blobManager.update();
	// joystick.run();
}