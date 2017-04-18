let blobs = [];
let blobAmount = 10;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	colorMode(HSB);

	for (let i=0; i<blobAmount; i++) {
		blobs[i] = new Blob(randomGaussian(20, 2), color(random(255), 50, 90));
	}
}

function draw() {
	background(200);
	blobs.forEach(function(blob) {
		blob.run();
	});
	checkForCollisions();
}

function checkForCollisions() {
	blobs.forEach(function(blob) {
		blobs.forEach(function(otherBlob) {
			if (otherBlob == this) {
				return;
			}
			if(blob.isCollidingWith(otherBlob)) {
				if (blob.size > otherBlob.size) {
					blob.eat(otherBlob);
					otherBlob.die();
				} else if (blob.size < otherBlob.size) {
					otherBlob.eat(blob);
					blob.die();
				} else {
					blob.bounceFrom(otherBlob);
					otherBlob.bounceFrom(Blob);
				}
			}
		});
	});
}
