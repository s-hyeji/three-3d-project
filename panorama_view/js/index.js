// import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js"; 
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

    this.init();
    this.initHelper();
    this.requestAnimation();
    this.windowResize();
  }

  init() {
    this.scene.background = null;
    this.scene.add(this.universeMesh);
    this.scene.add(this.shpearMesh);
    this.scene.add(this.squareMesh);

    // 카메라
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 20, 70);
    this.camera.lookAt(0, 0, 0);

    // 랜더링
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
    // this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  requestAnimation() {
    requestAnimationFrame(() => this.requestAnimation());
    // let speed = Date.now() * 0.0005;
    // let ratateRadius = 80;
    // this.camera.position.x = Math.cos(speed) * ratateRadius;
    // this.camera.position.z = Math.sin(speed) * ratateRadius;
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
    this.timeLine_L.eventCallback('onComplete', () => {
      scene_E.shpearMesh.position.set(-20, 0, 0);
      scene_E.squareMesh.position.set(20, 0, 0);
    })
  }

  shpearClickAct() {
    this.timeLine_C
      .to(scene_E.shpearMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
      .to(scene_E.squareMesh.position, { duration: 0.7, x: 200, y: 20, z: 0 }, '<')
      .to(scene_E.camera.position, { duration: 1.2, x: 0, y: 0, z: 1, ease: "power2.inOut", }, '+1')
    return this.timeLine_C;
  }

  squareClickAct() {
    this.timeLine_C
      .to(scene_E.squareMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
      .to(scene_E.shpearMesh.position, { duration: 0.7, x: -200, y: 20, z: 0 }, '<')
      .to(scene_E.camera.position, { duration: 1.2, x: 0, y: 0, z: 1, ease: "power2.inOut", }, '+1')
    return this.timeLine_C;
  }
}


const scene_E = new Scene_Event();
const mouse_E = new Mouse_Event('#wrap', 5);
console.log('# Scene_Event', scene_E);
console.log('# Mouse_Event', mouse_E);




