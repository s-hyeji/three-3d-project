import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from "GLTFLoader";
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';
import Player from './object/Player.js';

class Scene {
  constructor() {
    this.wrap = document.querySelector('#wrap');
    this.canvasWrap = document.querySelector('#canvasWrap');
    this.mixerArr = [];
    this.isClick = true;
    this.init();
  }

  init() {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#fff");

    // camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    console.log(this.camera);
    
    this.clock = new THREE.Clock();

    // Fog
    // let fogNear = 60;
    // let fogFar = 100;
    // this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasWrap.appendChild(this.renderer.domElement);

    // lights
    this.ambientLight = new THREE.AmbientLight("#eee", 4);
    // this.pointLight = new THREE.PointLight('#000', 1);
    // this.pointLight.position.set(10, 30, 10);
    // this.pointLight.castShadow = true;
    // this.pointLight.shadow.mapSize.width = 100;
    // this.pointLight.shadow.mapSize.height = 100;
    // this.pointLight.shadow.radius = 5;
    this.scene.add(this.ambientLight);
    // this.scene.add(this.pointLight);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    // this.orbit.rotateSpeed = -0.5;
    // this.orbit.enableZoom = false;
    // this.orbit.enableRotate = false;


    this.createObject();
    this.initHelper();
    this.windowResize();

  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(100, 20));
    // this.scene.add(new THREE.PointLightHelper(this.pointLight));
  }



  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.updateProjectionMatrix();
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  createObject() {
    const fbxLoader = new FBXLoader();
    const player_url = {
      standing: './images/FBX/Standing.fbx',
      running: './images/FBX/Running.fbx',
    }
    fbxLoader.load(
      player_url.standing,
      (Object) => {
        this.player = new Player(Object, player_url);
        this.scene.add(Object);
        this.objectMotion();
        this.requestAnimation();
      },
    )
  }

  objectMotion() {
    this.mixer = new THREE.AnimationMixer(this.player.player);
    this.mixerArr.push(this.mixer);
    if (this.mixerArr.length > 0) {
      this.mixer.clipAction(this.player.player.animations[0]).play();
    }
  }

  requestAnimation() {
    this.player.keyboardEvent();
    for (let i = 0; i < this.mixerArr.length; i++) {
      this.mixerArr[i].update(this.clock.getDelta());
    }
    this.renderer.render(this.scene, this.camera);
    this.orbit.update();


    // 카메라 이동
    let c_moveX = this.player.position().moveX;
    let c_moveZ = this.player.position().moveZ;
    this.camera.position.set(c_moveX, 40, -30 + c_moveZ);
    gsap.to(this.camera.position, { x: c_moveX, y: 40, z: -30 + c_moveZ, delay: 0.1 },)
    // gsap.to(this.camera.lookAt, { x: c_moveX, y: 10, z: 5 + c_moveZ },)
    this.camera.lookAt(c_moveX, 10, 5 + c_moveZ);

    requestAnimationFrame(() => this.requestAnimation());
  }
}



const scene = new Scene();