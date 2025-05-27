import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';

class Scene_Event {
  constructor() {
    this.wrap = document.querySelector('#wrap');
    this.canvasWrap = document.querySelector('#canvasWrap');

    this.init();
    this.setObject();
    this.requestAnimation();
    this.windowResize();
    // this.initHelper();
  }

  init() {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#fff");

    // camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 0, 50);

    // Fog
    // let fogNear = 60;
    // let fogFar = 100;
    // this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasWrap.appendChild(this.renderer.domElement);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = -0.5;
    this.orbit.enableZoom = false;
    this.orbit.enableRotate = false;

    // Object3D
    this.boxGroup = new THREE.Object3D();
    this.scene.add(this.boxGroup);
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(100, 20));
    // this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  requestAnimation() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
    this.orbit.update();

    requestAnimationFrame(() => this.requestAnimation());
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.updateProjectionMatrix();
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}

const scene_E = new Scene_Event();
