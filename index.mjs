import * as PIXI from './lib/pixi.min.mjs';

const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);

import Board from './board.mjs';
const board = Board.create({ margin: 120 });
app.stage.addChild(board);

board.doMove(0, 1, 1);
