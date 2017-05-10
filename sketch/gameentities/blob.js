class Blob extends Particle {
	constructor (p, size, blobColor, startingPosition, initialVelocity, maxVel, isManual) {
		super(p, size, blobColor, startingPosition, initialVelocity, maxVel);

		this.isManual = isManual;
		this.isAlive = true;
	}

	update() {
		if (this.isAlive) {
			super.update();
			
			if (!this.isManual) {
				this.inputModule.update();
			}
		}
	}
	
	displayAt(pos) {
		let p=this.p;
		if (this.isAlive) {
			super.displayAt(pos);
			if (this.isManual) {
				// Distinguish player blob by
				
				p.colorMode(p.HSB, 255, 255, 255);

				// border 
				p.noFill();
				// stroke(
				// 	color(
				// 		hue(this.color), 
				// 		saturation(this.color), 
				// 		brightness(this.color) + 25));
				// ellipse(
				// 	pos.x, 
				// 	pos.y, 
				// 	size * 2);

				// center spot
				p.noStroke();
				p.fill(
					p.color(
						p.hue(this.color), 
						p.saturation(this.color), 
						p.brightness(this.color) - 100));
				p.ellipse(
					pos.x, 
					pos.y, 
					this.size * (5/6));
			}
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
		return Math.PI * this.size * this.size;
	}

	static calcRadius(area) {
		return Math.sqrt(area/Math.PI);
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
		let scalar = 1;
		this.applyForce(direction.mult(scalar));
	}

	setInputModule(inputModule) {
		inputModule.attach(this);
		this.inputModule = inputModule;
	}
}