const { Base } = require("bnb_js/prefabs")
const { MakeupBase, FaceRegion } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class MakeupEyebrows extends Base {
    region = new FaceRegion("eyebrows", settings, ["lbrow_nn", "rbrow_nn"])

    setPrefabSettings(state) {
        this.clear()
        MakeupBase.apply(this.region, state)
        bnb.scene.enableRecognizerFeature(bnb.FeatureID.BROWS_CORRECTION)
    }

    clear() {
        bnb.scene.disableRecognizerFeature(bnb.FeatureID.BROWS_CORRECTION)
        this.region.clear()
    }
}

exports = {
    MakeupEyebrows
}