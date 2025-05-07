import * as THREE from 'three';
// import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js"; 

export default function showShpearMesh() {
  const textureLoader = new THREE.TextureLoader();
  const frontTexture = textureLoader.load('./images/Sphere/sphere_img_01.jpg');
  const backTexture = textureLoader.load('./images/Sphere/sphere_img_01.jpg');
  const geometry = new THREE.SphereGeometry(10, 20, 20);
  
  const material = new THREE.MeshBasicMaterial({
    map : frontTexture,
    side: THREE.DoubleSide,
  });

  const shpearMesh = new THREE.Mesh(geometry, material);
  shpearMesh.position.set(-20, 0, 0);

  return shpearMesh;
}