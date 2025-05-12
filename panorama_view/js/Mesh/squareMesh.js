import * as THREE from 'three';

export default function showSquareMesh() {
  const frontMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, });
  const backMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide, });
  const geometry = new THREE.BoxGeometry(15, 15, 15);
  const frontMesh = new THREE.Mesh(geometry, frontMaterial);
  const backMesh = new THREE.Mesh(geometry, backMaterial);
  frontMesh.name = 'frontBoxMesh';
  backMesh.name = 'backBoxMesh';

  const squareGroup = new THREE.Group();
  squareGroup.add(frontMesh);
  squareGroup.add(backMesh);
  squareGroup.position.set(20, 0, 0);

  return squareGroup;
}

