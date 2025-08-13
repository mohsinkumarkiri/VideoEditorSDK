const { Base } = require("bnb_js/prefabs")
const { FaceRegion } = require("./region.js")

class MakeupBase extends Base {
  constructor(faceIndex=0) {
    if (faceIndex !== 0) {
      bnb.log(`ERROR: MakeupBase prefab support only face index 0, got ${faceIndex}`)
      return
    }

    super(faceIndex)

    this._mode = "speed"

    const assets = bnb.scene.getAssetManager()
    this._fakeSkin = assets.findMaterial("shaders/nn_combine").findParameter("fake_skin_nn_active")
    this._skinNN = assets.findImage("skin_nn").asSegmentationMask()
    this._smooth = assets.findMaterial("shaders/smooth/smooth").findParameter("smooth_weights")
    this._smokey = assets.findMaterial("shaders/face_tex").findParameter("smokey_eyes_index")

    this.mode()
  }

  static apply(region, { color, finish, coverage, strength }) {
    if (typeof coverage === "undefined") coverage = strength // backward compatibility with old coverage name

    const makeupRegion = region
    const regionSettings = region.settings

    const finishSettings = finish instanceof Object ? finish : regionSettings[finish]
    if (!finishSettings) {
      bnb.log(`[WARN] The finish "${finish}" does not exist in region "${region.name}"`)
      return
    }
    if (Object.keys(finishSettings).length < 5) {
      bnb.log(
        `[WARN] The finish "${finish}" of region "${region.name}" is malformed: one of the A, C, K, R, P parameters is missing`
      )
    }

    const { texture, K: kSettings, ...rest } = finishSettings

    let K

    if (typeof coverage === "number") K = coverage
    else if (typeof kSettings === "number") K = kSettings
    /*
     * maps
     * "l", "lo", "low" -> "low"
     * "m", "mi", "mid" -> "mid"
     * "h", "hi", "hig", "high" -> "high"
     */ else
      for (const preset of ["low", "mid", "high"])
        if (preset.startsWith(coverage)) K = kSettings[preset]
  
    makeupRegion.color(color)
    makeupRegion.parameters({ K, ...rest })
    if (texture) makeupRegion.texture(texture)
  }

  clear() {
    this.smooth("0 1")
    this.mode("speed")
  }

  smooth(weights) {
    const [wholeFace, underEyes] = weights.split(" ").map((c) => parseFloat(c))
    const { x, y, z, w } = this._smooth.getVector4()
    this._smooth.setVector4(new bnb.Vec4(wholeFace, underEyes, z, w))
  }

  /** @param {"speed"|"quality"} [mode] */
  mode(newMode) {
    if (newMode) this._mode = newMode

    const isQualityMode = this._mode === "quality"

    this._fakeSkin.setVector4(new bnb.Vec4(isQualityMode ? 0 : 1, 0, 0, 0))
    this._skinNN.setActive(isQualityMode)
  }

  // smokey eyes index: 0 - disable smokey eyes, regular eyeshadow masks are used
  //                    1 - use red channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
  //                    2 - green channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
  //                    3 - blue channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
  //                    4 - alpha channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
  smokey(index) {
    this._smokey.setVector4(new bnb.Vec4(index, 0, 0, 0))
  }
}

exports = {
  MakeupBase,
  FaceRegion,
}
