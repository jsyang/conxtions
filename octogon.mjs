import * as PIXI from './lib/pixi.min.mjs';
import { SIZE, COLOR } from './constants.mjs';

function getGraphicalCoords(x, y) {
    return { x: SIZE.SPACEWIDTH * .5 * x, y: SIZE.SPACEWIDTH * .5 * y };
}

const OCTRATIO = 1;

function create(params) {
    const { board, isRed, x, y, isVert, isRealized, isIllegal } = params;

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

    if (!isRealized) {
        highlight(g, false);
    }

    g.eventMode = 'static';

    g.markMove = _isRed => realize(g, _isRed);

    g.gamepieceState = { x, y, board, isRealized, isRed, isVert };

    g.on('pointerover', () => highlight(g, true));
    g.on('pointerout', () => highlight(g, false));
    g.on('pointerdown', () => board.doMove(x, y));

    return g;
}

function prepareTurn(oct, isRedTurn) {
    if (oct.gamepieceState.isRealized) return;

    enable(oct, (oct.gamepieceState.isRed && isRedTurn) || (!oct.gamepieceState.isRed && !isRedTurn));
}

function highlight(oct, isOn) {
    oct.tint = isOn ? 0xdddddd : 0x333333;
}

// Used to temporarily restrict interactivity depending on turn
function enable(oct, isEnabled) {
    if (isEnabled) {
        oct.eventMode = 'static';
        oct.alpha = 1;
        oct.tint = 0x333333;
        oct.visible = true;
    } else {
        oct.eventMode = 'none';
        oct.alpha = 0;
        oct.visible = false;
    }
}

function realize(oct, _isRed) {
    oct.eventMode = 'none';
    oct.gamepieceState.isRealized = true;

    if (_isRed === oct.gamepieceState.isRed) {
        oct.tint = 0xffffff;
        oct.alpha = 1;
        oct.visible = true;
    } else {
        oct.tint = 0x333333;
        oct.alpha = 0;
        oct.visible = false;
    }
}

// Used at the end of a game to remove all interactivity
function disable(oct) {
    oct.eventMode = 'none';
    oct.gamepieceState.isRealized = true;
}

export default {
    create,
    prepareTurn,
    disable,
    enable,
};