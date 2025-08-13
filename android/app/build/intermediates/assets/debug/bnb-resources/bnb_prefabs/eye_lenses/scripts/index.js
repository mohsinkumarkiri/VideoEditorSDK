'use strict';

const prefabs = require("bnb_js/prefabs");

class EyeLenses extends prefabs.Base {
    constructor(faceIndex=0) {
        super();
        const assets = bnb.scene.getAssetManager();

        this._tex = assets.findImage("eye_lenses_texture")?.asTexture();
    }

    /** Sets the texture of eye lenses */
    filename(filename) {
        this._tex.load(filename);
        return this;
    }

    /** Resets any settings applied */
    clear() {
        this.filename("");
    }
}

exports = {
    EyeLenses
}
