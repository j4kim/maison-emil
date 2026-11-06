import * as THREE from "three";
import maison from "./maison.svg";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { GPUPicker } from "three_gpu_picking";

const HOME_H = 704;
const HOME_W = 512;

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

        this.windows = [];

        this.addMaison();

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

    async addMaison() {
        const loader = new SVGLoader();
        const data = await loader.loadAsync(maison);
        const paths = data.paths;
        const group = new THREE.Group();

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false,
            });
            const shapes = path.toShapes();
            for (let j = 0; j < shapes.length; j++) {
                const geometry = new THREE.ShapeGeometry(shapes[j]);
                geometry.scale(1, -1, 1);
                const mesh = new THREE.Mesh(geometry, material);
                const windowId = +path.userData.node.dataset.window;
                if (windowId) {
                    const side = path.userData.node.dataset.side;
                    geometry.computeBoundingBox();
                    const bounds = geometry.boundingBox;
                    const pivotX = side === "l" ? bounds.min.x : bounds.max.x;
                    const pivotY = (bounds.min.y + bounds.max.y) / 2;
                    geometry.translate(-pivotX, -pivotY, 0);
                    mesh.position.set(pivotX, pivotY, 0);
                    const win = this.windows[windowId] ?? {};
                    win[side] = mesh;
                    this.windows[windowId] = win;
                }
                mesh.name = path.userData.node.id;
                mesh.dataset = { ...path.userData.node.dataset };
                group.add(mesh);
            }
        }
        group.position.set(-HOME_W / 2, HOME_H);
        this.scene.add(group);
        await this.addWindowBackgrounds(group);
    }

    async addWindowBackgrounds(group) {
        const material = new THREE.MeshBasicMaterial({
            color: 0x1a1715,
            side: THREE.DoubleSide,
        });
        this.windows.forEach(function (win, id) {
            const background = new THREE.Mesh(
                new THREE.PlaneGeometry(32 + 25, 64 + 25),
                material,
            );
            background.position.set(
                (win.l.position.x + win.r.position.x) / 2,
                (win.l.position.y + win.r.position.y) / 2,
                -10,
            );
            background.pickTarget = true;
            background.windowId = id;
            background.renderOrder = -1;
            group.add(background);
        });
    }

    pick(ev) {
        var objectId = this.picker.pick(
            ev.clientX * window.devicePixelRatio,
            ev.clientY * window.devicePixelRatio,
            (obj) => obj.pickTarget,
        );
        if (objectId > 0) {
            const obj = this.scene.getObjectById(objectId);
            this.openWindow(obj.windowId);
        }
    }

    openWindow(windowId) {
        const win = this.windows[windowId];
        if (win.isOpen) {
            win.l.rotation.y = 0;
            win.r.rotation.y = 0;
        } else {
            win.l.rotation.y = -1 * Math.PI;
            win.r.rotation.y = Math.PI;
        }
        win.isOpen = !win.isOpen;
    }
}
