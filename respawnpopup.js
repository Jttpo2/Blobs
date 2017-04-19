class RespawnPopup {
	constructor() {
		this.desktopText = 'Hit space to respawn';
		this.touchText = 'Tap to respawn';
		this.otherMediumText = 'Do something to respawn';

		this.pos = createVector(
			width * (1/2),
			height * (3/7));
		this.textSize = height * (1/19);
		colorMode(HSB, 255, 255, 255);
		this.textColor = RespawnPopup.getColorWithRandomHue( 
			Constants.BLOB_SATURATION - 20, 
			Constants.BLOB_BRIGHTNESS -20);
		this.outlineColor = color(
			hue(this.textColor), 
			saturation(this.textColor) -20, 
			brightness(this.textColor) -150);
	}	

	run() {
		this.display();
	}

	display() {
		if (this.isShowing) {
			this.displayOnScreen();
		}
	}

	// Public
	show() {
		this.isShowing = true;
	}

	// Public
	hide() {
		this.isShowing = false;
	}

	// Private
	displayOnScreen() {
		textAlign(CENTER);
		textStyle(NORMAL);
		textFont();
		fill(
			RespawnPopup.getColorWithRandomHue(
				saturation(this.textColor), 
				brightness(this.textColor)));
		stroke(this.outlineColor);
		// noStroke();
		strokeWeight(2);
		textSize(this.textSize);

		let textToDisplay = '';
		if (this.isOnDesktop) {
			textToDisplay = this.desktopText;
		} else if (this.isOnMobile) {
			textToDisplay = this.touchText;
		} else {
			textToDisplay = this.otherMediumText;
		}
		text(textToDisplay, this.pos.x, this.pos.y);
	}

	isOnMobile() {
		// TODO: implement 
		return false;
	} 

	isOnDesktop() {
		// TODO: implement
		return true;
	}

	observerUpdate(message) {
		if (message.message == "Player Died") {
			this.show();
		} else if (message.message == "Player Respawned") {
			this.hide();
		}
	}

	static getColorWithRandomHue(saturation, brightness) {
		return color(
			random(255),
			saturation,
			brightness);
	}
}