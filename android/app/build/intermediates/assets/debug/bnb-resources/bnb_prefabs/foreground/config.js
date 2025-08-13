'use strict';

const prefabs = require("bnb_js/prefabs");

class Foreground extends prefabs.Base {
    constructor() {
        super();
        const assets = bnb.scene.getAssetManager();
        const materialName = `shaders/foreground`;
        this._material = assets.findMaterial(materialName);
        if (!this._material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`);
          return;
        }
        this._foreground_texture = assets.findImage("foreground_texture")?.asTexture();
    }

    /** Set foreground texture */
    filename(filename) {
        this._foreground_texture.load(filename);
        return this;
    }

    /** 
     * @param blending_mode String; one of "off", "alpha", "premul_alpha", 
     * "alpha_rgba", "screen", "add", "multiply", "min", "max" 
     */
    blending(blending_mode) {
        blending_mode = blending_mode.toUpperCase();

        if (!(blending_mode in bnb.BlendingMode)) {
            throw new Error(`Unknown blending_mode ${blending_mode}`);
        }
        let state = this._material.getState();
        state.blending = bnb.BlendingMode[blending_mode];
        this._material.setState(state);
    }

    /** Resets any settings applied */
    clear() {
        this.filename("");
        this.blending("alpha");
    }
}

exports = {
    Foreground
}
