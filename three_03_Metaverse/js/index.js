import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';
import Player from './object/Player.js';

class Scene {
  constructor() {
    this.wrap = document.querySelector('#canvasWrap');

    this.isClick = true;
    this.isCameraAuto = true; // 카메라 자동 애니메이션 제어 플래그 추가
    this.init();
  }

  init() {
    // scene 설정
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#ddd");

    // camera 설정
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);

    // clock 설정
    this.clock = new THREE.Clock();

    // Fog 설정
    // let fogNear = 60;
    // let fogFar = 100;
    // this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

    // renderer 설정
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.wrap.appendChild(this.renderer.domElement);

    // lights 설정
    this.ambientLight = new THREE.AmbientLight("#fff", 4);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight('#fff', 1);
    
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.pointLight.shadow.radius = 5;
    this.scene.add(this.pointLight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = -0.5;
    this.orbit.minDistance = 10;
    this.orbit.maxDistance = 100;
    this.orbit.maxPolarAngle = Math.PI / 2;

    this.createObject();
    this.initHelper();
    this.windowResize();
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    this.scene.add(new THREE.GridHelper(100, 20));
    this.scene.add(new THREE.PointLightHelper(this.pointLight));
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
        this.player.setAction(player_url);
        this.requestAnimation();
      },
    )
  }

  requestAnimation() {
    // mixer 랜더링
    for (let i = 0; i < this.player.mixerArr.length; i++) {
      this.player.mixerArr[i].update(this.clock.getDelta());
    }

    // 캐릭터 위치
    this.player.keyEvent();
    let c_moveX = this.player.position().moveX;
    let c_moveZ = this.player.position().moveZ;

    // 카메라 위치를 lerp로 부드럽게 이동 (즉시 반응 + 부드러움)
    if (this.isCameraAuto) {
      let lerpFactor = 0.05;
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, c_moveX, lerpFactor);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 30, lerpFactor);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, -30 + c_moveZ, lerpFactor);
      this.camera.lookAt(c_moveX, 10, 5 + c_moveZ);
    }
    
    this.renderer.render(this.scene, this.camera);
    this.pointLight.position.set(10 + c_moveX, 30, 10 + c_moveZ);
    this.orbit.target.set(c_moveX, 10, 5 + c_moveZ);
    this.orbit.update();

    requestAnimationFrame(() => this.requestAnimation());
  }
}


const scene = new Scene();
scene.orbit.addEventListener('start', () => { scene.isCameraAuto = false; });
document.addEventListener('keydown', (e) => {
  let key = ['Enter', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (key.includes(e.code)) scene.isCameraAuto = true;
});




// 경고 메시지 숨기기
const originalWarn = console.warn;
console.warn = function (msg, ...args) {
  if (
    typeof msg === "string" &&
    (
      msg.includes("THREE.FBXLoader: ShininessExponent map is not supported in three.js") ||
      msg.includes("THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex")
    )
  ) return; // 해당 경고는 무시
  originalWarn.apply(console, [msg, ...args]);
};