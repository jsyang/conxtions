// Primarily used for state persistence
// Used as a singleton module

// OPTIMIZE: to take out blank rows
const _stateR = (new Array(11)).fill(0);
const _stateW = (new Array(11)).fill(0);
let _stateIsRedTurn = 0;
let _isGameOver = 0;
let _isWinnerRed = 0;

function reset() {
    _stateR.fill(0);
    _stateW.fill(0);
    _stateIsRedTurn = 0;
    _isGameOver = 0;
}

function doMove(isRed, x, y) {
    if (isRed) _stateIsRedTurn = 1;
    const state = isRed ? _stateR : _stateW;
    state[y] |= 1 << x;

    // Toggle between red's turn and not
    _stateIsRedTurn ^= 1;

    if (checkBoxIn()) return;
    if (checkLinks()) return;
}

function getState() {
    return {
        RED: [..._stateR],
        WHITE: [..._stateW],
        isRedTurn: !!_stateIsRedTurn,
        isGameOver: !!_isGameOver,
        isWinnerRed: !!_isWinnerRed,
    };
}

// Returns true if box-in win condition is satisified for either side
// false otherwise

// Returns  0 if position not been marked
//          non-zero otherwise
function checkPositionMarked(state, x, y) {
    // Do nothing if square being checked was not valid
    if (
        (x === 0 && y === 0) ||
        (x === 10 && y === 0) ||
        (x === 10 && y === 10) ||
        (x === 0 && y === 10) ||
        (x < 0 || y < 0 || x > 10 || y > 10)
    ) {
        return 0;
    }

    return state[y] ? state[y] & (1 << x) : 0;
}

function checkSquareConnected(visitedSquares, x, y, octs, totalInSprawl) {
    // Don't revisit a square
    if (visitedSquares[y] & (1 << x)) return;

    // Mark unvisited square as visited
    visitedSquares[y] |= 1 << x;
    totalInSprawl.vertices++;

    // Check all 4 directions for connections and add to the totals for this spread
    let N, E, S, W;

    N = !checkPositionMarked(visitedSquares, x, y - 2) && checkPositionMarked(octs, x, y - 1);
    S = !checkPositionMarked(visitedSquares, x, y + 2) && checkPositionMarked(octs, x, y + 1);
    E = !checkPositionMarked(visitedSquares, x + 2, y) && checkPositionMarked(octs, x + 1, y);
    W = !checkPositionMarked(visitedSquares, x - 2, y) && checkPositionMarked(octs, x - 1, y);

    totalInSprawl.edges += [N, E, S, W].filter(Boolean).length;
    if (N) checkSquareConnected(visitedSquares, x, y - 2, octs, totalInSprawl);
    if (S) checkSquareConnected(visitedSquares, x, y + 2, octs, totalInSprawl);
    if (E) checkSquareConnected(visitedSquares, x + 2, y, octs, totalInSprawl);
    if (W) checkSquareConnected(visitedSquares, x - 2, y, octs, totalInSprawl);
}

// TODO: fill this in via AI code gen?
function checkBoxIn() {
    const visitedSquares = (new Array(11)).fill(0);
    const totalInSprawl = {
        edges: 0,
        vertices: 0,
    };

    // Check white squares
    for (let x = 1; x <= 9; x += 2) {
        for (let y = 0; y <= 10; y += 2) {
            // Starting conditions
            totalInSprawl.edges = 0;
            totalInSprawl.vertices = 0;

            if (checkPositionMarked(visitedSquares, x, y)) continue;

            checkSquareConnected(visitedSquares, x, y, _stateW, totalInSprawl);

            if (totalInSprawl.edges === totalInSprawl.vertices) {
                _isWinnerRed = 0;
                _isGameOver = 1;
                return true;
            }
        }
    }

    // Reset visited squares
    visitedSquares.fill(0);
    // Check red squares
    for (let x = 0; x <= 10; x += 2) {
        for (let y = 1; y <= 9; y += 2) {
            // Starting conditions
            totalInSprawl.edges = 0;
            totalInSprawl.vertices = 0;

            if (checkPositionMarked(visitedSquares, x, y)) continue;

            checkSquareConnected(visitedSquares, x, y, _stateR, totalInSprawl);

            if (totalInSprawl.edges === totalInSprawl.vertices) {
                _isWinnerRed = 1;
                _isGameOver = 1;
                return true;
            }
        }
    }

    return false;
}

function checkLinks() {
    const visitedOcts = (new Array(11)).fill(0);
    // Start from top row (white squares)
    for (let x = 1; x <= 9; x += 2) {
        if (!(_stateW[1] & (1 << x))) continue;

        const hasLinkedUpTopBottom = checkLinkWhiteFromPosition(_stateW, visitedOcts, x, 1);

        if (hasLinkedUpTopBottom) {
            _isGameOver = 1;
            _isWinnerRed = 0;
            return true;
        }
    }

    visitedOcts.fill(0);
    // Start from left col (red squares)
    for (let y = 1; y <= 9; y += 2) {
        if (!(_stateR[y] & 2)) continue;

        const hasLinkedUpLeftRight = checkLinkRedFromPosition(_stateR, visitedOcts, 1, y);

        if (hasLinkedUpLeftRight) {
            _isGameOver = 1;
            _isWinnerRed = 1;
            return true;
        }
    }

    return false;
}

function checkLinkWhiteFromPosition(state, visitedOcts, x, y) {
    if (x <= 0 || x >= 10 || y <= 0 || y >= 10) return false;
    visitedOcts[y] |= 1 << x;

    // Top Right
    const visitedTR = visitedOcts[y - 1] & (1 << (x + 1));
    const TR = !visitedTR && (state[y - 1] & (1 << (x + 1)));

    // Bottom Right
    const visitedBR = visitedOcts[y + 1] & (1 << (x + 1));
    const BR = !visitedBR && (state[y + 1] & (1 << (x + 1)));

    // Top Left
    const visitedTL = visitedOcts[y - 1] & (1 << (x - 1));
    const TL = !visitedTL && (state[y - 1] & (1 << (x - 1)));

    // Bottom Left
    const visitedBL = visitedOcts[y + 1] & (1 << (x - 1));
    const BL = !visitedBL && (state[y + 1] & (1 << (x - 1)));

    let isConnected = false;

    if (x % 2) {
        // Verticals moves
        // N
        const visitedN = visitedOcts[y - 2] & (1 << x);
        const N = !visitedN && (state[y - 2] & (1 << x));

        // S
        const visitedS = visitedOcts[y + 2] & (1 << x);
        const S = !visitedS && (state[y + 2] & (1 << x));

        // Linked to bottom row
        if (S && y === 7) return true;

        // Linked to top row
        if (N && y === 3) return true;

        isConnected ||=
            (N && checkLinkWhiteFromPosition(state, visitedOcts, x, y - 2)) ||
            (S && checkLinkWhiteFromPosition(state, visitedOcts, x, y + 2));
    } else {
        // Horizontal moves
        // E
        const visitedE = visitedOcts[y] & (1 << (x + 2));
        const E = !visitedE && (state[y] & (1 << (x + 2)));

        // W
        const visitedW = visitedOcts[y] & (1 << (x - 2));
        const W = !visitedW && (state[y] & (1 << (x - 2)));

        isConnected ||=
            (E && checkLinkWhiteFromPosition(state, visitedOcts, x + 2, y)) ||
            (W && checkLinkWhiteFromPosition(state, visitedOcts, x - 2, y));
    }

    if (isConnected) return true;

    return (
        (TR && checkLinkWhiteFromPosition(state, visitedOcts, x + 1, y - 1)) ||
        (BR && checkLinkWhiteFromPosition(state, visitedOcts, x + 1, y + 1)) ||
        (TL && checkLinkWhiteFromPosition(state, visitedOcts, x - 1, y - 1)) ||
        (BL && checkLinkWhiteFromPosition(state, visitedOcts, x - 1, y + 1))
    );

}

function checkLinkRedFromPosition(state, visitedOcts, x, y) {
    if (x <= 0 || x >= 10 || y <= 0 || y >= 10) return false;
    visitedOcts[y] |= 1 << x;

    // Top Right
    const visitedTR = visitedOcts[y - 1] & (1 << (x + 1));
    const TR = !visitedTR && (state[y - 1] & (1 << (x + 1)));

    // Bottom Right
    const visitedBR = visitedOcts[y + 1] & (1 << (x + 1));
    const BR = !visitedBR && (state[y + 1] & (1 << (x + 1)));

    // Top Left
    const visitedTL = visitedOcts[y - 1] & (1 << (x - 1));
    const TL = !visitedTL && (state[y - 1] & (1 << (x - 1)));

    // Bottom Left
    const visitedBL = visitedOcts[y + 1] & (1 << (x - 1));
    const BL = !visitedBL && (state[y + 1] & (1 << (x - 1)));

    let isConnected = false;

    if (x % 2) {
        // Horizontal moves
        // E
        const visitedE = visitedOcts[y] & (1 << (x + 2));
        const E = !visitedE && (state[y] & (1 << (x + 2)));

        // W
        const visitedW = visitedOcts[y] & (1 << (x - 2));
        const W = !visitedW && (state[y] & (1 << (x - 2)));


        // Linked to right col
        if (E && x === 7) return true;

        // Linked to left col
        if (W && x === 3) return true;

        isConnected ||=
            (E && checkLinkRedFromPosition(state, visitedOcts, x + 2, y)) ||
            (W && checkLinkRedFromPosition(state, visitedOcts, x - 2, y));
    } else {
        // Verticals moves
        // N
        const visitedN = visitedOcts[y - 2] & (1 << x);
        const N = !visitedN && (state[y - 2] & (1 << x));

        // S
        const visitedS = visitedOcts[y + 2] & (1 << x);
        const S = !visitedS && (state[y + 2] & (1 << x));


        isConnected ||=
            (N && checkLinkRedFromPosition(state, visitedOcts, x, y - 2)) ||
            (S && checkLinkRedFromPosition(state, visitedOcts, x, y + 2));
    }

    if (isConnected) return true;

    return (
        (TR && checkLinkRedFromPosition(state, visitedOcts, x + 1, y - 1)) ||
        (BR && checkLinkRedFromPosition(state, visitedOcts, x + 1, y + 1)) ||
        (TL && checkLinkRedFromPosition(state, visitedOcts, x - 1, y - 1)) ||
        (BL && checkLinkRedFromPosition(state, visitedOcts, x - 1, y + 1))
    );

}

export default {
    doMove,
    reset,
    getState,
};