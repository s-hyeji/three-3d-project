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
        geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        break;

      case 'triangle':
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(0, 1.5); // top (정삼각형 높이)
        triangleShape.lineTo(-2, -2); // bottom left
        triangleShape.lineTo(2, -2); // bottom right
        triangleShape.lineTo(0, 1.5); // close
        geometry = new THREE.ShapeGeometry(triangleShape);
        break;

      case 'circle':
        geometry = new THREE.SphereGeometry(1.7);
        break;
    }
    const material = new THREE.MeshStandardMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = false;
  }

  getMesh() {
    return this.mesh;
  }

  setColor(newColor) {
    this.color = newColor;
    if (this.mesh) {
      this.mesh.material.color.set(new THREE.Color(newColor));
      console.log(this.mesh.material);
    }
    console.log(this.mesh.material);
  }
  show(scene) {
    if (this.mesh) {
      scene.add(this.mesh);
      meshAni(this.mesh);
    }
  }
}