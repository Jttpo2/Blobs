// blobs.js

let sketch = p => {
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
	let colors;

	// Start with the assumption that we are on desktop.
	// Attach to p5.js object for passing to manual input module.
	p.isTouchDevice = false;

	let respawnPopup;

	// Makes sure resources are loaded before initiatin sketch
	p.preload = () => {

	};

	p.setup = () => {
		let canvas = p.createCanvas(
			window.innerWidth * canvasToWindowWidthRatio,
			window.innerHeight * canvasToWindowHeightRatio
		);

		// frameRate(1);

		colors = {
			background: p.color(50),
			pattern: p.color(100)
		}
		gameboard = new Gameboard(
			p,
			Constants.GAME_SIZE,
			Constants.GAME_SIZE,
			colors.background,
			colors.pattern);
		blobManager = new BlobManager(
			p,
			gameboard);
		let playerStartPos = p.createVector(
			gameboard.width/2,
			gameboard.height/2);
		player = new Player(
			playerStartPos,
			blobManager);
		followCam = new FollowCam(
			p,
			gameboard,
			blobManager.allBlobs);
		manualInput = new ManualInput(p);
		followCam.follow(player);
		brain = new Brain(p,
			followCam,
			manualInput,
			player);

		respawnPopup = new RespawnPopup(p);
		player.attach(respawnPopup);
	};

	p.draw = () => {
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

	p.windowResized = () => {
		p.resizeCanvas(
			window.innerWidth * canvasToWindowWidthRatio,
			window.innerHeight * canvasToWindowHeightRatio);
		p.onResize();
	};

	p.onResize = () => {
		respawnPopup.reposition();
	};

	// Hack to check whether we're on a touch device.
	// Must be called every frame
	p.detectIfTouchDevice = () => {
		if (p.touches.length > 0) {
			p.isTouchDevice = true;
		}
	};
};

let myP5 = new p5(sketch);
