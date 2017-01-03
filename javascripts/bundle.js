/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _board = __webpack_require__(1);
	
	var _board2 = _interopRequireDefault(_board);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener("DOMContentLoaded", function (event) {
	  var currentLevel = 1;
	  var board = new _board2.default(currentLevel);
	  var clearBtn = document.getElementById('clear');
	  var startBtn = document.getElementById('start');
	  var levelBtns = [];
	
	  var _loop = function _loop(i) {
	    var btn = document.getElementById("level-" + i);
	    levelBtns.push(btn);
	    btn.addEventListener('click', function (event) {
	      levelBtns[currentLevel - 1].classList.remove("current-level");
	      currentLevel = i;
	      event.target.classList.add("current-level");
	      board.changeLevel(i);
	    });
	  };
	
	  for (var i = 1; i <= 10; i++) {
	    _loop(i);
	  }
	
	  levelBtns[currentLevel - 1].classList.add("current-level");
	
	  createjs.Ticker.setFPS(10);
	  board.render();
	
	  clearBtn.addEventListener('click', function (event) {
	    board.clearWalls();
	  });
	
	  startBtn.addEventListener('click', function (event) {
	    board.start();
	  });
	
	  window.board = board;
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _queue = __webpack_require__(2);
	
	var _queue2 = _interopRequireDefault(_queue);
	
	var _cell = __webpack_require__(3);
	
	var _cell2 = _interopRequireDefault(_cell);
	
	var _level = __webpack_require__(4);
	
	var _level2 = _interopRequireDefault(_level);
	
	var _stats = __webpack_require__(5);
	
	var _stats2 = _interopRequireDefault(_stats);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board(level) {
	    _classCallCheck(this, Board);
	
	    this.stage = new createjs.Stage("stage");
	    this.stage.enableMouseOver(20);
	    this.level = new _level2.default(level);
	    this.wallCounter = document.getElementById('wall-counter');
	    this.moveCounter = document.getElementById('move-counter');
	    this.goalMoves = document.getElementById('goal-moves');
	    this.startBtn = document.getElementById('start');
	    this.populateLevel();
	    this.stats = new _stats2.default();
	  }
	
	  _createClass(Board, [{
	    key: "emptyGrid",
	    value: function emptyGrid() {
	      var grid = new Array(15);
	      for (var i = 0; i < 15; i++) {
	        grid[i] = new Array(10);
	        for (var j = 0; j < 10; j++) {
	          var cell = new _cell2.default([i, j], "empty", this);
	          this.stage.addChild(cell.getRect());
	          grid[i][j] = cell;
	        }
	      }
	
	      return grid;
	    }
	  }, {
	    key: "cell",
	    value: function cell(pos) {
	      return this.grid[pos[0]][pos[1]];
	    }
	  }, {
	    key: "inBounds",
	    value: function inBounds(pos) {
	      if (pos[0] >= 0 && pos[0] < 15) {
	        if (pos[1] >= 0 && pos[1] < 10) {
	          return true;
	        }
	      }
	
	      return false;
	    }
	  }, {
	    key: "neighbors",
	    value: function neighbors(pos) {
	      var _this = this;
	
	      var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
	      var validNeighbors = [];
	      DIRS.forEach(function (dir) {
	        var neighbor = [pos[0] + dir[0], pos[1] + dir[1]];
	        if (_this.inBounds(neighbor)) {
	          validNeighbors.push(neighbor);
	        }
	      });
	
	      return validNeighbors;
	    }
	  }, {
	    key: "bfs",
	    value: function bfs(startPos) {
	      var _this2 = this;
	
	      var goalType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "finish";
	
	      var queue = new _queue2.default();
	      queue.enqueue(startPos);
	      var prevCell = {};
	      prevCell[startPos] = "none";
	
	      var _loop = function _loop() {
	        var current = queue.dequeue();
	
	        if (_this2.cell(current).type === goalType) {
	          prevCell["dest"] = current;
	          return "break";
	        }
	
	        _this2.neighbors(current).forEach(function (next) {
	          if (_this2.cell(next).pathable() && !prevCell[next]) {
	            queue.enqueue(next);
	            prevCell[next] = current;
	          }
	        });
	      };
	
	      while (!queue.empty()) {
	        var _ret = _loop();
	
	        if (_ret === "break") break;
	      }
	
	      return prevCell;
	    }
	  }, {
	    key: "generatePath",
	    value: function generatePath(bfsResult) {
	      if (!bfsResult["dest"]) {
	        return [];
	      }
	
	      var current = bfsResult["dest"];
	      var path = [current];
	
	      while (bfsResult[current] != "none") {
	        current = bfsResult[current];
	        path.push(current);
	      }
	
	      return path.reverse();
	    }
	  }, {
	    key: "getBestPath",
	    value: function getBestPath() {
	      var bestPath = this.generatePath(this.bfs(this.level.start[0]));
	
	      for (var i = 1; i < this.level.start.length; i++) {
	        var path = this.generatePath(this.bfs(this.level.start[i]));
	        if (path.length < bestPath.length) {
	          bestPath = path;
	        }
	      }
	
	      return bestPath;
	    }
	  }, {
	    key: "animatePath",
	    value: function animatePath(path) {
	      createjs.Ticker.on("tick", this.activateCell, this, false, { path: path });
	    }
	  }, {
	    key: "activateCell",
	    value: function activateCell(e, data) {
	      var n = createjs.Ticker.getTicks(true) - 1;
	      var pos = data.path[n];
	      this.updateMoveCount();
	      this.render();
	      if (n === data.path.length + 5) {
	        createjs.Ticker.reset();
	        this.enableStart();
	      } else if (pos) {
	        this.moves = n;
	        this.cell(pos).activate();
	      }
	    }
	  }, {
	    key: "start",
	    value: function start() {
	      var path = this.getBestPath();
	
	      if (path.length > 0) {
	        this.disableStart();
	        this.animatePath(path);
	      } else {
	        alert("Path is blocked!");
	      }
	    }
	  }, {
	    key: "disableStart",
	    value: function disableStart() {
	      this.startBtn.setAttribute("disabled", "true");
	    }
	  }, {
	    key: "enableStart",
	    value: function enableStart() {
	      this.startBtn.removeAttribute("disabled");
	    }
	  }, {
	    key: "populateLevel",
	    value: function populateLevel() {
	      var _this3 = this;
	
	      this.grid = this.emptyGrid();
	      this.walls = this.level.walls;
	      this.moves = 0;
	      this.goalMoves.innerHTML = "Goal Moves: " + this.level.goal;
	
	      this.level.rocks.forEach(function (rock) {
	        _this3.cell(rock).updateType("rock");
	      });
	
	      this.level.start.forEach(function (start) {
	        _this3.cell(start).updateType("start");
	      });
	
	      this.level.finish.forEach(function (finish) {
	        _this3.cell(finish).updateType("finish");
	      });
	    }
	  }, {
	    key: "changeLevel",
	    value: function changeLevel(n) {
	      this.stage.removeAllChildren();
	      createjs.Ticker.reset();
	      this.level = new _level2.default(n);
	      this.populateLevel();
	      this.updateWallCount();
	      this.updateMoveCount();
	      this.render();
	      this.enableStart();
	    }
	  }, {
	    key: "clearWalls",
	    value: function clearWalls() {
	      for (var x = 0; x < 15; x++) {
	        for (var y = 0; y < 10; y++) {
	          var cell = this.cell([x, y]);
	          if (cell.type === "wall") {
	            cell.updateType("empty");
	            this.walls++;
	          }
	        }
	      }
	      this.updateWallCount();
	      this.render();
	    }
	  }, {
	    key: "updateWallCount",
	    value: function updateWallCount() {
	      this.wallCounter.innerHTML = this.walls;
	    }
	  }, {
	    key: "updateMoveCount",
	    value: function updateMoveCount() {
	      this.moveCounter.innerHTML = this.moves;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      // this.updateWallCount();
	      // this.updateMoveCount();
	      this.stage.update();
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Queue = function () {
	  function Queue() {
	    _classCallCheck(this, Queue);
	
	    this.contents = [];
	  }
	
	  _createClass(Queue, [{
	    key: "enqueue",
	    value: function enqueue(item) {
	      this.contents.push(item);
	    }
	  }, {
	    key: "dequeue",
	    value: function dequeue() {
	      return this.contents.shift();
	    }
	  }, {
	    key: "empty",
	    value: function empty() {
	      return this.contents.length === 0;
	    }
	  }]);
	
	  return Queue;
	}();
	
	exports.default = Queue;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Cell = function () {
	  function Cell(pos) {
	    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "empty";
	    var board = arguments[2];
	
	    _classCallCheck(this, Cell);
	
	    this.pos = pos;
	    this.type = type;
	    this.board = board;
	    this.rect = new createjs.Shape();
	    this.configRect();
	  }
	
	  _createClass(Cell, [{
	    key: "configRect",
	    value: function configRect() {
	      this.rect.removeAllEventListeners();
	      this.addAction();
	      this.draw();
	      this.setAlpha();
	    }
	  }, {
	    key: "updateType",
	    value: function updateType(type) {
	      this.type = type;
	      this.configRect();
	    }
	  }, {
	    key: "pathable",
	    value: function pathable() {
	      return this.type != "rock" && this.type != "wall";
	    }
	  }, {
	    key: "activate",
	    value: function activate() {
	      this.active = true;
	      var expire = createjs.Ticker.getTicks() + 5;
	      createjs.Ticker.on("tick", this.deactivate, this, false, { expire: expire });
	      this.rect.graphics.clear().beginStroke("rgba(0,0,0,1)").beginFill("#0000FF").drawRect(this.pos[0] * 35, this.pos[1] * 35, 35, 35);
	      this.rect.alpha = 1;
	      this.board.render();
	    }
	  }, {
	    key: "deactivate",
	    value: function deactivate(e, data) {
	      if (data.expire === createjs.Ticker.getTicks()) {
	        this.active = false;
	        this.draw();
	        this.setAlpha();
	      }
	    }
	  }, {
	    key: "addAction",
	    value: function addAction() {
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
	  }, {
	    key: "handleClick",
	    value: function handleClick(e) {
	      switch (this.type) {
	        case "empty":
	          this.addWall();
	          break;
	        case "wall":
	          this.removeWall();
	          break;
	      }
	    }
	  }, {
	    key: "handleMouseOver",
	    value: function handleMouseOver(e) {
	      if (!this.active) {
	        e.target.alpha = e.type === "mouseover" ? 0.25 : 0.01;
	        this.board.render();
	      }
	    }
	  }, {
	    key: "addWall",
	    value: function addWall() {
	      if (this.board.walls > 0) {
	        this.board.walls--;
	        this.updateType("wall");
	        this.board.updateWallCount();
	        this.board.render();
	      }
	    }
	  }, {
	    key: "removeWall",
	    value: function removeWall() {
	      this.board.walls += 1;
	      this.updateType("empty");
	      this.board.updateWallCount();
	      this.board.render();
	    }
	  }, {
	    key: "getColor",
	    value: function getColor() {
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
	  }, {
	    key: "getStroke",
	    value: function getStroke() {
	      if (this.type === "rock" || this.type === "wall") {
	        return "rgba(0,0,0,1)";
	      }
	    }
	  }, {
	    key: "draw",
	    value: function draw() {
	      this.rect.graphics.clear().beginStroke(this.getStroke()).beginFill(this.getColor()).drawRoundRect(this.pos[0] * 35, this.pos[1] * 35, 35, 35, 5);
	    }
	  }, {
	    key: "setAlpha",
	    value: function setAlpha() {
	      this.type === "empty" ? this.rect.alpha = 0.01 : this.rect.alpha = 1;
	    }
	  }, {
	    key: "getRect",
	    value: function getRect() {
	      return this.rect;
	    }
	  }]);
	
	  return Cell;
	}();
	
	exports.default = Cell;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Level = function () {
	  function Level(num) {
	    _classCallCheck(this, Level);
	
	    this.levelId = num;
	    this.init();
	  }
	
	  _createClass(Level, [{
	    key: "init",
	    value: function init() {
	      switch (this.levelId) {
	        case 1:
	          this.walls = 10;
	          this.goal = 26;
	          this.rocks = [[1, 1], [2, 0], [4, 4], [8, 5], [12, 9]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 2:
	          this.walls = 14;
	          this.goal = 36;
	          this.rocks = [[3, 9], [4, 8], [7, 4], [7, 7], [9, 9]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 3:
	          this.walls = 14;
	          this.goal = 31;
	          this.rocks = [[1, 4], [2, 5], [4, 3], [5, 6], [7, 0], [7, 7], [10, 3], [12, 9]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 4:
	          this.walls = 14;
	          this.goal = 39;
	          this.rocks = [[1, 3], [1, 4], [1, 7], [2, 4], [2, 9], [3, 0], [5, 2], [5, 6], [5, 7], [7, 0], [7, 2], [7, 3], [7, 8], [8, 2], [9, 5], [9, 9], [10, 0], [10, 2], [10, 6], [12, 1], [13, 7]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 5:
	          this.walls = 18;
	          this.goal = 43;
	          this.rocks = [[1, 0], [1, 6], [2, 9], [3, 3], [3, 8], [6, 0], [6, 1], [6, 2], [6, 6], [7, 9], [10, 5], [12, 8], [13, 5]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 6:
	          this.walls = 11;
	          this.goal = 26;
	          this.rocks = [[7, 6], [2, 5], [10, 0], [2, 6], [2, 1], [13, 7], [2, 4], [12, 8], [8, 1], [13, 5], [12, 7]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 7:
	          this.walls = 14;
	          this.goal = 41;
	          this.rocks = [[1, 4], [1, 9], [2, 1], [2, 7], [2, 8], [3, 0], [4, 5], [4, 9], [5, 1], [5, 2], [5, 3], [7, 3], [9, 7], [10, 0], [10, 2], [10, 6], [10, 7], [11, 0], [12, 6], [12, 8], [13, 5]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 8:
	          this.walls = 14;
	          this.goal = 32;
	          this.rocks = [[2, 3], [2, 9], [4, 5], [5, 7], [7, 0], [11, 2], [12, 6]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 9:
	          this.walls = 999;
	          this.goal = 67;
	          this.rocks = [[3, 9], [4, 8], [7, 4], [7, 7], [9, 9]];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	        case 10:
	          this.walls = 999;
	          this.goal = 73;
	          this.rocks = [];
	          this.start = this.startCol();
	          this.finish = this.finishCol();
	          break;
	      }
	    }
	  }, {
	    key: "startCol",
	    value: function startCol() {
	      return [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]];
	    }
	  }, {
	    key: "finishCol",
	    value: function finishCol() {
	      return [[14, 0], [14, 1], [14, 2], [14, 3], [14, 4], [14, 5], [14, 6], [14, 7], [14, 8], [14, 9]];
	    }
	  }]);
	
	  return Level;
	}();
	
	exports.default = Level;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Stats = function () {
	  function Stats() {
	    _classCallCheck(this, Stats);
	
	    this.data = this.loadSavedStats();
	  }
	
	  _createClass(Stats, [{
	    key: 'loadSavedStats',
	    value: function loadSavedStats() {
	      var cookies = document.cookie.split(';');
	      for (var i = 0; i < cookies.length; i++) {
	        var c = cookies[i];
	
	        while (c.charAt(0) == ' ') {
	          c = c.substring(1);
	        }
	
	        if (c.indexOf('stats=') == 0) {
	          var _stats = c.substring(name.length, c.length);
	          return JSON.parse(_stats);
	        }
	      }
	      return {};
	    }
	  }, {
	    key: 'updateStats',
	    value: function updateStats(level, score, walls) {
	      this.data[level].best = score;
	      this.data[level].walls = walls;
	      stats = JSON.stringify(this.data);
	      document.cookie = 'stats=' + stats;
	    }
	  }, {
	    key: 'clearStats',
	    value: function clearStats() {
	      document.cookie = "stats={}";
	    }
	  }]);
	
	  return Stats;
	}();
	
	exports.default = Stats;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map