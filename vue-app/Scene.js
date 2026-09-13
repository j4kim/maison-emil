import * as THREE from "three";

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

        this.camera.position.z = 384;
    }

    animate(time) {
        this.renderer.render(this.scene, this.camera);
    }

    addMaison() {
        const geometry = new THREE.PlaneGeometry(256, 320);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffee,
        });
        const facade = new THREE.Mesh(geometry, material);
        this.scene.add(facade);
    }
}
