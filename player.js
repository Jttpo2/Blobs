class Player {
	constructor(blobManager, inputModule) {
		this.blobManager = blobManager;
		inputModule.attach(this); // Listen to input
		this.inputModule = inputModule;

		this.blob = null;
		this.spawnPlayer();
	}

	spawnPlayer() {
		if (!this.blob || !this.blob.isAlive) {
			this.blob = blobManager.initPlayerBlob();
			this.blob.setInputModule(this.inputModule);			
		}
	}

	update() {

	}

	get pos() {
		return this.blob.pos;
	}

	observerUpdate(message) {
		if (message.message == "SpawnPlayer") {
			this.spawnPlayer();
		}		
	}
}