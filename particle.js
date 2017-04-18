class Particle {
	constructor(size, particleColor) {
		this.pos = createVector(random(width), random(height));
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);

		this.maxSpeed = 10;
		this.size = size;
		this.color = particleColor;
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);

		this.edges();
	}

	display() {
		noStroke();
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
	}

	run() {
		this.update();
		this.display();
	}

	applyForce(force) {
		let f = force.copy();
		// f.div(this.mass);
		this.acc.add(f);
	}

	edges() {
		if (this.pos.x > width) {
			this.pos.x = 0;
		}
		if(this.pos.x < 0) {
			this.pos.x = width;
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
		}
		if (this.pos.y < 0) {
			this.pos.y = height;
		}
	}
}