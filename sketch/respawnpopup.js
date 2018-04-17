class RespawnPopup {
	constructor(p) {
		this.p = p; // p5.js instance

		this.desktopText = 'Hit any key to respawn';
		this.touchText = 'Tap to respawn';
		this.otherMediumText = 'Do something to respawn';

		this.pos = null;
		this.reposition();
		this.textSize = p.height * (1/19);
		p.colorMode(p.HSB, 255, 255, 255);
		this.textColor = RespawnPopup.getColorWithRandomHue(
			p,
			Constants.BLOB_SATURATION - 20,
			Constants.BLOB_BRIGHTNESS -110);
		this.outlineColor = p.color(
			p.hue(this.textColor),
			p.saturation(this.textColor) -20,
			p.brightness(this.textColor) -150);
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
		let p=this.p;
		p.textAlign(p.CENTER);
		p.textStyle(p.NORMAL);
		p.textFont();
		p.fill(
			RespawnPopup.getColorWithRandomHue(
				p,
				p.saturation(this.textColor),
				p.brightness(this.textColor)));
		p.stroke(this.outlineColor);
		// p.noStroke();
		p.strokeWeight(2);
		p.textSize(this.textSize);

		let textToDisplay = '';
		if (this.isOnDesktop()) {
			textToDisplay = this.desktopText;
		} else if (this.isOnMobile()) {
			textToDisplay = this.touchText;
		} else {
			textToDisplay = this.otherMediumText;
		}
		p.text(textToDisplay, this.pos.x, this.pos.y);
	}

	isOnMobile() {
		return isTouchDevice;
	}

	isOnDesktop() {
		return !this.p.isTouchDevice;
	}

	observerUpdate(message) {
		if (message.message == "Player Died") {
			this.show();
		} else if (message.message == "Player Respawned") {
			this.hide();
		}
	}

	static getColorWithRandomHue(p, saturation, brightness) {
		return p.color(
			Math.random() * 255,
			saturation,
			brightness);
	}

	reposition() {
		let p=this.p;
		this.pos = p.createVector(
			p.width * (1/2),
			p.height * (3/7));
	}
}
