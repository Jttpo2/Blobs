class Brain {
  constructor(p, camera, inputModule, player) {
    this.p = p;
    this.cam = camera;
    inputModule.attach(this);
    this.input = inputModule;
    this.player = player;
  };

  // Handle updates from input module
  observerUpdate(message) {
    switch (message.message) {
      case InputEnum.INPUT_AT_SCREEN_POSITION: this.handleInput(message.vector);
      break;
      case InputEnum.CLICK_STARTED: this.player.spawnPlayer();
      break;
      case InputEnum.KEY_KILL_PLAYER_PRESSED: this.player.killPlayer();
      break;
    }
  }

  handleInput(screenPosition) {
    player.moveTowards(this.cam.convertToGameSpace(screenPosition));
  }


}
