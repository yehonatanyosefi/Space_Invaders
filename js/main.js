'use strict'
const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = `<img src="img/player.png">` //♆
const SKY = ' '
const ALIEN = '<img src="img/baddie2.png">' //👽
const LASER = '<img src="img/laser.png">' //⤊
// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard
var gGame
var isBgMusic = false
// const gLevel = { DIFFICULTY: 0, }
function init() {
    setGlobals()
    updateGlobals()
    gBoard = createBoard()
    createAliens(gBoard)
    createHero(gBoard)
    renderBoard(gBoard)
    if (isBgMusic === false) {
        playSound('bg_music', 0.25, true)
        isBgMusic = true
    }
}

function setGlobals() {
    gGame = {
        isOn: false,
        aliensCount: 0,
        score: 0,
    }
}

function updateGlobals() {
    updateScore()
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
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
            else var innerText = cell.type

            strHTML += `<td class="${className}" data-i='${i}' data-j='${j}'>${innerText}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.container')
    elContainer.innerHTML = strHTML
}
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject,
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject;
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || '';
}

function gameFinish(isWin) {
    // gGame.isOn = false
    
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
    var elMsg = document.querySelector('.user-msg span')
    if (!isWin) {
        elMsg.innerText = 'lost. Try again!'
        playSound('game_lose')
    } else {
        elMsg.innerText = 'won!'
        playSound('game_win')
    }
}