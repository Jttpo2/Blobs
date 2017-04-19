class Joystick {
	constructor() {
		colorMode(HSB, 255, 255, 255);
		this.color = color(134, 200, 100);
		this.borderColor =
		color(
			hue(this.color), 
			saturation(this.color), 
			brightness(this.color) + 25);
		this.thumbColor = color(
			hue(this.color), 
			saturation(this.color), 
			brightness(this.color) - 40);
		this.innerThumbColor  = color(
			hue(this.color), 
			saturation(this.color), 
			brightness(this.color) + 80);
		
		this.decidingDimension = min(width, height);

		this.radius = this.decidingDimension/8;
		this.borderWidth = this.radius * (1/5);

		this.thumbSize = this.radius/1.2;
		this.innerThumbSize = this.thumbSize * (3/4);
		this.edgeMargin = this.radius * (7/5);
		this.pos = createVector(
			this.edgeMargin,
			height -this.edgeMargin
			);

		this.thumbPos = this.pos;
		// Prevent thumb from going all the way to joystick edge
		this.thumbCenterDistanceLimit = 9/10;

		// Scale down the movement vector generated from thumb distance to center
		this.movementScalar = 0.03;

		this.observers = [];

		this.isSteering = false;
		this.wasSteering = false;
	}

	run() {
		this.update();
		this.display();
	}

	update() {

	}

	display() {
		stroke(this.borderColor);
		strokeWeight(this.borderWidth);
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);

		noStroke();
		// Thumb
		fill(this.thumbColor);
		ellipse(this.thumbPos.x, this.thumbPos.y, this.thumbSize);

		// Inner thumb
		fill(this.innerThumbColor);
		ellipse(this.thumbPos.x, this.thumbPos.y, this.innerThumbSize);
	}

	feedInput(pos) {
		if (!this.isSteering && this.isWithinJoystick(pos)) {
			this.steerTowards(pos);
		} else if (this.isSteering) {
			this.steerTowards(pos);
		}
	}

	finishInput() {
		this.isSteering = false;
		this.thumbPos = this.pos;
	}

	steerTowards(pos) {
		let movementVector = this.getMovementVector(pos);
		movementVector.limit(this.radius * this.thumbCenterDistanceLimit);
		this.thumbPos = p5.Vector.add(movementVector, this.pos);
		
		// Scale down this strong vector
		movementVector.mult(this.movementScalar);

		this.notify({
			message: InputEnum.MOVEMENT_VECTOR,
			vector: movementVector
		});
		this.isSteering = true;
	}

	getMovementVector(inputPos) {
		return p5.Vector.sub(inputPos, this.pos);  
	}

	isWithinJoystick(inputPos) {
		return p5.Vector.dist(inputPos, this.pos) < this.radius * this.thumbCenterDistanceLimit;
	}

	attach(observer) {
		this.observers.push(observer);
	}

	detach(observer) {
		let index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers.splice(index, 1);
		}
	}

	notify(message) {
		this.observers.forEach(function(observer) {
			observer.observerUpdate(message);
		});
	}
}