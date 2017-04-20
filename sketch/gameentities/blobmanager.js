class BlobManager {
	constructor(gameboard) {
		this.gameboard = gameboard;

		this.blobs = [];
		this.initialBlobAmount = Constants.INITIAL_BLOB_AMOUNT;
		this.standardBlobSize = 10;

		colorMode(HSB, 255, 255, 255);
		this.playerBlobColor = Constants.PLAYER_BLOB_COLOR;

		this.initBlobs();

		this.deadBlobs = new FIFOQueue();
	}

	update() {
		let thisHandle = this;
		this.blobs.forEach(function(blob) {
			blob.update();
			thisHandle.repositionOutsideGameboard(blob);
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
		// Hack to not spawn drones on screen
		let pos = this.getRandomSpawnPosition();
		while (!this.isSpawnPositionOk(pos)) {
			pos = this.getRandomSpawnPosition();
		}
		let vel = createVector(
			randomGaussian(0, 2), 
			randomGaussian(0, 2));
		let size = randomGaussian(
			this.standardBlobSize, 10);
		let col = color(
			random(255), 
			Constants.BLOB_SATURATION, 
			Constants.BLOB_BRIGHTNESS);
		let inputModule = new PerlinInput();
		let isManual = false;
		let blob = new Blob(
			size, 
			col, 
			pos, 
			vel, 
			isManual);
		blob.setInputModule(inputModule);
		this.blobs.push(blob);
	}

	initPlayerBlob(pos) {
		let vel = createVector(0, 0);
		let size = this.standardBlobSize + 0.2;
		let isManual = true;
		this.playerBlob = new Blob(
			size, 
			this.playerBlobColor, 
			pos, 
			vel, 
			isManual);
		this.blobs.push(this.playerBlob);
		return this.playerBlob;
	}

	repositionOutsideGameboard(blob) {
		if (blob.pos.x > this.gameboard.width) {
			blob.pos.x = 0;
		}
		if(blob.pos.x < 0) {
			blob.pos.x = this.gameboard.width;
		}
		if (blob.pos.y > this.gameboard.height) {
			blob.pos.y = 0;
		}
		if (blob.pos.y < 0) {
			blob.pos.y = this.gameboard.height;
		}
	}

	displayThoseWithinView(topLeft, bottomRight) {
		
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

			// Add new for every dead one removed
			this.addBlob();
		}
	}

	get allBlobs() {
		return this.blobs;
	}

	getRandomSpawnPosition() {
		return createVector(
			random(
				this.gameboard.width), 
			random(
				this.gameboard.height));
	}

	// Hack to not spawn drones on screen
	doNotSpawnNear(pos) {
		this.avoidWhenSpawningDrones = pos;
	}

	// Hack to not spawn drones on screen
	isSpawnPositionOk(pos) {
		if (this.avoidWhenSpawningDrones) {
			return this.avoidWhenSpawningDrones.dist(pos) > max(width, height) / 2;
		} else {
			return true;
		}
	}
}
