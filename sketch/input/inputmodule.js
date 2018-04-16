// "Abstract" steering module base class
class InputModule {
	constructor(p) {
		this.p = p; // p5.js instance
		this.observers = [];
	}

	static get VECTOR_UP() {
		return this.p.createVector(0, -1);
	}

	static get VECTOR_DOWN() {
		return this.p.createVector(0, 1);
	}

	static get VECTOR_LEFT() {
		return this.p.createVector(-1, 0);
	}

	static get VECTOR_RIGHT() {
		return this.p.createVector(1, 0);
	}

	static get VECTOR_ZERO() {
		return this.p.createVector(0, 0);
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
			if(observer.observerUpdate) {
				observer.observerUpdate(message);
			} else {
				console.log(
					"Observer " + observer.constructor.name + " does not have observerUpdate(message) function");
			}
		});
	}

	notifyMovement(vector) {
		this.notify({
			message: InputEnum.MOVEMENT_VECTOR,
			vector: vector
		});
	}

	notifyInputAt(pos) {
		this.notify({
			message: InputEnum.INPUT_AT_POSITION,
			vector: pos
		});
	}
}
