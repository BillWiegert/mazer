document.addEventListener("DOMContentLoaded", function(event) {
  const board = new Board(1);
  const clearBtn = document.getElementById('clear');
  const wallCount = document.getElementById('wall-count');

  board.render();

  clearBtn.addEventListener('click', function(event) {
    board.clearWalls();
  });
});

class Board {
  constructor(level) {
    this.stage = new createjs.Stage("stage");
    this.stage.enableMouseOver(20);
    this.grid = this.emptyGrid();
    this.level = level;
    this.wallCount = document.getElementById('wall-count');

    if (level <= 10) {
      this.populateLevel()
    }
  }

  emptyGrid() {
    const grid = new Array(15);
    for (let i = 0; i < 15; i++) {
      grid[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
        let cell = new Cell([i, j], "empty", this);
        this.stage.addChild(cell.getRect());
        grid[i][j] = cell
      }
    }

    return grid;
  }

  cell(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  populateLevel() {
    switch (this.level) {
      case 1:
        this.levelOne();
        break;
      default:
        this.levelOne();
        break;
    }
  }

  levelOne() {
    this.walls = 10;
    const rocks = [
      [1, 1], [2, 0], [4, 4], [8, 5], [12, 9]
    ];

    const start = []

    for(let i = 0; i < 10; i++) {
      start.push([0, i]);
    }

    const finish = []

    for(let i = 0; i < 10; i++) {
      finish.push([14, i]);
    }

    rocks.forEach(rock => {
      this.cell(rock).updateType("rock");
    });

    start.forEach(start => {
      this.cell(start).updateType("start");
    });

    finish.forEach(finish => {
      this.cell(finish).updateType("finish");
    });
  }

  clearWalls() {
    for (let x = 0; x < 15; x++) {
      for (let y = 0; y < 10; y++) {
        let cell = this.cell([x, y]);
        if (cell.type === "wall") {
          cell.updateType("empty");
          this.walls++;
        }
      }
    }
    this.render();
  }

  updateWallCount() {
    this.wallCount.innerHTML = this.walls;
  }

  render() {
    this.updateWallCount();
    this.stage.update();
  }
}

class Cell {
  constructor(pos, type = "empty", board) {
    this.pos = pos;
    this.type = type; // types: empty, rock, wall, start, finish
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

  addAction() {
    switch (this.type) {
      case "empty":
        this.rect.on("click", this.handleClick, this);
        this.rect.on("mouseover", this.handleMouseOver, this);
        this.rect.on("mouseout", this.handleMouseOver, this);
        break;
      case "wall":
        this.rect.on("click", this.handleClick, this);
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
    e.target.alpha = (e.type === "mouseover") ? 0.25 : 0.01;
    this.board.render();
  }

  addWall() {
    if (this.board.walls > 0) {
      this.board.walls--;
      this.updateType("wall");
      this.board.render();
    }
  }

  removeWall() {
    this.board.walls += 1;
    this.updateType("empty");
    this.board.render();
  }


  getColor() {
    switch (this.type) {
      case "empty":
        return "#000000";
        break;
      case "rock":
        return "#783200";
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
