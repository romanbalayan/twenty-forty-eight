import Grid from "./lib/Grid.js"
import Tile from "./lib/Tile.js"

let validMovePlayed = false
let isGameBoardLocked = false

const gameBoard = document.getElementById("board")
const grid = new Grid(gameBoard)

grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

setupInput()

function setupInput() {
    window.addEventListener("keydown", handleInput, {once: true})
}

async function handleInput(e) {
    
    if (isGameBoardLocked) {
        return
    }

    switch(e.key) {
        case "ArrowUp":
            await moveUp()
            break
        case "ArrowDown":
            await moveDown()
            break
        case "ArrowLeft":
            await moveLeft()
            break
        case "ArrowRight":
            await moveRight()
            break
        default:
            setupInput()
            return
    }

    grid.mergeTiles()

    if (validMovePlayed) {
        grid.randomEmptyCell().tile = new Tile(gameBoard)
        validMovePlayed = false
        if (grid.hasNoValidMoves()) {
            window.location = '#gameover'
            isGameBoardLocked = true
            return
        }
    }
    
    setupInput()
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(rows => [...rows].reverse()))
}

function slideTiles(cellGroup) {
    return Promise.all(
        cellGroup.flatMap(cells => {
            const promises = []

            for ( let i = 0; i < cells.length; i++ ) {
                let currentCell = cells[i]
                if (currentCell.isEmpty()) {
                    continue
                }
                let lastValidTargetCell
                for (let j = i - 1; j >= 0; j--) {
                    let targetCell = cells[j]
                    if (!targetCell.canAccept(currentCell.tile)) {
                        break
                    }
                    lastValidTargetCell = targetCell
                }

                if (lastValidTargetCell != null) {
                    promises.push(currentCell.tile.waitForTransition())
                    validMovePlayed = true
                    currentCell.merge(lastValidTargetCell)
                }
            }
            return promises
        })
    )
}

function locationHashChanged( e ) {
    if ( location.hash === "" ) {
        grid.reset()
        grid.randomEmptyCell().tile = new Tile(gameBoard)
        grid.randomEmptyCell().tile = new Tile(gameBoard)
        isGameBoardLocked = false
        setupInput()
    }
}

window.onhashchange = locationHashChanged;
