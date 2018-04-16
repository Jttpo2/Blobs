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
    }
  }

  handleInput(screenPosition) {
    player.moveTowards(this.cam.convertToGameSpace(screenPosition));
  }


}
