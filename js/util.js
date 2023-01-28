'use strict'

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`);
}

function playSound(fileName, volume = 1, loop = false) {
    var audio = new Audio(`sounds/${fileName}.mp3`)
    audio.loop = loop
    audio.volume = volume
    audio.play()
}

function updateLives() {
    var elLives = document.querySelector('#lives')
    var img = HERO
    for (var i = 1; i < gHero.lives; i++) {
        img += HERO
    }
    elLives.innerHTML = img
    if (gHero.lives === 0) elLives.classList.add('hidden')
    else elLives.classList.remove('hidden')
}

function updateFastLasers() {
    var elFastLasers = document.querySelector('#fast-lasers')
    var img = FAST_LASER
    for (var i = 1; i < gHero.superAttackCount; i++) {
        img += FAST_LASER
    }
    elFastLasers.innerHTML = img
    if (gHero.superAttackCount === 0) elFastLasers.classList.add('hidden')
    else elFastLasers.classList.remove('hidden')
}

function updateScore() {
    var elScore = document.querySelector('#current-score')
    elScore.innerText = gGame.score
}

function updateHighScore() {
    var score = localStorage.score
    var elScore = document.querySelector('#high-score')
    if (score >= 10000) elScore.innerText = '∞'
    else elScore.innerText = score
}

function updateModal(display, msg = 'Press Start to Begin', btn = 'Start') {
    var elModal = document.querySelector('.modal')
    elModal.style.display = display
    var elMsg = document.querySelector('.user-msg')
    elMsg.innerText = msg
    var elBtn = document.querySelector('.restart-btn')
    elBtn.innerText = btn
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is inclusive and the minimum is inclusive
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) { //edge down = rowIdx = BOARD_SIZE[1]-1, edge up = rowIdx = 0, edge left = colIdx = 0, edge right = colIdx = BOARD_SIZE[0]-1
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            else if (board[i][j] === '*') negsCount++
        }
    }
    return negsCount
}