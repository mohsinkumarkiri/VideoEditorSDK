const { Base } = require("bnb_js/prefabs")
const { MakeupBase, FaceRegion } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class MakeupConcealer extends Base {
    region = new FaceRegion("concealer", settings)

    setPrefabSettings(state) {
        this.clear()
        MakeupBase.apply(this.region, state)
    }

    clear() {
        this.region.clear()
    }
}

exports = {
    MakeupConcealer
}