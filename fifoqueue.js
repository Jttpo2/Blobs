class FIFOQueue {
	constructor() {
		this.elements = [];
	}

	peek() {
		return this.elements[this.elements.length - 1];
	}

	poll() {
		let element = this.peek();
		this.elements.splice(this.elements.length - 1, 1);

		return element;
	}

	add(element) {
		this.elements.push(element);
	}

	flush() {
		this.elements = [];
	}

	get size() {
		return this.elements.length;
	}

	isEmpty() {
		return this.size <= 0;
	}
}