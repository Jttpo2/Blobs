// "Abstract" steering module base class
class InputModule {
	constructor() {
		this.observers = [];
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

	up() {
		this.notify(InputEnum.UP);
	}

	down() {
		this.notify(InputEnum.DOWN);
	}

	left() {
		this.notify(InputEnum.LEFT);
	}

	right() {
		this.notify(InputEnum.RIGHT);
	}
}