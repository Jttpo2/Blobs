class Particle {
	constructor(p, size, particleColor, startingPosition, initialVelocity, maxVel) {
		this.p = p; // p5.js instance

		this.pos = startingPosition;
		this.vel = initialVelocity;
		this.acc = p.createVector(0, 0);

		this.maxSpeed = maxVel;
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
		let p=this.p;
		p.noStroke();
		p.fill(this.color);
		p.ellipse(pos.x, pos.y, this.size*2);
	}

	run() {
		this.update();
		this.display();
	}

	applyForce(force) {
		this.acc.add(p5.Vector.div(force, this.mass));
	}

	get mass() {
		return this.size;
	}
}