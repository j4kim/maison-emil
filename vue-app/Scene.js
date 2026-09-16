import * as THREE from "three";

export class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setAnimationLoop((time) => this.animate(time));

        this.h = 20 * 16;
        this.w = 16 * 16;

        this.addMaison();

        this.camera.position.z = 26 * 16;
        this.camera.position.y = 5 * 16;
        this.camera.rotation.x = 0.2;
    }

    animate(time) {
        this.renderer.render(this.scene, this.camera);
    }

    addMaison() {
        const maison = new THREE.Object3D();

        const geometry = new THREE.PlaneGeometry(this.w, this.h);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffee,
        });
        const facade = new THREE.Mesh(geometry, material);

        maison.add(facade);

        const toitGeo = new THREE.BufferGeometry();
        const largeurMaison = this.w;
        const hauteurFacade = this.h;
        const hauteurToit = this.h / 8;
        const xGauche = -largeurMaison / 2;
        const xDroite = largeurMaison / 2;
        const yBas = hauteurFacade; // Le bas du toit touche le haut de la façade
        const yHaut = hauteurFacade + hauteurToit; // Le sommet de la maison
        const sommets = new Float32Array([
            xGauche,
            yBas,
            0.0, // Sommet 1 : Bas gauche
            xDroite,
            yBas,
            0.0, // Sommet 2 : Bas droite
            0.0,
            yHaut,
            0.0, // Sommet 3 : Pointe du toit (centré en X)
        ]);
        toitGeo.setAttribute("position", new THREE.BufferAttribute(sommets, 3));
        const toitMat = new THREE.MeshBasicMaterial({
            color: 0xd14949,
            side: THREE.DoubleSide,
        });
        const toit = new THREE.Mesh(toitGeo, toitMat);

        this.scene.add(toit);

        maison.position.y = this.h / 2;

        this.scene.add(maison);
    }
}
