import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';
import showUniverse from './Mesh/universeMesh.js';
import showShpearMesh from './Mesh/shpearMesh.js';
import showSquareMesh from './Mesh/squareMesh.js';

class Scene_Event {
  constructor() {
    // 메쉬 선언
    this.scene = new THREE.Scene();
    this.universeMesh = showUniverse();
    this.shpearMesh = showShpearMesh();
    this.squareMesh = showSquareMesh();

    const textureLoader = new THREE.TextureLoader();
    this.frontTexture_circle = [
      textureLoader.load('./images/Sphere/exterior/sphere_img_01.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_02.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_03.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_04.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_05.jpg'),
    ]

    this.backTexture_circle = [
      textureLoader.load('./images/Sphere/interior/sphere_img_01.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_02.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_03.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_04.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_05.jpg'),
    ]

    this.frontTexture_box = [
      textureLoader.load('./images/Sphere/exterior/sphere_img_01.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_02.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_03.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_04.jpg'),
      textureLoader.load('./images/Sphere/exterior/sphere_img_05.jpg'),
    ]

    this.backTexture_box = [
      textureLoader.load('./images/Sphere/interior/sphere_img_01.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_02.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_03.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_04.jpg'),
      textureLoader.load('./images/Sphere/interior/sphere_img_05.jpg'),
    ]

    for (let i = 0; i < this.frontTexture_circle.length; i++) {
      this.frontTexture_circle[i].colorSpace = THREE.SRGBColorSpace;
      this.backTexture_circle[i].colorSpace = THREE.SRGBColorSpace;
      this.frontTexture_box[i].colorSpace = THREE.SRGBColorSpace;
      this.backTexture_box[i].colorSpace = THREE.SRGBColorSpace;
    }

    this.shpearMesh.children[0].material.map = this.frontTexture_circle[0];
    this.shpearMesh.children[1].material.map = this.backTexture_circle[0];
    this.squareMesh.children[0].material.map = this.frontTexture_box[0];
    this.squareMesh.children[1].material.map = this.backTexture_box[0];

    this.init();
    this.initHelper();
    this.requestAnimation();
    this.windowResize();
  }

  init() {
    // scene
    this.scene.background = null;
    this.scene.add(this.universeMesh);
    this.scene.add(this.shpearMesh);
    this.scene.add(this.squareMesh);

    // camera
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 20, 70);
    this.camera.lookAt(0, 0, 0);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: 0xffffff });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = -0.5;

    this.isRotating = false;
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(20));
    this.scene.add(new THREE.GridHelper(50));
  }

  requestAnimation() {
    requestAnimationFrame(() => this.requestAnimation());
    this.renderer.render(this.scene, this.camera);
    this.orbit.update();

    if (!this.isRotating) {
      this.shpearMesh.rotation.y += 0.005;
      this.squareMesh.rotation.y += 0.005;
    }
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}



class Mouse_Event {
  constructor(root, imgLength) {
    this.container = document.querySelector(root);

    this.startWrap = this.container.querySelector('#start_wrap');
    this.startWrap_btns = this.container.querySelectorAll('#start_wrap button');
    this.shpearBtn = this.startWrap.querySelector('#shpear');
    this.squareBtn = this.startWrap.querySelector('#square');

    this.objectWrap = this.container.querySelector('#object_wrap')
    this.buttons = this.container.querySelectorAll('button');

    this.imgLength = imgLength;
    this.shprearNum = 1;
    this.squareNum = 1;

    this.hoverCheck = false;
    this.leaveCheck = false;
    this.isDblclick = false;

    this.timeLine_H = gsap.timeline();
    this.timeLine_L = gsap.timeline();
    this.timeLine_C = gsap.timeline();

    this.clickEvent();
    this.startWrap_btns.forEach((buttons) => { buttons.addEventListener('mouseover', (event) => { this.hoverEvent(event); }); })
    this.startWrap.addEventListener('mouseleave', (event) => { this.LeaveEvent(event); });
    document.addEventListener('dblclick', () => { this.downEvent(); });
    document.addEventListener('contextmenu', () => { this.contextmenuEvent(); });
  }

  downEvent() { this.container.style.pointerEvents = 'none'; }
  contextmenuEvent() { this.container.style.pointerEvents = 'auto'; }

  hoverEvent(event) {
    this.hoverCheck = true;
    this.event = event;
    console.log(this.event, '# 마우스 HOVER!');

    if (!this.hoverCheck) return;
    if (this.event.target.id === 'shpear') this.shpearHoverAct();
    if (this.event.target.id === 'square') this.squareHoverAct();
  }

  LeaveEvent(event) {
    this.leaveCheck = true;
    if (!this.leaveCheck) return;
    this.event = event;
    console.log(this.event, '# 마우스 LEAVE!');
    this.objectLeaveAct();
  }

  clickEvent() {
    this.buttons.forEach((event) => {
      event.addEventListener('click', (button) => {
        this.button = button;
        this.hoverCheck = false;
        console.log(this.button, '# 마우스 CLICK!');

        // 시작 버튼들
        if (this.button.target.parentNode.id === 'start_wrap') {
          this.startWrap.classList.add('displayN');
          setTimeout(() => { this.objectWrap.classList.add(`${this.button.target.id}`); }, 2000)

          if (this.button.target.id === 'shpear') this.shpearClickAct().restart();
          if (this.button.target.id === 'square') this.squareClickAct().restart();

          this.timeLine_C.eventCallback('onUpdate', () => { this.container.style.pointerEvents = 'none'; })
          this.timeLine_C.eventCallback('onComplete', () => {
            scene_E.isRotating = true;
            this.container.style.pointerEvents = 'auto';
          })
        }



        // 오브젝트들 내 버튼들
        if (this.button.target.id === 'prev') {
          console.log('# Prev button!');
          switch (this.objectWrap.classList.value) {
            case 'shpear': this.shprearNum--; break;
            case 'square': this.squareNum--; break;
          }
          if (this.shprearNum === 0) this.shprearNum = this.imgLength;
          if (this.squareNum === 0) this.squareNum = this.imgLength;
        }


        if (this.button.target.id === 'next') {
          console.log('# Next button!');
          switch (this.objectWrap.classList.value) {
            case 'shpear': this.shprearNum++; break;
            case 'square': this.squareNum++; break;
          }
          if (this.shprearNum === this.imgLength + 1) this.shprearNum = 1;
          if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
        }

        scene_E.shpearMesh.frontTexture = scene_E.frontTexture_circle[this.shprearNum - 1];
        scene_E.shpearMesh.backTexture = scene_E.backTexture_circle[this.shprearNum - 1];
        scene_E.squareMesh.frontTexture = scene_E.frontTexture_box[this.squareNum - 1];
        scene_E.squareMesh.backTexture = scene_E.backTexture_box[this.squareNum - 1];

        let curCircleMesh = scene_E.shpearMesh.children;
        let curBoxMesh = scene_E.squareMesh.children;
        for (let i = 0; i < curCircleMesh.length; i++) {
          if (curCircleMesh[i].name === 'backCircleMesh') curCircleMesh[1].material.map = scene_E.shpearMesh.backTexture;
          else curCircleMesh[0].material.map = scene_E.shpearMesh.frontTexture;

          if (curBoxMesh[i].name === 'backBoxMesh') curBoxMesh[1].material.map = scene_E.squareMesh.backTexture;
          else curBoxMesh[0].material.map = scene_E.squareMesh.frontTexture;
        }

        // 돌아 가기
        if (this.button.target.id === 'return') {
          console.log('# Return button!');
          scene_E.isRotating = false;
          this.objectWrap.className = '';
          this.shprearNum, this.squareNum = 1;
          this.startWrap.classList.remove('displayN');

          if (this.objectWrap.classList.value === 'shpear') this.shpearClickAct().reverse();
          else this.squareClickAct().reverse();

          this.timeLine_C.eventCallback('onReverseComplete', () => {
            this.container.style.pointerEvents = 'auto';
            this.timeLine_C.clear();
          })
        }
      })
    });
  }

  shpearHoverAct() {
    this.timeLine_H
      .to(this.shpearBtn, { duration: 0.3, scale: 1.4, x: 180 })
      .to(this.squareBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
      .to(scene_E.shpearMesh.position, { duration: 0.5, x: 0, y: 15, z: 50, ease: "power4.inOut", }, '<')
  }

  squareHoverAct() {
    this.timeLine_H
      .to(this.squareBtn, { duration: 0.3, scale: 1.4, x: -180 })
      .to(this.shpearBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
      .to(scene_E.squareMesh.position, { duration: 0.5, x: 0, y: 15, z: 48, ease: "power4.inOut", }, '<')
  }

  objectLeaveAct() {
    this.timeLine_L
      .to(this.shpearBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0 })
      .to(this.squareBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0 }, '<')
      .to(scene_E.shpearMesh.position, { x: -20, y: 0, z: 0, ease: "power4.inOut", }, '<')
      .to(scene_E.squareMesh.position, { x: 20, y: 0, z: 0, ease: "power4.inOut", }, '<')
    // this.timeLine_L.eventCallback('onComplete', () => {
    //   scene_E.shpearMesh.position.set(-20, 0, 0);
    //   scene_E.squareMesh.position.set(20, 0, 0);
    // })
  }

  shpearClickAct() {
    this.timeLine_C
      .to(scene_E.shpearMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
      .to(scene_E.squareMesh.position, { duration: 0.7, x: 300, y: 20, z: 0 }, '<')
      .to(scene_E.camera.position, { duration: 1.2, x: 0, y: 0, z: 1, ease: "power2.inOut" }, '<')
    return this.timeLine_C;
  }

  squareClickAct() {
    this.timeLine_C
      .to(scene_E.squareMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
      .to(scene_E.shpearMesh.position, { duration: 0.7, x: -300, y: 20, z: 0 }, '<')
      .to(scene_E.camera.position, { duration: 1.2, x: 0, y: 0, z: 1, ease: "power2.inOut" }, '<')
    return this.timeLine_C;
  }
}


const scene_E = new Scene_Event();
const mouse_E = new Mouse_Event('#wrap', scene_E.frontTexture_circle.length);
console.log('# Scene_Event', scene_E);
console.log('# Mouse_Event', mouse_E);




