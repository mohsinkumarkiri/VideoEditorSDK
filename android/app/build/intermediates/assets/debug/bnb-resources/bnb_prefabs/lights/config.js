'use strict';

const prefabs = require("bnb_js/prefabs");

class Lights extends prefabs.Base {
    constructor() {
        super();
    }

    radiance(first, ...rest) {
        if (Array.isArray(first))
            return this.radiance(...first);
        const radiances = [first, ...rest];
        const size = Math.min(radiances.length, 4);
        for (let i = 0; i < size; ++i) {
            const [r, g, b, w] = radiances[i].split(" ").map((c) => parseFloat(c));
            bnb.scene.findGlobalMaterialParameter('bnb_light_rad' + i).setVector4(new bnb.Vec4(r, g, b, w));
        }
        return radiances;
    }

    direction(first, ...rest) {
        if (Array.isArray(first))
            return this.direction(...first);
        const directions = [first, ...rest];
        const size = Math.min(directions.length, 4);
        for (let i = 0; i < size; ++i) {
            const [x, y, z] = directions[i].split(" ").map((c) => parseFloat(c));
            const l2 = x*x + y*y + z*z;
            const n = l2 > 0.000001 ? 1.0 / Math.sqrt(l2) : 0.0;
            bnb.scene.findGlobalMaterialParameter('bnb_light_dir' + i).setVector4(new bnb.Vec4(x*n, y*n, z*n, 0));
        }
        return directions;
    }

    clear() {
        this.radiance(["0 0 0 0", "0 0 0 0", "0 0 0 0", "0 0 0 0"]);
    }
}

exports = {
    Lights
}