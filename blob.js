class Blob extends Particle {
	constructor (size, blobColor, startingPosition, initialVelocity) {
		super(size, blobColor, startingPosition, initialVelocity);

		this.isAlive = true;
	}

	update() {
		if (this.isAlive) {
			super.update();
			this.inputModule.update();
		}
	}

	display() {
		if (this.isAlive) {
			super.display();
		}
	}

	isCollidingWith(otherBlob) {
		if (!this.isAlive || !otherBlob.isAlive) {
			return false;	
		} 
		return p5.Vector.dist(this.pos, otherBlob.pos) < this.size + otherBlob.size;
	}

	eat(otherBlob) {
		if (!this.isAlive || !otherBlob.isAlive) {
			return;	
		}
		this.size = Blob.calcRadius(this.area + otherBlob.area);
	}

	die() {
		this.isAlive = false;
		this.inputModule.detach(this);
	}

	get area() {
		return this.calcArea();
	}

	calcArea() {
		return PI * this.size * this.size;
	}

	static calcRadius(area) {
		return sqrt(area/PI);
	}

	bounceFrom(otherBlob) {
		// TODO: Get affected by velocity (and mass?) of other blob
	}

	observerUpdate(message) {
		if (message.message == InputEnum.MOVEMENT_VECTOR) {
			this.moveInDirection(message.vector);
		}
	}

	moveInDirection(direction) {
		let scalar = 4;
		this.applyForce(direction.mult(scalar));
	}

	setInputModule(inputModule) {
		inputModule.attach(this);
		this.inputModule = inputModule;
	}
}