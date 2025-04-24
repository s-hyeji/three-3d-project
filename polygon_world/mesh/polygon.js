import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

export function polygonMesh(type = "hex") {
 const segments = type === "hex" ? 6 : 5;
 const geometry = new THREE.CircleGeometry(1, segments);
 const material = new THREE.MeshBasicMaterial({ color: 0xff6600 });
 return new THREE.Mesh(geometry, material);
}