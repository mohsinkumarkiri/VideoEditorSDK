'use strict';

const prefabs = require("bnb_js/prefabs");

class Softlight extends prefabs.Base {
    constructor(faceIdx=0) {
        super();
        const assets = bnb.scene.getAssetManager();
        const materialName = `softlight/shaders/softlight`
        const material = assets.findMaterial(materialName)
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`)
          return
        }
    
        const parameters = material.getParameters()
        this._softlight_texture = "/bnb_prefabs/softlight/images/soft.ktx"
        this._strength = parameters.find((parameter) => parameter.getName() == "strength") 
        this._texture = assets.findImage("soft").asTexture()
    }

    setState({color, filename})
    {
        if(filename !== 'undefined'){
            this.texture(filename)
        }
        if(color !== 'undefined'){
            this.color(color)
        }
    }
    
    strength(str) {
        this._strength.setVector4(new bnb.Vec4(str, 0, 0, 0))
        return this;
    }
    texture(filename) {
        this._texture.load(filename);
    }
    clear() {
        this.strength(0);
        this.texture(this._softlight_texture)
    }
}

exports = {
    Softlight
}