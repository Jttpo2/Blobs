class BlobManager {
	constructor() {
		this.blobs = [];
		this.initialBlobAmount = 6;
		this.standardBlobSize = 20;

		colorMode(HSB, 255, 255, 255);
		this.playerBlobColor = color(0, 255, 170);

		this.initBlobs();

		this.deadBlobs = new FIFOQueue();	
	}

	update() {
		this.blobs.forEach(function(blob) {
			blob.run();
		});
		this.checkForCollisions();
		this.deleteDeadBlobs();
	}

	initBlobs() {
		for (let i=0; i<this.initialBlobAmount; i++) {
			this.addBlob();
		}
	}

	addBlob() {
		let pos = createVector(random(width), random(height));
		let vel = createVector(randomGaussian(0, 2), randomGaussian(0, 2));
		let size = randomGaussian(this.standardBlobSize, 0.1);
		let col = color(random(255), 120, 230);
		let inputModule = new PerlinInput();
		let isManual = false;
		let blob = new Blob(size, col, pos, vel, isManual);
		blob.setInputModule(inputModule);
		this.blobs.push(blob);
	}

	initPlayerBlob() {
		let pos = createVector(width/2, height/2);
		let vel = createVector(0, 0);
		let size = this.standardBlobSize;
		let isManual = true;
		this.playerBlob = new Blob(size, this.playerBlobColor, pos, vel, isManual);
		this.blobs.push(this.playerBlob);
		return this.playerBlob;
	}

	checkForCollisions() {
		let surroundingClassHandle = this;
		this.blobs.forEach(function(blob) {
			surroundingClassHandle.blobs.forEach(function(otherBlob) {
				if (otherBlob == this) {
					return;
				}
				if(blob.isCollidingWith(otherBlob)) {
					if (blob.size > otherBlob.size) {
						blob.eat(otherBlob);
						surroundingClassHandle.kill(otherBlob);
					} else if (blob.size < otherBlob.size) {
						otherBlob.eat(blob);
						surroundingClassHandle.kill(blob);

					} else {
						blob.bounceFrom(otherBlob);
						otherBlob.bounceFrom(Blob);
					}
				}
			});
		});
	}

	kill(blob) {
		blob.die();
		this.deadBlobs.add(blob);
	}

	deleteDeadBlobs() {
		while (!this.deadBlobs.isEmpty()) {
			let deadBlob = this.deadBlobs.poll();
			let index = this.blobs.indexOf(deadBlob);
			this.blobs.splice(index, 1);
		}
	}
}
