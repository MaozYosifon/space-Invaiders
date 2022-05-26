const LASER_SPEED = 80;
var laserInterval;
var gHero;
var gIsFinish = false;

// creates the hero and place it on board
function createHero(board) {
    gHero = { pos: { i: 12, j: 5 }, isShoot: false, isSuper: false, isShielded: false, superCount: 3, shieldsCount: 3 };
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO;
}

// Handle game keys
function onKeyDown(ev) {
    moveHero(ev);
    if (ev.code === 'Space') {
        // console.log(ev);
        shoot(LASER);
    } else if (ev.code === 'KeyN') {
        shoot(LASER_N);
    } else if (ev.code === 'KeyX') {
        if (!gHero.superCount) return;
        gHero.isSuper = true;
        console.log(gHero.isSuper);
        gHero.superCount--;
        shoot(LASER_X);
        console.log(gHero.isSuper);
        gHero.isSuper = false;
        console.log(gHero.isSuper);
    } else if (ev.code === 'KeyZ') {
        if (gHero.isShielded) return;
        shieldActive();
    }
    // console.log(ev);
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
    if (!gGame.isOn) return;
    // console.log('ev', ev);
    var nextLocation = getNextLocation(dir);

    if (!nextLocation) return;
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j];
    // console.log('NEXT CELL', nextCell);

    if (nextCell === undefined) return;

    // update the model
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = EMPTY;

    // update the dom
    updateCell(gHero.pos, EMPTY);

    gHero.pos = nextLocation;

    // update the model
    gBoard[gHero.pos.i][gHero.pos.j].gameObject = gHero.isShielded ? SHIELD : HERO;
    // update the dom
    updateCell(gHero.pos, getHeroHTML());
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot(laser) {
    // if (!gHero.isSuper) {
    if (gHero.isShoot) return;
    // }
    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j };

    // updateCell(laserPos, laser);
    if (!gHero.isSuper) {
        gHero.isShoot = true;
    }
    var laserNextPos = blinkLaser(laserPos, laser);
    laserInterval = setInterval(
        () => {
            laserNextPos = blinkLaser(laserNextPos, laser);
            // if (isFinish) clearInterval(laserInterval);
        },
        gHero.isSuper ? 50 : LASER_SPEED
    );
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos, laser) {
    var currentPos = pos;
    if (gIsFinish) {
        updateCell(currentPos, EMPTY);
        clearInterval(laserInterval);
        gHero.isShoot = false;
        gIsFinish = false;
        return;
    }
    nextPos = {
        i: currentPos.i - 1,
        j: currentPos.j,
    };

    var nextCell = gBoard[nextPos.i][nextPos.j].gameObject;
    // if (nextCell.gameObject === SHIELD) return;
    updateCell(currentPos, EMPTY);
    updateCell(nextPos, LASER);

    if (nextPos.i === 0 || nextCell === ALIEN || nextCell === CANDY) {
        if (nextCell === CANDY) {
            updateScore(50);
            gIsAlienFreeze = true;
            setTimeout(() => {
                gIsAlienFreeze = false;
            }, 5000);
        } else if (nextCell === ALIEN && laser === LASER) {
            --gTotalAliens;
            updateScore(10);
        } else if (nextCell === ALIEN && laser === LASER_N) {
            var negsLoc = countNegsAround(gBoard, nextPos.i, nextPos.j);
            for (var i = 0; i < negsLoc.length; i++) {
                updateCell(negsLoc[i], EMPTY);
                --gTotalAliens;
                updateScore(10);
            }
            --gTotalAliens;
        } else if (nextCell === ALIEN && laser === LASER_X) {
            --gTotalAliens;
            updateScore(10);
        }
        gIsFinish = true;
        if (gTotalAliens === 0) gameOver(true);
    }
    currentPos = nextPos;
    return currentPos;
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gHero.pos.i,
        j: gHero.pos.j,
    };
    switch (eventKeyboard.code) {
        case 'ArrowLeft':
            console.log('left');
            nextLocation.j--;
            break;
        case 'ArrowRight':
            console.log('right');
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}

function getHeroHTML() {
    return `<span class="hero" >${gHero.isShielded ? SHIELD : HERO}</span>`;
}

function countNegsAround(mat, rowIdx, colIdx) {
    var negsLoc = [];
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = gBoard[i][j].gameObject;
            if (currCell === ALIEN) {
                console.log('asd');
                negsLoc.push({ i, j });
            }
        }
    }
    return negsLoc;
    return count;
}

function shieldActive() {
    if (!gHero.shieldsCount) return;
    gHero.isShielded = true;
    gHero.shieldsCount--;

    updateCell(gHero.pos, getHeroHTML());
    setTimeout(() => {
        gHero.isShielded = false;
        updateCell(gHero.pos, getHeroHTML());
    }, 3000);
}
