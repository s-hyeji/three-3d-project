import * as THREE from 'three';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';

export default class Player {
  constructor(player, src) {
    this.obj = player;
    this.src = src;
    this.obj.scale.set(0.1, 0.1, 0.1);
    this.obj.position.x = 0.3;
    this.obj.traverse((child) => { if (child.isMesh) child.castShadow = true; });
    this.moveZ = this.moveX = 0;
    this.speed = 0.5;
    this.setAction();
  }

  setAction() {
    const fbxLoader = new FBXLoader();
    // 여러 액션을 반복문으로 로드
    const actionNames = Object.keys(this.src);

    actionNames.forEach((action) => {
      fbxLoader.load(
        this.src[action],
        (loadActions) => {
          this.actions[action] = this.mixer.clipAction(loadActions.animations[0]);
        }
      );
    });
    this.mixerArr = [];
    this.actions = {};
    this.mixer = new THREE.AnimationMixer(this.obj);
    this.mixerArr.push(this.mixer);
    this.actions.standing = this.mixer.clipAction(this.obj.animations[0]);
    this.actions.standing.play();
  }

  keyEvent() {
    let fadeTime = 0.2;
    if (this.actions && this.actions.running && this.actions.standing) {
      if (key.keyDown['up'] || key.keyDown['down'] || key.keyDown['left'] || key.keyDown['right']) {
        if (!this.actions.running.isRunning()) {
          this.actions.standing.fadeOut(fadeTime);
          this.actions.running.reset().fadeIn(fadeTime).play();
        }
      } else {
        if (!this.actions.standing.isRunning()) {
          this.actions.running.fadeOut(fadeTime);
          this.actions.standing.reset().fadeIn(fadeTime).play();
        }
      }
    }

    // 현재 각도와 목표 각도 계산
    let direction = null;

    if (key.keyDown['up']) direction = 0;
    if (key.keyDown['down']) direction = Math.PI;
    if (key.keyDown['left']) direction = Math.PI / 2;
    if (key.keyDown['right']) direction = -Math.PI / 2;

    // 대각선 처리
    if (key.keyDown['up'] && key.keyDown['right']) direction = -Math.PI / 4;
    if (key.keyDown['up'] && key.keyDown['left']) direction = Math.PI / 4;
    if (key.keyDown['down'] && key.keyDown['right']) direction = -3 * Math.PI / 4;
    if (key.keyDown['down'] && key.keyDown['left']) direction = 3 * Math.PI / 4;

    // 이동
    if (key.keyDown['up']) this.obj.position.z += this.moveZ + this.speed;
    if (key.keyDown['down']) this.obj.position.z -= this.moveZ + this.speed;
    if (key.keyDown['left']) this.obj.position.x += this.moveX + this.speed;
    if (key.keyDown['right']) this.obj.position.x -= this.moveX + this.speed;

    // 자연스러운 회전(가장 짧은 방향으로)
    if (direction !== null) {
      let currentY = this.obj.rotation.y;
      let delta = ((direction - currentY + Math.PI) % (2 * Math.PI)) - Math.PI;
      let shortestY = currentY + delta;
      gsap.to(this.obj.rotation, { y: shortestY, duration: 0.3, ease: "power2.out" });
    }


    if (key.keyDown['enter']) {
      console.log('# 엔터');

    }

    if (key.keyDown['spaceBar']) {
      console.log('# 스페이스 바');
    }
  }

  position() {
    return {
      moveX: this.obj.position.x,
      moveZ: this.obj.position.z,
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