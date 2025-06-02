import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';


class Floor {
  constructor(material, cylinder) {
    this.obj = cylinder;
    this.material = material;
    this.obj.position.set(0, -0.5, 0);
    this.obj.receiveShadow = true;

    this.objLoader = new OBJLoader();
    this.gltfLoader = new GLTFLoader();
    this.barrier = new THREE.Object3D();

    this.setTexture();
    this.setObjects();
  }

  setTexture() {
    const textureLoader = new THREE.TextureLoader().load('./images/floor/floor.png');
    textureLoader.colorSpace = THREE.SRGBColorSpace;
    this.material.map = textureLoader;
    // this.material.map.wrapS = THREE.RepeatWrapping;
    // this.material.map.wrapT = THREE.RepeatWrapping;
    // this.material.map.repeat.set(2.5, 2.5);
  }

  setObjects() {
    this.barrier.name = 'barrier';
    this.gltfLoader.load('./images/GLTF/barrier/scene.gltf', (Object) => {
      this.barrier.add(Object.scene);
      this.barrier.scale.set(8, 8, 8);
      this.barrier.position.set(80, 0, 150);
    });
  }
}

const radius = 300;
const geometry = new THREE.CylinderGeometry(radius, radius, 1, 50);
const material = new THREE.MeshStandardMaterial({ color: '#b6b9bd', side: THREE.FrontSide });
const cylinder = new THREE.Mesh(geometry, material);
const floor = new Floor(material, cylinder);
export default floor;