const { Base } = require("bnb_js/prefabs")
const { MakeupBase, FaceRegion } = require("bnb_prefabs/makeup_base/scripts/index.js")

const settings = JSON.parse(require("./settings.js"))

class MakeupEyeshadow extends Base {
    regions = [
        new FaceRegion("eyeshadow0", settings),
        new FaceRegion("eyeshadow1", settings),
        new FaceRegion("eyeshadow2", settings),
    ]

    setPrefabSettings(state) {
        this.clear()
        if (state instanceof Array) {
            for (const [i, s] of state.entries()) {
                if (i > this.regions.length) break
                MakeupBase.apply(this.regions[i], s)
            }
        } else {
            MakeupBase.apply(this.regions[0], state)
        }
    }

    clear() {
        for (const region of this.regions) region.clear()
    }
}

exports = {
    MakeupEyeshadow
}