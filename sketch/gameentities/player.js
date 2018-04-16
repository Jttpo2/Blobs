class Player {
	constructor(startPos, blobManager) {
		this.observers = [];
		this.blobManager = blobManager;

		this.blob = null;
		this.lastKnownPos = startPos;
		this.spawnPlayer(startPos);
	}

	spawnPlayer(pos) {
		if (pos === null) {
			pos = this.lastKnownPos;
		}
		if (!this.blob || !this.blob.isAlive) {
			this.blob = blobManager.initPlayerBlob(pos);

			this.notify({
				message: "Player Respawned"
			});
		}
	}

	killPlayer() {
		this.lastKnownPos = this.pos;
		blobManager.kill(this.blob);
	}

	update() {
		if (!this.isAlive) {
			this.notify({
				message: "Player Died"
			});
		}

		// Hack to not spawn drones on screen
		if (this.isAlive) {
			this.blobManager.doNotSpawnNear(this.pos);
		}
	}

	get isAlive() {
		return this.blob && this.blob.isAlive;
	}

	get pos() {
		return this.blob.pos;
	}

	moveTowards(pos) {
		let movementVector = this.getMovementVectorTowards(pos);
		this.blob.moveInDirection(movementVector);
	}

	getMovementVectorTowards(pos) {
		return p5.Vector.sub(pos, this.pos);
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
