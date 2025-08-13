const { Base, parseColor } = require("bnb_js/prefabs")
const { MakeupBase } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class LipsShine {
    constructor(name, settings, segmentationMasks = []) {
        this.name = name
        this.settings = settings
        const mat = bnb.scene.getAssetManager().findMaterial("shaders/lipsshine/shiny")
        this._color = mat.findParameter("var_lips_color")
        this._saturation_brightness = mat.findParameter("var_lips_saturation_brightness")
        this._shine_intensity_bleeding_scale = mat.findParameter("var_lips_shine_intensity_bleeding_scale")
        this._glitter_bleeding_intensity_grain = mat.findParameter("var_lips_glitter_bleeding_intensity_grain")

        this._nns = []
        for (const segmentationMask of segmentationMasks) {
            const nn = bnb.scene.getAssetManager().findImage(segmentationMask)?.asSegmentationMask()
            if (nn) this._nns.push(nn)
        }
    }
    color(color) {
        this._color.setVector4(parseColor(color));
    }
    parameters({ K, SAT, BR, SI, SB, SS, GB, GI, GG }) {
        const {x: r, y: g, z: b} = this._color.getVector4()
        this._color.setVector4(new bnb.Vec4(r, g, b, K))
        const {x: sat, y: br} = this._saturation_brightness.getVector4()
        if (typeof SAT === "undefined") SAT = sat
        if (typeof BR === "undefined") BR = br
        this._saturation_brightness.setVector4(new bnb.Vec4(SAT, BR, 0, 0));
        const {x: si, y: sb, z: ss} = this._shine_intensity_bleeding_scale.getVector4()
        if (typeof SI === "undefined") SI = si
        if (typeof SB === "undefined") SB = sb
        if (typeof SS === "undefined") SS = ss
        this._shine_intensity_bleeding_scale.setVector4(new bnb.Vec4(SI, SB, SS, 0));
        const {x: gb, y: gi, z: gg} = this._glitter_bleeding_intensity_grain.getVector4()
        if (typeof GB === "undefined") GB = gb
        if (typeof GI === "undefined") GI = gi
        if (typeof GG === "undefined") GG = gg
        this._glitter_bleeding_intensity_grain.setVector4(new bnb.Vec4(GB, GI, GG, 0));
        this._show()
    }
    clear() {
        this._hide()
    }
    _show() {
        for (const nn of this._nns) nn.setActive(true)
    }
    _hide() {
        this._color.setVector4(new bnb.Vec4(0, 0, 0, 0))
        this._saturation_brightness.setVector4(new bnb.Vec4(1, 1, 0, 0))
        this._shine_intensity_bleeding_scale.setVector4(new bnb.Vec4(0, 0, 0, 0))
        this._glitter_bleeding_intensity_grain.setVector4(new bnb.Vec4(0, 0, 0, 0))
        for (const nn of this._nns) nn.setActive(false)
    }
}

class MakeupLipsshine extends Base {
    region = new LipsShine("lipsshine", settings, ["lips_shining_nn"])

    setPrefabSettings(state) {
        this.clear()
        MakeupBase.apply(this.region, state)
    }

    clear() {
        this.region.clear()
    }
}

exports = {
    MakeupLipsshine
}