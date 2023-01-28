const ALIEN_SPEED = 997;
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row

var gAlien
function createAliens(board) {
    for (var i = gAlien.topRowIdx; i < ALIENS_ROW_COUNT + gAlien.topRowIdx; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            var species
            switch (i) {
                case 1:
                    species = ALIEN1
                    break
                case 2:
                    species = ALIEN2
                    break
                case 3:
                case 4:
                    species = ALIEN3
                    break
            }
            board[i][j] = createCell(ALIEN, species)
            gGame.aliensCount++
        }
    }
}

function killAlien(pos) {
    switch (gBoard[pos.i][pos.j].gameObject) {
        case ALIEN1:
            gGame.score += 20
            break
        case ALIEN2:
            gGame.score += 15
            break
        case ALIEN3:
            gGame.score += 10
            break
    }
    updateCell(pos)
    updateScore()
    playSound('kill')
    gGame.aliensCount--
    if (gGame.aliensCount === 0) gameFinish(true)
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (!gGame.isOn) return
    if (gAlien.isFrozen) return
    gAlien.speedInterval = setInterval(() => {
        if (gAlien.isFrozen) return
        if (gAlien.moveCount >= 0 && gAlien.moveCount < 6) {
            shiftBoardRight(gBoard, gAlien.topRowIdx, gAlien.bottomRowIdx) //right
            gAlien.moveCount++
        } else if (gAlien.moveCount === 6) {
            shiftBoardDown(gBoard, gAlien.bottomRowIdx, gAlien.topRowIdx) //down
            gAlien.moveCount++
        } else if (gAlien.moveCount > 6 && gAlien.moveCount <= 12) {
            shiftBoardLeft(gBoard, gAlien.topRowIdx, gAlien.bottomRowIdx) //left
            gAlien.moveCount++
        } else {
            shiftBoardDown(gBoard, gAlien.bottomRowIdx, gAlien.topRowIdx) //down
            gAlien.moveCount = 0
        }
    }, ALIEN_SPEED);
}
function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = BOARD_SIZE-1; j >= 0; j--) {
            var currPos = { i: i, j: j }
            var nextPos = { i: i, j: j + 1 }
            var currCell =  gBoard[currPos.i][currPos.j]
            var nextCell = gBoard[nextPos.i][nextPos.j]
            if (currCell.type !== ALIEN) continue
            if (nextCell.type === LASER) {
                updateCell(currPos)
                updateCell(nextPos, ALIEN, species)
                killAlien(nextPos)
                continue
            } else if (nextCell.type === ROCK) removeRock(nextPos)
            else if (nextCell.type === BUNKER) removeBunker(nextPos)
            var species = gBoard[i][j].gameObject
            updateCell(currPos)
            updateCell(nextPos, ALIEN, species)
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j <= BOARD_SIZE-1; j++) {
            var currPos = { i, j }
            var nextPos = { i: i, j: j - 1 }
            var currCell =  gBoard[currPos.i][currPos.j]
            var nextCell = gBoard[nextPos.i][nextPos.j]
            if (currCell.type !== ALIEN) continue
            if (nextCell.type === LASER) {
                updateCell(currPos)
                updateCell(nextPos, ALIEN, species)
                killAlien(nextPos)
                continue
            } else if (nextCell.type === ROCK) removeRock(nextPos)
            else if (nextCell.type === BUNKER) removeBunker(nextPos)
            var species = gBoard[i][j].gameObject
            updateCell(currPos)
            updateCell(nextPos, ALIEN, species)
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 0; j <= BOARD_SIZE-1; j++) {
            var currPos = { i, j }
            var nextPos = { i: i + 1, j }
            var currCell =  gBoard[currPos.i][currPos.j]
            var nextCell = gBoard[nextPos.i][nextPos.j]
            if (currCell.type !== ALIEN) continue
            if (nextCell.type === LASER) {
                updateCell(currPos)
                updateCell(nextPos, ALIEN, species)
                killAlien(nextPos)
                continue
            } else if (nextCell.type === ROCK) removeRock(nextPos)
            if (nextCell.type === BUNKER) removeBunker(nextPos)
            var species = gBoard[i][j].gameObject
            updateCell(currPos)
            updateCell(nextPos, ALIEN, species)
            if (gAlien.lastRow < i + 1) gAlien.lastRow = i + 1
        }
    }
    gAlien.topRowIdx++
    if (gAlien.lastRow === gAlien.bottomRowIdx) gameFinish(false)
}

function throwRock() {
    if (gAlien.isFrozen || gAlien.isThrowingRock || Math.random() > 0.4) return
    var alienArr = []
    for (var j = 0; j <= 13; j++) {
        var i = gAlien.lastRow
        if (gBoard[i][j].type === ALIEN) {
            var currPos = { i, j }
            alienArr.push(currPos)
        }
    }
    if (!alienArr[0]) {
        gAlien.lastRow--
        throwRock()
        return
    }
    var alienIdx = getRandomInt(0, alienArr.length)
    var currPos = alienArr[alienIdx]
    var nextPos = { i: currPos.i + 1, j: currPos.j }
    gAlien.isThrowingRock = true
    createRock(nextPos)
}

function createRock(pos, oldPos = null) {
    if (!gAlien.isThrowingRock) return
    if (oldPos && oldPos.i === 13) {
        updateCell(oldPos)
        gAlien.isThrowingRock = false
        return
    }
    var currCell = gBoard[pos.i][pos.j]
    if (oldPos && gBoard[oldPos.i][oldPos.j].type === ROCK) updateCell(oldPos)
    if (currCell.type === HERO) {
        removeLife()
        gAlien.isThrowingRock = false
    } else if (currCell.type === LASER) {
        gAlien.isThrowingRock = false
        removeLaser()
    } else if (currCell.type === BUNKER) {
        gAlien.isThrowingRock = false
        removeBunker(pos)
    } else if (currCell.type === ALIEN) {
        gAlien.isThrowingRock = false
        return
    } else {
        updateCell(pos, ROCK, ROCK)
        var nextPos = { i: pos.i + 1, j: pos.j }
        setTimeout(() => {
            createRock(nextPos, pos)
        }, 150)
    }
}

function removeRock(pos) {
    updateCell(pos)
    gAlien.isThrowingRock = false
}





//failed experiment
// function findHighestNumberObject(obj) {
    //     let highestNum = 0
    //     let highestNumKey = ''
    //     for (let key in obj) {
    //       if (obj[key] > highestNum) {
    //         highestNum = obj[key]
    //         highestNumKey = key
    //       }
    //     }
    //     return parseInt(highestNumKey)
    //   }
    // function moveAliens() {
    //     if (!gGame.isOn) return
    //     if (gAlien.isFrozen) return
    //     gAlien.speedInterval = setInterval(() => {
    //         if (gAlien.isFrozen) return
    //         console.log('gAlien.rowMovedCount',gAlien.rowMovedCount)
    //         var lowestMovedIdx = findHighestNumberObject(gAlien.rowMovedCount)
    //         console.log('lowestMoveIdx',lowestMovedIdx)
    //         console.log('count',gAlien.rowMovedCount[lowestMovedIdx])
    //         moveRow(lowestMovedIdx)
    //     }, ALIEN_SPEED);
    // }
    // function moveRow(rowIdx) {
    //     if (gAlien.rowMovedCount[rowIdx] >= 0 && gAlien.rowMovedCount[rowIdx] < 6) {
    //         shiftRowRight(gBoard, gAlien.topRowIdx, gAlien.bottomRowIdx, rowIdx) //right
    //         gAlien.rowMovedCount[rowIdx]++
    //         console.log('count after ',gAlien.rowMovedCount[rowIdx])
    //     } else if (gAlien.rowMovedCount[rowIdx] === 6) {
    //         shiftRowDown(gBoard, gAlien.bottomRowIdx, gAlien.topRowIdx, rowIdx) //down
    //         gAlien.rowMovedCount[rowIdx]++
    //     } else if (gAlien.rowMovedCount[rowIdx] > 6 && gAlien.rowMovedCount[rowIdx] <= 12) {
    //         shiftRowLeft(gBoard, gAlien.topRowIdx, gAlien.bottomRowIdx, rowIdx) //left
    //         gAlien.rowMovedCount[rowIdx]++
    //     } else {
    //         shiftRowDown(gBoard, gAlien.bottomRowIdx, gAlien.topRowIdx, rowIdx) //down
    //         gAlien.rowMovedCount[rowIdx] = 0
    //     }
    // }
    
    // function shiftRowRight(board, fromI, toI, rowIdx) {
    //     var currRow = gAlien.lastRow - rowIdx + ALIENS_ROW_COUNT - 1
    //     for (var j = BOARD_SIZE - 1; j >= 0; j--) {
    //         var currPos = { i: currRow, j: j }
    //         var nextPos = { i: currRow, j: j + 1 }
    //         var currCell = gBoard[currPos.i][currPos.j]
    //         var nextCell = gBoard[nextPos.i][nextPos.j]
    //         if (currCell.type !== ALIEN) continue
    //         if (nextCell.type === LASER) {
    //             updateCell(currPos)
    //             updateCell(nextPos, ALIEN, species)
    //             killAlien(nextPos)
    //             continue
    //         } else if (nextCell.type === ROCK) removeRock(nextPos)
    //         else if (nextCell.type === BUNKER) removeBunker(nextPos)
    //         var species = gBoard[currRow][j].gameObject
    //         updateCell(currPos)
    //         updateCell(nextPos, ALIEN, species)
    //     }
    // }
    
    // function shiftRowLeft(board, fromI, toI, rowIdx) {
    //     var currRow = gAlien.lastRow - rowIdx + ALIENS_ROW_COUNT - 1
    //     for (var j = 0; j <= BOARD_SIZE - 1; j++) {
    //         var currPos = { i:currRow, j }
    //         var nextPos = { i: currRow, j: j - 1 }
    //         var currCell = gBoard[currPos.i][currPos.j]
    //         var nextCell = gBoard[nextPos.i][nextPos.j]
    //         if (currCell.type !== ALIEN) continue
    //         if (nextCell.type === LASER) {
    //             updateCell(currPos)
    //             updateCell(nextPos, ALIEN, species)
    //             killAlien(nextPos)
    //             continue
    //         } else if (nextCell.type === ROCK) removeRock(nextPos)
    //         else if (nextCell.type === BUNKER) removeBunker(nextPos)
    //         var species = gBoard[currRow][j].gameObject
    //         updateCell(currPos)
    //         updateCell(nextPos, ALIEN, species)
    //     }
    // }
    
    // function shiftRowDown(board, fromI, toI, rowIdx) {
    //     var currRow = gAlien.lastRow - rowIdx + ALIENS_ROW_COUNT - 1
    //     for (var j = 0; j <= BOARD_SIZE - 1; j++) {
    //         var currPos = { i:currRow, j }
    //         var nextPos = { i: currRow + 1, j }
    //         var currCell = gBoard[currPos.i][currPos.j]
    //         var nextCell = gBoard[nextPos.i][nextPos.j]
    //         if (currCell.type !== ALIEN) continue
    //         if (nextCell.type === LASER) {
    //             updateCell(currPos)
    //             updateCell(nextPos, ALIEN, species)
    //             killAlien(nextPos)
    //             continue
    //         } else if (nextCell.type === ROCK) removeRock(nextPos)
    //         if (nextCell.type === BUNKER) removeBunker(nextPos)
    //         var species = gBoard[currRow][j].gameObject
    //         updateCell(currPos)
    //         updateCell(nextPos, ALIEN, species)
    //         if (gAlien.lastRow < currRow + 1) gAlien.lastRow = currRow + 1
    //     }
    //     gAlien.topRowIdx++
    //     if (gAlien.lastRow === gAlien.bottomRowIdx) gameFinish(false)
    // }