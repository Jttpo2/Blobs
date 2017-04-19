class FollowCam {
	constructor(blobManager) {
		this.blobManager = blobManager;
		this.followee = null;
		this.viewZeroInGameSpace = null;
		this.gameZeroInScreenSpace = null;

		this.lookingAtGameSpacePos = null;
		// this.desiredPos = null;
		this.movementDamping = 1;
		this.lastFrameTime = millis();
	}

	follow(entity) {
		this.followee = entity;
		this.lookingAtGameSpacePos = entity.pos;
	}

	update() {
		if (this.followee) {
			this.smoothFollow(this.followee);
			// this.lookingAtGameSpacePos = this.followee.pos;
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
		let thisHandle = this;
		let everythingThisCamRendereds = this.getRenderedObjects();
		everythingThisCamRendereds.forEach(function(rendObj) {
			if (thisHandle.isWithinViewFrustum(rendObj)) {
				let screenSpaceCoord = thisHandle.convertToScreenSpace(rendObj.pos);
				rendObj.displayAt(screenSpaceCoord);
			}
		});
	}

	convertToScreenSpace(gameSpaceCoord) {
		return p5.Vector.sub(gameSpaceCoord, this.viewZeroInGameSpace);
	}

	convertToGameSpace(screenSpaceCoord) {
		return p5.Vector.add(screenSpaceCoord, this.viewZeroInGameSpace);
	}

	getRenderedObjects() {
		return this.blobManager.allBlobs;
	}

	isWithinViewFrustum(object) {
		let screenSpaceCoord = this.convertToScreenSpace(object.pos);
		return screenSpaceCoord.x >= 0 && 
		screenSpaceCoord.x < width &&
		screenSpaceCoord.y >= 0 && 
		screenSpaceCoord.y < height;
	}

	smoothFollow(entity) {
		let desiredPos = entity.pos;
		let currentPos = this.lookingAtGameSpacePos;	
		let nextPos = p5.Vector.lerp(currentPos, desiredPos, this.getSecondsSinceLastFrame() * this.movementDamping);
		// this.lookingAtGameSpacePos = entity.pos;
		this.lookingAtGameSpacePos = nextPos;

	}

	getSecondsSinceLastFrame() {
		return (millis() - this.lastFrameTime) / 1000;
	}
}