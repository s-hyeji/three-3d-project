import * as THREE from 'three';

export default class Polygon {
 constructor(shape) {
  this.shape = shape;
  this.color = '#A6A6A6';
  this.mesh = null;
  // 
  this.shapeSetting();
 }

 shapeSetting() {
  console.log('도형 타입:', this.shape);
  let geometry;

  switch (this.shape) {
   case 'square':
    geometry = new THREE.BoxGeometry(1, 1, 0.1);
    break;

   case 'triangle':
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 1);
    triangleShape.lineTo(-1, -1);
    triangleShape.lineTo(1, -1);
    triangleShape.lineTo(0, 1);
    geometry = new THREE.ShapeGeometry(triangleShape);
    break;

   case 'circle':
    geometry = new THREE.CircleGeometry(0.7, 32);
    break;
  }
  const material = new THREE.MeshBasicMaterial({ color: this.color });
  this.mesh = new THREE.Mesh(geometry, material);
  this.mesh.visible = false;
 }

 getMesh() {
  return this.mesh;
 }

 setColor(newColor) {
  this.color = newColor;
  if (this.mesh) {
   this.mesh.material.color.set(newColor);
  }
 }

 show(scene) {
  if (this.mesh) {
   scene.add(this.mesh);
   meshAni(this.mesh);
  }
 }
}