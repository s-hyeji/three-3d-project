import * as THREE from 'three';

export default class Polygon {
  constructor(shape, materialType) {
    this.shape = shape;
    this.color = '#FF7694';
    this.mesh = null;

    this.shapeSetting();
    this.setMaterial(materialType);
  }

  shapeSetting() {
    // console.log('도형 타입:', this.shape);
    let geometry;

    switch (this.shape) {
      case 'square':
        geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        break;

      case 'triangle': {
        geometry = new THREE.ConeGeometry(1.8, 3.2, 3);
        // geometry.rotateY(Math.PI / 6);
        break;
      }

      case 'circle':
        geometry = new THREE.SphereGeometry(1.7);
        break;
    }

    this.mesh = new THREE.Mesh(geometry);
    this.mesh.visible = false;
  }

  getMesh() {
    return this.mesh;
  }

  setColor(newColor) {
    this.color = newColor;
    if (this.mesh && this.mesh.material) {
      this.mesh.material.color.set(new THREE.Color(newColor));
    }
  }

  setMaterial(type) {
    const color = new THREE.Color(this.color);
    let material;

    if (type === 'standard') {
      material = new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide
      });
    } else {
      material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide
      });
    }

    if (this.mesh) {
      this.mesh.material?.dispose();
      this.mesh.material = material;
    }
  }

}
