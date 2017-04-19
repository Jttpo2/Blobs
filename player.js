class Player {
	constructor(blobManager, joystick) {
		this.blobManager = blobManager;
		this.joystick = joystick;

		this.spawnPlayer();
	}

	spawnPlayer() {
		this.blob = blobManager.initPlayerBlob();
		this.blob.setInputModule(new ManualInput(this.joystick));
	}
}