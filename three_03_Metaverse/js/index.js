import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from "GLTFLoader";
import { FBXLoader } from "FBXLoader";
// import { gsap } from 'gsap';
import { Player } from './object/Player.js';

class Scene {
  constructor() {
    this.wrap = document.querySelector('#wrap');
    this.canvasWrap = document.querySelector('#canvasWrap');
    this.init();
  }

  init() {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#fff");

    // camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(20, 25, 20);

    // Fog
    // let fogNear = 60;
    // let fogFar = 100;
    // this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasWrap.appendChild(this.renderer.domElement);

    // lights
    this.ambientLight = new THREE.AmbientLight("0x404040", 4);
    this.pointLight = new THREE.PointLight('0x000000', 1);
    this.pointLight.position.set(10, 30, 10);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 50;
    this.pointLight.shadow.mapSize.height = 50;
    this.pointLight.shadow.radius = 5;
    this.scene.add(this.ambientLight);
    this.scene.add(this.pointLight);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    // this.orbit.rotateSpeed = -0.5;
    // this.orbit.enableZoom = false;
    // this.orbit.enableRotate = false;

    this.requestAnimation();
    this.windowResize();
    this.initHelper();
    this.createObject();
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(100, 20));
    this.scene.add(new THREE.PointLightHelper(this.pointLight));
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

  createObject() {
    const fbxLoader = new FBXLoader();
    const player_url = {
      standing: './images/FBX/Standing.fbx',
      running: './images/FBX/Running.fbx',
    }
    fbxLoader.load(`${player_url.standing}`,
      (Object) => {
        new Player(Object, player_url);
        this.scene.add(Object);
      },
      // (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
      // (err) => { console.log(err); }
    )


    const planGeometry = new THREE.PlaneGeometry(100, 100);
    const planMaterial = new THREE.MeshStandardMaterial({ color: "#eee", side: THREE.DoubleSide })
    const plan = new THREE.Mesh(planGeometry, planMaterial);
    plan.position.set(0, 0, 0);
    this.scene.add(plan);
  }
}

const scene = new Scene();
