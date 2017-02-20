# Mazer

## Background

[Mazer](http://mazer.space) is a maze making game based on the game [Pathery](http://pathery.com). The objective of the game is to create a maze that takes the computer the greatest number of moves to finish. The board is a grid with a column of starting spaces on the left and finish spaces on the right. Permanent walls are randomly placed on the board and the player is given a variable number of their own walls to place as they see fit.

## How to Play

Mazer's interface is fairly straight forward. Walls are placed by clicking on any empty cell and can be removed by clicking on them again. There are a limited number of walls so place them wisely.

Once you are satisfied with your maze click the start button to start the path animation. You can adjust the speed of this animation with the dropdown next to the start button.

Each cell that the path travels through adds to your move count. Your goal is to achieve the Goal Moves displayed under the board.

You can press the Clear button to quickly remove all placed walls.

![Level One](images/mazer_level_one.gif)

## Technologies and Libraries Used

* HTML5 and CSS3
* JavaScript (ES6)
* HTML5 Canvas
* EaselJS

## Features and Implementation

### Pathfinding

In order to make the game challenging the path that the AI takes through the maze must always be the shortest path possible from any start location to any finish location. To achieve this I implemented a Breadth-First Search algorithm that takes a start position and searches until it finds a cell whose type matches the given goalType.

#### Breadth-First Search
```javascript
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
```

This function returns an object `prevCell` from which the path can be derived. In the `prevCell` object the key `"dest"` contains the coordinates of the final position in the path that was of type `goalType`. Using those coordinates as a key in the `prevCell` object will yield the coordinates of the previous cell in the path.

This process is repeated, pushing coordinates into an array at each step, until a value of `"none"` is received, indicating the start of the path. The array containing the coordinates is reversed to be in the correct order and returned.

```javascript
generatePath(prevCell) {
  if (!prevCell["dest"]) {
    return [];
  }

  let current = prevCell["dest"];
  const path = [current];

  while (prevCell[current] != "none") {
    current = prevCell[current]
    path.push(current);
  }

  return path.reverse();
}
```

This process is repeated for each start position and the resulting path with the shortest length is selected as the path that the AI will take.

## Future Features

* Use local storage to save best solutions and preferences
* Checkpoints that must be reached before finish
* Random level generator
* User accounts and high scores per map
* Generate maps from map id numbers
