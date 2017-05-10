class ManualInput extends InputModule {
	constructor(p, joystick) {
		super(p);
		joystick.attach(this);
		this.joystick = joystick;

		this.mouseIsPressedPrev = false;
		this.keyIsPressedPrev = null;
		this.prevKey = null;

		this.killKey = 'k';

		this.mousePos = null;

		this.touchInputVector = p.createVector(0, 0);
		this.prevTouchesLength = 0;
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
		let p = this.p;
		this.mousePos = p.createVector(p.mouseX, p.mouseY);
		if (p.mouseIsPressed) {
			// Input started this update or continues from previous one
			this.joystick.feedInput(this.mousePos);
			
			if (!this.mouseIsPressedPrev) {
				// New input
				this.notifySpawnPlayer();
			}
		} else if (this.mouseIsPressedPrev) {
			// Input stopped since last update
			this.joystick.finishInput();
		}

		this.mouseIsPressedPrev = p.mouseIsPressed;
	}

	handleTouchInput() {
		let p=this.p;
		if (p.touches.length > 0) {
			// Input started this update or continues from previous one
			// TODO: Only concentrates on first touch for now
			let touch = p.touches[0];
			this.touchInputVector = p.createVector(touch.x, touch.y);
			this.joystick.feedInput(this.touchInputVector);

			if (this.prevTouchesLength === 0) {
				// New touch input initiated
				this.notifySpawnPlayer();
			}
		} else { 
			this.joystick.finishInput();
		}

		this.prevTouchesLength = p.touches.length;
	}

	handleKeyboardInput() {
		let p=this.p;
		let key = p.key;
		if (p.keyIsPressed) {
			if (key != this.prevKey) {
				// Respawn on any key
				this.notifySpawnPlayer();
			}
			
			let keyCode = p.keyCode;

			if (this.prevKey === this.spawnKey && key === this.spawnkey) {
				// Do nothing on prolonged presses on same key.
				// TODO: Doesn't work
			} else if (key === this.killKey && this.prevKey != this.killKey) {
				this.notify({
					message: "Kill Player"
				});
			} 

			// Legacy keyboard input
			else if (keyCode === p.UP_ARROW) {
				this.notifyMovement(InputModule.VECTOR_UP);
			} else if (keyCode === p.DOWN_ARROW) {
				this.notifyMovement(InputModule.VECTOR_DOWN);
			} else if (keyCode === p.LEFT_ARROW) {
				this.notifyMovement(InputModule.VECTOR_LEFT);
			} else if (keyCode === p.RIGHT_ARROW) {
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
		if (message.message === InputEnum.MOVEMENT_VECTOR) {
			this.notifyMovement(message.vector);
		}
	}

	notifySpawnPlayer() {
		this.notify({
			message: "Spawn Player"
		});
	}
}