document.addEventListener("DOMContentLoaded", function(event) {
  const board = new Board(1);
  const clearBtn = document.getElementById('clear');
  const startBtn = document.getElementById('start');

  board.render();

  clearBtn.addEventListener('click', function(event) {
    board.clearWalls();
  });

  startBtn.addEventListener('click', function(event) {
    board.start();
  })

  window.board = board;
});

class Board {
  constructor(level) {
    this.stage = new createjs.Stage("stage");
    this.stage.enableMouseOver(20);
    this.grid = this.emptyGrid();
    this.level = level;
    this.moves = 0;
    this.wallCounter = document.getElementById('wall-counter');
    this.moveCounter = document.getElementById('move-counter');
    this.goalMoves = document.getElementById('goal-moves');
    createjs.Ticker.setFPS(10);

    if (level <= 10) {
      this.populateLevel();
    }
  }

  emptyGrid() {
    const grid = new Array(15);
    for (let i = 0; i < 15; i++) {
      grid[i] = new Array(10);
      for (let j = 0; j < 10; j++) {
        let cell = new Cell([i, j], "empty", this);
        this.stage.addChild(cell.getRect());
        grid[i][j] = cell;
      }
    }

    return grid;
  }

  cell(pos) {
    return this.grid[pos[0]][pos[1]];
  }

  inBounds(pos) {
    if (pos[0] >= 0 && pos[0] < 15) {
      if (pos[1] >= 0 && pos[1] < 10) {
        return true;
      }
    }

    return false;
  }

  neighbors(pos) {
    const DIRS = [[0,-1],[1,0],[0,1],[-1,0]];
    const validNeighbors = []
    DIRS.forEach(dir => {
      let neighbor = [pos[0] + dir[0], pos[1] + dir[1]];
      if (this.inBounds(neighbor)) {
        validNeighbors.push(neighbor);
      }
    });

    return validNeighbors;
  }

  bfs(startPos, goalType = "finish") {
    const queue = new Queue();
    queue.enqueue(startPos);
    const prevCell = {};
    prevCell[startPos] = "none";

    while (!queue.empty()) {
      let current = queue.dequeue();

      if (this.cell(current).type === goalType) {
        prevCell["dest"] = current;
        break;
      }

      this.neighbors(current).forEach(next => {
        if (this.cell(next).pathable() && !prevCell[next]) {
          queue.enqueue(next);
          prevCell[next] = current;
        }
      });
    }

    return prevCell;
  }

  generatePath(bfsResult) {
    if (!bfsResult["dest"]) {
      return [];
    }

    let current = bfsResult["dest"];
    const path = [current];

    while (bfsResult[current] != "none") {
      current = bfsResult[current]
      path.push(current);
    }

    return path.reverse();
  }

  getBestPath() {
    let bestPath = this.generatePath(this.bfs(this.startPositions[0]));

    for (let i = 1; i < this.startPositions.length; i++) {
      let path = this.generatePath(this.bfs(this.startPositions[i]));
      if (path.length < bestPath.length) {
        bestPath = path;
      }
    }

    return bestPath;
  }

  animatePath(path) {
    createjs.Ticker.on("tick", this.activateCell, this, false, {path});
  }

  activateCell(e, data) {
    const n = createjs.Ticker.getTicks(true) - 1;
    const pos = data.path[n];
    if (n >= data.path.length + 5) {
      createjs.Ticker.reset();
    } else if (pos) {
      this.moves = n;
      this.cell(pos).activate();
    }
  }

  start() {
    const path = this.getBestPath();

    if (path.length > 0) {
      this.animatePath(path);
    } else {
      alert("Path is blocked!");
    }
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
    this.goal = 26;

    const rocks = [
      [1, 1], [2, 0], [4, 4], [8, 5], [12, 9]
    ];

    const start = [];

    for(let i = 0; i < 10; i++) {
      start.push([0, i]);
    }

    this.startPositions = start;

    const finish = [];

    for(let i = 0; i < 10; i++) {
      finish.push([14, i]);
    }

    this.goalMoves.innerHTML = `Goal Moves: ${this.goal}`;

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
    this.wallCounter.innerHTML = this.walls;
  }

  updateMoveCount() {
    this.moveCounter.innerHTML = this.moves;
  }

  render() {
    this.updateWallCount();
    this.updateMoveCount();
    this.stage.update();
  }
}

// =======================================

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
      this.draw();
      this.setAlpha();
      this.board.render();
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

class Queue {
  constructor() {
    this.contents = [];
  }

  enqueue(item) {
    this.contents.push(item);
  }

  dequeue() {
    return this.contents.shift();
  }

  empty() {
    return this.contents.length === 0;
  }
}
