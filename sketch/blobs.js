// blobs.js

let sketch = function (p) {
	let canvasToWindowWidthRatio = 1; //= 5/7;
	let canvasToWindowHeightRatio = 1; //= 5/7;

	let desiredFramerate = 60;
	let pausedFramerate = 1;

	let blobManager;
	let manualInput;
	let player;
	let followCam;
	let brain;
	let gameboard;
	let gamesize = Constants.GAME_SIZE;
	let backgroundColor;
	let patternColor;

	// Start with the assumption that we are on desktop.
	// Attach to processing object for passing to manual input module.
	p.isTouchDevice = false;

	let respawnPopup;

	// Makes sure resources are loaded before initiatin sketch
	p.preload = function() {

	};

	p.setup = function() {
		let canvas = p.createCanvas(
			window.innerWidth * canvasToWindowWidthRatio,
			window.innerHeight * canvasToWindowHeightRatio
		);

		// frameRate(1);

		backgroundColor = p.color(50);
		patternColor = p.color(100);
		gameboard = new Gameboard(p, gamesize, gamesize, backgroundColor, patternColor);
		blobManager = new BlobManager(p, gameboard);
		let playerStartPos = p.createVector(gameboard.width/2, gameboard.height/2);
		player = new Player(playerStartPos, blobManager);

		followCam = new FollowCam(p, gameboard, blobManager.allBlobs);
		manualInput = new ManualInput(p);
		followCam.follow(player);
		brain = new Brain(p, followCam, manualInput, player);

		respawnPopup = new RespawnPopup(p);
		player.attach(respawnPopup);
	};

	p.draw = function() {
		if (p.focused) {
			p.frameRate(desiredFramerate);
		} else {
			p.frameRate(pausedFramerate);
		}

		p.detectIfTouchDevice();

		manualInput.update();
		player.update();
		blobManager.update();
		followCam.update();
		respawnPopup.run();
	};

	p.windowResized = function() {
		p.resizeCanvas(
			window.innerWidth * canvasToWindowWidthRatio,
			window.innerHeight * canvasToWindowHeightRatio);
		p.onResize();
	};

	p.onResize = function() {
		respawnPopup.reposition();
	};

	// Hack to check whether we're on a touch device.
	// Must be called every frame
	p.detectIfTouchDevice = function() {
		if (p.touches.length > 0) {
			p.isTouchDevice = true;
		}
	};
};

let myP5 = new p5(sketch);
