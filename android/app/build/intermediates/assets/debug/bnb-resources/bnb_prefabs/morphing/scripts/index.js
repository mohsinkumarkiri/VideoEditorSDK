'use strict';

const prefabs = require("bnb_js/prefabs");

const assets = bnb.scene.getAssetManager()
const DummyVector4 = {
  x: 0,
  y: 0,
  z: 0,
  w: 0,
}
const DummyParameter = {
  getName() {
    return "DummyParameter"
  },
  getVector4() {
    return DummyVector4
  },
  setVector4() {
    return // do nothing
  },
}
class Morphing extends prefabs.Base {
    constructor(faceIndex=0) {
        super()
        this._morphs_00 = DummyParameter; 
        this._morphs_04 = DummyParameter; 
        this._morphs_08 = DummyParameter; 
        this._morphs_12 = DummyParameter; 
        this._morphs_16 = DummyParameter; 
        this._morphs_20 = DummyParameter; 
        this._morphs_24 = DummyParameter; 
        this._morphs_28 = DummyParameter; 
        this._morphs_32 = DummyParameter; 
        this._morphs_36 = DummyParameter; 

        const materialName = `shaders/morphing/draw:${faceIndex}`
        const material = assets.findMaterial(materialName)
        if (!material) {
            bnb.log(`[WARN] Unable to find material "${materialName}"`)
            return
        }

        const parameters = material.getParameters()
        this._morphs_00 = parameters.find((parameter) => parameter.getName() == "morphs_00") 
        this._morphs_04 = parameters.find((parameter) => parameter.getName() == "morphs_04")   
        this._morphs_08 = parameters.find((parameter) => parameter.getName() == "morphs_08")   
        this._morphs_12 = parameters.find((parameter) => parameter.getName() == "morphs_12")   
        this._morphs_16 = parameters.find((parameter) => parameter.getName() == "morphs_16")   
        this._morphs_20 = parameters.find((parameter) => parameter.getName() == "morphs_20")   
        this._morphs_24 = parameters.find((parameter) => parameter.getName() == "morphs_24") 
        this._morphs_28 = parameters.find((parameter) => parameter.getName() == "morphs_28") 
        this._morphs_32 = parameters.find((parameter) => parameter.getName() == "morphs_32") 
        this._morphs_36 = parameters.find((parameter) => parameter.getName() == "morphs_36") 
    }
    /** Set all morph weights, w should be an array with 37 weights in order:
       0 Eyebrows spacing         - Adjusting the space between the eyebrows [-1;1]
       1 Eyebrows height          - Raising/lowering the eyebrows [-1;1]
       2 Eyebrows bend            - Adjusting the bend of the eyebrows [-1;1]
       3 Eyes enlargement         - Enlarging the eyes [0;1]
       4 Eyes rounding            - Adjusting the roundness of the eyes [0;1]
       5 Eyes height              - Raising/lowering the eyes [-1;1]
       6 Eyes spacing             - Adjusting the space between the eyes [-1;1]
       7 Eyes squint              - Making the person squint by adjusting the eyelids [-1;1]
       8 Lower eyelid position    - Raising/lowering the lower eyelid [-1;1]
       9 Lower eyelid size        - Enlarging/shrinking the lower eyelid [-1;1]
      10 Nose length              - Adjusting the nose length [-1;1]
      11 Nose width               - Adjusting the nose width [-1;1]
      12 Nose tip width           - Adjusting the nose tip width [0;1]
      13 Lips height              - Raising/lowering the lips [-1;1]
      14 Lips size                - Adjusting the width and vertical size of the lips [-1;1]
      15 Lips thickness           - Adjusting the thickness of the lips [-1;1]
      16 Mouth size               - Adjusting the size of the mouth [-1;1]
      17 Smile                    - Making a person smile [0;1]
      18 Lips shape               - Adjusting the shape of the lips [-1;1]
      19 Face narrowing           - Narrowing the face [0;1]
      20 Face V-shape             - Shrinking the chin and narrowing the cheeks [0;1]
      21 Cheekbones narrowing     - Narrowing the cheekbones [-1;1]
      22 Cheeks narrowing         - Narrowing the cheeks [0;1]
      23 Jaw narrowing            - Narrowing the jaw [0;1]
      24 Chin shortening          - Decreasing the length of the chin [0;1]
      25 Chin narrowing           - Narrowing the chin [0;1]
      26 Sunken cheeks            - Sinking the cheeks and emphasizing the cheekbones [0;1]
      27 Cheeks and jaw narrowing - Narrowing the cheeks and the jaw [0;1]
      28 Jaw                      - wide / thin [0;1]
      29 Nose                     - down / up + Expression SmileClosed [0;1]
      30 Eyes Down                - [0;1]
      31 Eyelid upper             - [0;1]
      32 Eyelid lower             - [0;1]
      33 Face Chin                - [0;1]
      34 Forehead                 - [0;1]
      35 Nose sellion             - [0;1]
      36 Lips Sharp               - [0;1]
    */
    weights(w) {
        this._morphs_00.setVector4(new bnb.Vec4(w[0],  w[1],  w[2],  w[3]));
        this._morphs_04.setVector4(new bnb.Vec4(w[4],  w[5],  w[6],  w[7]));
        this._morphs_08.setVector4(new bnb.Vec4(w[8],  w[9],  w[10], w[11]));
        this._morphs_12.setVector4(new bnb.Vec4(w[12], w[13], w[14], w[15]));
        this._morphs_16.setVector4(new bnb.Vec4(w[16], w[17], w[18], w[19]));
        this._morphs_20.setVector4(new bnb.Vec4(w[20], w[21], w[22], w[23]));
        this._morphs_24.setVector4(new bnb.Vec4(w[24], w[25], w[26], w[27]));
        this._morphs_28.setVector4(new bnb.Vec4(w[28], w[29], w[30], w[31]));
        this._morphs_32.setVector4(new bnb.Vec4(w[32], w[33], w[34], w[35]));
        this._morphs_36.setVector4(new bnb.Vec4(w[36], 0,     0,     0));
        return this;
    }
    /** Set eyebrows morph params. Params should be a number (only spacing), or object with properties:
        spacing - Adjusting the space between the eyebrows [-1;1]
        height  - Raising/lowering the eyebrows [-1;1]
        bend    - Adjusting the bend of the eyebrows [-1;1]
    **/
    eyebrows(params) {
        if (typeof params === "number")
            this._morphs_00.setX(params);
        if (typeof params === "object") {
            let array = Object.keys(params);
            array.includes("spacing") && this._morphs_00.setX(params.spacing);
            array.includes("height") && this._morphs_00.setY(params.height);
            array.includes("bend") && this._morphs_00.setZ(params.bend);
        }
        return this;
    }
    /** Set eyes morph params. Params should be a number (only rounding), or object with properties:
        rounding          - Adjusting the roundness of the eyes [0;1]
        enlargement       - Enlarging the eyes [0;1]
        height            - Raising/lowering the eyes [-1;1]
        spacing           - Adjusting the space between the eyes [-1;1]
        squint            - Making the person squint by adjusting the eyelids [-1;1]
        lower_eyelid_pos  - Raising/lowering the lower eyelid [-1;1]
        lower_eyelid_size - Enlarging/shrinking the lower eyelid [-1;1]
        down              - Eyes down [0;1]
        eyelid_upper      - Eyelid upper [0;1]
        eyelid_lower      - Eyelid lower [0;1]
    **/
    eyes(params) {
        if (typeof params === "number")
            this._morphs_04.setX(params);
        if (typeof params === "object") {
            let array = Object.keys(params);
            array.includes("enlargement") && this._morphs_00.setW(params.enlargement);
            array.includes("rounding") && this._morphs_04.setX(params.rounding);
            array.includes("height") && this._morphs_04.setY(params.height);
            array.includes("spacing") && this._morphs_04.setZ(params.spacing);
            array.includes("squint") && this._morphs_04.setW(params.squint);
            array.includes("lower_eyelid_pos") && this._morphs_08.setX(params.lower_eyelid_pos);
            array.includes("lower_eyelid_size") && this._morphs_08.setY(params.lower_eyelid_size);
            array.includes("down") && this._morphs_28.setZ(params.down);
            array.includes("eyelid_upper") && this._morphs_28.setW(params.eyelid_upper);
            array.includes("eyelid_lower") && this._morphs_32.setX(params.eyelid_lower);
        }
        return this;
    }
    /** Set nose morph params. Params should be a number (only width), or object with properties:
        width     - Adjusting the nose width [-1;1]
        length    - Adjusting the nose length [-1;1]
        tip_width - Adjusting the nose tip width [0;1]
        down_up   - Nose down/up [0;1]
        sellion   - Nose sellion [0;1]
    **/
    nose(params) {
        if (typeof params === "number")
            this._morphs_08.setW(params);
        if (typeof params === "object") {
            let array = Object.keys(params);
            array.includes("width") && this._morphs_08.setW(params.width);
            array.includes("length") && this._morphs_08.setZ(params.length);
            array.includes("tip_width") && this._morphs_12.setX(params.tip_width);
            array.includes("down_up") && this._morphs_28.setY(params.down_up);
            array.includes("sellion") && this._morphs_32.setW(params.sellion);
        }
        return this;
    }
    /** Set lips morph params. Params sould be a number (only size), or object with properties:
        size       - Adjusting the width and vertical size of the lips [-1;1]
        height     - Raising/lowering the lips [-1;1]
        thickness  - Adjusting the thickness of the lips [-1;1]
        mouth_size - Adjusting the size of the mouth [-1;1]
        smile      - Making a person smile [0;1]
        shape      - Adjusting the shape of the lips [-1;1]
        sharp      - Lips Sharp [0;1]
    **/
    lips(params) {
        if (typeof params === "number")
            this._morphs_12.setZ(params);
        if (typeof params === "object") {
            let array = Object.keys(params);
            array.includes("size") && this._morphs_12.setZ(params.size);
            array.includes("height") && this._morphs_12.setY(params.height);
            array.includes("thickness") && this._morphs_12.setW(params.thickness);
            array.includes("mouth_size") && this._morphs_16.setX(params.mouth_size);
            array.includes("smile") && this._morphs_16.setY(params.smile);
            array.includes("shape") && this._morphs_16.setZ(params.shape);
            array.includes("sharp") && this._morphs_36.setX(params.sharp);
        }
        return this;
    }
    /** Set face morph params. Params sould be a number (only narrowing), or object with properties:
        narrowing            - Narrowing the face [0;1]
        v_shape              - Shrinking the chin and narrowing the cheeks [0;1]
        chekbones_narrowing  - Narrowing the cheekbones [-1;1]
        cheeks_narrowing     - Narrowing the cheeks [0;1]
        jaw_narrowing        - Narrowing the jaw [0;1]
        chin_shortening      - Decreasing the length of the chin [0;1]
        chin_narrowing       - Narrowing the chin [0;1]
        sunken_cheeks        - Sinking the cheeks and emphasizing the cheekbones [0;1]
        cheeks_jaw_narrowing - Narrowing the cheeks and the jaw [0;1]
        jaw_wide_thin        - Jaw wide/thin [0;1]
        chin                 - Face Chin [0;1]
        forehead             - Forehead [0;1]
    **/
    face(params) {
        if (typeof params === "number")
            this._morphs_16.setW(params);
        if (typeof params === "object") {
            let array = Object.keys(params);
            array.includes("narrowing") && this._morphs_16.setW(params.narrowing);
            array.includes("v_shape") && this._morphs_20.setX(params.v_shape);
            array.includes("cheekbones_narrowing") && this._morphs_20.setY(params.cheekbones_narrowing);
            array.includes("cheeks_narrowing") && this._morphs_20.setZ(params.cheeks_narrowing);
            array.includes("jaw_narrowing") && this._morphs_20.setW(params.jaw_narrowing);
            array.includes("chin_shortening") && this._morphs_24.setX(params.chin_shortening);
            array.includes("chin_narrowing") && this._morphs_24.setY(params.chin_narrowing);
            array.includes("sunken_cheeks") && this._morphs_24.setZ(params.sunken_cheeks);
            array.includes("cheeks_jaw_narrowing") && this._morphs_24.setW(params.cheeks_jaw_narrowing);
            array.includes("jaw_wide_thin") && this._morphs_28.setX(params.jaw_wide_thin);
            array.includes("chin") && this._morphs_32.setY(params.chin);
            array.includes("forehead") && this._morphs_32.setZ(params.forehead);
        }
        return this;
    }
    /** Resets all morphs */
    clear() {
        this.weights([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]);
    }

}

exports = {
    Morphing
}
