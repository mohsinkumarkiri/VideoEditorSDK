'use strict';

const prefabs = require("bnb_js/prefabs");

class TeethWhitening extends prefabs.Base {
    constructor() {
        super();

        const assets = bnb.scene.getAssetManager();

        const materialName = `shaders/teeth/whitening`
        const material = assets.findMaterial(materialName)
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`)
          return
        }
    
        const parameters = material.getParameters()
        this._whitening_strength = parameters.find((parameter) => parameter.getName() == "whitening")   

        this._teeth_nn = bnb.scene.getAssetManager().findImage("teeth_nn")?.asSegmentationMask();

    }

    setState({teeth}){
        if(teeth !== 'undefined'){
            this.whitening(teeth)
        }

        return this;
    }

    strength(strength) {
        this._whitening_strength.setVector4(new bnb.Vec4(strength, 0., 0., 0.))
        this._teeth_nn.setActive(strength !== 0)
        return this;
    }

    clear() {
        this.strength(0.0);
    }
}
exports = {
    TeethWhitening
}
