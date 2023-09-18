import * as PIXI from './lib/pixi.min.mjs';
import { SIZE, COLOR } from './constants.mjs';

function getGraphicalCoords(x, y) {
    return { x: SIZE.SPACEWIDTH * .5 * x, y: SIZE.SPACEWIDTH * .5 * y };
}

const OCTRATIO = 1;

function create(params) {
    const { isRed, x, y, isVert, isRealized, isIllegal, isBlocked } = params;

    const g = new PIXI.Graphics();
    g.beginFill(COLOR.black);
    g.lineStyle(2, COLOR.gray);

    /******************
    
        A >>>>> B
    
    H               C
    
    G               D
    
        F       E
    
    ******************/

    // -> A
    g.moveTo(
        -SIZE.HALFWIDTH * OCTRATIO,
        -SIZE.SPACEWIDTH * .5 + SIZE.HALFWIDTH
    );

    // A -> B
    g.lineTo(
        SIZE.HALFWIDTH * OCTRATIO,
        -SIZE.SPACEWIDTH * .5 + SIZE.HALFWIDTH
    );

    // B -> C
    g.lineTo(
        SIZE.SPACEWIDTH * .5 - SIZE.HALFWIDTH,
        -SIZE.HALFWIDTH * OCTRATIO,
    );

    // C -> D
    g.lineTo(
        SIZE.SPACEWIDTH * .5 - SIZE.HALFWIDTH,
        SIZE.HALFWIDTH * OCTRATIO,
    );

    // D -> E
    g.lineTo(
        SIZE.HALFWIDTH * OCTRATIO,
        SIZE.SPACEWIDTH * .5 - SIZE.HALFWIDTH
    );

    // E -> F
    g.lineTo(
        -SIZE.HALFWIDTH * OCTRATIO,
        SIZE.SPACEWIDTH * .5 - SIZE.HALFWIDTH
    );

    // F -> G
    g.lineTo(
        -SIZE.SPACEWIDTH * .5 + SIZE.HALFWIDTH,
        SIZE.HALFWIDTH * OCTRATIO,
    );

    // G -> H
    g.lineTo(
        -SIZE.SPACEWIDTH * .5 + SIZE.HALFWIDTH,
        -SIZE.HALFWIDTH * OCTRATIO,
    );


    g.closePath();
    g.endFill();

    const coords = getGraphicalCoords(x, y);
    g.position.set(coords.x, coords.y);

    if (isIllegal) {
        g.tint = 0x666600;
        return g;
    }

    // Connection Path
    g.lineStyle(0);
    g.beginFill(isRed ? COLOR.red : COLOR.white);

    if (isVert) {
        g.drawRect(
            -SIZE.HALFWIDTH * OCTRATIO,
            -SIZE.SPACEWIDTH * .5 + SIZE.HALFWIDTH,
            2 * SIZE.HALFWIDTH,
            SIZE.SPACEWIDTH - 2 * SIZE.HALFWIDTH,
        );
    } else {
        g.drawRect(
            -SIZE.SPACEWIDTH * .5 + SIZE.HALFWIDTH,
            -SIZE.HALFWIDTH * OCTRATIO,
            SIZE.SPACEWIDTH - 2 * SIZE.HALFWIDTH,
            2 * SIZE.HALFWIDTH,
        );
    }
    g.endFill();


    if (isBlocked) {
        g.alpha = 0;
        return g;
    }

    if (!isRealized) {
        g.tint = 0x222222;
    }

    g.markMove = _isRed => {
        g.eventMode = 'none';
        if (_isRed === isRed) {
            g.tint = 0xffffff;
            g.alpha = 1;
            g.visible = true;
        } else {
            g.tint = 0x222222;
            g.alpha = 0;
            g.visible = false;
        }

    };

    g.eventMode = 'static';
    g.game = { isRealized, isRed, isVert, timeHover: 0 };
    g.on('pointerover', () => {
        clearTimeout(g.game.timeHover);
        g.game.timeHover = setTimeout(() => {
            g.tint = 0x222222;
        }, 800);
        g.tint = 0xdddddd;
    });
    g.on('pointerout', () => {
        clearTimeout(g.game.timeHover);
        g.tint = 0x222222;
    });

    return g;
}

export default {
    create,
};