const GRID_SIZE = 4;
const CELL_SIZE = 16;
const CELL_GAP = 2.45;

export default class Grid {
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(cellElement, index % GRID_SIZE, (index / GRID_SIZE) | 0);
    });
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get tilesByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell.tile?.value;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  get tilesByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell.tile?.value;
      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }

  mergeTiles() {
    this.#cells.forEach((cell) => cell.mergeTiles());
  }

  hasNoValidMoves() {
    if (this.#emptyCells.length !== 0) {
      return false;
    } else if (hasEqualAndAdjacentTile(this.tilesByRow)) {
      return false;
    } else if (hasEqualAndAdjacentTile(this.tilesByColumn)) {
      return false;
    }
    return true;
  }

  reset() {
    return this.#cells.forEach((c) => {
      c.tile?.remove();
      c.tile = null;
    });
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) {
      return;
    }
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) {
      return;
    }
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  isEmpty() {
    return this.tile == null;
  }

  merge(targetCell) {
    if (targetCell.tile == null) {
      targetCell.tile = this.#tile;
    } else {
      targetCell.mergeTile = this.#tile;
    }
    this.tile = null;
  }

  canAccept(tile) {
    if (this.tile == null) {
      return true;
    }
    return this.#mergeTile == null && this.#tile.value === tile.value;
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) {
      return;
    }
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }

  print() {
    return `Cell: ${this.#x},${this.#y}`;
  }
}

function createCellElements(gridElement) {
  const cells = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }

  return cells;
}

function hasEqualAndAdjacentTile(tilesArray) {
  for (let i = 0; i < tilesArray.length; i++) {
    let previousTile = tilesArray[i][0];
    for (let j = 1; j < tilesArray[i].length; j++) {
      if (previousTile === tilesArray[i][j]) {
        return true;
      }
      previousTile = tilesArray[i][j];
    }
  }
}
