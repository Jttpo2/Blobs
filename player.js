class Player {
	constructor(startPos, blobManager, inputModule) {
		this.blobManager = blobManager;
		inputModule.attach(this); // Listen to input
		this.inputModule = inputModule;

		this.blob = null;
		// this.lastKnownBlobPos = null;
		this.spawnPlayer(startPos);
	}

	spawnPlayer(pos) {
		if (!this.blob || !this.blob.isAlive) {
			this.blob = blobManager.initPlayerBlob(pos);
			this.blob.setInputModule(this.inputModule);
			// this.lastKnownBlobPos = this.blob.pos;			
		}
	}

	update() {
		// if (this.blob && this.blob.pos) {
		// 	this.lastKnownBlobPos = this.blob.pos.copy();
		// }
	}

	get pos() {
		// if (this.blob && this.blob.pos) {
			return this.blob.pos;
		// } else {
		// 	return this.lastKnownBlobPos;
		// }
	}

	observerUpdate(message) {
		if (message.message == "SpawnPlayer") {
			this.spawnPlayer(this.pos);
		}		
	}
}