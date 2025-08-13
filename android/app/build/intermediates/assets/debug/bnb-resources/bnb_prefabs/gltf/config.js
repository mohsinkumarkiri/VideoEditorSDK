'use strict';

const prefabs = require("bnb_js/prefabs");

class Gltf extends prefabs.Base {
    constructor(faceIndex=0) {
        super();
        const entity = bnb.scene.getRoot().findChildByName(`gltf:${faceIndex}`);
        this._transform = entity.getComponent(bnb.ComponentType.TRANSFORMATION).asTransformation();
        this._meshInstance = entity.getComponent(bnb.ComponentType.MESH_INSTANCE).asMeshInstance();
        this._physics = this._meshInstance.getPhysicsSimulator();

        const cut_entity = bnb.scene.getRoot().findChildByName(`cut:${faceIndex}`);
        this._cutMeshInstance = cut_entity.getComponent(bnb.ComponentType.MESH_INSTANCE).asMeshInstance();
        this._cutMesh = bnb.scene.getAssetManager().findMesh("cut");
        this._headCutPath = "/bnb_prefabs/gltf/meshes/cut.bsm2";
        this._headWithEarsCutPath = "/bnb_prefabs/gltf/meshes/cut_ears.bsm2";

    }

    cut(param){
        switch(param){
            case "head":
                bnb.scene.getAssetManager().uploadMeshData(this._cutMesh, this._headCutPath);
                this._cutMeshInstance.setVisible(true);
                return;
            case "head_with_ears":
                bnb.scene.getAssetManager().uploadMeshData(this._cutMesh, this._headWithEarsCutPath);
                this._cutMeshInstance.setVisible(true);
                return;
            default:
                    throw Error("Invalid cut name or path! Availale cut names: 'head', 'head_with_ears'.");
        }
    }

    translation(tr) {
        const [x, y, z] = tr.split(" ").map((c) => parseFloat(c));
        this._transform.setTranslation(new bnb.Vec3(x, y, z));
        return this;
    }

    scale(scale) {
        const [x, y, z] = scale.split(" ").map((c) => parseFloat(c));
        this._transform.setScale(new bnb.Vec3(x, y, z));
        return this;
    }

    rotation(rot) {
        const [x, y, z] = rot.split(" ").map((c) => parseFloat(c));
        this._transform.setRotation(new bnb.Vec3(x, y, z));
        return this;
    }

    gravity(vector) {
        const [x, y, z] = vector.split(" ").map((c) => parseFloat(c));
        this._physics?.setGravity(new bnb.Vec3(x, y, z));
        return this;
    }   

    damping(value) {
        this._physics?.setDamping(parseFloat(value));
    }

    bones(obj) {
        for(const [bone, weight] of Object.entries(obj))
            this._physics?.setInvMass(bone, parseFloat(weight));
    }

    colliders(array) {
        array.forEach((el,index)=>{
            const [x, y, z] = el["center"].split(" ").map((c) => parseFloat(c));
            this._physics?.setSphereCollider(index, new bnb.Vec3(x, y, z), el["radius"]);
        })
    }

    constraints(array) {
        array.forEach((el)=>{
            this._physics?.setConstraint(el["from"], el["to"], el["distance"]);
        })
    }

    bonesInMvSpace(param){
        this._physics?.setBonesInMvSpace(param);
    }

    animation({name, mode="loop", seek_position=0}) {
        if (name !== undefined) {
            const bnbMode = bnb.AnimationMode[mode.toUpperCase()];
            this._meshInstance.animationChange(name, bnbMode);
        }
 
        // ms to ns:
        this._meshInstance.animationSeek(seek_position * 1000);
        
        this._meshInstance.animationPlay();
    }

    _mesh() {}
    _usePhysics() {}

    clear() {
        this._cutMeshInstance.setVisible(false)
        this.translation("0 0 0");
        this.scale("1 1 1");
        this.rotation("0 0 0");
        this._physics?.reset();
    }
}

exports = {
    Gltf
}
