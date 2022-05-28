// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject,
    };
}
function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`);
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function getEmptyCells() {
    var emptyCells = [];

    for (var j = 0; j < gBoard[0].length; j++) {
        if (
            gBoard[0][j].gameObject === ALIEN1 ||
            gBoard[0][j].gameObject === ALIEN2 ||
            gBoard[0][j].gameObject === ALIEN3
        )
            continue;
        emptyCells.push({ i: 0, j });
    }

    return emptyCells;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
