'use strict';

const prefabs = require("bnb_js/prefabs");

class Eyes extends prefabs.Base {
    constructor(faceIndex=0) {
        super();
        const assets = bnb.scene.getAssetManager();

        const materialName = `shaders/eyes/color`;
        const material = assets.findMaterial(materialName);
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`);
          return;
        }
    
        const parameters = material.getParameters()
        this._eyes_color = parameters.find((parameter) => parameter.getName() == "eyes_color"); 
        this._pupil_color = parameters.find((parameter) => parameter.getName() == "pupil_color");   
        this._corneosclera_color= parameters.find((parameter) => parameter.getName() == "corneosclera_color");   

        this._eyes_nns = [
            bnb.scene.getAssetManager().findImage("left_eye_nn")?.asSegmentationMask(),
            bnb.scene.getAssetManager().findImage("right_eye_nn")?.asSegmentationMask()
        ];

        this._pupil_nns = [
            bnb.scene.getAssetManager().findImage("left_eye_pupil_nn")?.asSegmentationMask(),
            bnb.scene.getAssetManager().findImage("right_eye_pupil_nn")?.asSegmentationMask()
        ];

        this._corneosclera_nns = [
            bnb.scene.getAssetManager().findImage("left_eye_corneosclera_nn")?.asSegmentationMask(),
            bnb.scene.getAssetManager().findImage("right_eye_corneosclera_nn")?.asSegmentationMask()
        ];

    }

    eyes(color) {
        const vecColor = prefabs.parseColor(color);
        this._eyes_color.setVector4(vecColor);
        for (const nn of this._eyes_nns) nn.setActive(vecColor.w !== 0);
        return this;
    }

    corneosclera(color) {
        const vecColor = prefabs.parseColor(color);
        this._corneosclera_color.setVector4(vecColor);
        for (const nn of this._corneosclera_nns) nn.setActive(vecColor.w !== 0);
        return this;
    }

    pupil(color) {
        const vecColor = prefabs.parseColor(color);
        this._pupil_color.setVector4(vecColor);
        for (const nn of this._pupil_nns) nn.setActive(vecColor.w !== 0);
        return this;
     }

    clear() {
        this.corneosclera("0 0 0 0");
        this.eyes("0 0 0 0");
        this.pupil("0 0 0 0");
    }
}

exports = {
    Eyes
}
