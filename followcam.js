class FollowCam {
	constructor(blobManager) {
		this.blobManager = blobManager;
		this.lookingAtGameSpacePos = null;
		this.followee = null;
		this.viewZeroInGameSpace = null;
		this.gameZeroInScreenSpace = null;
	}

	follow(entity) {
		this.followee = entity;
	}

	update() {
		if (this.followee) {
			this.lookingAtGameSpacePos = this.followee.pos;
			this.viewZeroInGameSpace = this.getViewZeroInGameSpace(this.lookingAtGameSpacePos);
			this.gameZeroInScreenSpace = this.convertToScreenSpace(this.viewZeroInGameSpace);
		}

		this.renderObjectsInView();
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
}