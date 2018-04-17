class BlobManager {
	constructor(p, gameboard) {
		this.p = p; // p5.js instance
		this.gameboard = gameboard;

		this.blobs = [];
		this.initialBlobAmount = Constants.INITIAL_BLOB_AMOUNT;

		p.colorMode(p.HSB, 255, 255, 255);
		this.playerBlobColor = p.color(1, 255, 170);

		this.initBlobs();

		this.deadBlobs = new FIFOQueue();
	}

	update() {
		// Correct place to do this?
		this.applyFriction(this.playerBlob);

		this.blobs.forEach(blob => {
			// this.applyFriction(blob);
			blob.update();
			this.repositionOutsideGameboard(blob);
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
		let p=this.p;
		// Hack to not spawn drones on screen
		let pos = this.getRandomSpawnPosition();
		while (!this.isSpawnPositionOk(pos)) {
			pos = this.getRandomSpawnPosition();
		}
		let vel = p.createVector(
			p.randomGaussian(0, 2),
			p.randomGaussian(0, 2));
		let size = p.randomGaussian(
			Constants.DRONE_AVERAGE_SIZE, Constants.DRONE_SIZE_STANDARD_DEVIATION);
		let col = p.color(
			Math.random() * 255,
			Constants.BLOB_SATURATION,
			Constants.BLOB_BRIGHTNESS);
		let inputModule = new PerlinInput(p);
		let isManual = false;
		let blob = new Blob(
			p,
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
		let p=this.p;
		let vel = p.createVector(0, 0);
		let size = Constants.DRONE_AVERAGE_SIZE + 0.2;
		let isManual = true;
		this.playerBlob = new Blob(
			p,
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
		this.blobs.forEach(blob => {
			this.blobs.forEach(otherBlob => {
				if (otherBlob == this) {
					return;
				}
				if(blob.isCollidingWith(otherBlob)) {
					if (blob.size > otherBlob.size) {
						blob.eat(otherBlob);
						this.kill(otherBlob);
					} else if (blob.size < otherBlob.size) {
						otherBlob.eat(blob);
						this.kill(blob);
					} else {
						blob.bounceFrom(otherBlob);
						otherBlob.bounceFrom(Blob);
					}
				}
			}, this);
		}, this);
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
		let p=this.p;
		return p.createVector(
			Math.random() * this.gameboard.width,
			Math.random() * this.gameboard.height);
	}

	// Hack to not spawn drones on screen
	doNotSpawnNear(pos) {
		this.avoidWhenSpawningDrones = pos;
	}

	// Hack to not spawn drones on screen
	isSpawnPositionOk(pos) {
		let p=this.p;
		if (this.avoidWhenSpawningDrones) {
			return this.avoidWhenSpawningDrones.dist(pos) > p.max(p.width, p.height) / 2;
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
