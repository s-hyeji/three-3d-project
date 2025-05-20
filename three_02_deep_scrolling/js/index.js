import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';

class Scene_Event {
  constructor(imagesPath) {
    this.wrap = document.querySelector('#wrap');
    this.canvasWrap = document.querySelector('#canvasWrap');
    this.imagesPath = imagesPath;
    this.vector_1_len = 7;
    this.totalBox = this.imagesPath.length;
    this.moveX = this.moveY = this.moveZ = this.targetNum = this.mouseX = this.mouseY = 0;
    this.depthNum = 30;
    this.speed = 10;
    this.maxDepth = (this.totalBox * this.depthNum) - 140;
    this.progressBar = document.querySelector('.bar')

    this.init();
    this.setObject();
    this.requestAnimation();
    this.windowResize();
    // this.initHelper();
  }

  init() {
    document.body.style.height = `${window.innerHeight + this.totalBox * this.depthNum * 10}px`;

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#fff");

    // camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 0, 50);

    // Fog
    let fogNear = 60;
    let fogFar = 100;
    this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

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

    this.moveZ += (this.targetNum - this.moveZ) * 0.07;
    this.boxGroup.position.z = this.moveZ;

    this.moveX += (this.mouseX - this.moveX - innerWidth / 2) * 0.05;
    this.moveY += (this.mouseY - this.moveY - innerWidth / 2) * 0.05;

    this.boxGroup.position.x = -(this.moveX / 100);
    this.boxGroup.position.y = this.moveY / 100;

    requestAnimationFrame(() => this.requestAnimation());
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.updateProjectionMatrix();
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
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
    const floorGeometry = new THREE.PlaneGeometry(350, 50);
    const beMaterial = new THREE.MeshBasicMaterial({ map: this.vector_Bg_map, transparent: true, side: THREE.FrontSide });
    const floormaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, color: 0x000000 });
    const bgMesh = new THREE.Mesh(beGeometry, beMaterial);
    const floorMesh = new THREE.Mesh(floorGeometry, floormaterial);
    bgMesh.position.set(0, 30, -270);
    floorMesh.position.set(0, -10, -240);
    floorMesh.rotation.set(-1.6, 0, 0)

    this.boxGroup.add(bgMesh);
    this.boxGroup.add(floorMesh);
  }

  scrollEvent() {
    // if (deltaY < 0) {
    //   if (this.targetNum > 0) {
    //     this.targetNum -= this.speed;
    //   }
    // } else {
    //   if (this.targetNum < this.maxDepth) {
    //     this.targetNum += this.speed;
    //   }
    // }
    let scrolly = window.scrollY;
    let pageNum = Math.ceil(scrolly / 100)
    this.targetNum = (67 * pageNum) / 10;

    let perNum = Math.ceil((scrolly / (document.body.offsetHeight - window.innerHeight)) * 100);
    this.progressBar.style.width = `${perNum}%`
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
// window.addEventListener('wheel', (e) => { scene_E.scrollEvent(e, e.deltaY) })
window.addEventListener('scroll', () => { scene_E.scrollEvent(); })
window.addEventListener('mousemove', (e) => {
  scene_E.mouseX = e.clientX;
  scene_E.mouseY = e.clientY;
})
window.addEventListener('load', () => { setTimeout(() => { window.scrollTo(0, 0); }, 10); })
