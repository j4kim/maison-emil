import * as THREE from "three";
import maison from "./maison.svg";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { flipShape } from "./utils";
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
                const shape = flipShape(shapes[j]);
                const geometry = new THREE.ShapeGeometry(shape);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = path.userData.node.id;
                mesh.dataset = { ...path.userData.node.dataset };
                group.add(mesh);
            }
        }
        group.position.set(-HOME_W / 2, HOME_H);
        this.scene.add(group);
    }

    pick(ev) {
        var objectId = this.picker.pick(
            ev.clientX * window.devicePixelRatio,
            ev.clientY * window.devicePixelRatio,
        );
        console.log(objectId);
    }
}
