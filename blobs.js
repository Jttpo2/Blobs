let blobManager;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	blobManager = new BlobManager();
}

function draw() {
	background(255);
	blobManager.update();
}