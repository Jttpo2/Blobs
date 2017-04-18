class ManualInput extends InputModule {
	constructor() {
		super();
	}

	update() {
		if (keyIsPressed) {
			if (keyCode == UP_ARROW) {
				this.move(InputModule.VECTOR_UP);
			} else if (keyCode == DOWN_ARROW) {
				this.move(InputModule.VECTOR_DOWN);
			} else if (keyCode == LEFT_ARROW) {
				this.move(InputModule.VECTOR_LEFT);
			} else if (keyCode == RIGHT_ARROW) {
				this.move(InputModule.VECTOR_RIGHT);
			} else {
				console.log("No function for key: " + keyCode);
			}
		}
	}	
}