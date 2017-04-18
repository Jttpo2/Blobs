class Blob extends Particle {
	constructor (size, blobColor, isManuallyControlled) {
		super(size, blobColor);

		this.isAlive = true;

		if (isManuallyControlled) {
			this.inputModule = new ManualInput();
		} else {
			this.inputModule = new AIInput();	
		}
		this.inputModule.attach(this);
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
		this.move(message);
	}

	move(direction) {

		let mag = 0.2;
		switch(direction) {
			case InputEnum.UP: 
			// console.log("up");
			this.applyForce(createVector(0, mag));
			break;
			case InputEnum.DOWN: 
			// console.log("down");
			this.applyForce(createVector(0, -mag));
			break;
			case InputEnum.LEFT: 
			// console.log("left");
			this.applyForce(createVector(-mag, 0));
			break;
			case InputEnum.RIGHT: 
			// console.log("right");
			this.applyForce(createVector(mag, 0));
			break;
			default: console.log("Received: " + direction);
		}
	}
}