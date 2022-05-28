const ALIEN_SPEED = 500;
const LIVES = '❤️';
var gIntervalAliens;
var gTotalAliens = 0;
var gAlienLaserInterval;

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx;
var gAliensBottomRowIdx;
/////////////////////////////
var gIsAlienFreeze;
var gIsFirstMove;
var gShiftedDown;
var gWasRight;
var gCurrentI;
var gIsAlienLaserFinish;
var gAlienIsShoot = false;

function createAliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            if (i === 0) {
                board[i][j].gameObject = ALIEN1;
            } else if (i === 1) {
                board[i][j].gameObject = ALIEN2;
            } else if (i === 2) {
                board[i][j].gameObject = ALIEN3;
            }
            gTotalAliens++;
        }
    }
    // console.log(gTotalAliens);
}

function handleAlienHit(pos) {}

// Sets an interval for shutting (blinking) the laser up towards Hero
function alienShoot() {
    var laserPos = getRandAlienPos(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
    // console.log(laserPos);

    // updateCell(laserPos, laser);
    var laserNextPos = blinkAlienLaser(laserPos, ALIEN_LASER);
    gAlienLaserInterval = setInterval(() => {
        laserNextPos = blinkAlienLaser(laserNextPos, ALIEN_LASER);
    }, 400);
}

function getRandAlienPos(fromI, toI) {
    var aliensPos = [];
    gAliensTopRowIdx = gCurrentI;
    gAliensBottomRowIdx = gCurrentI + ALIENS_ROW_COUNT - 1;
    // console.log(gAliensBottomRowIdx);
    // for (var i = 0; i < gAliensBottomRowIdx; i++) {
    for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
        if (
            gBoard[gAliensBottomRowIdx][j].gameObject === ALIEN1 ||
            gBoard[gAliensBottomRowIdx][j].gameObject === ALIEN2 ||
            gBoard[gAliensBottomRowIdx][j].gameObject === ALIEN3
        ) {
            // console.log('13113131313');
            aliensPos.push({ i: gAliensBottomRowIdx + 1, j });
        }
    }
    // }
    var alienPos = aliensPos[getRandomInt(0, aliensPos.length - 1)];
    // console.log(alienPos);
    // console.log(aliensPos);
    return alienPos;
}

// renders a LASER at specific cell for short time and removes it
function blinkAlienLaser(pos, laser) {
    var currentPos = pos;
    if (gIsAlienLaserFinish) {
        updateCell(currentPos, EMPTY);
        clearInterval(laserInterval);
        // gHero.isShoot = false;/////change to aliens
        gIsAlienLaserFinish = false;
        return;
    }
    // console.log(pos);
    var nextPos = {
        i: currentPos.i + 1,
        j: currentPos.j,
    };
    // if (nextPos.type === EARTH) {
    //     updateCell(currentPos, EMPTY);
    //     return;
    var nextCell = gBoard[nextPos.i][nextPos.j].gameObject;
    console.log(nextCell);
    if (nextCell === getHeroHTML()) {
        console.log('hero');
        // var elLives = document.querySelector('lives');
        gHero.lives--;
        setLivesLeft();
        clearInterval(gAlienLaserInterval);
        updateCell(currentPos, EMPTY);
        console.log(gHero.lives);
        gIsAlienLaserFinish = true;
        if (gHero.lives === 0) gameOver();
        return;
    } else if (nextPos.i === gBoard.length - 1) {
        updateCell(currentPos, EMPTY);
        gIsAlienLaserFinish = true;
        clearInterval(gAlienLaserInterval);
        return;
    }

    updateCell(currentPos, EMPTY);
    updateCell(nextPos, laser);

    currentPos = nextPos;
    return currentPos;
}
function setLivesLeft() {
    var elLives = document.querySelector('.lives');
    strHTML = '';
    for (var i = 0; i < gHero.lives; i++) {
        strHTML += LIVES;
    }
    elLives.innerHTML = strHTML;
}

function shiftBoardRight(fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = gBoard[i].length - 1; j > 0; j--) {
            gBoard[i][j].gameObject = gBoard[i][j - 1].gameObject;
            if (i === gHero.pos.i && j === gHero.pos.j) gameOver();
        }
        gBoard[i][0].gameObject = EMPTY;
    }
}

function shiftBoardLeft(fromI, toI) {
    for (var i = fromI; i < toI; i++) {
        for (var j = 0; j < gBoard[i].length - 1; j++) {
            gBoard[i][j].gameObject = gBoard[i][j + 1].gameObject;
            if (i === gHero.pos.i && j === gHero.pos.j) gameOver();
        }
        gBoard[i][gBoard[i].length - 1].gameObject = EMPTY;
    }
}

function shiftBoardDown(fromI, toI) {
    for (var i = toI; i >= fromI; i--) {
        for (var j = getAlienStartPos(); j <= getAlienEndPos(); j++) {
            gBoard[i + 1][j].gameObject = gBoard[i][j].gameObject;
        }
    }
    for (var j = getAlienStartPos(); j <= getAlienEndPos(); j++) {
        gBoard[fromI][j].gameObject = EMPTY;
    }

    gCurrentI++;
}

function getAlienEndPos() {
    var endPos = -1;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (
                gBoard[i][j].gameObject === ALIEN1 ||
                gBoard[i][j].gameObject === ALIEN2 ||
                gBoard[i][j].gameObject === ALIEN3
            ) {
                if (endPos < j) endPos = j;
            }
        }
    }
    return endPos;
}

function getAlienStartPos() {
    var startPos = gBoard.length;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (
                gBoard[i][j].gameObject === ALIEN1 ||
                gBoard[i][j].gameObject === ALIEN2 ||
                gBoard[i][j].gameObject === ALIEN3
            ) {
                if (startPos > j) startPos = j;
            }
        }
    }
    return startPos;
}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    if (gIsAlienFreeze) return;
    if (gWasRight && getAlienEndPos() !== gBoard.length - 1) {
        // console.log('Right');
        shiftBoardRight(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        renderBoard(gBoard);
        // if (getAlienEndPos() === gBoard.length - 1 && gWasRight) {
        //     renderBoard(gBoard);
        //     shiftBoardDown(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        //     gWasRight = !gWasRight;
        // }
    } else if (!gWasRight && getAlienStartPos() !== 0) {
        // console.log('Left');
        shiftBoardLeft(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        renderBoard(gBoard);

        // if (getAlienStartPos() === 0 && !gWasRight) {
        //     renderBoard(gBoard);
        //     shiftBoardDown(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        //     gWasRight = !gWasRight;
        // }
    } else if (getAlienEndPos() === gBoard.length - 1 || getAlienStartPos() === 0) {
        // renderBoard(gBoard);
        shiftBoardDown(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        gWasRight = !gWasRight;
        renderBoard(gBoard);
    }
}

function pauseOnOf(el) {
    el.blur();
    gIsAlienFreeze = !gIsAlienFreeze;
}

// function getAliensHTML() {
//     return `<span class="hero" >${ALIEN}</span>`;
// }
