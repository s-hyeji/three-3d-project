import * as THREE from 'three';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';

export default class Player {
  constructor(player, src) {
    this.player = player;
    this.src = src;
    this.player.scale.set(0.1, 0.1, 0.1);
    this.moveZ = this.moveX = 0;
    this.speed = 0.5;

    console.log(this.player);
    this.player.load()
  }

  keyboardEvent() {

    if (key.keyDown['up']) {
      this.player.position.z += this.moveZ + this.speed;
      gsap.to(this.player.rotation, { y: 0 });
    }

    if (key.keyDown['down']) {
      this.player.position.z -= this.moveZ + this.speed;
      gsap.to(this.player.rotation, { y: 3 });
    }

    if (key.keyDown['left']) {
      this.player.position.x += this.moveX + this.speed;
      gsap.to(this.player.rotation, { y: 1.5 });
    }

    if (key.keyDown['right']) {
      this.player.position.x -= this.moveX + this.speed;
      gsap.to(this.player.rotation, { y: 4.5 });
      if (key.keyDown['up']) gsap.to(this.player.rotation, { y: 6 });
    }

    if (key.keyDown['enter']) {
    }

    if (key.keyDown['spaceBar']) {
    }
  }

  position() {
    return {
      moveX: this.player.position.x,
      moveZ: this.player.position.z,
    }
  }
}

const key = {
  keyDown: {},
  keyValue: {
    13: 'enter',
    32: 'spaceBar',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  },
}

window.addEventListener('keydown', (e) => { key.keyDown[key.keyValue[e.keyCode]] = true; })
window.addEventListener('keyup', (e) => { key.keyDown[key.keyValue[e.keyCode]] = false; })