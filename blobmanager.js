class BlobManager {
	constructor(joystick) {
		this.blobs = [];
		this.initialBlobAmount = 0;
		this.standardBlobSize = 20;

		colorMode(HSB, 255, 255, 255);
		
		this.joystick = joystick;

		this.initBlobs();
		this.initPlayerBlob();


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
		this.blobs.push(new Blob(size, col, pos, vel, inputModule));
	}

	initPlayerBlob() {
		let pos = createVector(width/2, height/2);
		let vel = createVector(0, 0);
		let size = this.standardBlobSize;
		let col = color(0, 255, 70);
		let inputModule = new ManualInput(this.joystick);
		// this.joystick.attach(this.joystick);
		// inputModule.listenTo()
		this.playerBlob = new Blob(size, col, pos, vel, inputModule);
		this.blobs.push(this.playerBlob);	
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

	// // Joystick listener
	// observerUpdate(message) {
	// 	if (message.message == InputEnum.Joystick) {
	// 		this.playerBlob.
	// 	}
	// }

	// attachPlayerToJoystick(joystick) {
	// 	this.playerBlob.
	// }
}
