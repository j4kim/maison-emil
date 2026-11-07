import * as THREE from "three";
import maisonSvg from "./maison.svg";
import { GPUPicker } from "three_gpu_picking";
import { House } from "./House";

export const HOME_H = 704; // todo : get values from House
export const HOME_W = 512;

export class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setAnimationLoop((time) => this.animate(time));

        House.init(maisonSvg).then((house) => {
            this.house = house;
            this.scene.add(this.house);
        });

        this.camera.position.z = 600;
        this.camera.position.y = HOME_H / 3;
        this.camera.rotation.x = Math.PI / 32;

        this.picker = new GPUPicker(
            THREE,
            this.renderer,
            this.scene,
            this.camera,
        );
    }

    animate(time) {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * @param {PointerEvent} ev
     * @returns {?number} windowId
     */
    pickWindow(ev) {
        var objectId = this.picker.pick(
            ev.clientX * window.devicePixelRatio,
            ev.clientY * window.devicePixelRatio,
            (obj) => obj.pickTarget,
        );
        if (objectId > 0) {
            const obj = this.scene.getObjectById(objectId);
            return obj.windowId;
        }
    }
}
