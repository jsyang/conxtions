// Primarily used for state persistence
// Used as a singleton module

// OPTIMIZE: to take out blank rows
const _stateR = (new Array(11)).fill(0);
const _stateW = (new Array(11)).fill(0);
let _stateIsRedTurn = 0;

function reset() {
    _stateR.fill(0);
    _stateW.fill(0);
    _stateIsRedTurn = 0;
}

function doMove(isRed, x, y) {
    if (isRed) _stateIsRedTurn = 1;
    const state = isRed ? _stateR : _stateW;
    state[y] |= 1 << x;
    // Toggle between red's turn and not
    _stateIsRedTurn ^= 1;
}

function getState() {
    return {
        RED: [..._stateR],
        WHITE: [..._stateW],
        isRedTurn: !!_stateIsRedTurn,
    };
}

export default {
    doMove,
    reset,
    getState,
};