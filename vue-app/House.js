import * as THREE from "three";
import { HOME_H, HOME_W, WIN_H, WIN_W } from "./Scene";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { getShutterData } from "./utils";
import interiorUrl from "./interior.jpg";

export class House extends THREE.Group {
    constructor(svgUrl) {
        super();
        this.svgUrl = svgUrl;
        this.windows = [];
        this.root = new THREE.Group();
        this.add(this.root);
    }

    static async init(svgUrl) {
        const house = new House(svgUrl);
        await house.load();
        return house;
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
                const { windowId, side } = getShutterData(path.userData.node);
                if (windowId) {
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
                this.root.add(mesh);
            }
        }
    }

    addWindowBackgrounds() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(interiorUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        this.windows.forEach((win, id) => {
            const background = new THREE.Mesh(
                new THREE.PlaneGeometry(WIN_W + 25, WIN_H + 25),
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
