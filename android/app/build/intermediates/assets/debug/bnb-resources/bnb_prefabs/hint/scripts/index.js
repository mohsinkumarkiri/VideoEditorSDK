'use strict';

const prefabs = require("bnb_js/prefabs");

let defaultFont;

class Hint extends prefabs.Base {
    constructor(spriteIdx=0) {
        super();
        const assets = bnb.scene.getAssetManager();

        const materialName = `shaders/hint/text:${spriteIdx}`
        const material = assets.findMaterial(materialName)
        if (!material) {
          bnb.log(`[WARN] Unable to find material "${materialName}"`)
          return
        }
    
        const parameters = material.getParameters()
        //TODO: unique uniforms
        this._color = parameters.find((parameter) => parameter.getName() == "text_color") 

        this._text_texture = bnb.scene.getAssetManager().findImage(`text_texture:${spriteIdx}`)?.asTextTexture();
        defaultFont = this._text_texture.getFont();

        this._entity = bnb.scene.getRoot().findChildByName(`hint_surface:${spriteIdx}`);
        this._transform = this._entity.getComponent(bnb.ComponentType.TRANSFORMATION).asTransformation();
    }

    font(filename) {
        this._text_texture.setFont(filename);
        return this;
    }

    color(color) {
        this._color.setVector4(prefabs.parseColor(color));
    }

    size(sz){
        let surfWidth = bnb.scene.getSurfaceWidth();
        let surfHeight =  bnb.scene.getSurfaceHeight();

        const [w, h] = sz.split(" ").map((c) => parseFloat(c));
        this._text_texture.setWidth(w);
        this._text_texture.setHeight(h);
        this._transform.setScale(new bnb.Vec3(w / surfWidth , h / surfWidth, 1));
        return this;
    }

    text(t){
        this._text_texture.setText(t);
        return this;
    }

    translation(tr){
        let surfWidth = bnb.scene.getSurfaceWidth();
        let surfHeight =  bnb.scene.getSurfaceHeight();

        const [x, y] = tr.split(" ").map((c) => parseFloat(c));
        this._transform.setTranslation(new bnb.Vec3(x/surfWidth, y/surfHeight, 1));
        return this;
    }

    rotation(rot){
        const [x, y, z] = rot.split(" ").map((c) => parseFloat(c));
        this._transform.setRotation(new bnb.Vec3(x, y, z));
        return this;
    }

    clear(){
        this.font(defaultFont);
        this.color("1 1 1 1");
        this.size('100 100');
        this.text("");
        this.translation("0 0");
        this.rotation("0 0 0");
    }
}

exports = {
    Hint
}