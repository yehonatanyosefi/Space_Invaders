const ALIEN_SPEED = 500;
var gIntervalAliens;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx = 1;
var gAliensBottomRowIdx = 13;
var gIsAlienFreeze = false;
var gAlienMoveInterval
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

function shiftBoardSide(board, fromI, toI, dir) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j < 14; j++) {
            var currCell = board[i][j]
            if (currCell.gameObject === LASER) {
                currCell.gameObject = SKY
            } else if (currCell.gameObject === SKY) return
            // if ()
            currCell.gameObject = null
            board[i + dir][j].gameObject = ALIEN
        }
    }
    renderBoard(gBoard)
}

function shiftBoardDown(board, fromI, toI) {

}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (gIsAlienFreeze) return
    gAlienMoveInterval = setInterval(() => {
        switch (moveDir) {
            case 1:
                shiftBoardSide(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx, 1) //right
                break
            case 2:
                shiftBoardSide(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx, -1) //left
                break
            case 3:
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx) //bottom
                break
        }
    }, 1000);
}