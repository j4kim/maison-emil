import * as THREE from "three";
import maison from "./maison.svg";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

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

        this.renderer.setAnimationLoop((time) => this.animate(time));

        this.addMaison();

        this.camera.position.z = 1000;
    }

    animate(time) {
        this.renderer.render(this.scene, this.camera);
    }

    async addMaison() {
        const loader = new SVGLoader();
        const data = await loader.loadAsync(maison);
        const paths = data.paths;
        const group = new THREE.Group();

        const flip = (pts) => pts.map((p) => new THREE.Vector2(p.x, -p.y));

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const material = new THREE.MeshBasicMaterial({
                color: path.color,
                side: THREE.DoubleSide,
                depthWrite: false,
            });
            const shapes = path.toShapes();
            for (let j = 0; j < shapes.length; j++) {
                const shape = new THREE.Shape(flip(shapes[j].getPoints()));
                const geometry = new THREE.ShapeGeometry(shape);
                const mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
            }
        }
        this.scene.add(group);
    }
}
