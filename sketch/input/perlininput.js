class PerlinInput extends InputModule {
	constructor(p) {
		super(p);

		this.xOff = 0;
		this.magOff = 0;
		this.perlinSetup();

		this.cycleTime = 0.05*1000;
		this.startTimer();
	}

	update() {
		this.checkTimer();
		
		// Perlin noise
		this.xOff += this.xIncrement;
		this.magOff += this.maxIncrement;
	}

	startTimer() {
		this.fireTime = Date.now() + this.cycleTime;
	}

	checkTimer() {
		if (Date.now() > this.fireTime) {
			this.timerFinished();
		}
	}

	timerFinished() {
		this.createRandomInput();
		this.startTimer();
	}

	createRandomInput() {
		let p=this.p;
		let noiseValue = p.noise(this.xOff) * p.TWO_PI * 2;
		let randUnitVector = p5.Vector.fromAngle(noiseValue);
		// Since noise() produces a value between 0 and 1 
		// we can use it to scale the vector between 0 and 
		// (the same span as the manual joystick puts out)
		randUnitVector.mult(p.noise(this.magOff));
		
		this.notifyMovement(randUnitVector);
	}

	perlinSetup() {
		let p=this.p;
		// Each instance should give off it's own random input
		this.xOff = Math.random() * 200000;
		this.xIncrement = 0.002;
		this.magOff = Math.random() * 200000 + 1000;
		this.maxIncrement = 0.001;

		p.noiseDetail(4, 0.5);
	}
}