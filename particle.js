class Particle {
	constructor(size, particleColor, startingPosition, initialVelocity) {
		this.pos = startingPosition;
		this.vel = initialVelocity;
		this.acc = createVector(0, 0);

		this.maxSpeed = 2;
		this.size = size; // Radius
		this.color = particleColor;
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	display() {
		displayAt(this.pos);
	}

	displayAt(pos) {
		noStroke();
		fill(this.color);
		ellipse(pos.x, pos.y, this.size*2);
	}

	run() {
		this.update();
		this.display();
	}

	applyForce(force) {
		let f = force.copy();
		f.div(this.mass);
		this.acc.add(f);
	}

	get mass() {
		return this.size;
	}
}