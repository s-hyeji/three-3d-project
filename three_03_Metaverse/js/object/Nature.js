import * as THREE from 'three';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';

export default class Nature {
  constructor(nature) {
    this.obj = nature;
    // console.log(this.obj.children[0]);
    let scaleSize = 0.02;
    this.obj.scale.set(scaleSize, scaleSize, scaleSize);
    this.obj.rotation.x = -Math.PI / 2;
    this.obj.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    this.setPosition();
  }

  setPosition() {
    let object = this.obj.children;
    let size = 1000;
    // let pos_X = Math.PI * 1000;

    // tree
    object[10].position.set((-10 * size), (-5 * size), (1 * size));
    object[11].position.set((-10 * size), (-1.5 * size), (0.8 * size));
    object[17].position.set((-10 * size), (-1.5 * size), (0.8 * size));
    
    object[18].position.set((-4 * size), (-3 * size), (1 * size));
    object[19].position.set((-4 * size), (3.5 * size), (1 * size));
    object[21].position.set((-4.5 * size), (-4.5 * size), (1.1 * size));
    object[24].position.set((2 * size), (3.5 * size), (1 * size));
    object[25].position.set((-5 * size), (1.7 * size), (1.5 * size));
    object[25].scale.set(1.5, 1.5, 1.5);
    object[28].position.set((-4.2 * size), (2.5 * size), (1.3 * size));
    object[31].position.set((2.3 * size), (-2.5 * size), (1 * size));
    object[33].position.set((3 * size), (-2 * size), (1.1 * size));
    object[42].position.set((-7.5 * size), (-2 * size), (1.5 * size));
    object[43].position.set((-6.5 * size), (-2 * size), (1 * size));
    
    // 중간 나무
    object[44].position.set((-0.5 * size), (5.3 * size), (1.6 * size));
    object[44].scale.set(3, 3, 3);
    object[45].position.set((1.5 * size), (4.2 * size), (1.4 * size));
    object[46].position.set((3.5 * size), (-4 * size), (1.5 * size));
    object[46].rotation.z = Math.PI;

    // 큰 나무
    object[47].position.set((-4.5 * size), (5.5 * size), (2 * size));
    object[51].position.set((3 * size), (4 * size), (1.5 * size));
    object[52].position.set((-7.5 * size), (-3.5 * size), (2 * size));
    object[53].position.set((-5.5 * size), (-3.5 * size), (1.7 * size));
    object[54].position.set((5 * size), (-1.5 * size), (1.8 * size));
    // this.obj.add(object[47].clone(), object[54].clone())
    // object[55].position.set((-0 * size), (-0 * size), (1.5 * size));
    // object[56].position.set((-0 * size), (-0 * size), (1.5 * size));

    // stone
    object[6].position.set((4 * size), (-3 * size), (0 * size));
    object[7].position.set((-7 * size), (-3 * size), (0 * size));
    object[8].position.set((-7 * size), (-4 * size), (0 * size));
    object[9].position.set((-6 * size), (-1.5 * size), (0 * size));
    object[12].position.set((-6 * size), (-2 * size), (0 * size));
    object[13].position.set((2 * size), (6 * size), (0 * size));
    object[14].position.set((3.5 * size), (-2 * size), (0 * size));
    object[15].position.set((-1 * size), (7 * size), (0 * size));
    object[16].position.set((-6 * size), (3 * size), (0 * size));
    object[35].position.set((-5 * size), (-3 * size), (0 * size));

    // cloud
    object[34].position.set((-0 * size), (-1.5 * size), (10 * size));
    object[36].position.set((-0 * size), (-1.5 * size), (10 * size));
    object[37].position.set((-0 * size), (-1.5 * size), (10 * size));
    object[38].position.set((-0 * size), (-1.5 * size), (10 * size));
    object[39].position.set((-0 * size), (-1.5 * size), (10 * size));

    this.removeObject(object);
  }

  removeObject(object) {
    let removeArr = [
      object[0],
      object[1],
      object[2],
      object[3],
      object[4],
      object[5],
      object[20],
      object[22],
      object[23],
      object[26],
      object[27],
      object[29],
      object[30],
      object[32],
      object[40],
      object[41],
      object[48],
      object[49],
      object[50],
    ];

    removeArr.forEach((child) => { child.scale.set(0, 0, 0); });
  }
}