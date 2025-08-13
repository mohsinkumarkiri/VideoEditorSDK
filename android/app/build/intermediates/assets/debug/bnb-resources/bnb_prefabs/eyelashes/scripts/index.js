'use strict';

const prefabs = require("bnb_js/prefabs");

class Eyelashes extends prefabs.Base {
    constructor(faceIdx=0) {
        super();

        const assets = bnb.scene.getAssetManager();
        const materialName = `eyelashes/shaders/eyelahes`
        const material = assets.findMaterial(materialName)
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`)
          return
        }
    
        const parameters = material.getParameters()
        this._eyelashes_texture = "/bnb_prefabs/eyelashes/images/eyelashes_makeup.ktx"
        this._color = parameters.find((parameter) => parameter.getName() == "eyelashes_color") 
        this._texture = assets.findImage("eyelashes").asTexture()
    }
    
    color(color) {
        this._color.setVector4(prefabs.parseColor(color));
        bnb.scene.enableRecognizerFeature(bnb.FeatureID.EYES_CORRECTION);
        return this;
    }

    texture(filename) {
        this._texture.load(filename);
    }

    clear() {
        this.color("0 0 0 0");
        this.texture(this._eyelashes_texture)
    }
}

exports = {
    Eyelashes
}