const LASER_SPEED = 80;
var gHero = {
    pos: { i: 12, j: 5 },
    isShoot: false,
    laserInterval: null,
}
// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
}
// Handle game keys
function onKeyDown(ev) {
    switch (ev.key) {
        case 'ArrowLeft':
            if (gHero.pos.j > 0) {
                updateCell(gHero.pos)
                gHero.pos.j--
                updateCell(gHero.pos, HERO)
            }
            break
        case 'ArrowRight':
            if (gHero.pos.j < BOARD_SIZE - 1) {
                updateCell(gHero.pos)
                gHero.pos.j++
                updateCell(gHero.pos, HERO)
            }
            break
        case ' ':
            if (!gHero.isShoot) {
                gHero.isShoot = true
                shoot()
            }
            break
    }
}
// Move the hero right (1) or left (-1)
function moveHero(dir) { //?

}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    playSound('shoot')
    var pos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    blinkLaser(pos)
    gHero.laserInterval = setInterval(() => {
        pos = { i: pos.i - 1, j: pos.j }
        if (pos.i < 0) {
            gHero.isShoot = false
            clearInterval(gHero.laserInterval)
            return
        }
        var currCell = gBoard[pos.i][pos.j]
        if (currCell.gameObject === ALIEN) {
            updateCell(pos)
            gHero.isShoot = false
            clearInterval(gHero.laserInterval)
            gGame.score += 10
            updateScore()
            playSound('kill')
            gGame.aliensCount--
            if (gGame.aliensCount === 0) gameFinish(true)
        } else {
            blinkLaser(pos)
        }
    }, 37);
}
// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    updateCell(pos, LASER)
    setTimeout(() => {
        updateCell(pos)
    }, 37);
}