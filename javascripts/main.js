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

  const modal = document.getElementById('mazer-modal');
  const modalContent = document.getElementById('modal-content');

  const modalSubcontent = {};
  modalSubcontent.tutorial = document.getElementById('tutorial-modal');
  modalSubcontent.nextLevel = document.getElementById('next-level-modal');
  modalSubcontent.finalLevel = document.getElementById('final-level-modal');
  modalSubcontent.pathBlocked = document.getElementById('path-blocked-modal');
  modalSubcontent.hide = function hide() {
    modal.style.display = "none";
    this.tutorial.style.display = "none";
    this.nextLevel.style.display = "none";
    this.finalLevel.style.display = "none";
    this.pathBlocked.style.display = "none";
  };

  modalSubcontent.show = function show(content) {
    modal.style.display = "block";
    const element = this[content];
    element.style.display = "block";

    switch (element.id) {
      case "tutorial-modal":
        modalContent.style.width = "80%";
        modalContent.style.minWidth = "400px";
        break;
      default:
        modalContent.style.width = "30%";
        modalContent.style.minWidth = "160px";
    }
  };

  board.modalSubcontent = modalSubcontent;

  const modelCloseBtns = document.getElementsByClassName('close-modal');

  for (let i = 0; i < modelCloseBtns.length; i++) {
    modelCloseBtns[i].onclick = function() {
      modal.style.display = "none";
      modalSubcontent.hide();
    }
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modalSubcontent.hide();
    }
  }

  const nextLevelBtn = document.getElementById('next-level-btn');

  nextLevelBtn.onclick = function(event) {
    modalSubcontent.hide();
    const next = board.nextLevel();
    levelBtns[next].click();
  }

  const tutorialBtn = document.getElementById("tutorial-btn");

  tutorialBtn.onclick = function(event) {
    modalSubcontent.show("tutorial");
  }

  clearBtn.addEventListener('click', function(event) {
    board.clearWalls();
  });

  startBtn.addEventListener('click', function(event) {
    board.start();
  })

});
