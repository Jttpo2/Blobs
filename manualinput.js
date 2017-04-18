class ManualInput extends InputModule {
	constructor() {
		super();
	}

	update() {
		if (keyIsPressed) {
			if (keyCode == UP_ARROW) {
				this.up();
			} else if (keyCode == DOWN_ARROW) {
				this.down();
			} else if (keyCode == LEFT_ARROW) {
				this.left();
			} else if (keyCode == RIGHT_ARROW) {
				this.right();
			}
		}
	}
	
}


// function keyPressed() {
// 	console.log("key pressed");
// 	if (keyCode === UP_ARROW) {
// 		console.log("up received from p5");
// 		ManualInput.up();
// 	} else if (keyCode === DOWN_ARROW) {
// 		ManualInput.down();
// 	} else if (keyCode === LEFT_ARROW) {
// 		ManualInput.left();
// 	} else if (keyCode === RIGHT_ARROW) {
// 		ManualInput.right();
// 	}
// }