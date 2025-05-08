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

    this.shpearMesh.rotation.y += 0.005;
    this.squareMesh.rotation.y += 0.005;
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

    });
  }


}



class View_Event {
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
    this.clickCheck = false;

    this.clickEvent();
    this.startWrap_btns.forEach((buttons) => { buttons.addEventListener('mouseover', (event) => { this.hoverEvent(event); }); })
    this.startWrap.addEventListener('mouseleave', (event) => { this.LeaveEvent(event); });

    this.timeLine_H = gsap.timeline();
    this.timeLine_C = gsap.timeline();
  }


  requestAnimation() {
    requestAnimationFrame(() => this.requestAnimation());
    this.orbit.update();
  }


  hoverEvent(event) {
    this.hoverCheck = true;
    this.event = event;
    console.log(this.event, '# 마우스 HOVER!');

    if (!this.hoverCheck) return;
    if (this.event.target.id === 'shpear') {
      this.timeLine_H
        .to(this.shpearBtn, { duration: 0.3, scale: 1.4, x: 190 })
        .to(this.squareBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
        .to(scene_V.shpearMesh.position, { duration: 0.3, x: 0, y: 15, z: 50 }, '<')
    }

    if (this.event.target.id === 'square') {
      this.timeLine_H
        .to(this.squareBtn, { duration: 0.3, scale: 1.4, x: -190 })
        .to(this.shpearBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
        .to(scene_V.squareMesh.position, { duration: 0.3, x: 0, y: 15, z: 48 }, '<')
    }
  }


  LeaveEvent(event) {
    this.leaveCheck = true;
    if (!this.leaveCheck) return;
    this.event = event;
    console.log(this.event, '# 마우스 LEAVE!');
    this.hoverCheck = false;

    this.timeLine_H
      .to(this.shpearBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0 })
      .to(this.squareBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0 }, '<')
      .to(scene_V.shpearMesh.position, { x: -20, y: 0, z: 0 }, '<')
      .to(scene_V.squareMesh.position, { x: 20, y: 0, z: 0 }, '<')
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

          if (this.button.target.id === 'shpear') {
            console.log('# 원 버튼!');
            setTimeout(() => { this.objectWrap.classList.add('shpear'); }, 2000)

            this.timeLine_C
              .to(scene_V.shpearMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
              .to(scene_V.squareMesh.position, { duration: 0.7, x: 200, y: 20, z: 0 }, '<')
              .to(scene_V.camera.position, { duration: 0.5, x: 0, y: 0, z: 0 }, '+1')
          }

          if (this.button.target.id === 'square') {
            console.log('# 박스 버튼!');
          }
        }

        // 오브젝트들 내 버튼
        if (this.button.target.id === 'prev') {
          console.log('# Prev button!');
          switch (this.container.classList.value) {
            case 'shpear': this.shprearNum--; break;
            case 'square': this.squareNum--; break;
          }
          if (this.shprearNum === 0) this.shprearNum = this.imgLength;
          if (this.squareNum === 0) this.squareNum = this.imgLength;
        }

        if (this.button.target.id === 'next') {
          console.log('# Next button!');
          switch (this.container.classList.value) {
            case 'shpear': this.shprearNum++; break;
            case 'square': this.squareNum++; break;
          }
          if (this.shprearNum === this.imgLength + 1) this.shprearNum = 1;
          if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
        }
      })
    });
    // console.log(`# 구 이미지 ${this.shprearNum}번 ||`, `정사각형 이미지 ${this.squareNum}번`);
  }
}




const scene_V = new Scene_Event();
const click_E = new View_Event('#wrap', 5);
console.log('# project_view', scene_V);
console.log('# click_view', click_E);




