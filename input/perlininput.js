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
		let noiseValue = noise(this.xOff) * TWO_PI * 2;
		let randUnitVector = p5.Vector.fromAngle(noiseValue);
		// Since noise() produces a value between 0 and 1 
		// we can use it to scale the vector between 0 and 
		// (the same span as the manual joystick puts out)
		randUnitVector.mult(noise(this.xOff + random(1000, 200000)));
		
		this.notifyMovement(randUnitVector);
	}

	perlinSetup() {
		// Each instance should give off it's own random input
		this.xOff = random(0, 200000);
		this.xIncrement = 0.002;

		noiseDetail(4, 0.5);
	}
}