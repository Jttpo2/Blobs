class BlobManager {
	constructor(gameboard) {
		this.gameboard = gameboard;

		this.blobs = [];
		this.initialBlobAmount = Constants.INITIAL_BLOB_AMOUNT;

		colorMode(HSB, 255, 255, 255);
		this.playerBlobColor = Constants.PLAYER_BLOB_COLOR;

		this.initBlobs();

		this.deadBlobs = new FIFOQueue();
	}

	update() {
		let thisHandle = this;
		
		// Correct place to do this?
		this.applyFriction(this.playerBlob);

		this.blobs.forEach(function(blob) {
			// this.applyFriction(blob);
			blob.update();
			thisHandle.repositionOutsideGameboard(blob);
		}, this);
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
			Constants.DRONE_AVERAGE_SIZE, Constants.DRONE_SIZE_STANDARD_DEVIATION);
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
			Constants.DRONE_MAX_VELOCITY, 
			isManual);
		blob.setInputModule(inputModule);
		this.blobs.push(blob);
	}

	initPlayerBlob(pos) {
		let vel = createVector(0, 0);
		let size = Constants.DRONE_AVERAGE_SIZE + 0.2;
		let isManual = true;
		this.playerBlob = new Blob(
			size, 
			this.playerBlobColor, 
			pos, 
			vel,
			Constants.PLAYER_MAX_VELOCITY,
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

	applyFriction(blob) {
		let friction = blob.vel.copy().normalize();
		let normal = blob.mass;
		friction.mult(-1 * Constants.FRICTION_COEFFICIENT * normal);
		blob.applyForce(friction);
	}
}
