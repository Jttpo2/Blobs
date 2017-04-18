class ManualInput extends InputModule {
	constructor(joystick) {
		super();
		this.joystick = joystick;
		joystick.attach(this);

		this.mouseIsPressedPrev = false;
		// this.previousTouchLength = 0;
	}

	update() {
		let mousePos = createVector(mouseX, mouseY);
		if (mouseIsPressed) {
			this.joystick.feedInput(mousePos);
			// if (!this.mouseIsPressedPrev) {
			// Input started this update
			// this.joystick.startInput(mousePos);
			// } else {
			// Input continues from previous update
			// this.joystick.continueInput(mousePos);

		} else if (this.mouseIsPressedPrev) {
			// Input stopped since last frame
			this.joystick.finishInput();
		}

		this.mouseIsPressedPrev = mouseIsPressed;

		// Will work for touch input?
		// if (touches.length > 0) {
		// 	if (this.previousTouchLength <= 0) {
		// 		// Input started this update
		// 		this.joystick.startInput(mousePos);
		// 	} else {
		// 		// Input continues from previous update
		// 		this.joystick.continueInput(mousePos);
		// 	}
		// } else if (this.previousTouchLength > 0) {
		// 	// Input stopped since last frame
		// 	this.joystick.finishInput();
		// }

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

	observerUpdate(message) {
		if (message.message == InputEnum.MOVEMENT_VECTOR) {
			this.move(message.vector);
		}
	}
}