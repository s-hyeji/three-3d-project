import * as THREE from 'three';

export default function showShpearMesh() {
  const textureLoader = new THREE.TextureLoader();

  // 앞면 텍스처
  const frontTexture = textureLoader.load('./images/Sphere/exterior/sphere_img_01.jpg');
  const frontMaterial = new THREE.MeshBasicMaterial({
    map: frontTexture,
    side: THREE.FrontSide, // 앞면만 렌더링
  });

  // 뒷면 텍스처
  const backTexture = textureLoader.load('./images/Sphere/interior/sphere_img_01.jpg');
  const backMaterial = new THREE.MeshBasicMaterial({
    map: backTexture,
    side: THREE.BackSide, // 뒷면만 렌더링
  });

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