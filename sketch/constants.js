class Constants {
	static get GAME_SIZE() {
		return 2000;
	}

	static get INITIAL_BLOB_AMOUNT() {
		return Constants.GAME_SIZE * 0.025;
	}	

	static get BLOB_SATURATION() {
		return 120;
	}

	static get BLOB_BRIGHTNESS() {
		return 230;
	}
	
	static get PLAYER_BLOB_COLOR() {
		return color(1, 255, 170);
	}	
}