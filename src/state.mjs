// Primarily used for state persistence
// Used as a singleton module

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

    if (checkWinCondition_BoxIn()) return;
    if (checkWinCondition_LinkUp()) return;
    
    // Toggle turn marker between red / white
    _stateIsRedTurn ^= 1;
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

import { isMarked } from './state.helpers.mjs';

// Recursively check if a square is linked to another square by an edge
function checkSquareConnected(visitedSquares, x, y, octs, totalInSprawl) {
    // Don't revisit a square
    if (visitedSquares[y] & (1 << x)) return;

    // Mark unvisited square as visited
    visitedSquares[y] |= 1 << x;
    totalInSprawl.vertices++;

    // Check all 4 directions for connections and add to the totals for this spread
    let N, E, S, W;

    N = !isMarked(visitedSquares, x, y - 2) && isMarked(octs, x, y - 1);
    S = !isMarked(visitedSquares, x, y + 2) && isMarked(octs, x, y + 1);
    E = !isMarked(visitedSquares, x + 2, y) && isMarked(octs, x + 1, y);
    W = !isMarked(visitedSquares, x - 2, y) && isMarked(octs, x - 1, y);

    totalInSprawl.edges += [N, E, S, W].filter(Boolean).length;
    if (N) checkSquareConnected(visitedSquares, x, y - 2, octs, totalInSprawl);
    if (S) checkSquareConnected(visitedSquares, x, y + 2, octs, totalInSprawl);
    if (E) checkSquareConnected(visitedSquares, x + 2, y, octs, totalInSprawl);
    if (W) checkSquareConnected(visitedSquares, x - 2, y, octs, totalInSprawl);
}

// TODO: fill this in via AI code gen?
function checkWinCondition_BoxIn() {
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

            if (isMarked(visitedSquares, x, y)) continue;

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

            if (isMarked(visitedSquares, x, y)) continue;

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

function checkWinCondition_LinkUp() {
    const visitedOcts = (new Array(11)).fill(0);
    // Start from top row (white squares)
    for (let x = 1; x <= 9; x += 2) {
        if (!isMarked(_stateW, x, 1)) continue;

        const hasLinkedUpTopBottom = checkLinksFromPosition(visitedOcts, x, 1, false);

        if (hasLinkedUpTopBottom) {
            _isGameOver = 1;
            _isWinnerRed = 0;
            return true;
        }
    }

    visitedOcts.fill(0);
    // Start from left col (red squares)
    for (let y = 1; y <= 9; y += 2) {
        if (!isMarked(_stateR, 1, y)) continue;

        const hasLinkedUpLeftRight = checkLinksFromPosition(visitedOcts, 1, y, true);

        if (hasLinkedUpLeftRight) {
            _isGameOver = 1;
            _isWinnerRed = 1;
            return true;
        }
    }

    return false;
}

function checkLinksFromPosition(visitedOcts, x, y, isRed) {
    if (x <= 0 || x >= 10 || y <= 0 || y >= 10) return false;
    visitedOcts[y] |= 1 << x;

    const state = isRed ? _stateR : _stateW;

    // Top Right
    // Bottom Right
    // Top Left
    // Bottom Left
    const TR = !isMarked(visitedOcts, x + 1, y - 1) && isMarked(state, x + 1, y - 1);
    const BR = !isMarked(visitedOcts, x + 1, y + 1) && isMarked(state, x + 1, y + 1);
    const TL = !isMarked(visitedOcts, x - 1, y - 1) && isMarked(state, x - 1, y - 1);
    const BL = !isMarked(visitedOcts, x - 1, y + 1) && isMarked(state, x - 1, y + 1);

    let isConnected = false;

    if ((isRed && (x % 2)) || !isRed && (x % 2 === 0)) {
        // Horizontal moves
        const E = !isMarked(visitedOcts, x + 2, y) && isMarked(state, x + 2, y);
        const W = !isMarked(visitedOcts, x - 2, y) && isMarked(state, x - 2, y);

        // Only red can win by connecting left to right
        if (isRed) {
            // Linked to right col
            if (E && x === 7) return true;

            // Linked to left col
            if (W && x === 3) return true;
        }

        isConnected ||=
            (E && checkLinksFromPosition(visitedOcts, x + 2, y, isRed)) ||
            (W && checkLinksFromPosition(visitedOcts, x - 2, y, isRed));
    } else {
        // Vertical moves
        const N = !isMarked(visitedOcts, x, y - 2) && isMarked(state, x, y - 2);
        const S = !isMarked(visitedOcts, x, y + 2) && isMarked(state, x, y + 2);

        // Only white can win by connecting top to bottom
        if (!isRed) {
            // Linked to bottom row
            if (S && y === 7) return true;

            // Linked to top row
            if (N && y === 3) return true;
        }

        isConnected ||=
            (N && checkLinksFromPosition(visitedOcts, x, y - 2, isRed)) ||
            (S && checkLinksFromPosition(visitedOcts, x, y + 2, isRed));
    }

    if (isConnected) return true;

    return (
        (TR && checkLinksFromPosition(visitedOcts, x + 1, y - 1, isRed)) ||
        (BR && checkLinksFromPosition(visitedOcts, x + 1, y + 1, isRed)) ||
        (TL && checkLinksFromPosition(visitedOcts, x - 1, y - 1, isRed)) ||
        (BL && checkLinksFromPosition(visitedOcts, x - 1, y + 1, isRed))
    );
}

export default {
    doMove,
    reset,
    getState,
};