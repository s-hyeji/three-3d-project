import * as THREE from 'three';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';

export default class Hut {
  constructor(object) {
    this.obj = object;
    // console.log(this.obj.children[0]);
    this.obj.position.set(0, 1, 0);
    let scaleSize = 0.2;
    this.obj.scale.set(scaleSize, scaleSize, scaleSize);
    // this.obj.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    this.setTexture();
  }

  setTexture() {
    console.log(this.obj);
    const textureLoader = new THREE.TextureLoader();
    const maps = [
      textureLoader.load('./images/hut/drevo_AO.png'),
      textureLoader.load('./images/hut/skla_a_dym2.png'),
      textureLoader.load('./images/hut/spodok.png'),
      textureLoader.load('./images/hut/stena.png'),
      textureLoader.load('./images/hut/strecha_COMBINED1.png'),
      textureLoader.load('./images/hut/strom.png'),
      textureLoader.load('./images/hut/studna.png'),
      textureLoader.load('./images/hut/tehly_komin1.png'),
    ];
    maps.forEach((map) => { map.colorSpace = THREE.SRGBColorSpace; });


    console.log(this.obj.children[2].material.color);
    this.obj.children[2].material.color.r = 180;
    this.obj.children[2].material.color.g = 180;
    this.obj.children[2].material.color.b = 180;
    // this.obj.children[4].material.map = maps[0];



  }
}










