// Slightly higher layer above the raw game mechanics
// - chat 
// - save / load / replay
// - export, etc.

import Board from './board.mjs';

function create(params) {
    const { stage } = params;

    const board = Board.create({ margin: 120 });
    stage.addChild(board);

    Board.prepareTurn(board);
}

export default {
    create,
};