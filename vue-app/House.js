import * as THREE from "three";
import { HOME_H, HOME_W } from "./Scene";
import { SVGLoader } from "three/examples/jsm/Addons.js";

export class House extends THREE.Group {
    constructor(svgUrl) {
        super();
        this.svgUrl = svgUrl;
        this.windows = [];
        this.root = new THREE.Group();
        this.add(this.root);
        this.load();
    }

    async load() {
        await this.loadSvg();
        this.addWindowBackgrounds();
        this.root.position.set(-HOME_W / 2, HOME_H);
    }

    async loadSvg() {
        const loader = new SVGLoader();
        const data = await loader.loadAsync(this.svgUrl);
        const paths = data.paths;

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
                this.root.add(mesh);
            }
        }
    }

    addWindowBackgrounds() {
        const material = new THREE.MeshBasicMaterial({
            color: 0x1a1715,
            side: THREE.DoubleSide,
        });
        this.windows.forEach((win, id) => {
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
            this.root.add(background);
        });
    }
}
