import * as THREE from 'three';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';

class Sky {
  constructor(material, sphere) {
    this.obj = sphere;
    this.material = material;
  }

  setAction() {
    const fbxLoader = new FBXLoader();
    // fbxLoader.load();
  }
}

const geometry = new THREE.SphereGeometry(250, 50, 50);
const material = new THREE.MeshStandardMaterial({ color: '#b4d9fd', side: THREE.DoubleSide, transparent: true });
const sphere = new THREE.Mesh(geometry, material);
const sky = new Sky(material, sphere);
export default sky;