import Board from "./board.js";

document.addEventListener("DOMContentLoaded", function(event) {
  const board = new Board(4);
  const clearBtn = document.getElementById('clear');
  const startBtn = document.getElementById('start');

  createjs.Ticker.setFPS(10);
  board.render();

  clearBtn.addEventListener('click', function(event) {
    board.clearWalls();
  });

  startBtn.addEventListener('click', function(event) {
    board.start();
  })

  window.board = board;
});
