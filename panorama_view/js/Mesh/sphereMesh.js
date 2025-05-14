import * as THREE from 'three';

export default function showSphereMesh() {
  const frontMaterial = new THREE.MeshStandardMaterial({ side: THREE.FrontSide,});
  const backMaterial = new THREE.MeshStandardMaterial({ side: THREE.BackSide,});
  const geometry = new THREE.SphereGeometry(10, 20, 20);
  const frontMesh = new THREE.Mesh(geometry, frontMaterial);
  const backMesh = new THREE.Mesh(geometry, backMaterial);
  frontMaterial.roughness = 0.4;
  frontMesh.name = 'frontCircleMesh';
  backMesh.name = 'backCircleMesh';

  const sphereGroup = new THREE.Group();
  sphereGroup.add(frontMesh);
  sphereGroup.add(backMesh);
  sphereGroup.position.set(-20, 0, 0);

  return sphereGroup;
}