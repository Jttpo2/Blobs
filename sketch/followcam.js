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