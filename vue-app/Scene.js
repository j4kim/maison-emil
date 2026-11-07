import * as THREE from "three";
import maisonSvg from "./assets/maison.svg";
import { GPUPicker } from "three_gpu_picking";
import { House } from "./House";
import gsap from "gsap";

export const HOME_H = 704; // todo : get values from House
export const HOME_W = 512;
export const WIN_W = 32;
export const WIN_H = 64;
export const INITIAL_CAMERA_POS = [0, HOME_H, 100];
export const INITIAL_CAMERA_ROT = [0.6, 0, 0];
export const DEFAULT_CAMERA_POS = [0, HOME_H / 3, 600];
export const DEFAULT_CAMERA_ROT = [Math.PI / 32, 0, 0];

export class Scene {
    constructor(canvas) {
        this.initialized = false;

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

        this.camera.position.set(...INITIAL_CAMERA_POS);
        this.camera.rotation.set(...INITIAL_CAMERA_ROT);

        this.picker = new GPUPicker(
            THREE,
            this.renderer,
            this.scene,
            this.camera,
        );
    }

    async init() {
        this.house = await House.init(maisonSvg);
        this.scene.add(this.house);
        this.initialized = true;
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

    focusWindow(win, duration = 2, ease = "power1.out") {
        const { x, y } = this.getWindowCenter(win);
        const z = 80;
        gsap.to(this.camera.position, { x, y, z, duration, ease });
        gsap.to(this.camera.rotation, { x: 0, duration, ease });
    }

    zoomOut(duration = 2, ease = "power1.inOut") {
        const [x, y, z] = DEFAULT_CAMERA_POS;
        gsap.to(this.camera.position, { x, y, z, duration, ease });
        gsap.to(this.camera.rotation, {
            x: DEFAULT_CAMERA_ROT[0],
            duration,
            ease,
        });
    }

    openWindow(win, ease = "power1.out") {
        gsap.to(win.l.rotation, { y: -Math.PI, duration: 1, ease });
        gsap.to(win.r.rotation, { y: Math.PI, duration: 1, ease });
    }
}
