class BlobManager {
	constructor() {
		this.blobs = [];
		this.blobAmount = 4;
		this.standardBlobSize = 20;

		colorMode(HSB, 255, 255, 255);

		for (let i=0; i<this.blobAmount; i++) {
			let pos = createVector(random(width), random(height));
			let vel = createVector(randomGaussian(0, 2), randomGaussian(0, 2));
			let size = randomGaussian(this.standardBlobSize, 0.1);
			let col = color(random(255), 120, 230);
			let manualControl = false;
			this.blobs[i] = new Blob(size, col, pos, vel, manualControl);
		}

		let pos = createVector(width/2, height/2);
		let vel = createVector(0, 0);
		let size = this.standardBlobSize;
		let col = color(0, 255, 70);
		let manualControl = true;
		this.playerBlob = new Blob(size, col, pos, vel, manualControl);
		this.blobs.push(this.playerBlob);	
	}

	update() {
		this.blobs.forEach(function(blob) {
			blob.run();
		});
		this.checkForCollisions();
	}

	checkForCollisions() {
		let blobsHandle = this.blobs;
		blobsHandle.forEach(function(blob) {
			blobsHandle.forEach(function(otherBlob) {
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
}