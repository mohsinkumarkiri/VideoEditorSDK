const prefabs = require("bnb_js/prefabs");

var ColoringMode;
(function (ColoringMode) {
    /* 0 */ ColoringMode[ColoringMode["SolidColor"] = 0] = "SolidColor";
    /* 1 */ ColoringMode[ColoringMode["Gradient"] = 1] = "Gradient";
    /* 2 */ ColoringMode[ColoringMode["Strands"] = 2] = "Strands";
})(ColoringMode || (ColoringMode = {}));

class Hair extends prefabs.Base {
    constructor(faceIndex=0) {
        super();
        const mat = bnb.scene.getAssetManager().findMaterial("shaders/hair/hair");
        this._colors = [];
        for (let i = 0; i < 5; ++i) {
            const param = mat.findParameter(`var_hair_color${i}`);
            param && this._colors.push(param);
        }
        this._mode = mat.findParameter("var_hair_colors_count_mode");
        this._nns = [];
        for (const segmentationMask of ["hair_nn", "hair_strand_nn"]) {
            const nn = bnb.scene.getAssetManager().findImage(segmentationMask)?.asSegmentationMask();
            nn && this._nns.push(nn);
        }
    }

    color(first, ...rest) {
        var _a;
        if (Array.isArray(first))
            return this.color(...first);
        const colors = [first, ...rest];
        this._mode.setX(colors.length);
        this._mode.setY(colors.length === 1 ? ColoringMode.SolidColor : ColoringMode.Gradient);
        this._nns[0].setActive(true);
        this._nns[1].setActive(false);
        for (let i = 0; i < colors.length; ++i) {
            this._colors[i].setVector4(prefabs.parseColor(colors[i] ?? "0 0 0"));
        }
        return colors;
    }

    strands(first, ...rest) {
        var _a;
        if (Array.isArray(first))
            return this.strands(...first);
        const colors = [first, ...rest];
        this._mode.setX(5);
        this._mode.setY(colors.length === 1 ? ColoringMode.SolidColor : ColoringMode.Strands);
        this._nns[0].setActive(false);
        this._nns[1].setActive(true);
        for (let i = 0; i < 5; ++i) {
            this._colors[i].setVector4(prefabs.parseColor(colors[i] ?? "0 0 0"));
        }
        return colors;
    }

    clear() {
        this.strands("0 0 0 0");
        this.color("0 0 0 0");

        for (const nn of this._nns) nn.setActive(false)
    }
}

exports = {
    Hair
}