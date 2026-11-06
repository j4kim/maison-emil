import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function fillOf(el, fallback) {
  const m = /fill\s*:\s*(#[0-9a-f]{3,8})/i.exec(el.getAttribute('style') || '');
  return new THREE.Color(m ? m[1] : fallback);
}

/**
 * Façade de maison construite depuis un SVG.
 * Fenêtres numérotées à partir de 1, de haut en bas puis de gauche à droite
 * (1 = haut gauche, 6 = haut droite, 7 = 2e rangée à gauche, ... 24 = bas droite).
 */
export class House extends THREE.Group {
  /**
   * @param {string} svgText contenu du fichier SVG
   * @param {object} [opts]
   * @param {number} [opts.scale=0.01]          unités Three.js par unité SVG
   * @param {number} [opts.wallDepth=8]         épaisseur du mur (unités SVG)
   * @param {number} [opts.shutterDepth=3]      épaisseur d'un volet (unités SVG)
   * @param {number} [opts.duration=0.9]        durée de l'animation (secondes)
   * @param {number|string} [opts.interiorColor=0x1b1b1b] couleur visible derrière les fenêtres
   */
  constructor(svgText, opts = {}) {
    super();
    const {
      scale = 0.01,
      wallDepth = 8,
      shutterDepth = 3,
      duration = 0.9,
      interiorColor = 0x1b1b1b,
    } = opts;

    this.duration = duration;
    this.windows = []; // { left, right, t, target }

    const root = new THREE.Group();
    root.scale.setScalar(scale);
    this.add(root);

    // ---------- Façade (SVGLoader) ----------
    const data = new SVGLoader().parse(svgText);
    const facadePath = data.paths.find((p) => p.userData.node?.id === 'facade');
    if (!facadePath) throw new Error('Élément #facade introuvable dans le SVG');

    // L'axe Y du SVG pointe vers le bas : on inverse y AVANT l'extrusion
    // (inverser après retournerait les faces).
    const flip = (pts) => pts.map((p) => new THREE.Vector2(p.x, -p.y));
    const shapes = facadePath.toShapes().map((s) => {
      const shape = new THREE.Shape(flip(s.getPoints()));
      shape.holes = s.holes.map((h) => new THREE.Path(flip(h.getPoints())));
      return shape;
    });

    const facadeGeo = new THREE.ExtrudeGeometry(shapes, { depth: wallDepth, bevelEnabled: false });
    facadeGeo.computeBoundingBox();
    const facade = new THREE.Mesh(
      facadeGeo,
      new THREE.MeshStandardMaterial({ color: facadePath.color, roughness: 0.9 })
    );
    root.add(facade);

    // Fond sombre visible à travers les trous des fenêtres
    const bb = facadeGeo.boundingBox;
    const interior = new THREE.Mesh(
      new THREE.PlaneGeometry(bb.max.x - bb.min.x, bb.max.y - bb.min.y),
      new THREE.MeshBasicMaterial({ color: interiorColor })
    );
    interior.position.set((bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2, 1);
    root.add(interior);

    // Centre la maison sur l'origine
    root.position.set(
      (-(bb.min.x + bb.max.x) / 2) * scale,
      (-(bb.min.y + bb.max.y) / 2) * scale,
      (-wallDepth / 2) * scale
    );

    // ---------- Fenêtres / volets (lecture directe du DOM du SVG) ----------
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const num = (el, a) => parseFloat(el.getAttribute(a));

    const windowGroups = [...doc.querySelectorAll('#windows g')]
      .map((g) => ({ g, rects: [...g.children].filter((c) => c.tagName.toLowerCase() === 'rect') }))
      .filter(({ rects }) => rects.length === 2)
      .map(({ rects }) => rects.sort((a, b) => num(a, 'x') - num(b, 'x')))
      // ordre de lecture : y croissant (haut -> bas), puis x croissant
      .sort((a, b) => num(a[0], 'y') - num(b[0], 'y') || num(a[0], 'x') - num(b[0], 'x'));

    // Les volets reposent sur la face avant du mur ; l'axe de charnière est
    // au centre de leur épaisseur, donc à 180° ils sont à plat contre le mur.
    const zPivot = wallDepth + 0.1 + shutterDepth / 2;

    const makeShutter = (rect, side) => {
      const x = num(rect, 'x'), y = num(rect, 'y');
      const w = num(rect, 'width'), h = num(rect, 'height');
      const pivot = new THREE.Group();
      // charnière sur le côté extérieur : bord gauche du volet gauche, bord droit du volet droit
      pivot.position.set(side === 'left' ? x : x + w, -(y + h / 2), zPivot);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, shutterDepth),
        new THREE.MeshStandardMaterial({ color: fillOf(rect, '#786055'), roughness: 0.7 })
      );
      mesh.position.x = side === 'left' ? w / 2 : -w / 2;
      pivot.add(mesh);
      root.add(pivot);
      return pivot;
    };

    for (const [l, r] of windowGroups) {
      this.windows.push({
        left: makeShutter(l, 'left'),
        right: makeShutter(r, 'right'),
        t: 0,
        target: 0,
      });
    }
  }

  static async load(url, opts) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Impossible de charger ${url} (${res.status})`);
    return new House(await res.text(), opts);
  }

  get windowCount() {
    return this.windows.length;
  }

  #get(n) {
    const w = this.windows[n - 1];
    if (!w) throw new RangeError(`Fenêtre ${n} inexistante (1..${this.windows.length})`);
    return w;
  }

  openWindow(n) { this.#get(n).target = 1; }
  closeWindow(n) { this.#get(n).target = 0; }
  toggleWindow(n) { const w = this.#get(n); w.target = w.target ? 0 : 1; }
  isOpen(n) { return this.#get(n).target === 1; }
  openAll() { this.windows.forEach((w) => (w.target = 1)); }
  closeAll() { this.windows.forEach((w) => (w.target = 0)); }

  /** À appeler à chaque frame avec le delta en secondes (clock.getDelta()). */
  update(dt) {
    const step = dt / this.duration;
    for (const w of this.windows) {
      if (w.t === w.target) continue;
      w.t = w.target > w.t ? Math.min(w.target, w.t + step) : Math.max(w.target, w.t - step);
      const e = easeInOutCubic(w.t);
      // vers l'avant (+z) : le volet gauche tourne en négatif, le droit en positif
      w.left.rotation.y = -Math.PI * e;
      w.right.rotation.y = Math.PI * e;
    }
  }
}
