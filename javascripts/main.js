import Board from "./board.js";

document.addEventListener("DOMContentLoaded", function(event) {
  let currentLevel = 1
  const board = new Board(currentLevel);
  const clearBtn = document.getElementById('clear');
  const startBtn = document.getElementById('start');
  const levelBtns = [];

  for (let i = 1; i <= 10; i++) {
    let btn = document.getElementById(`level-${i}`);
    levelBtns.push(btn);
    btn.addEventListener('click', function(event) {
      levelBtns[currentLevel - 1].classList.remove("current-level");
      currentLevel = i;
      event.target.classList.add("current-level");
      board.changeLevel(i);
    })
  }

  levelBtns[currentLevel - 1].classList.add("current-level");

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
