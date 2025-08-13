const { Base } = require("bnb_js/prefabs")
const { MakeupBase, FaceRegion } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class MakeupLipsliner extends Base {
    region = new FaceRegion("lipsliner", settings, ["lips_nn"])
    parameter = bnb.scene.getAssetManager().findMaterial("shaders/lipsliner/liner2").findParameter("lipsliner_r1_r2")

    // r1 controls liner width, r2 controls softness
    liner(r1r2) {
        if (r1r2 === undefined) return
        const [r1, r2] = r1r2.split(" ").map((c) => parseFloat(c))
        const { x, y, z, w } = this.parameter.getVector4()
        this.parameter.setVector4(new bnb.Vec4(r1, r2, z, w))
    }

    setPrefabSettings(state) {
        this.clear()
        this.liner(state.liner)
        MakeupBase.apply(this.region, state)
    }

    clear() {
        this.liner("3 5")
        this.region.clear()
    }
}

exports = {
    MakeupLipsliner
}