import * as THREE from 'three';

export default function showUniverse() {
  const texture = new THREE.TextureLoader().load('./images/universe.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const geometry = new THREE.SphereGeometry(400, 32, 32);
  const universeMesh = new THREE.Mesh(geometry, material);
  return universeMesh;
}