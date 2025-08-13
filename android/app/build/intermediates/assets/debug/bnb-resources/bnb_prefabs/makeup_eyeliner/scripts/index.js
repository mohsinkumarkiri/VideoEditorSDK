const { Base } = require("bnb_js/prefabs")
const { MakeupBase, FaceRegion } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class MakeupEyeliner extends Base {
    region = new FaceRegion("eyeliner", settings)

    setPrefabSettings(state) {
        this.clear()
        MakeupBase.apply(this.region, state)
        bnb.scene.enableRecognizerFeature(bnb.FeatureID.EYES_CORRECTION)
    }

    clear() {
        bnb.scene.disableRecognizerFeature(bnb.FeatureID.EYES_CORRECTION)
        this.region.clear()
    }
}

exports = {
    MakeupEyeliner
}