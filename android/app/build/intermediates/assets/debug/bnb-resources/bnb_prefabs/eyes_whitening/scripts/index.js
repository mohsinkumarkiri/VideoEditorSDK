'use strict';

const prefabs = require("bnb_js/prefabs");

class EyesWhitening extends prefabs.Base {
    constructor(faceIdx=0) {
        super();

        const assets = bnb.scene.getAssetManager();

        const materialName = `eyes_whitening/shaders/whitening`
        const material = assets.findMaterial(materialName)
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`)
          return
        }
    
        const parameters = material.getParameters()
        this._whitening_strength = parameters.find((parameter) => parameter.getName() == "whitening_strength") 
    }

    strength(str) {
        this._whitening_strength.setVector4(new bnb.Vec4(str, 0., 0., 0.))
        return this;
    }
    clear() {
        this.strength(0);
    }
}

exports = {
    EyesWhitening
}
