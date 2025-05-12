import * as THREE from 'three';

export default function showSquareMesh() {
  const textureLoader = new THREE.TextureLoader();

  // 앞면 텍스처
  const frontTexture = textureLoader.load('./images/Square/exterior/sphere_img_01.jpg');
  const frontMaterial = new THREE.MeshBasicMaterial({
    map: frontTexture,
    side: THREE.FrontSide, // 앞면만 렌더링
  });

  // 뒷면 텍스처
  const backTexture = textureLoader.load('./images/Square/interior/sphere_img_01.jpg');
  const backMaterial = new THREE.MeshBasicMaterial({
    map: backTexture,
    side: THREE.BackSide, // 뒷면만 렌더링
  });

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

