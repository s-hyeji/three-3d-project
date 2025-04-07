import * as THREE from 'three';


export default function showUniverse() {
  const geometry = new THREE.SphereGeometry(2000, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./images/sphere_img_01.jpg'),
    side: THREE.BackSide,
  });
  const universeMesh = new THREE.Mesh(geometry, material);

  return universeMesh;
}