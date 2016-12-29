import Board from "./board.js";

document.addEventListener("DOMContentLoaded", function(event) {
  const board = new Board(1);
  const clearBtn = document.getElementById('clear');
  const startBtn = document.getElementById('start');
  const levelBtns = [];

  for (let i = 1; i <= 10; i++) {
    let btn = document.getElementById(`level-${i}`);
    btn.addEventListener('click', function(event) {
      board.changeLevel(i);
    })
  }

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
