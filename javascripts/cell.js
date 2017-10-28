class Cell {
  constructor(pos, type = "empty", board) {
    this.pos = pos;
    this.type = type;
    this.board = board;
    this.rect = new createjs.Shape();
    this.configRect();
  }

  configRect() {
    this.rect.removeAllEventListeners();
    this.addAction();
    this.draw();
    this.setAlpha();
  }

  updateType(type) {
    this.type = type;
    this.configRect();
  }

  pathable() {
    return this.type != "rock" && this.type != "wall";
  }

  activate() {
    this.active = true;
    const expire = createjs.Ticker.getTicks() + 5;
    createjs.Ticker.on("tick", this.deactivate, this, false, {expire});
    this.rect.graphics.clear()
      .beginStroke("rgba(0,0,0,1)")
      .beginFill("#0000FF")
      .drawRect(this.pos[0] * 35, this.pos[1] * 35, 35, 35);
    this.rect.alpha = 1;
    this.board.render();
  }

  deactivate(e, data) {
    if (data.expire === createjs.Ticker.getTicks()) {
      this.active = false;
      this.draw();
      this.setAlpha();
    }
  }

  addAction() {
    switch (this.type) {
      case "empty":
        this.rect.on("click", this.handleClick, this);
        this.rect.on("mouseover", this.handleMouseOver, this);
        this.rect.on("mouseout", this.handleMouseOver, this);
        break;
      case "wall":
        this.rect.on("click", this.handleClick, this);
        this.rect.on("mouseover", this.handleMouseOver, this);
        this.rect.on("mouseout", this.handleMouseOver, this);
        break;
      case "rock":
        break;
    }
  }

  handleClick(e) {
    switch(this.type) {
      case "empty":
        this.addWall();
        break;
      case "wall":
        this.removeWall();
        break;
    }
  }

  handleMouseOver(e) {
    if (this.active) { return; }
    if (e.type === "mouseover") {
      e.target.alpha = (this.type === "wall") ? 0.65 : 0.25;
    } else {
      this.setAlpha()
    }
    this.board.render();
  }

  addWall() {
    if (this.board.walls > 0) {
      this.board.walls--;
      this.updateType("wall");
      this.board.updateWallCount();
      this.board.render();
    }
  }

  removeWall() {
    this.board.walls += 1;
    this.updateType("empty");
    this.board.updateWallCount();
    this.board.render();
  }


  getColor() {
    switch (this.type) {
      case "empty":
        return "#000000";
        break;
      case "active":
        return "#0000FF";
        break;
      case "rock":
        return "#773300";
        break;
      case "wall":
        return "rgba(150,200,0,1)";
        break;
      case "start":
        return "rgba(0,255,0,0.5)";
        break;
      case "finish":
        return "rgba(0,0,0,0.5)";
        break;
      default:
        return "rgba(0,0,0,0)";
    }
  }

  getStroke() {
    if (this.type === "rock" || this.type === "wall") {
      return "rgba(0,0,0,1)";
    }
  }

  draw() {
    this.rect.graphics.clear()
      .beginStroke(this.getStroke())
      .beginFill(this.getColor())
      .drawRoundRect(this.pos[0] * 35, this.pos[1] * 35, 35, 35, 5);
  }

  setAlpha() {
    this.type === "empty" ? this.rect.alpha = 0.01 : this.rect.alpha = 1;
  }

  getRect() {
    return this.rect;
  }
}

export default Cell;
