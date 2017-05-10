// Represents the blob world
class Gameboard {
	constructor(p, boardWidth, boardHeight, backgroundColor, patternColor) {
		this.p = p; // p5.js instance

		this.width = boardWidth;
		this.height = boardHeight;

		// For rendering in screen space
		this.pos = p.createVector(0, 0);

		this.borderWidth = 0;

		this.backgroundColor = backgroundColor;
		this.patternColor = patternColor;
		this.patternThickness = 2;
		this.borderColorBrightnessOffset = 100;
		p.colorMode(p.HSB, 255, 255, 255);
		this.borderColor = p.color(
			p.hue(this.backgroundColor), 
			p.saturation(this.backgroundColor), 
			p.brightness(this.backgroundColor) - this.borderColorBrightnessOffset);
	}

	display() {
		let p = this.p;
		this.displayAt(p.createVector(0, 0));
	}

	displayAt(topLeftInScreenSpace) {
		this.fillSurroundings(topLeftInScreenSpace);
		this.drawBackground(topLeftInScreenSpace);
		this.drawPatternAt(topLeftInScreenSpace);
	}

	// The area outside the gameboard must be filled with visual content to not look a mess.
	fillSurroundings() {
		let p = this.p;
		p.fill(this.borderColor);
		p.noStroke();
		p.rect(
			this.pos.x - p.width, 
			this.pos.y - p.height, 
			this.width + p.width, 
			this.height + p.height);
	}

	drawBackground(topLeftInScreenSpace) {
		let p = this.p;
		p.fill(this.backgroundColor);
		p.stroke(this.borderColor);
		p.strokeWeight(this.borderWidth);

		p.rect(
			topLeftInScreenSpace.x, 
			topLeftInScreenSpace.y, 
			this.width, 
			this.height);
	}

	drawPatternAt(topLeftInScreenSpace) {
		// this.drawGrid(topLeftInScreenSpace);
		this.drawDots(topLeftInScreenSpace);
	}

	drawGrid(topLeftInScreenSpace) {
		let p = this.p;
		for (let x=Constants.GAMEBOARD_PATTERN_SIZE/2; x<this.width; x+=Constants.GAMEBOARD_PATTERN_SIZE) {
			p.stroke(this.patternColor);
			p.strokeWeight(this.patternThickness);
			p.line(topLeftInScreenSpace.x + x, topLeftInScreenSpace.y, topLeftInScreenSpace.x + x, this.height);
		}

		for (let y=Constants.GAMEBOARD_PATTERN_SIZE/2; y<this.width; y+=Constants.GAMEBOARD_PATTERN_SIZE) {
			p.stroke(this.patternColor);
			p.strokeWeight(this.patternThickness);
			p.line(topLeftInScreenSpace.x, topLeftInScreenSpace.y + y, this.width, topLeftInScreenSpace.y + y);
		}
	}

	drawDots(topLeftInScreenSpace) {
		let p = this.p;
		for (let x=Constants.GAMEBOARD_PATTERN_SIZE/2; x<this.width; x+=Constants.GAMEBOARD_PATTERN_SIZE) {
			for (let y=Constants.GAMEBOARD_PATTERN_SIZE/2; y<this.width; y+=Constants.GAMEBOARD_PATTERN_SIZE) {
				p.stroke(this.patternColor);
				p.strokeWeight(this.patternThickness);
				p.point(topLeftInScreenSpace.x + x, topLeftInScreenSpace.y + y);
			}
		}
	}
}