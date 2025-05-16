import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';

class Scene_Event {
  constructor() {
    // 메쉬 선언
    this.wrap = document.querySelector('#wrap');
    this.width = 1280;
    this.height = 720;
    this.scene = new THREE.Scene();


    this.init();
    this.requestAnimation();
    this.windowResize();
    this.initHelper();
  }

  init() {
    // scene
    this.scene.background = null;

    // camera
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 20, 70);
    this.camera.lookAt(0, 0, 0);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: 0xffffff });
    this.renderer.setSize(this.width, this.height);
    this.wrap.prepend(this.renderer.domElement);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = -0.5;
    this.orbit.enableRotate = false;
    this.orbit.enableZoom = false;

    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // this.directionalLight.position.set(-20, 10, 100);
    // this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    // this.scene.add(this.directionalLight);
    // this.scene.add(this.ambientLight);
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(20));
    this.scene.add(new THREE.GridHelper(50));
    this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  requestAnimation() {
    this.renderer.render(this.scene, this.camera);
    this.orbit.update();
    requestAnimationFrame(() => this.requestAnimation());
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.updateProjectionMatrix();
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
    });
  }
}


class Scroll_Event {
  constructor(root) {
    this.container = document.querySelector(root);

  }
}



const scene_E = new Scene_Event();
const scroll_E = new Scroll_Event();
console.log('# Scene_Event', scene_E);
console.log('# Scroll_Event', scroll_E);