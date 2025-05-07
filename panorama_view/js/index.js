// import * as THREE from "https://unpkg.com/three@0.108.0/build/three.module.js"; 
import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';
import showUniverse from './Mesh/universeMesh.js';
import showShpearMesh from './Mesh/shpearMesh.js';
import showSquareMesh from './Mesh/squareMesh.js';


class Project_view {
  constructor(root, imgLength) {
    this.container = document.querySelector(root);
    this.buttons = this.container.querySelectorAll('button');
    this.imgLength = imgLength;
    this.shprearNum = 1;
    this.squareNum = 1;

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
    let speed = Date.now() * 0.0005;
    let ratateRadius = 80;
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

  clickEvent() {
    this.buttons.forEach((event) => {
      event.addEventListener('click', (button) => {
        this.button = button;

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



class Click_view {
  constructor() {
    this.startContaier = document.querySelector('startWrap');
    this.shpearBtn = document.querySelector('#shpear');
    this.squareBtn = document.querySelector('#square');
    project_view.clickEvent();
    document.addEventListener('mouseover', (event) => { this.hoverEvnet(event); });

    gsap_Ani.animation_01();
    gsap_Ani.play();
  }

  hoverEvnet(event) {
    this.event = event;
    if (this.event.target.nodeName === 'BUTTON') {
      if (this.event.target.id === 'shpear') {
        console.log('# shpear hover!');
      }

      if (this.event.target.id === 'square') {
        console.log('# square hover!');
      }
    }
  }
}




class Gsap_Ani {
  constructor(root) {
    this.obj = root
  }

  animation_01() {
    console.log('aaaaaaaaa');
    
  }
}



const project_view = new Project_view('#button_wrap', 5);
const click_view = new Click_view();
const gsap_Ani = new Gsap_Ani();
console.log('# project_view', project_view);
console.log('# click_view', click_view);
console.log('# gsap', gsap);




