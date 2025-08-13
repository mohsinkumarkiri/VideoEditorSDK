const { Base } = require("bnb_js/prefabs")
const { MakeupBase, FaceRegion } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class MakeupLipstick extends Base {
    region = new FaceRegion("lipstick", settings, ["lips_nn"])

    setPrefabSettings(state) {
        this.clear()
        MakeupBase.apply(this.region, state)
        bnb.scene.enableRecognizerFeature(bnb.FeatureID.LIPS_CORRECTION)
    }

    clear() {
        bnb.scene.disableRecognizerFeature(bnb.FeatureID.LIPS_CORRECTION)
        this.region.clear()
    }
}

exports = {
    MakeupLipstick
}