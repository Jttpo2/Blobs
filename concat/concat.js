class Constants {
	static get GAME_SIZE() {
		return 2000;
	}

	static get INITIAL_BLOB_AMOUNT() {
		return Constants.GAME_SIZE * 0.025;
	}	

	static get BLOB_SATURATION() {
		return 120;
	}

	static get BLOB_BRIGHTNESS() {
		return 230;
	}
	
	static get PLAYER_BLOB_COLOR() {
		return color(1, 255, 170);
	}	
}
class FIFOQueue {
	constructor() {
		this.elements = [];
	}

	peek() {
		return this.elements[this.elements.length - 1];
	}

	poll() {
		let element = this.peek();
		this.elements.splice(this.elements.length - 1, 1);

		return element;
	}

	add(element) {
		this.elements.push(element);
	}

	flush() {
		this.elements = [];
	}

	get size() {
		return this.elements.length;
	}

	isEmpty() {
		return this.size <= 0;
	}
}
let InputEnum = {
	// UP: "Up",
	// DOWN: "Down",
	// LEFT: "Left",
	// RIGHT: "Right",
	MOVEMENT_VECTOR: "Movement Vector"
};

Object.freeze(InputEnum);
Object.seal(InputEnum);
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
class RespawnPopup {
	constructor() {
		this.desktopText = 'Hit space to respawn';
		this.touchText = 'Tap to respawn';
		this.otherMediumText = 'Do something to respawn';

		this.pos = null;
		this.reposition();
		this.textSize = height * (1/19);
		colorMode(HSB, 255, 255, 255);
		this.textColor = RespawnPopup.getColorWithRandomHue( 
			Constants.BLOB_SATURATION - 20, 
			Constants.BLOB_BRIGHTNESS -110);
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

	reposition() {
		this.pos = createVector(
			width * (1/2),
			height * (3/7));
	}
}
class FollowCam {
	constructor(gameBoard, allBlobs) {
		this.gameBoard = gameBoard;

		this.allBlobs = allBlobs;
		this.followee = null;
		this.viewZeroInGameSpace = null;
		this.gameZeroInScreenSpace = null;

		this.lookingAtGameSpacePos = null;
		this.movementDamping = 0.01;
		this.lastFrameTime = millis();
	}

	follow(entity) {
		this.followee = entity;
		this.lookingAtGameSpacePos = entity.pos;
	}

	update() {
		if (this.followee) {
			this.smoothFollow(this.followee);
			this.viewZeroInGameSpace = this.getViewZeroInGameSpace(this.lookingAtGameSpacePos);
			this.gameZeroInScreenSpace = this.convertToScreenSpace(this.viewZeroInGameSpace);
		}

		this.renderObjectsInView();

		this.lastFrameTime = millis();
	}

	getViewZeroInGameSpace(lookingAtPos) {
		return createVector(
			lookingAtPos.x - width/2,
			lookingAtPos.y - height/2);
	}

	renderObjectsInView() {
		this.render(this.gameBoard);

		let thisHandle = this;
		let allBlobs = this.allBlobs;
		allBlobs.forEach(function(rendObj) {
			thisHandle.render(rendObj);
		});
	}

	render(object) {
		let screenSpaceCoord = this.convertToScreenSpace(object.pos);
		object.displayAt(screenSpaceCoord);
	}

	convertToScreenSpace(gameSpaceCoord) {
		return p5.Vector.sub(gameSpaceCoord, this.viewZeroInGameSpace);
	}

	convertToGameSpace(screenSpaceCoord) {
		return p5.Vector.add(screenSpaceCoord, this.viewZeroInGameSpace);
	}

	smoothFollow(entity) {
		if (!entity.pos) {
			console.log("FollowCam: Entity has no position to smoothfollow");
			return;
		}
		let desiredPos = entity.pos;
		let currentPos = this.lookingAtGameSpacePos;	
		let nextPos = p5.Vector.lerp(
			currentPos, desiredPos, 
			this.getSecondsSinceLastFrame() * 
			this.movementDamping * 
			desiredPos.dist(currentPos));
		this.lookingAtGameSpacePos = nextPos;
	}

	getSecondsSinceLastFrame() {
		return (millis() - this.lastFrameTime) / 1000;
	}
}
class Joystick {
	constructor() {
		colorMode(HSB, 255, 255, 255);
		this.color = color(134, 200, 100);
		this.borderColor =
		color(
			hue(this.color), 
			saturation(this.color), 
			brightness(this.color) + 25);
		this.thumbColor = color(
			hue(this.color), 
			saturation(this.color), 
			brightness(this.color) - 40);
		this.innerThumbColor  = color(
			hue(this.color), 
			saturation(this.color), 
			brightness(this.color) + 80);
		
		this.decidingDimension = min(width, height);

		this.radius = this.decidingDimension/8;
		this.borderWidth = this.radius * (1/5);

		this.thumbSize = this.radius/1.2;
		this.innerThumbSize = this.thumbSize * (3/4);
		this.edgeMargin = this.radius * (7/5);
		this.pos = createVector(
			this.edgeMargin,
			height -this.edgeMargin
			);

		this.thumbPos = this.pos;
		// Prevent thumb from going all the way to joystick edge
		this.thumbCenterDistanceLimit = 9/10;

		// Scale down the movement vector generated from thumb distance to center
		this.movementScalar = 0.03;

		this.observers = [];

		this.isSteering = false;
		this.wasSteering = false;
	}

	run() {
		this.update();
		this.display();
	}

	update() {

	}

	display() {
		stroke(this.borderColor);
		strokeWeight(this.borderWidth);
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.radius * 2);

		noStroke();
		// Thumb
		fill(this.thumbColor);
		ellipse(this.thumbPos.x, this.thumbPos.y, this.thumbSize);

		// Inner thumb
		fill(this.innerThumbColor);
		ellipse(this.thumbPos.x, this.thumbPos.y, this.innerThumbSize);
	}

	feedInput(pos) {
		if (!this.isSteering && this.isWithinJoystick(pos)) {
			this.steerTowards(pos);
		} else if (this.isSteering) {
			this.steerTowards(pos);
		}
	}

	finishInput() {
		this.isSteering = false;
		this.thumbPos = this.pos;
	}

	steerTowards(pos) {
		let movementVector = this.getMovementVector(pos);
		movementVector.limit(this.radius * this.thumbCenterDistanceLimit);
		this.thumbPos = p5.Vector.add(movementVector, this.pos);
		
		// Scale down this strong vector
		movementVector.mult(this.movementScalar);

		this.notify({
			message: InputEnum.MOVEMENT_VECTOR,
			vector: movementVector
		});
		this.isSteering = true;
	}

	getMovementVector(inputPos) {
		return p5.Vector.sub(inputPos, this.pos);  
	}

	isWithinJoystick(inputPos) {
		return p5.Vector.dist(inputPos, this.pos) < this.radius * this.thumbCenterDistanceLimit;
	}

	attach(observer) {
		this.observers.push(observer);
	}

	detach(observer) {
		let index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers.splice(index, 1);
		}
	}

	notify(message) {
		this.observers.forEach(function(observer) {
			observer.observerUpdate(message);
		});
	}
}
// "Abstract" steering module base class
class InputModule {
	constructor() {
		this.observers = [];
	}

	static get VECTOR_UP() {
		return createVector(0, -1);
	}

	static get VECTOR_DOWN() {
		return createVector(0, 1);
	}

	static get VECTOR_LEFT() {
		return createVector(-1, 0);
	}

	static get VECTOR_RIGHT() {
		return createVector(1, 0);
	}

	static get VECTOR_ZERO() {
		return createVector(0, 0);
	}

	update() {

	}

	attach(observer) {
		this.observers.push(observer);
	}

	detach(observer) {
		let index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers.splice(index, 1);
		}
	}

	notify(message) {
		this.observers.forEach(function(observer) {
			if(observer.observerUpdate) {
				observer.observerUpdate(message);
			} else {
				console.log(
					"Observer " + observer.constructor.name + " does not have observerUpdate(message) function");
			}
		});
	}

	notifyMovement(vector) {
		this.notify(
		{
			message: InputEnum.MOVEMENT_VECTOR, 
			vector: vector
		}
		);
	}
}
class ManualInput extends InputModule {
	constructor(joystick) {
		super();
		joystick.attach(this);
		this.joystick = joystick;

		this.mouseIsPressedPrev = false;
		this.keyIsPressedPrev = null;
		this.prevKey = null;

		this.spawnKey = ' ';
		this.killKey = 'k';

		this.mousePos = null;

		this.touchInputVector = createVector(0, 0);
	}

	update() {
		this.handleMouseInput();
		this.handleKeyboardInput();
		this.handleTouchInput();
	}	

	handleMouseInput() {
		this.mousePos = createVector(mouseX, mouseY);
		if (mouseIsPressed) {
			// Input started this update or continues from previous one
			this.joystick.feedInput(this.mousePos);
		} else if (this.mouseIsPressedPrev) {
			// Input stopped since last update
			this.joystick.finishInput();
		}

		this.mouseIsPressedPrev = mouseIsPressed;
	}

	handleTouchInput() {
		if (touches.length > 0) {
			// Input started this update or continues from previous one
			// TODO: Only concentrate on first touch for now
			let touch = touches[0];
			this.touchInputVector = createVector(touch.x, touch.y);
			this.joystick.feedInput(this.touchInputVector);
		} else { 
			this.joystick.finishInput();
		}
	}

	handleKeyboardInput() {
		
		if (keyIsPressed) {
			if (key == this.spawnKey && this.prevKey != this.spawnKey) {
				this.notifySpawnPlayer();
			} else if (this.prevKey == this.spawnKey && key == this.spawnkey) {
				// Do nothing on prolonged presses on same key.
				// TODO: Doesn't work
			} else if (key == this.killKey && this.prevKey != this.killKey) {
				this.notify({
					message: "Kill Player"
				});
			} 

			// Legacy keyboard input
			else if (keyCode == UP_ARROW) {
				this.notifyMovement(InputModule.VECTOR_UP);
			} else if (keyCode == DOWN_ARROW) {
				this.notifyMovement(InputModule.VECTOR_DOWN);
			} else if (keyCode == LEFT_ARROW) {
				this.notifyMovement(InputModule.VECTOR_LEFT);
			} else if (keyCode == RIGHT_ARROW) {
				this.notifyMovement(InputModule.VECTOR_RIGHT);
			} else {
				console.log("No function for key: " + keyCode);
			}

			// To prevent long unwanted long presses.
			this.prevKey = key;

		} else  {
			this.prevKey = null;
		}
	}

	observerUpdate(message) {
		if (message.message == InputEnum.MOVEMENT_VECTOR) {
			this.notifyMovement(message.vector);
		}
	}

	notifySpawnPlayer() {
		this.notify({
			message: "SpawnPlayer"
		});
	}
}
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
class Player {
	constructor(startPos, blobManager, inputModule) {
		this.observers = [];
		this.blobManager = blobManager;
		inputModule.attach(this); // Listen to input
		this.inputModule = inputModule;

		this.blob = null;
		this.spawnPlayer(startPos);
	}

	spawnPlayer(pos) {
		if (!this.blob || !this.blob.isAlive) {
			this.blob = blobManager.initPlayerBlob(pos);
			this.blob.setInputModule(this.inputModule);

			this.notify({
				message: "Player Respawned"
			});			
		}
	}

	killPlayer() {
		blobManager.kill(this.blob);
	}

	update() {
		if (!this.isAlive) {
			this.notify({
				message: "Player Died"
			});
		}

		// Hack to not spawn drones on screen
		// if (this.isAlive) {
			this.blobManager.doNotSpawnNear(this.pos);
		// } 
	}

	get isAlive() {
		return this.blob && this.blob.isAlive;
	}

	get pos() {
		return this.blob.pos;
	}

	// ***** React to input from objects observed by player *************

	observerUpdate(message) {
		if (message.message == "SpawnPlayer") {
			this.spawnPlayer(this.pos);
		} else if (message.message == "Kill Player") {
			this.killPlayer();
		}
	}

	// ***** Handle observers observing player ***************************

	attach(observer) {
		this.observers.push(observer);
	}

	detach(observer) {
		let index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers.splice(index, 1);
		}
	}

	notify(message) {
		this.observers.forEach(function(observer) {
			if(observer.observerUpdate) {
				observer.observerUpdate(message);
			} else {
				console.log(
					"Observer " + observer.constructor.name + " does not have observerUpdate(message) function");
			}
		});
	}
	// *********************************************************
}
class Particle {
	constructor(size, particleColor, startingPosition, initialVelocity) {
		this.pos = startingPosition;
		this.vel = initialVelocity;
		this.acc = createVector(0, 0);

		this.maxSpeed = 2;
		this.size = size; // Radius
		this.color = particleColor;
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	display() {
		displayAt(this.pos);
	}

	displayAt(pos) {
		noStroke();
		fill(this.color);
		ellipse(pos.x, pos.y, this.size*2);
	}

	run() {
		this.update();
		this.display();
	}

	applyForce(force) {
		let f = force.copy();
		f.div(this.mass);
		this.acc.add(f);
	}

	get mass() {
		return this.size;
	}
}
class Blob extends Particle {
	constructor (size, blobColor, startingPosition, initialVelocity, isManual) {
		super(size, blobColor, startingPosition, initialVelocity);

		this.isManual = isManual;
		this.isAlive = true;
	}

	update() {
		if (this.isAlive) {
			super.update();
			
			if (!this.isManual) {
				this.inputModule.update();
			}
		}
	}
	
	displayAt(pos) {
		if (this.isAlive) {
			super.displayAt(pos);
			if (this.isManual) {
				// Distinguish player blob by
				
				colorMode(HSB, 255, 255, 255);

				// border 
				noFill();
				// stroke(
				// 	color(
				// 		hue(this.color), 
				// 		saturation(this.color), 
				// 		brightness(this.color) + 25));
				// ellipse(
				// 	pos.x, 
				// 	pos.y, 
				// 	size * 2);

				// center spot
				noStroke();
				fill(
					color(
						hue(this.color), 
						saturation(this.color), 
						brightness(this.color) - 100));
				ellipse(
					pos.x, 
					pos.y, 
					this.size * (5/6));
			}
		}
	}

	isCollidingWith(otherBlob) {
		if (!this.isAlive || !otherBlob.isAlive) {
			return false;	
		} 
		return p5.Vector.dist(this.pos, otherBlob.pos) < this.size + otherBlob.size;
	}

	eat(otherBlob) {
		if (!this.isAlive || !otherBlob.isAlive) {
			return;	
		}
		this.size = Blob.calcRadius(this.area + otherBlob.area);
	}

	die() {
		this.isAlive = false;
		this.inputModule.detach(this);
	}

	get area() {
		return this.calcArea();
	}

	calcArea() {
		return PI * this.size * this.size;
	}

	static calcRadius(area) {
		return sqrt(area/PI);
	}

	bounceFrom(otherBlob) {
		// TODO: Get affected by velocity (and mass?) of other blob
	}

	observerUpdate(message) {
		if (message.message == InputEnum.MOVEMENT_VECTOR) {
			this.moveInDirection(message.vector);
		}
	}

	moveInDirection(direction) {
		let scalar = 4;
		this.applyForce(direction.mult(scalar));
	}

	setInputModule(inputModule) {
		inputModule.attach(this);
		this.inputModule = inputModule;
	}
}
let canvasToWindowWidthRatio = 5/7;
let canvasToWindowHeightRatio = 5/7;

let blobManager;
let manualInput;
let joystick;
let player;
let followCam;
let gameboard;
let gamesize = Constants.GAME_SIZE;
let backgroundColor;

let respawnPopup;

// Makes sure resources are loaded before initiatin sketch
function preload() {
}

function setup() {
	let canvas = createCanvas(
		window.innerWidth * canvasToWindowWidthRatio,
		window.innerHeight * canvasToWindowHeightRatio
		);

	// frameRate(1);

	backgroundColor = color(50);
	gameboard = new Gameboard(gamesize, gamesize, backgroundColor);
	joystick = new Joystick();
	manualInput = new ManualInput(joystick);
	blobManager = new BlobManager(gameboard);
	let playerStartPos = createVector(gameboard.width/2, gameboard.height/2);
	player = new Player(playerStartPos, blobManager, manualInput);
	followCam = new FollowCam(gameboard, blobManager.allBlobs);
	followCam.follow(player);

	respawnPopup = new RespawnPopup();
	player.attach(respawnPopup);
}

function draw() {
	player.update();
	blobManager.update();
	manualInput.update();
	followCam.update();
	joystick.run();
	respawnPopup.run();
}

function windowResized() {
	resizeCanvas(
		window.innerWidth * canvasToWindowWidthRatio,
		window.innerHeight * canvasToWindowHeightRatio);
	onResize();
}

function onResize() {
	respawnPopup.reposition();
}


class BlobManager {
	constructor(gameboard) {
		this.gameboard = gameboard;

		this.blobs = [];
		this.initialBlobAmount = Constants.INITIAL_BLOB_AMOUNT;
		this.standardBlobSize = 10;

		colorMode(HSB, 255, 255, 255);
		this.playerBlobColor = Constants.PLAYER_BLOB_COLOR;

		this.initBlobs();

		this.deadBlobs = new FIFOQueue();
	}

	update() {
		let thisHandle = this;
		this.blobs.forEach(function(blob) {
			blob.update();
			thisHandle.repositionOutsideGameboard(blob);
		});
		this.checkForCollisions();

		this.deleteDeadBlobs();
	}

	initBlobs() {
		for (let i=0; i<this.initialBlobAmount; i++) {
			this.addBlob();
		}
	}

	addBlob() {
		// Hack to not spawn drones on screen
		let pos = this.getRandomSpawnPosition();
		while (!this.isSpawnPositionOk(pos)) {
			pos = this.getRandomSpawnPosition();
		}
		let vel = createVector(
			randomGaussian(0, 2), 
			randomGaussian(0, 2));
		let size = randomGaussian(
			this.standardBlobSize, 10);
		let col = color(
			random(255), 
			Constants.BLOB_SATURATION, 
			Constants.BLOB_BRIGHTNESS);
		let inputModule = new PerlinInput();
		let isManual = false;
		let blob = new Blob(
			size, 
			col, 
			pos, 
			vel, 
			isManual);
		blob.setInputModule(inputModule);
		this.blobs.push(blob);
	}

	initPlayerBlob(pos) {
		let vel = createVector(0, 0);
		let size = this.standardBlobSize + 0.2;
		let isManual = true;
		this.playerBlob = new Blob(
			size, 
			this.playerBlobColor, 
			pos, 
			vel, 
			isManual);
		this.blobs.push(this.playerBlob);
		return this.playerBlob;
	}

	repositionOutsideGameboard(blob) {
		if (blob.pos.x > this.gameboard.width) {
			blob.pos.x = 0;
		}
		if(blob.pos.x < 0) {
			blob.pos.x = this.gameboard.width;
		}
		if (blob.pos.y > this.gameboard.height) {
			blob.pos.y = 0;
		}
		if (blob.pos.y < 0) {
			blob.pos.y = this.gameboard.height;
		}
	}

	displayThoseWithinView(topLeft, bottomRight) {
		
	}

	checkForCollisions() {
		let surroundingClassHandle = this;
		this.blobs.forEach(function(blob) {
			surroundingClassHandle.blobs.forEach(function(otherBlob) {
				if (otherBlob == this) {
					return;
				}
				if(blob.isCollidingWith(otherBlob)) {
					if (blob.size > otherBlob.size) {
						blob.eat(otherBlob);
						surroundingClassHandle.kill(otherBlob);
					} else if (blob.size < otherBlob.size) {
						otherBlob.eat(blob);
						surroundingClassHandle.kill(blob);
					} else {
						blob.bounceFrom(otherBlob);
						otherBlob.bounceFrom(Blob);
					}
				}
			});
		});
	}

	kill(blob) {
		blob.die();
		this.deadBlobs.add(blob);
	}

	deleteDeadBlobs() {
		while (!this.deadBlobs.isEmpty()) {
			let deadBlob = this.deadBlobs.poll();
			let index = this.blobs.indexOf(deadBlob);
			this.blobs.splice(index, 1);

			// Add new for every dead one removed
			this.addBlob();
		}
	}

	get allBlobs() {
		return this.blobs;
	}

	getRandomSpawnPosition() {
		return createVector(
			random(
				this.gameboard.width), 
			random(
				this.gameboard.height));
	}

	// Hack to not spawn drones on screen
	doNotSpawnNear(pos) {
		this.avoidWhenSpawningDrones = pos;
	}

	// Hack to not spawn drones on screen
	isSpawnPositionOk(pos) {
		if (this.avoidWhenSpawningDrones) {
			return this.avoidWhenSpawningDrones.dist(pos) > max(width, height) / 2;
		} else {
			return true;
		}
	}
}
