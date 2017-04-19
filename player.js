class Player {
	constructor(startPos, blobManager, inputModule) {
		this.observers = [];
		this.blobManager = blobManager;
		inputModule.attach(this); // Listen to input
		this.inputModule = inputModule;

		this.blob = null;
		// this.lastKnownBlobPos = null;
		this.spawnPlayer(startPos);



		// this.respawnPopup = new RespawnPopup();
	}

	spawnPlayer(pos) {
		if (!this.blob || !this.blob.isAlive) {
			this.blob = blobManager.initPlayerBlob(pos);
			this.blob.setInputModule(this.inputModule);
			// this.lastKnownBlobPos = this.blob.pos;

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

		// this.respawnPopup.display();

		// if (this.blob && this.blob.pos) {
		// 	this.lastKnownBlobPos = this.blob.pos.copy();
		// }
	}

	get isAlive() {
		return this.blob && this.blob.isAlive;
	}

	get pos() {
		// if (this.blob && this.blob.pos) {
			return this.blob.pos;
		// } else {
		// 	return this.lastKnownBlobPos;
		// }
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