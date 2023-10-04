import * as PIXI from '../lib/pixi.min.mjs';

const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);

import Game from './game.mjs';
Game.create({
    stage: app.stage,
    isRedTurn: 1,
});