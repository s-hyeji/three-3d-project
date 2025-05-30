import * as THREE from 'three';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';


class Floor {
  constructor(material, cylinder) {
    this.obj = cylinder;
    this.material = material;
    this.obj.position.set(0, -0.5, 0);
    this.obj.receiveShadow = true;
    this.textureLoad();
  }

  textureLoad() {
    const textureLoader = new THREE.TextureLoader();
    const maps = '';
    // const maps = [
    //   { type: 'basic', texture: textureLoader.load('./images/floor/slate_driveway_diff_4k.jpg') },
    //   { type: 'normal', texture: textureLoader.load('./images/floor/slate_driveway_nor_gl_4k.png') },
    //   { type: 'roughness', texture: textureLoader.load('./images/floor/slate_driveway_rough_4k.png') },
    //   { type: 'displacement', texture: textureLoader.load('./images/floor/slate_driveway_disp_4k.png') },
    // ];

    // const maps = [
    //   { type: 'basic', texture: textureLoader.load('./images/floor/mossy_cobblestone_diff_2k.jpg') },
    //   { type: 'normal', texture: textureLoader.load('./images/floor/mossy_cobblestone_nor_gl_2k.png') },
    //   { type: 'roughness', texture: textureLoader.load('./images/floor/mossy_cobblestone_rough_2k.png') },
    //   { type: 'displacement', texture: textureLoader.load('./images/floor/mossy_cobblestone_disp_2k.png') },
    // ];

    // for (let i = 0; i < maps.length; i++) { maps[i].texture.colorSpace = THREE.SRGBColorSpace; }

    // this.material.map = maps.find(map => map.type === 'basic').texture;
    // this.material.normalMap = maps.find(map => map.type === 'normal').texture;
    // this.material.roughnessMap = maps.find(map => map.type === 'roughness').texture;
    // this.material.displacementMap = maps.find(map => map.type === 'displacement').texture;
    // console.log(this.material);
  }
}

const radius = 300;
const geometry = new THREE.CylinderGeometry(radius, radius, 1, 50);
const material = new THREE.MeshStandardMaterial({color: '#8BDA85', side: THREE.FrontSide, transparent: true });
const cylinder = new THREE.Mesh(geometry, material);
const floor = new Floor(material, cylinder);
export default floor;