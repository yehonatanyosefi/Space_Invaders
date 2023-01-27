const ALIEN_SPEED = 500;
var gIntervalAliens;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx = 12
var gIsAlienFreeze = false
var gAlienMoveCount
var gLastAlienRow
function createAliens(board) {
    for (var i = gAliensTopRowIdx; i < ALIENS_ROW_COUNT + gAliensTopRowIdx; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j] = createCell(ALIEN)
            gGame.aliensCount++
        }
    }

}

function handleAlienHit(pos) {

}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 13; j >= 0; j--) {
            var currCell = board[i][j]
            var nextCell = board[i][j+1]
            if (checkIfNotAlien(currCell)) continue
            if (nextCell.gameObject === LASER) {
                currCell.gameObject = SKY
                nextCell.gameObject = SKY
                handleHit()
                continue
            }
            currCell.gameObject = null
            nextCell.gameObject = ALIEN
        }
    }
    renderBoard(gBoard)
}
function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j <= 13; j++) {
            var currCell = board[i][j]
            var nextCell = board[i][j-1]
            if (checkIfNotAlien(currCell)) continue
            if (nextCell.gameObject === LASER) {
                currCell.gameObject = SKY
                nextCell.gameObject = SKY
                handleHit()
                continue
            }
            currCell.gameObject = null
            nextCell.gameObject = ALIEN
        }
    }
    renderBoard(gBoard)
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 0; j <= 13; j++) {
            var currCell = board[i][j]
            var nextCell = board[i+1][j]
            if (checkIfNotAlien(currCell)) continue
            if (nextCell.gameObject === LASER) {
                currCell.gameObject = SKY
                nextCell.gameObject = SKY
                handleHit()
                continue
            }
            if (gLastAlienRow < i+1) gLastAlienRow = i+1
            currCell.gameObject = null
            nextCell.gameObject = ALIEN
        }
    }
    renderBoard(gBoard)
    gAliensTopRowIdx++
    if (gLastAlienRow === gAliensBottomRowIdx) gameFinish(false)
}

function checkIfNotAlien(currCell) {
    return (!currCell.gameObject || currCell.gameObject === SKY || currCell.gameObject === LASER || currCell.gameObject === HERO)
}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (!gGame.isOn) return
    if (gIsAlienFreeze) return
    gIntervalAliens = setInterval(() => {
        if (gAlienMoveCount >= 0 && gAlienMoveCount < 6) {
            shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx) //right
            gAlienMoveCount++
        } else if (gAlienMoveCount === 6) {
            shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx) //bottom
            gAlienMoveCount++
        } else if (gAlienMoveCount > 6 && gAlienMoveCount <= 12) {
            shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx) //left
            gAlienMoveCount++
        } else {
            shiftBoardDown(gBoard, gAliensBottomRowIdx, gAliensTopRowIdx) //bottom
            gAlienMoveCount = 0
        }
    }, 500);
}