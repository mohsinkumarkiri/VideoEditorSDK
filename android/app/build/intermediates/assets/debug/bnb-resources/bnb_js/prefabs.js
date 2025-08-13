'use strict';

/**
 * Convert color from `string` to `bnb.Vec4`
 * @param {string} color String representing color (3 or 4 components). 
 * E.g. `"0.5 0.4 0.3 1"`, `"255 0 0"`, "#00FF00", "FF10C0FF"
 * @returns {bnb.Vec4}
 */
function parseColor(color) {
    const splittedComp = color.split(' ');
    let resultArray;

    if (splittedComp.length > 1) {
        // "0.5 0.5 0.5" or "100 100 100 255" case
        resultArray = splittedComp.map((comp) => parseFloat(comp));
        if (Math.max(...resultArray) > 1) {
            resultArray = resultArray.map((val) => val / 255);
        }
        if (resultArray.length < 4) {
             // Append alpha 1.0
            resultArray.push(1);
        }
    } else {
        // "#RRGGBB" or "RRGGBBAA" hex case
        if(color[0] == '#') {
            // remove leading '#'
            color = color.slice(1);
        }
        if (color.length < 8) {
            // Append alpha 1.0
            color += 'FF';
        }
        resultArray = color.match(/.{2}/g).map(
            (hexComp) => parseInt(hexComp, 16) / 255
        );
    }

    let hasNan = false;
    resultArray.map((val) => {
        if(isNaN(val)) hasNan = true; 
    });
    if (hasNan || resultArray.length != 4) {
        throw Error(`Invalid color '${color}'. Possible values: 
            '0.5 0.5 0.5', '100 100 100 255', '#0C28DD'`)
    }
    return new bnb.Vec4(...resultArray);
}

class Base {
    setPrefabSettings(state) {
        this.clear(); 

        for (let [method, args] of Object.entries(state)) {
            method = snake2camelCase(method);
            method = removeAtSymbol(method);

            if (method in this) {
                this[method](args);
            } else {
                throw new Error(
                    `'${this.constructor.name}' has no '${method}' state property.`);
            }
        }

        if (this?.startPrefab !== undefined) {
            this.startPrefab();
        }
    }
}

function snake2camelCase(snake) {
    const parts = snake.split('_');
    return parts.reduce((result, part) => 
        result + part.charAt(0).toUpperCase() + part.slice(1)
    );
}

function removeAtSymbol(name) {
    if (name[0] == '@') {
        return '_' + name.slice(1);
    }
    return name;
}

exports = {
    Base,
    parseColor
}
