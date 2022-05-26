const ALIEN_SPEED = 500;
var gIntervalAliens;
var gTotalAliens = 0;

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

function createAliens(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            if (i < ALIENS_ROW_COUNT) {
                board[i][j].gameObject = ALIEN;
                gTotalAliens++;
            }
        }
    }
    // console.log(gTotalAliens);
}

function handleAlienHit(pos) {}

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
            if (gBoard[i][j].gameObject === ALIEN) {
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
            if (gBoard[i][j].gameObject === ALIEN) {
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
    if (gWasRight) {
        console.log('Right');
        shiftBoardRight(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        if (getAlienEndPos() === gBoard.length - 1 && gWasRight) {
            renderBoard(gBoard);
            shiftBoardDown(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
            gWasRight = !gWasRight;
        }
    } else if (!gWasRight) {
        console.log('Left');
        shiftBoardLeft(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
        if (getAlienStartPos() === 0 && !gWasRight) {
            renderBoard(gBoard);
            shiftBoardDown(gCurrentI, gCurrentI + ALIENS_ROW_COUNT);
            gWasRight = !gWasRight;
        }
    }
    renderBoard(gBoard);

    // if (
    //     (getAlienEndPos() === gBoard.length - 1 && shiftedDown) ||
    //     (getAlienStartPos() === 0 && !isFirstMove && shiftedDown)
    // ) {
    //     console.log('Down');
    //     shiftBoardDown(currentI, currentI + ALIENS_ROW_COUNT);
    //     shiftedDown = !shiftedDown;
    // } else if (wasRight && !shiftedDown) {
    //     console.log('Right');
    //     shiftBoardRight(currentI, currentI + ALIENS_ROW_COUNT);
    //     if (getAlienEndPos() === gBoard.length - 1) {
    //         wasRight = !wasRight;
    //         shiftedDown = !shiftedDown;
    //         shiftBoardDown(currentI, currentI + ALIENS_ROW_COUNT);

    //     }
    // } else if (!wasRight && !shiftedDown) {
    //     console.log('Left');
    //     shiftBoardLeft(currentI, currentI + ALIENS_ROW_COUNT);
    //     if (getAlienStartPos() === 0) {
    //         console.log('chif');
    //         wasRight = !wasRight;
    //         shiftedDown = !shiftedDown;
    //         shiftBoardDown(currentI, currentI + ALIENS_ROW_COUNT);

    //     }
    // }
    // renderBoard(gBoard);
}

function pauseOnOf() {
    gIsAlienFreeze = !gIsAlienFreeze;
}

// function getAliensHTML() {
//     return `<span class="hero" >${ALIEN}</span>`;
// }
