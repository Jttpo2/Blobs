// "Abstract" steering module base class
class InputModule {
	constructor() {
		this.observers = [];
	}

	static get VECTOR_UP() {
		return createVector(0, -1);
	}

	static get VECTOR_DOWN() {
		return createVector(0, 1);
	}

	static get VECTOR_LEFT() {
		return createVector(-1, 0);
	}

	static get VECTOR_RIGHT() {
		return createVector(1, 0);
	}

	static get VECTOR_ZERO() {
		return createVector(0, 0);
	}

	update() {

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

	move(vector) {
		this.notify(
		{
			message: InputEnum.MOVEMENT_VECTOR, 
			vector: vector
		}
		);
	}
}