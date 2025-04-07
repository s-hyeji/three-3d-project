import * as THREE from 'three';

export default function showShpearMesh() {
  const textureLoader = new THREE.TextureLoader();
  const frontTexture = textureLoader.load('./images/sphere_img_02.jpg');
  const backTexture = textureLoader.load('./images/sphere_img_03.jpg');
  const geometry = new THREE.SphereGeometry(10, 10, 10);
  
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map : frontTexture,
  });

  material.side = THREE.BackSide;
  material.map = backTexture;
  const shpearMesh = new THREE.Mesh(geometry, material);
  shpearMesh.position.set(0, 0, 30);

  const animate = () => {
    requestAnimationFrame(animate);
    shpearMesh.rotation.y += 0.003;
  };
  animate();

  return shpearMesh;
}