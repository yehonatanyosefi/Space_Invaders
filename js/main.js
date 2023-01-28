'use strict'
const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 4
const SKY = ' '
const HERO = `<img src="img/player.png">` //♆
const LASER = '<img src="img/laser.png">' //⤊
const FAST_LASER = '<img src="img/fast_laser.png">'
const ALIEN = '<img src="img/baddie1.png">' //👽
const ALIEN1 = '<img src="img/baddie1.png">'
const ALIEN2 = '<img src="img/baddie2.png">'
const ALIEN3 = '<img src="img/baddie3.png">'
const CANDY = '<img src="img/candy.png">'
const ROCK = '<img src="img/rock.png">'
const BUNKER = '<img src="img/bunker.png">'
var gBoard
var gGame
var isBgMusic = false
// Aliens Variety - V
// Super mode 'x' - V
// Space candies - V
// Aliens Freeze - V
// Aliens Shoot - V
// Lives - V
// Bunkers - V
// Mine:
// Highscores - V
// Aiens Scoring Individually - V
// Aliens Move By Row - each row will move individually at an interval - couldn't make it bug free :(
function init() {
    setGlobals()
    updateGlobals()
    gBoard = createBoard()
    createAliens(gBoard)
    createBunkers(gBoard)
    createHero(gBoard)
    renderBoard(gBoard)
}
function gameStart() {
    gGame.isOn = true
    moveAliens()
    gGame.candyInterval = setInterval(createCandy, 10000)
    gAlien.rockInterval = setInterval(throwRock, 727)
}

function setGlobals() {
    gGame = {
        isOn: false,
        aliensCount: 0,
        score: 0,
        candyInterval: null,
        isCandy: false,
    }
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        laserInterval: null,
        superAttackCount: 3,
        superOn: false,
        laserSpeed: 80,
        laserPos: {},
        isLaser: false,
        lives: 3,
    }
    gAlien = {
        speedInterval: null,
        topRowIdx: 1,
        bottomRowIdx: 12,
        isFrozen: false,
        moveCount: 0,
        lastRow: ALIENS_ROW_COUNT,
        isThrowingRock: false,
        rowMovedCount: createRows(),
    }
    if (!localStorage.score) localStorage.score = 0
}

function createRows() {
    var rowObj = {}
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        rowObj[i] = 0
    }
    return rowObj
}

function updateGlobals() {
    updateScore()
    updateHighScore()
    updateFastLasers()
    updateLives()
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    const size = BOARD_SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    return board
}
// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var className = `cell`
            const cell = board[i][j]
            if (cell.gameObject) var innerText = cell.gameObject
            else var innerText = ' '

            strHTML += `<td class="${className}" data-i='${i}' data-j='${j}'>${innerText}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.container')
    elContainer.innerHTML = strHTML
}
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(type = SKY, gameObject = SKY) {
    return {
        type: type,
        gameObject: gameObject,
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, type = SKY, gameObject = SKY) {
    const currCell = gBoard[pos.i][pos.j]
    currCell.type = type
    currCell.gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || '';
}

function gameFinish(isWin) {
    gGame.isOn = false
    clearInterval(gAlien.speedInterval)
    clearInterval(gGame.laserInterval)
    gGame.isCandy = true
    clearInterval(gGame.candyInterval)
    clearInterval(gAlien.rockInterval)
    if (gGame.score > localStorage.score) {
        localStorage.score = gGame.score
        updateHighScore()
    }
    if (!isWin) {
        updateModal('block', 'You lost. Try again!', 'restart')
        playSound('game_over')
        clearInterval(gAlien.speedInterval)
    } else {
        updateModal('block', 'You won!', 'restart')
        playSound('game_win')
    }
}

function onStart() {
    updateModal('none')
    playSound('click_button')
    if (isBgMusic === false) {
        playSound('bg_music', 0.6, true)
        isBgMusic = true
    }
    init()
    gameStart()
}

function createCandy() {
    var pos = {i:0,j:getRandomInt(0, BOARD_SIZE-1)}
    updateCell(pos, CANDY, CANDY)
    gGame.isCandy = true
    setTimeout(() => {
        if (gGame.isCandy) {
            updateCell(pos)
            gGame.isCandy = false
        }
    }, 5000);
}

function collectCandy(pos) {
    gGame.isCandy = false
    updateCell(pos)
    gGame.score += 50
    updateScore()
    playSound('candy')
    gAlien.isFrozen = true
    setTimeout(() => {
        gAlien.isFrozen = false
    }, 5000);
}

function createBunkers(board) {
    for (var i = gAlien.lastRow+4; i < gAlien.bottomRowIdx-1; i++) {
        for (var j = 0; j < BOARD_SIZE-1; j++) {
            if (j % 4 === 0) continue
            if (j % 2 === 0 && i !== gAlien.lastRow+4) continue
            board[i][j] = createCell(BUNKER, BUNKER)
        }
    }
}


function removeBunker(pos) {
    updateCell(pos)
}