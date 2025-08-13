'use strict';

const prefabs = require("bnb_js/prefabs");

class EyesFlare extends prefabs.Base {
    constructor(faceIdx=0) {
        super();

        const assets = bnb.scene.getAssetManager();

        const materialName = `eyes_flare/shaders/flare`
        const material = assets.findMaterial(materialName)
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`)
          return
        }
    
        const parameters = material.getParameters()
        this._flare_strength = parameters.find((parameter) => parameter.getName() == "strength") 

    }

    strength(str) {
        this._flare_strength.setVector4(new bnb.Vec4(str, 0., 0., 0.))
        return this;
    }
    clear() {
        this.strength(0);
    }
}

exports = {
    EyesFlare
}
