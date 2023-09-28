// Can be used for Octs or Squares, as long as `state` is a Bitfield Array
// Returns  0 if position not been marked
//          non-zero otherwise
export function isMarked(state, x, y) {
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

