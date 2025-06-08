import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';
import { GLTFLoader } from 'GLTFLoader';
import { MTLLoader } from 'MTLLoader';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';

class Sky {
  constructor(material, sphere) {
    this.obj = sphere;
    this.material = material;
    this.objLoader = new OBJLoader();
    this.gltfLoader = new GLTFLoader();
    this.cloud = new THREE.Object3D();

    this.setTexture();
    this.setObjects();
  }

  setTexture() {
    const skySrc = new THREE.TextureLoader().load('./images/sky/sky_2.png');
    skySrc.colorSpace = THREE.SRGBColorSpace;
    this.obj.material.map = skySrc;
  }

  setObjects() {
    let count = 30;
    this.cloud.name = 'cloudGroup';
    this.cloud.castShadow = true;
    this.cloud.receiveShadow = true;

    for (let i = 0; i < count; i++) {
      this.objLoader.load('./images/OBJ/cloud/cloud.obj', (object) => {
        object.position.x = Math.floor(Math.random() * 300) - 150;
        object.position.z = Math.floor(Math.random() * 300) - 150;
        object.position.y = 100;
        object.scale.set(1.5, 1.5, 1.5);
        this.cloud.add(object);
      });
    }
  }

  initAnimation() {
    this.obj.rotation.y -= 0.002;
    this.cloud.rotation.y -= 0.001;
  }
}

const geometry = new THREE.SphereGeometry(250, 50, 50);
const material = new THREE.MeshStandardMaterial({ color: '#b4d9fd', side: THREE.DoubleSide, transparent: true });
const sphere = new THREE.Mesh(geometry, material);
const sky = new Sky(material, sphere);
export default sky;