// Slightly higher layer above the raw game mechanics
// - chat 
// - save / load / replay
// - export, etc.

import Board from './board.mjs';

function create(params) {
    const { stage } = params;

    const board = Board.create({ margin: 160 });

    Board.prepareTurn(board);

    stage.addChild(board);
}

export default {
    create,
};