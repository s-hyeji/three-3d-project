import * as THREE from 'three';
// import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js"; 

export default function showUniverse() {
  const texture = new THREE.TextureLoader().load('./images/universe.jpg');
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const geometry = new THREE.SphereGeometry(400, 32, 32); // 구체 생성
  const universeMesh = new THREE.Mesh(geometry, material);

  return universeMesh;
}