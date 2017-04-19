class ManualInput extends InputModule {
	constructor(joystick) {
		super();
		joystick.attach(this);
		this.joystick = joystick;

		this.mouseIsPressedPrev = false;
		this.keyIsPressedPrev = null;
		this.prevKey = null;

		this.spawnKey = ' ';
		this.killKey = 'k';
	}

	update() {
		this.handelMouseInput();
		this.handleKeyboardInput();
		this.handleTouchInput();
	}	

	handelMouseInput() {
		let mousePos = createVector(mouseX, mouseY);
		if (mouseIsPressed) {
			this.joystick.feedInput(mousePos);
		} else if (this.mouseIsPressedPrev) {
			// Input stopped since last frame
			this.joystick.finishInput();
		}

		this.mouseIsPressedPrev = mouseIsPressed;
	}

	handleTouchInput() {
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
	}

	handleKeyboardInput() {
		
		if (keyIsPressed) {
			if (key == this.spawnKey && this.prevKey != this.spawnKey) {
				this.notifySpawnPlayer();
			} else if (this.prevKey == this.spawnKey && key == this.spawnkey) {
				// Do nothing on prolonged presses on same key.
				// TODO: Doesn't work
			} else if (key == this.killKey && this.prevKey != this.killKey) {
				this.notify({
					message: "Kill Player"
				});
			} 

			// Legacy keyboard input
			else if (keyCode == UP_ARROW) {
				this.notifyMovement(InputModule.VECTOR_UP);
			} else if (keyCode == DOWN_ARROW) {
				this.notifyMovement(InputModule.VECTOR_DOWN);
			} else if (keyCode == LEFT_ARROW) {
				this.notifyMovement(InputModule.VECTOR_LEFT);
			} else if (keyCode == RIGHT_ARROW) {
				this.notifyMovement(InputModule.VECTOR_RIGHT);
			} else {
				console.log("No function for key: " + keyCode);
			}

			// To prevent long unwanted long presses.
			this.prevKey = key;

		} else  {
			this.prevKey = null;
		}
	}

	observerUpdate(message) {
		if (message.message == InputEnum.MOVEMENT_VECTOR) {
			this.notifyMovement(message.vector);
		}
	}

	notifySpawnPlayer() {
		this.notify({
			message: "SpawnPlayer"
		});
	}
}