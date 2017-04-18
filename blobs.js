let blobs = [];
let blobAmount = 5;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /2,
		window.innerHeight /2
		);

	canvas.parent('sketch-holder');

	for (let i=0; i<blobAmount; i++) {
		blobs[i] = new Blob(10, color(23, 140, 240));
	}
}

function draw() {
	background(200);
	blobs.forEach(function(blob) {
		blob.run();
	});
	
}