import * as THREE from "three";
import maisonSvg from "./assets/maison.svg";
import { GPUPicker } from "three_gpu_picking";
import { House } from "./House";
import gsap from "gsap";

export const HOME_H = 704; // todo : get values from House
export const HOME_W = 512;
export const WIN_W = 32;
export const WIN_H = 64;
export const DEFAULT_CAMERA_POS = [0, HOME_H / 3, 600];
export const DEFAULT_CAMERA_ROT = [Math.PI / 32, 0, 0];

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
        this.renderer.setClearColor(0x000000, 0);

        this.renderer.setAnimationLoop((time) => this.animate(time));

        House.init(maisonSvg).then((house) => {
            this.house = house;
            this.scene.add(this.house);
        });

        this.camera.position.set(...DEFAULT_CAMERA_POS);
        this.camera.rotation.set(...DEFAULT_CAMERA_ROT);

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

    getWindowCenter(win) {
        const x = this.house.root.position.x + win.l.position.x + WIN_W / 2;
        const y = this.house.root.position.y + win.l.position.y;
        return { x, y };
    }

    focusWindow(win) {
        const { x, y } = this.getWindowCenter(win);
        const z = 80;
        gsap.to(this.camera.position, { x, y, z, duration: 1 });
        gsap.to(this.camera.rotation, { x: 0, duration: 1 });
    }

    zoomOut() {
        const [x, y, z] = DEFAULT_CAMERA_POS;
        gsap.to(this.camera.position, { x, y, z, duration: 1 });
        gsap.to(this.camera.rotation, {
            x: DEFAULT_CAMERA_ROT[0],
            duration: 1,
        });
    }

    open(win) {
        gsap.to(win.l.rotation, { y: -Math.PI, duration: 1 });
        gsap.to(win.r.rotation, { y: Math.PI, duration: 1 });
    }
}
