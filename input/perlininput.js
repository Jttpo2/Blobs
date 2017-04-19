class PerlinInput extends InputModule {
	constructor() {
		super();

		this.perlinSetup();

		this.cycleTime = 0.05*1000;
		this.startTimer();
	}

	update() {
		this.checkTimer();
		// Perlin noise
		this.xOff += this.xIncrement;
	}

	startTimer() {
		this.fireTime = millis() + this.cycleTime;
	}

	checkTimer() {
		if (millis() > this.fireTime) {
			this.timerFinished();
		}
	}

	timerFinished() {
		this.createRandomInput();
		this.startTimer();
	}

	createRandomInput() {
		let rand = noise(this.xOff) * TWO_PI * 2;
		rand %= TWO_PI;
		rand = floor(rand / HALF_PI);
		switch(rand) {
			case 0: this.notifyMovement(InputModule.VECTOR_UP);
			break;
			case 1:  this.notifyMovement(InputModule.VECTOR_DOWN);
			break;
			case 2:  this.notifyMovement(InputModule.VECTOR_LEFT);
			break;
			case 3:  this.notifyMovement(InputModule.VECTOR_RIGHT);
			break;
			default: console.log("PerlinInput random number unassigned");
		}	
	}

	perlinSetup() {
		// Each instance should give off it's own random input
		this.xOff = random(0, 100000);
		this.xIncrement = 0.002;

		noiseDetail(4, 0.5);
	}
}