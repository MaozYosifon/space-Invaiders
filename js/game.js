const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8;
const ALIENS_ROW_COUNT = 3;
const HERO = '🛸';
const ALIEN = '👽';
const LASER = '⤊';
const LASER_X = '^';
const LASER_N = '#';
const CANDY = '🍭';
const EMPTY = ' ';
const onEarth = '🌲';
const SKY = 'SKY';
const EARTH = 'EARTH';
const SHIELD = '🤖';
const BUNKER = '🛡';

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gCandyInterval;

var gGame = {
    isOn: false,
    aliensCount: 0,
};

// Called when game loads
function init() {
    var gElRestartBtn = document.querySelector('.restart');
    gElRestartBtn.style.display = 'none';
}

function startReset() {
    gBoard = createBoard();
    createHero(gBoard);
    console.log(gBoard);
    clearInterval(gIntervalAliens);
    createAliens(gBoard);
    // gTotalAliens = 0;
    gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED);
    gCandyInterval = setInterval(addCandy, 10000);
    gIsAlienFreeze = false;
    gIsFirstMove = true;
    gShiftedDown = false;
    gWasRight = true;
    gCurrentI = 0;
    var elBoard = document.querySelector('.board');
    elBoard.style.display = 'block';
    var gElRestartBtn = document.querySelector('.restart');
    gElRestartBtn.style.display = 'none';
    gGame.aliensCount = 0;
    document.querySelector('h2 span').innerText = gGame.aliensCount;
    gGame.isOn = true;
    renderBoard(gBoard);
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    var board = [];
    for (var i = 0; i < BOARD_SIZE; i++) {
        board.push([]);
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = createCell(EMPTY);
            if (i === BOARD_SIZE - 1) {
                board[i][j].type = EARTH;
            }
        }
    }
    board[11][3].gameObject = board[11][6].gameObject = board[11][9].gameObject = BUNKER;
    return board;
}

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = `<table border="0"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j });
            currCell.type === SKY ? (cellClass += ' sky') : (cellClass += ' earth');
            strHTML += `<td class ="cell ${cellClass}" data-i='${i}' data-j='${j}'>${board[i][j].gameObject}</td>`;
        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector('.board');
    elContainer.innerHTML = strHTML;
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject,
    };
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    // console.log(pos);
    // console.log(gameObject);
    gBoard[pos.i][pos.j].gameObject = gameObject;
    // console.log(gBoard[pos.i][pos.j]);
    var elCell = getElCell(pos);
    // console.log(elCell);
    elCell.innerHTML = gameObject || '';
}

function updateScore(diff) {
    gGame.aliensCount += diff;
    document.querySelector('h2 span').innerText = gGame.aliensCount;
}

function gameOver(isWin) {
    // isWin ? console.log('You Win') : console.log('Game Over');
    openModal(isWin);
    gGame.isOn = false;
    clearInterval(gIntervalAliens);
    clearInterval(gCandyInterval);
}

function openModal(isWin) {
    var gElRestartBtn = document.querySelector('.restart');
    gElRestartBtn.style.display = 'block';
    var elH2Restart = document.querySelector('.restart h2');
    elH2Restart.innerHTML = isWin ? 'You Win' : 'Game Over';
}

function addCandy() {
    var emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return;
    var randCandy = emptyCells[getRandomInt(0, emptyCells.length)];
    gBoard[randCandy.i][randCandy.j].gameObject = CANDY;
    updateCell(randCandy, CANDY);
    setTimeout(() => {
        console.log('candy');
        randCandy.gameObject = EMPTY;
        updateCell(randCandy, EMPTY);
    }, 5000);
}
