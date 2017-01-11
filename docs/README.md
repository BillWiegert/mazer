# Mazer

## Background

Mazer will be a maze making game based on the game [Pathery](www.pathery.com). The objective of the game is the create a maze that takes the computer the highest number of moves to finish. The board is a grid with a column of starting spaces on the left and finish spaces on the right. Permanent walls are randomly placed on the board and the player is given a variable number of their own walls to place as they see fit.

## MVP

Mazer will consist of the following features:
* [x] A maze solving AI that finds the shortest path
* [x] User-placeable walls
* [x] Visual representation of pathfinding with adjustable speed.
* [x] Ten seed boards with predetermined goal score

In addition, this project will include:
* [ ] A production README


## WireFrame

This app will consist of a single screen that contains the game board, level selection and nav links to the github repo and my LinkedIn.

As a bonus feature there will be a 'Generate Level' form that will generate a random level or generate a level from a map id. Map ids will be displayed on generated maps.

Another bonus feature will be the tracking of high scores per random map. These scores will be displayed under the game board.

![Wireframe](wireframe.png)

## Implementation Timeline

Day 1: Set up webpack and create a basic entry file with a canvas element. Create the board and cell objects. Each cell can be a start position, end position, fixed wall or placed wall. Goals for the day:

* Render walls to the canvas element
* Enable mouse clicks to add and remove walls

Day 2: Create maze solving AI that will find the shortest possible path. Create 10 levels and find their best possible solutions. Day 2 goals:

* AI finds shortest possible path
* Keeps a log of moves
* Always takes the same path given equal options

Day 3: Render AI's path on the game board and install start button to display that path and speed dropdown to adjust speed of path rendering. Day 3 goals:

* Path should be visually indicated on the board
* Speed can be changed via dropdown

## Bonus features

* [ ] Random solvable map generator
* [ ] New random map each day
* [ ] User accounts and high scores per map
* [ ] Generate maps from map id numbers
