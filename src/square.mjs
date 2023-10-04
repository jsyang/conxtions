import * as PIXI from '../lib/pixi.min.mjs';
import { COLOR, SIZE } from './constants.mjs';

function getGraphicalCoords(x, y) {
    return { x: SIZE.SPACEWIDTH * x, y: SIZE.SPACEWIDTH * y };
}

function create(params) {
    const { color, x, y } = params;

    const g = new PIXI.Graphics();
    g.lineStyle(2, COLOR.gray);
    g.beginFill(COLOR[color]);
    g.drawRect(-SIZE.HALFWIDTH, -SIZE.HALFWIDTH, SIZE.HALFWIDTH * 2, SIZE.HALFWIDTH * 2);
    g.endFill();

    const coords = getGraphicalCoords(x, y);
    g.position.set(coords.x, coords.y);

    return g;
}

export default {
    create,
};