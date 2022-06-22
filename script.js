import Grid from "./lib/Grid.js";
import Tile from "./lib/Tile.js";

let validMovePlayed = false;
let isGameBoardLocked = false;

const gameBoard = document.getElementById("board");
const grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

swipedetect(gameBoard, handleInput);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  if (isGameBoardLocked) {
    return;
  }

  if (e.key) {
    switch (e.key) {
      case "ArrowUp":
        await moveUp();
        break;
      case "ArrowDown":
        await moveDown();
        break;
      case "ArrowLeft":
        await moveLeft();
        break;
      case "ArrowRight":
        await moveRight();
        break;
      default:
        setupInput();
        return;
    }
  } else {
    switch (e) {
      case "up":
        await moveUp();
        break;
      case "down":
        await moveDown();
        break;
      case "left":
        await moveLeft();
        break;
      case "right":
        await moveRight();
        break;
      default:
        setupInput();
        return;
    }
  }

  grid.mergeTiles();

  if (validMovePlayed) {
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    validMovePlayed = false;
    if (grid.hasNoValidMoves()) {
      window.location = "#gameover";
      isGameBoardLocked = true;
      return;
    }
  }

  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((rows) => [...rows].reverse()));
}

function slideTiles(cellGroup) {
  return Promise.all(
    cellGroup.flatMap((cells) => {
      const promises = [];

      for (let i = 0; i < cells.length; i++) {
        let currentCell = cells[i];
        if (currentCell.isEmpty()) {
          continue;
        }
        let lastValidTargetCell;
        for (let j = i - 1; j >= 0; j--) {
          let targetCell = cells[j];
          if (!targetCell.canAccept(currentCell.tile)) {
            break;
          }
          lastValidTargetCell = targetCell;
        }

        if (lastValidTargetCell != null) {
          promises.push(currentCell.tile.waitForTransition());
          validMovePlayed = true;
          currentCell.merge(lastValidTargetCell);
        }
      }
      return promises;
    })
  );
}

function locationHashChanged(e) {
  if (location.hash === "") {
    grid.reset();
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    isGameBoardLocked = false;
    setupInput();
  }
}

window.onhashchange = locationHashChanged;

function swipedetect(el, callback) {
  const touchsurface = el;
  let swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function (swipedir) {};

  touchsurface.addEventListener(
    "touchstart",
    function (e) {
      const touchobj = e.changedTouches[0];
      swipedir = "none";
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    },
    false
  );

  touchsurface.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    false
  );

  touchsurface.addEventListener(
    "touchend",
    function (e) {
      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      const absX = Math.abs(distX);
      const absY = Math.abs(distY);

      if (elapsedTime <= allowedTime) {
        if (absX >= threshold && absY <= restraint) {
          swipedir = distX < 0 ? "left" : "right";
        } else if (absY >= threshold && absX <= restraint) {
          swipedir = distY < 0 ? "up" : "down";
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    },
    false
  );
}
