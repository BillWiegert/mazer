import Queue from "./queue.js";
import Cell from "./cell.js";
import Level from "./level.js";
import Stats from "./stats.js";

class Board {
  constructor(level) {
    this.stage = new createjs.Stage("stage");
    this.stage.enableMouseOver(20);
    this.level = new Level(level);
    this.wallCounter = document.getElementById('wall-counter');
    this.moveCounter = document.getElementById('move-counter');
    this.goalMoves = document.getElementById('goal-moves');
    this.startBtn = document.getElementById('start');
    this.populateLevel();
    this.stats = new Stats;
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
    let bestPath = this.generatePath(this.bfs(this.level.start[0]));

    for (let i = 1; i < this.level.start.length; i++) {
      let path = this.generatePath(this.bfs(this.level.start[i]));
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
    if (n === data.path.length + 5) {
      createjs.Ticker.reset();
      this.enableStart();
    } else if (pos) {
      this.moves = n;
      this.cell(pos).activate();
    }
  }

  start() {
    const path = this.getBestPath();

    if (path.length > 0) {
      this.disableStart();
      this.animatePath(path);
    } else {
      alert("Path is blocked!");
    }
  }

  disableStart() {
    this.startBtn.setAttribute("disabled", "true");
  }

  enableStart() {
    this.startBtn.removeAttribute("disabled");
  }

  populateLevel() {
    this.grid = this.emptyGrid();
    this.walls = this.level.walls;
    this.moves = 0;
    this.goalMoves.innerHTML = `Goal Moves: ${this.level.goal}`;

    this.level.rocks.forEach(rock => {
      this.cell(rock).updateType("rock");
    });

    this.level.start.forEach(start => {
      this.cell(start).updateType("start");
    });

    this.level.finish.forEach(finish => {
      this.cell(finish).updateType("finish");
    });
  }

  changeLevel(n) {
    this.stage.removeAllChildren();
    createjs.Ticker.reset();
    this.level = new Level(n);
    this.populateLevel();
    this.render();
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

export default Board;
