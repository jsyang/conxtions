// TODO: optimize to take out blank rows
const _stateR = (new Array(11)).fill(0);
const _stateW = (new Array(11)).fill(0);

function reset() {
    _stateR.fill(0);
    _stateW.fill(0);
}

function doMove(isRed, x, y) {
    const state = isRed ? _stateR : _stateW;
    state[y] |= 1 << x;

}

function getState() {
    return {
        RED: [..._stateR],
        WHITE: [..._stateW],
    };
}

export default {
    doMove,
    reset,
    getState,
};