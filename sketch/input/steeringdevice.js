class SteeringDevice {
  constructor(p) {
    this.p = p; // p5.js instance

    this.observers = [];

    // maxMovementMagnitude =
  }

  run() {
    this.update();
    this.display();
  }

  update() {

  }

  display() {

  }

  feedInput(pos) {
    this.steerTowards(pos);
  }

  steerTowards(pos) {
    let movementVector = this.getMovementVector(pos);
    // movementVector.limit(this.radius * this.thumbCenterDistanceLimit);
    this.thumbPos = p5.Vector.add(movementVector, this.pos);

    // Scale down this strong vector
    movementVector.mult(this.movementScalar);

    this.notify({
      message: InputEnum.MOVEMENT_VECTOR,
      vector: movementVector
    });
    this.isSteering = true;
  }

  getMovementVector(inputPos) {
    return p5.Vector.sub(inputPos, this.pos);
  }

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
      observer.observerUpdate(message);
    });
  }

}
