import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";




export class Player {
  constructor(player, url) {
    this.player = player;
    this.url = url;

    console.log(this.player);
    this.player.scale.set(0.1, 0.1, 0.1);
    console.log(this.player.animations[0]);
  }
}