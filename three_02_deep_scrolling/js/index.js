import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';

class Scene_Event {
  constructor(imagesPath) {
    // 메쉬 선언
    this.wrap = document.querySelector('#wrap');
    this.width = 1280;
    this.height = 720;
    this.imagesPath = imagesPath;
    this.vector_1_len = 7
    this.depthNum = 30;
    this.totalBox = this.imagesPath.length;
    this.maxDepth = 240;
    this.moveZ = this.targetNum = 0;

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
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, 50);
    // let cameraPos = 30;
    // this.camera.position.set(cameraPos, cameraPos, cameraPos);

    // Fog
    this.scene.fog = new THREE.Fog("#ffffff", 60, 150);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.wrap.prepend(this.renderer.domElement);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = -0.5;
    this.orbit.enableZoom = true;
    // this.orbit.enableZoom = false;
    // this.orbit.enableRotate = false;


    // Object3D
    this.boxGroup = new THREE.Object3D();
    this.scene.add(this.boxGroup);
    this.scrollEvent();

    const textureLoader = new THREE.TextureLoader();
    let vector_map, imagesWidth, imagesHeight;

    this.vector_Bg_map = textureLoader.load('./images/vector_2/bg.jpg');
    this.vector_Bg_map.colorSpace = THREE.SRGBColorSpace;


    for (let i = 0; i < this.totalBox; i++) {
      vector_map = textureLoader.load(this.imagesPath[i].src);
      vector_map.colorSpace = THREE.SRGBColorSpace;
      imagesWidth = i < this.vector_1_len ? 30 : 50;
      imagesHeight = i < this.vector_1_len ? this.imagesPath[i].height : 22;
      this.setObject(i, vector_map, imagesWidth, imagesHeight);
    }

    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    // this.directionalLight.position.set(-20, 10, 100);
    // this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    // this.scene.add(this.directionalLight);
    // this.scene.add(this.ambientLight);
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(100, 20));
    // this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  requestAnimation() {
    this.targetNum += 0.05;
    // this.moveZ += (this.targetNum - this.moveZ) * (this.moveZ > 210 ? 0.0002 : 0.001);
    this.moveZ += (this.targetNum - this.moveZ) * 0.005;
    console.log(this.targetNum - this.moveZ);
    this.boxGroup.position.z = this.moveZ;

    // if (this.moveZ > 250) {
    //   this.scene.fog = new THREE.Fog("#000000", 100, 200);
    // } else {
    //   this.scene.fog = new THREE.Fog("#ffffff", 60, 100);
    // }

    this.camera.lookAt(this.scene.position);
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

  setObject(i, map, width, height) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: map, transparent: true, side: THREE.FrontSide });
    const boxMesh = new THREE.Mesh(geometry, material);

    let depthNum = i < this.vector_1_len ? this.depthNum : 3;
    let pos_X = i < this.vector_1_len ? Math.round(Math.random()) * 15 - 15 / 2 : 0;
    let pos_Y = i < this.vector_1_len ? Math.round(Math.random()) * 5 - 5 / 2 : 0;
    let pos_Z = i < this.vector_1_len ? i * depthNum : (this.vector_1_len * 30) + (i * depthNum);

    boxMesh.position.set(pos_X, pos_Y, -pos_Z);
    this.boxGroup.add(boxMesh);
    this.setCustomObject();
  }

  setCustomObject() {
    const beGeometry = new THREE.PlaneGeometry(350, 100);
    const floorGeometry = new THREE.PlaneGeometry(350, 100);
    const beMaterial = new THREE.MeshBasicMaterial({ map: this.vector_Bg_map, transparent: true, side: THREE.FrontSide });
    const floormaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, color: 0x000000 });
    const bgMesh = new THREE.Mesh(beGeometry, beMaterial);
    const floorMesh = new THREE.Mesh(floorGeometry, floormaterial);
    bgMesh.position.set(0, 30, -300);
    floorMesh.position.set(0, -10, -240);
    floorMesh.rotation.set(-1.6, 0, 0)

    this.boxGroup.add(bgMesh);
    this.boxGroup.add(floorMesh);
  }

  scrollEvent(event, deltaY) {
    console.log(this.moveZ);

    if (deltaY < 0) {

      this.targetNum -= this.depthNum;
      if (this.targetNum > -20) {
      }
    } else {
      this.targetNum += this.depthNum;
    }



    console.log(this.targetNum);
  }
}


const imagesPath = [
  {
    src: './images/vector_1/img_00.png',
    height: 19,
  },
  {
    src: './images/vector_1/img_01.png',
    height: 18,
  },
  {
    src: './images/vector_1/img_02.png',
    height: 36,
  },
  {
    src: './images/vector_1/img_03.png',
    height: 27,
  },
  {
    src: './images/vector_1/img_04.png',
    height: 26,
  },
  {
    src: './images/vector_1/img_05.png',
    height: 21,
  },
  {
    src: './images/vector_1/img_06.png',
    height: 45,
  },
  { src: './images/vector_2/main_6.png' },
  { src: './images/vector_2/main_5.png' },
  { src: './images/vector_2/main_4.png' },
  { src: './images/vector_2/main_3.png' },
  { src: './images/vector_2/main_2.png' },
  { src: './images/vector_2/main_1.png' },
  { src: './images/vector_2/main_0.png' },
]


const scene_E = new Scene_Event(imagesPath);
console.log('# Scene_Event', scene_E);
window.addEventListener('wheel', (e) => { scene_E.scrollEvent(e, e.deltaY) })
