class Gameboard {
	constructor(boardWidth, boardHeight, backgroundColor) {
		this.width = boardWidth;
		this.height = boardHeight;

		// For rendering in screen space
		this.pos = createVector(0, 0);

		this.borderWidth = 10;

		this.backgroundColor = backgroundColor;
		colorMode(HSB, 255, 255, 255);
		this.borderColor = color(
			hue(this.backgroundColor), 
			saturation(this.backgroundColor), 
			brightness(this.backgroundColor) - 100);
	}

	display() {
		this.displayAt(createVector(0, 0));
	}

	displayAt(topLeftInScreenSpace) {
		this.fillSurroundings(topLeftInScreenSpace);

		fill(this.backgroundColor);
		stroke(this.borderColor);
		strokeWeight(this.borderWidth);
		rect(
			topLeftInScreenSpace.x, 
			topLeftInScreenSpace.y, 
			this.width, 
			this.height);
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
}