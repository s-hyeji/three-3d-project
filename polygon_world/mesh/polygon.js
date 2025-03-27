import * as THREE from 'three';

export default function polygon($data) {
 let geometry, material, mesh;

 if ($data.type === "square") {
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  mesh = new THREE.Mesh(geometry, material);
  // 
 } else if ($data.type === "triangle") {
  geometry = new THREE.ConeGeometry(1, 1, 3);
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  mesh = new THREE.Mesh(geometry, material);
  // 
 } else if ($data.type === "circle") {
  geometry = new THREE.CircleGeometry(1, 32);
  material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  mesh = new THREE.Mesh(geometry, material);
 }


 mesh.position.set(0, 0, 0);
 $data.scene.add(mesh);

 return mesh;
}