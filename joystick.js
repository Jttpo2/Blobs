class Joystick {
	constructor() {
		colorMode(HSB, 255, 255, 255);
		this.color = color(134, 200, 100);
		this.thumbColor = color(134, 200, 20);
		
		this.decidingDimension = min(width, height);

		this.radius = this.decidingDimension/8;
		this.thumbSize = this.radius/1.2;
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
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);

		// Thumb
		fill(this.thumbColor);
		ellipse(this.thumbPos.x, this.thumbPos.y, this.thumbSize);
	}

	// startInput(pos) {
	// 	if (!this.isSteering && this.isWithinJoystick(pos)) {
	// 		this.isSteering = true;
	// 		this.feedInput(pos);
	// 	}
	// }

	// continueInput(pos) {
	// 	if (this.isSteering) {
	// 		this.feedInput(pos);

	// 	}
	// }


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