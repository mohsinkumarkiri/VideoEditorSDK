'use strict';

const prefabs = require("bnb_js/prefabs");

class Lut extends prefabs.Base {
    constructor() {
        super();
        const assets = bnb.scene.getAssetManager();

        const materialName = `shaders/lut/lut_filter`;
        const material = assets.findMaterial(materialName);
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`);
          return
        }
    
        const parameters = material.getParameters();
        this._strength = parameters.find((parameter) => parameter.getName() == "lut_filter_strength"); 


        this._tex_filter = assets.findImage("lut_texture")?.asWeightedLut();
    }
    /** Sets the filter LUT */
    filename(filename) {
        this._tex_filter.load(filename);
        return this;
    }
    /** Sets the filter strength from 0 to 1 */
    strength(strength) {
        this._strength.setVector4(new bnb.Vec4(strength, 0, 0, 0))
        return this;
    }

    setState({filename, strength})
    {
        if(filename !== 'undefined'){
            this.filename(filename)
        }
        if(strength !== 'undefined'){
            this.strength(strength)
        }
    }
    /** Resets any settings applied */
    clear() {
        this.filename("");
        this.strength(1);
    }
}

exports = {
    Lut
}
