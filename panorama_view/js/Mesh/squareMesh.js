import * as THREE from 'three';

export default function showSquareMesh() {
  const textureLoader = new THREE.TextureLoader();
  const frontTexture = textureLoader.load('./images/sphere_img_01.jpg');
  const backTexture = textureLoader.load('./images/sphere_img_01.jpg');
  const geometry = new THREE.BoxGeometry(15, 15, 15);
  
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map : frontTexture,
  });

  const squareMesh = new THREE.Mesh(geometry, material);
  squareMesh.position.set(0, 0, -30);

  const animate = () => {
    requestAnimationFrame(animate);
    squareMesh.rotation.y += 0.003;
  };
  animate();

  return squareMesh;
}