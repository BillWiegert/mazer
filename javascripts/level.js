class Level {
  constructor(num) {
    this.levelId = num;
    this.init();
  }

  init() {
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
        this.rocks = [
          [1, 4], [2, 5], [4, 3], [5, 6], [7, 0], [7, 7], [10, 3], [12, 9]
        ];
        this.start = this.startCol();
        this.finish = this.finishCol();
        break;
      case 4:
        this.walls = 14;
        this.goal = 39;
        this.rocks = [
          [ 1, 3], [ 1, 4], [ 1, 7], [ 2, 4], [ 2, 9], [ 3, 0], [ 5, 2],
          [ 5, 6], [ 5, 7], [ 7, 0], [ 7, 2], [ 7, 3], [ 7, 8], [ 8, 2],
          [ 9, 5], [ 9, 9], [10, 0], [10, 2], [10, 6], [12, 1], [13, 7]
        ];
        this.start = this.startCol();
        this.finish = this.finishCol();
        break;
      case 5:
        this.walls = 18;
        this.goal = 43;
        this.rocks = [
          [1, 0], [1, 6], [2, 9], [3, 3], [3, 8], [6, 0], [6, 1],
          [6, 2], [6, 6], [7, 9], [10, 5], [12, 8], [13, 5]
        ];
        this.start = this.startCol();
        this.finish = this.finishCol();
        break;
      case 6:
        this.walls = 11;
        this.goal = 26;
        this.rocks = [
          [7,6], [2,5], [10,0], [2,6], [2,1], [13,7], [2,4], [12,8],
          [8,1], [13,5], [12,7]
        ];
        this.start = this.startCol();
        this.finish = this.finishCol();
        break;
      case 7:
        this.walls = 14;
        this.goal = 41;
        this.rocks = [
          [ 1, 4], [ 1, 9], [ 2, 1], [ 2, 7], [ 2, 8], [ 3, 0], [ 4, 5],
          [ 4, 9], [ 5, 1], [ 5, 2], [ 5, 3], [ 7, 3], [ 9, 7], [10, 0],
          [10, 2], [10, 6], [10, 7], [11, 0], [12, 6], [12, 8], [13, 5]
        ];
        this.start = this.startCol();
        this.finish = this.finishCol();
        break;
      case 8:
        this.walls = 14;
        this.goal = 32;
        this.rocks = [
          [2, 3], [2, 9], [4, 5], [5, 7], [7, 0], [11, 2], [12, 6]
        ];
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



  startCol() {
    return [
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
      [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]
    ];
  }

  finishCol() {
    return [
      [14, 0], [14, 1], [14, 2], [14, 3], [14, 4],
      [14, 5], [14, 6], [14, 7], [14, 8], [14, 9]
    ];
  }
}

export default Level;
