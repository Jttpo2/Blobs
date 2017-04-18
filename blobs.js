let blobs = [];
let blobAmount = 10;

function setup() {
	let canvas = createCanvas(
		window.innerWidth /1.5,
		window.innerHeight /1.5
		);

	canvas.parent('sketch-holder');

	colorMode(HSB, 255, 255, 255);

	for (let i=0; i<blobAmount; i++) {
		blobs[i] = new Blob(randomGaussian(20, 0.1), color(random(255), 120, 230), false);
	}
}

function draw() {
	
	background(255);
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
