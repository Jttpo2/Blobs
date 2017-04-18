class Blob extends Particle {
	constructor (size, blobColor) {
		super(size, blobColor);

		this.isAlive = true;
	}

	update() {
		if (this.isAlive) {
			super.update();
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
		this.size += otherBlob.size;

		// TODO: grow by consumed blobs area (instead of radius)

		// otherBlob.getEaten();

		// 2 * PI * size
		// Area
		// PI * otherBlob.size * otherBlob.size
	}

	die() {
		this.isAlive = false;
	}

	bounceFrom(otherBlob) {
		// TODO: Get affected by velocity (and mass?) of other blob
	}
}