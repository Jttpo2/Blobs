class Gameboard {
	constructor(boardWidth, boardHeight, backgroundColor, patternColor) {
		this.width = boardWidth;
		this.height = boardHeight;

		// For rendering in screen space
		this.pos = createVector(0, 0);

		this.borderWidth = 0;

		this.backgroundColor = backgroundColor;
		this.patternColor = patternColor;
		this.patternThickness = 2;
		this.borderColorBrightnessOffset = 100;
		colorMode(HSB, 255, 255, 255);
		this.borderColor = color(
			hue(this.backgroundColor), 
			saturation(this.backgroundColor), 
			brightness(this.backgroundColor) - this.borderColorBrightnessOffset);
	}

	display() {
		this.displayAt(createVector(0, 0));
	}

	displayAt(topLeftInScreenSpace) {
		this.fillSurroundings(topLeftInScreenSpace);
		this.drawBackground(topLeftInScreenSpace);
		this.drawPatternAt(topLeftInScreenSpace);
	}

	// The area outside the gameboard must be filled with visual content to not look a mess.
	fillSurroundings() {
		fill(this.borderColor);
		noStroke();
		rect(
			this.pos.x - width, 
			this.pos.y - height, 
			this.width + width, 
			this.height + height);
	}

	drawBackground(topLeftInScreenSpace) {
		fill(this.backgroundColor);
		stroke(this.borderColor);
		strokeWeight(this.borderWidth);

		rect(
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
		for (let x=Constants.GAMEBOARD_PATTERN_SIZE/2; x<this.width; x+=Constants.GAMEBOARD_PATTERN_SIZE) {
			stroke(this.patternColor);
			strokeWeight(this.patternThickness);
			line(topLeftInScreenSpace.x + x, topLeftInScreenSpace.y, topLeftInScreenSpace.x + x, this.height);
		}

		for (let y=Constants.GAMEBOARD_PATTERN_SIZE/2; y<this.width; y+=Constants.GAMEBOARD_PATTERN_SIZE) {
			stroke(this.patternColor);
			strokeWeight(this.patternThickness);
			line(topLeftInScreenSpace.x, topLeftInScreenSpace.y + y, this.width, topLeftInScreenSpace.y + y);
		}
	}

	drawDots(topLeftInScreenSpace) {
		for (let x=Constants.GAMEBOARD_PATTERN_SIZE/2; x<this.width; x+=Constants.GAMEBOARD_PATTERN_SIZE) {
			for (let y=Constants.GAMEBOARD_PATTERN_SIZE/2; y<this.width; y+=Constants.GAMEBOARD_PATTERN_SIZE) {
				stroke(this.patternColor);
				strokeWeight(this.patternThickness);
				point(topLeftInScreenSpace.x + x, topLeftInScreenSpace.y + y);
			}
		}

	}
}