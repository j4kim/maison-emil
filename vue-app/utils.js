import * as THREE from "three";

export const flip = (pts) => pts.map((p) => new THREE.Vector2(p.x, -p.y));

export const flipShape = (shape) => new THREE.Shape(flip(shape.getPoints()));
