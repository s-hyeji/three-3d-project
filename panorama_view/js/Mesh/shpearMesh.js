import * as THREE from 'three';

export default function showShpearMesh() {
  const frontMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide,});
  const backMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide,});
  const geometry = new THREE.SphereGeometry(10, 20, 20);
  const frontMesh = new THREE.Mesh(geometry, frontMaterial);
  const backMesh = new THREE.Mesh(geometry, backMaterial);
  frontMesh.name = 'frontCircleMesh';
  backMesh.name = 'backCircleMesh';

  const shpearGroup = new THREE.Group();
  shpearGroup.add(frontMesh);
  shpearGroup.add(backMesh);
  shpearGroup.position.set(-20, 0, 0);

  return shpearGroup;
}