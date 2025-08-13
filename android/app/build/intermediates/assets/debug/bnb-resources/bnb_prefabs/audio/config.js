'use strict';

const prefabs = require("bnb_js/prefabs");

class Audio extends prefabs.Base {
    constructor(soundIdx=0) {
        super();
        this.audio = bnb.scene.getAssetManager().createAudioTrack(`prefab_audio:${soundIdx}`);
        this.clear();
    }

    filename(path) {
        this.path = path;
        return this;
    }

    start(pos) {
        this.startPos = pos;
        return this;
    }

    end(pos) {
        this.endPos = pos;
        return this;
    }

    loop(loop) {
        this.loopFlag = loop;
        return this;
    }

    volume(level) {
        this.volumeLevel = level;
        return this;
    }

    clear() {
        this.audio.asMedia().stop();
        this.path = "";
        this.startPos = 0;
        this.endPos = null;
        this.loopFlag = true;
        this.volumeLevel = null;
    }

    startPrefab() {
        if (this.path.length == 0) {
            throw Error("'filename is mandatory'");
        }
        this.audio.load(this.path);
        this.audio.asMedia().setStartPosition(this.startPos);
        if (this.endPos) {
            this.audio.asMedia().setEndPosition(this.endPos);
        }
        this.audio.asMedia().setLooped(this.loopFlag);
        if (this.volumeLevel) {
            this.audio.setVolume(this.volumeLevel);
        }
        this.audio.asMedia().play();
    }
}

exports = {
    Audio
}