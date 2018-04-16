class FollowCam {
	constructor(p, gameBoard, allBlobs) {
		this.p = p; // p5.js instance

		this.gameBoard = gameBoard;

		this.allBlobs = allBlobs;
		this.followee = null;
		this.viewZeroInGameSpace = null;
		this.gameZeroInScreenSpace = null;

		this.lookingAtGameSpacePos = null;
		this.movementDamping = 0.01;
		this.lastFrameTime = Date.now();
	}

	follow(entity) {
		this.followee = entity;
		this.lookingAtGameSpacePos = entity.pos;
	}

	update() {
		let p=this.p;
		if (this.followee) {
			this.smoothFollow(this.followee);
			this.viewZeroInGameSpace = this.getViewZeroInGameSpace(this.lookingAtGameSpacePos);
			this.gameZeroInScreenSpace = this.convertToScreenSpace(this.viewZeroInGameSpace);
		}

		this.renderObjectsInView();

		this.lastFrameTime = Date.now();
	}

	getViewZeroInGameSpace(lookingAtPos) {
		let p=this.p;
		return p.createVector(
			lookingAtPos.x - p.width/2,
			lookingAtPos.y - p.height/2);
	}

	renderObjectsInView() {
		this.render(this.gameBoard);

		let allBlobs = this.allBlobs;
		allBlobs.forEach(function(rendObj) {
			this.render(rendObj);
		}, this);
	}

	render(object) {
		let screenSpaceCoord = this.convertToScreenSpace(object.pos);
		object.displayAt(screenSpaceCoord);
	}

	convertToScreenSpace(gameSpaceCoord) {
		if (!gameSpaceCoord) return null;
		return p5.Vector.sub(gameSpaceCoord, this.viewZeroInGameSpace);
	}

	convertToGameSpace(screenSpaceCoord) {
		if (!screenSpaceCoord) return null;
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
		let p=this.p;
		return (Date.now() - this.lastFrameTime) / 1000;
	}
}
