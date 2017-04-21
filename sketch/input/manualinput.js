class ManualInput extends InputModule {
	constructor(joystick) {
		super();
		joystick.attach(this);
		this.joystick = joystick;

		this.mouseIsPressedPrev = false;
		this.keyIsPressedPrev = null;
		this.prevKey = null;

		this.killKey = 'k';

		this.mousePos = null;

		this.touchInputVector = createVector(0, 0);
	}

	update() {
		if (!isTouchDevice) {
			this.handleMouseInput();
			this.handleKeyboardInput();
		} else {
			this.handleTouchInput();		
		}
	}	

	handleMouseInput() {
		this.mousePos = createVector(mouseX, mouseY);
		if (mouseIsPressed) {
			// Input started this update or continues from previous one
			this.joystick.feedInput(this.mousePos);
		} else if (this.mouseIsPressedPrev) {
			// Input stopped since last update
			this.joystick.finishInput();
		}

		this.mouseIsPressedPrev = mouseIsPressed;
	}

	handleTouchInput() {
		if (touches.length > 0) {
			// Input started this update or continues from previous one
			// TODO: Only concentrates on first touch for now
			let touch = touches[0];
			this.touchInputVector = createVector(touch.x, touch.y);
			this.joystick.feedInput(this.touchInputVector);
		} else { 
			this.joystick.finishInput();
		}
	}

	handleKeyboardInput() {
		if (keyIsPressed) {
			if (key != this.prevKey) {
				// Respawn on any key
				this.notifySpawnPlayer();
			}

			if (this.prevKey == this.spawnKey && key == this.spawnkey) {
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
			message: "Spawn Player"
		});
	}
}