class Joystick {
	constructor() {
		colorMode(HSB, 255, 255, 255);
		this.color = color(134, 200, 100);
		this.radius = 50;
		this.thumbSize = 5;

		this.pos = createVector(
			width * (2/8),
			height * (6/8)
			);

		this.observers = [];
	}

	run() {
		this.update();
		this.display();
	}

	update() {

	}

	display() {
		ellipse(this.pos.x, this.pos.y, this.radius * 2);
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