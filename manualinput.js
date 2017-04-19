class ManualInput extends InputModule {
	constructor(joystick) {
		super();
		joystick.attach(this);
		this.joystick = joystick;

		this.mouseIsPressedPrev = false;
		this.keyIsPressedPrev = null;
	}

	update() {
		let mousePos = createVector(mouseX, mouseY);
		if (mouseIsPressed) {
			this.joystick.feedInput(mousePos);
		} else if (this.mouseIsPressedPrev) {
			// Input stopped since last frame
			this.joystick.finishInput();
		}

		this.mouseIsPressedPrev = mouseIsPressed;

		// Might work for touch input?
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


		// Legacy keyboard input
		if (keyIsPressed) {
			if (keyCode == UP_ARROW) {
				this.move(InputModule.VECTOR_UP);
				// this.joystick.feedInput(p5.Vector.add(this.joystick.pos, p5.Vector.mult(InputModule.VECTOR_UP, this.joystick.radius) ));
			} else if (keyCode == DOWN_ARROW) {
				this.move(InputModule.VECTOR_DOWN);
			} else if (keyCode == LEFT_ARROW) {
				this.move(InputModule.VECTOR_LEFT);
			} else if (keyCode == RIGHT_ARROW) {
				this.move(InputModule.VECTOR_RIGHT);
			} else {
				console.log("No function for key: " + keyCode);
			}
		} else if (this.keyIsPressedPrev) {
			this.joystick.finishInput();
		}
	}	

	observerUpdate(message) {
		if (message.message == InputEnum.MOVEMENT_VECTOR) {
			this.move(message.vector);
		}
	}
}