const ALIEN_SPEED = 500;
var gIntervalAliens;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx = 1;
var gAliensBottomRowIdx;
var gIsAlienFreeze = true;
function createAliens(board) {
    for (var i = gAliensTopRowIdx; i < ALIENS_ROW_COUNT+gAliensTopRowIdx; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j] = createCell(ALIEN)
            gGame.aliensCount++
        }
    }

}

function handleAlienHit(pos) {

}

function shiftBoardRight(board, fromI, toI) {

}

function shiftBoardLeft(board, fromI, toI) {

}

function shiftBoardDown(board, fromI, toI) {

}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {

}