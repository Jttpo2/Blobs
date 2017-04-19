class Player {
	constructor(blobManager, inputModule) {
		this.blobManager = blobManager;
		this.inputModule = inputModule;

		this.blob = null;
		this.spawnPlayer();
	}

	spawnPlayer() {
		this.blob = blobManager.initPlayerBlob();
		this.blob.setInputModule(this.inputModule);
	}

	update() {

	}
}