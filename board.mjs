import * as PIXI from './lib/pixi.min.mjs';
import Square from './square.mjs';
import Octogon from './octogon.mjs';

import State from './state.mjs';

function create(params) {
    const { margin } = params;
    const board = new PIXI.Container();

    // Squares
    for (let i = 0; i < 6; i++) {
        for (let j = .5; j < 5; j++) {
            board.addChild(
                Square.create({ color: 'white', x: j, y: i })
            );
        }
    }

    for (let i = .5; i < 5; i++) {
        for (let j = 0; j < 6; j++) {
            board.addChild(
                Square.create({ color: 'red', x: j, y: i })
            );
        }
    }

    // Show all illegal tiles
    board.addChild(Octogon.create({ x: 0, y: 0, isIllegal: true }));
    board.addChild(Octogon.create({ x: 10, y: 0, isIllegal: true }));
    board.addChild(Octogon.create({ x: 0, y: 10, isIllegal: true }));
    board.addChild(Octogon.create({ x: 10, y: 10, isIllegal: true }));


    const octogonsR = [];
    const octogonsW = [];
    for (let i = 0; i <= 10; i++) {
        octogonsR.push([]);
        octogonsW.push([]);
    }

    // Legal white moves
    for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10; j++) {
            if (j < 1 || j > 9) {
                octogonsW[i].push(null);
            } else {
                if (i % 2) {
                    if (j % 2) {
                        const oct = Octogon.create({ board, isRed: 0, x: j, y: i, isVert: 1 });
                        board.addChild(oct);
                        octogonsW[i].push(oct);
                    } else {
                        octogonsW[i].push(null);
                    }
                } else {
                    if (!(j % 2)) {
                        const oct = Octogon.create({ board, isRed: 0, x: j, y: i, isVert: 0 });
                        board.addChild(oct);
                        octogonsW[i].push(oct);
                    } else {
                        octogonsW[i].push(null);
                    }
                }
            }
        }
    }

    // Legal red moves
    for (let i = 0; i <= 10; i++) {
        for (let j = 0; j <= 10; j++) {
            if (i < 1 || i > 9) {
                octogonsR[i].push(null);
            } else {
                if (i % 2) {
                    if (j % 2) {
                        const oct = Octogon.create({ board, isRed: 1, x: j, y: i, isVert: 0 });
                        board.addChild(oct);
                        octogonsR[i].push(oct);
                    } else {
                        octogonsR[i].push(null);
                    }
                } else {
                    if (!(j % 2)) {
                        const oct = Octogon.create({ board, isRed: 1, x: j, y: i, isVert: 1 });
                        board.addChild(oct);
                        octogonsR[i].push(oct);
                    } else {
                        octogonsR[i].push(null);
                    }
                }
            }
        }
    }

    board.doMove = (x, y) => doMove(board, x, y);

    // Store child octs
    board.octs = {
        red: octogonsR,
        white: octogonsW,
    };

    // Move board graphically
    board.position.x = margin;
    board.position.y = margin;

    return board;
}

function prepareTurn(board) {
    const state = State.getState();

    for (let row of board.octs.red) {
        for (let o of row) {
            if (o) {
                Octogon.prepareTurn(o, state.isRedTurn);
            }
        }
    }
    for (let row of board.octs.white) {
        for (let o of row) {
            if (o) {
                Octogon.prepareTurn(o, state.isRedTurn);
            }
        }
    }
}

function doMove(board, x, y) {
    const { isRedTurn } = State.getState();
    State.doMove(isRedTurn, x, y);

    if (isRedTurn) {
        board.octs.red[y][x]?.markMove(1);
        board.octs.white[y][x]?.markMove(1);
    } else {
        board.octs.red[y][x]?.markMove(0);
        board.octs.white[y][x]?.markMove(0);
    }

    prepareTurn(board);
}

export default {
    create,
    prepareTurn,
    doMove,
};