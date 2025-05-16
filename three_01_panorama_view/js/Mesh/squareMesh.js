import * as THREE from 'three';

export default function showSquareMesh() {
  const frontMaterial = new THREE.MeshStandardMaterial({ side: THREE.FrontSide, transparent: true });
  const backMaterial = new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true });
  const geometry = new THREE.BoxGeometry(15, 15, 15);
  const frontMesh = new THREE.Mesh(geometry, frontMaterial);
  const backMesh = new THREE.Mesh(geometry, backMaterial);
  frontMaterial.roughness = 0.4;
  frontMesh.name = 'frontBoxMesh';
  backMesh.name = 'backBoxMesh';

  const squareGroup = new THREE.Group();
  squareGroup.add(frontMesh);
  squareGroup.add(backMesh);
  squareGroup.position.set(20, 0, 0);

  return squareGroup;
}

