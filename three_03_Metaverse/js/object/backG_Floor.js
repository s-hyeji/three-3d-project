import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader';
import { GLTFLoader } from 'GLTFLoader';
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
    this.garden = new THREE.Object3D();
    this.bigTree = new THREE.Object3D();
    this.flower_bed_1 = new THREE.Object3D();
    this.flower_bed_2 = new THREE.Object3D();
    this.flower_bed_3 = new THREE.Object3D();
    this.flower_bed_4 = new THREE.Object3D();

    this.setTexture();
    this.setObjects();
  }

  setTexture() {
    const textureLoader = new THREE.TextureLoader()
    const texturesSrc = [
      textureLoader.load('./images/floor/floor.png'),
      textureLoader.load('./images/GLTF/mango_tree/textures/Material.001_baseColor.png'),
      textureLoader.load('./images/GLTF/mango_tree/textures/Material.002_baseColor.png'),
      textureLoader.load('./images/GLTF/mango_tree/textures/Material.002_normal.png'),
      textureLoader.load('./images/GLTF/mango_tree/textures/Material.004_baseColor.png'),
    ]
    texturesSrc.forEach((url) => { url.colorSpace = THREE.SRGBColorSpace; });
    this.material.map = texturesSrc[0];
    // this.material.map.wrapS = THREE.RepeatWrapping;
    // this.material.map.wrapT = THREE.RepeatWrapping;
    // this.material.map.repeat.set(2.5, 2.5);
  }

  setObjects() {
    this.barrier.name = 'barrier';
    this.gltfLoader.load('./images/GLTF/barrier/scene.gltf', (object) => {
      this.barrier.add(object.scene);
      this.barrier.scale.set(8, 8, 8);
      this.barrier.position.set(80, 0, 150);
    });

    this.garden.name = 'garden';
    this.gltfLoader.load('./images/GLTF/garden/scene.gltf', (object) => {
      this.garden.add(object.scene);
      this.garden.scale.set(3, 3, 3);
      this.garden.position.set(-140, 9, 130);
    });

    this.bigTree.name = 'bigtree';
    this.gltfLoader.load('./images/GLTF/mango_tree/scene.gltf', (object) => {
      this.bigTree.add(object.scene);
      this.bigTree.scale.set(28, 28, 28);
      this.bigTree.position.set(-141.5, 0, 144.5);
      this.bigTree.rotation.y = Math.PI / 2;
      object.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.material.transparent = true;
          child.material.side = THREE.FrontSide;
          child.material.depthWrite = true;
          child.renderOrder = 1;
        }
      });
    });

    this.flower_bed_1.name = 'flower_bed_1';
    this.gltfLoader.load('./images/GLTF/flower_bed_1/scene.gltf', (object) => {
      this.flower_bed_1.add(object.scene);
      this.flower_bed_1.scale.set(10, 20, 12);
      this.flower_bed_1.position.set(-72, -12, -48);
    });

    this.flower_bed_2.name = 'flower_bed_2';
    this.gltfLoader.load('./images/GLTF/flower_bed_2/scene.gltf', (object) => {
      this.flower_bed_2.add(object.scene);
      this.flower_bed_2.scale.set(30, 30, 30);
      this.flower_bed_2.position.set(-90, 0, 10);
    });

    this.flower_bed_3.name = 'flower_bed_3';
    this.gltfLoader.load('./images/GLTF/flower_bed_3/scene.gltf', (object) => {
      this.flower_bed_3.add(object.scene);
      this.flower_bed_3.scale.set(15, 15, 15);
      this.flower_bed_3.position.set(140, 27, -160);
      this.flower_bed_3.rotation.y = -Math.PI / 5;
    });
  }
}

const radius = 300;
const geometry = new THREE.CylinderGeometry(radius, radius, 1, 50);
const material = new THREE.MeshStandardMaterial({ color: '#b6b9bd', side: THREE.FrontSide });
const cylinder = new THREE.Mesh(geometry, material);
const floor = new Floor(material, cylinder);
export default floor;