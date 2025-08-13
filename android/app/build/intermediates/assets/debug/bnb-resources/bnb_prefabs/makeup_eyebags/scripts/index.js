const { Base } = require("bnb_js/prefabs")

class MakeupEyebags extends Base {
    parameter = bnb.scene.getAssetManager().findMaterial("shaders/eyebags/tone").findParameter("eyebags_alpha")

    alpha(a) {
        const { x, y, z, w } = this.parameter.getVector4()
        this.parameter.setVector4(new bnb.Vec4(a, y, z, w))
    }

    clear() {
        this.alpha(0.8)
    }
}

exports = {
    MakeupEyebags
}