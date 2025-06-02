import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { FBXLoader } from "FBXLoader";
import { gsap } from 'gsap';
import Player from './object/Player.js';
import Floor from './object/backG_Floor.js';
import Sky from './object/backG_Sky.js';

class Scene {
  constructor() {
    this.wrap = document.querySelector('#canvasWrap');
    this.floor = Floor;
    this.sky = Sky;
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
    this.camera.position.y = 100;
    // clock 설정
    this.clock = new THREE.Clock();

    // Fog 설정
    // let fogNear = 1;
    // let fogFar = 400;
    // this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

    // renderer 설정
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.wrap.appendChild(this.renderer.domElement);

    // lights 설정
    this.ambientLight = new THREE.AmbientLight("#fff", 3.5);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight(0xffffff, 20000);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 2048;
    this.pointLight.shadow.mapSize.height = 2048;
    this.pointLight.position.set(0, 200, 0);
    this.scene.add(this.pointLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(100, 100, -50);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(this.directionalLight);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = 0.5;
    this.orbit.minDistance = 10;
    // this.orbit.maxDistance = 70;
    this.orbit.maxPolarAngle = Math.PI / 2;

    this.createObject();
    this.initHelper();
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    // this.scene.add(new THREE.GridHelper(100, 20));
    this.scene.add(new THREE.PointLightHelper(this.pointLight));
    this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  createObject() {
    this.scene.add(this.floor.obj);
    this.scene.add(this.floor.barrier);
    this.scene.add(this.floor.garden);
    this.scene.add(this.sky.obj);
    this.scene.add(this.sky.cloud);

    const fbxLoader = new FBXLoader();
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const textureLoader = new THREE.TextureLoader();

    // 플레이어 생성
    const player_url = {
      standing: './images/FBX/player/Standing.fbx',
      running: './images/FBX/player/Running.fbx',
    }
    fbxLoader.load(
      player_url.standing,
      (Object) => {
        this.player = new Player(Object, player_url);
        this.scene.add(Object);
        this.requestAnimation();
      },
    )

    let g1_duration = 0.7;
    let g1_delay = 2;
    let g2_delay = 0.3;

    // 경찰서
    fbxLoader.load(
      './images/FBX/police/Police_Station.fbx',
      (Object) => {
        Object.position.set(150, 1, -10);
        Object.scale.set(0, 0, 0);
        Object.rotation.y = -Math.PI / 2;
        Object.castShadow = true;
        gsap.to(Object.scale, { x: 0.3, z: 0.3, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
        gsap.to(Object.scale, { y: 0.3, delay: g2_delay }, '<');
        Object.traverse((child) => { if (child.isMesh && child.material) child.material.color.set(0xffffff); });
        this.scene.add(Object);
      },
    )

    // 병원
    fbxLoader.load(
      './images/FBX/hospital/Hospital.fbx',
      (Object) => {
        Object.position.set(-150, -1, 0);
        Object.scale.set(0, 0, 0);
        Object.castShadow = true;
        gsap.to(Object.scale, { x: 2.5, z: 2.5, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
        gsap.to(Object.scale, { y: 2.5, delay: g2_delay }, '<');
        this.scene.add(Object);
      },
    )


    // 앰뷸런스
    objLoader.load('./images/OBJ/ambulance/ambulance.obj', (Object) => {
      Object.position.set(-100, 3, 50);
      Object.scale.set(0, 0, 0);
      Object.rotation.y = -Math.PI / 5;
      Object.castShadow = true;
      let ab_map = textureLoader.load('./images/OBJ/ambulance/ambulance.png');
      ab_map.colorSpace = THREE.SRGBColorSpace;
      Object.children.forEach((child) => {
        if (child.isMesh && child.material) child.material.map = ab_map;
      })
      gsap.to(Object.scale, { x: 10, z: 10, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
      gsap.to(Object.scale, { y: 10, delay: g2_delay }, '<');
      this.scene.add(Object);
    });


    // 은행
    mtlLoader.load('./images/OBJ/bank/bank.mtl', (mtl) => {
      objLoader.setMaterials(mtl);
      objLoader.load('./images/OBJ/bank/bank.obj', (Object) => {
        Object.position.set(0, 0, 150);
        Object.rotation.y = -Math.PI / 1;
        Object.scale.set(0, 0, 0);
        Object.castShadow = true;
        gsap.to(Object.scale, { x: 0.05, z: 0.05, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
        gsap.to(Object.scale, { y: 0.05, delay: g2_delay }, '<');
        this.scene.add(Object);
      });
    });

    // 학교
    const schoolMap = [
      textureLoader.load('./images/OBJ/school/textures/School-Albedo.png'),
      textureLoader.load('./images/OBJ/school/textures/School-Emissive.png')
    ]
    schoolMap.forEach((url) => { url.colorSpace = THREE.SRGBColorSpace; });
    objLoader.load('./images/OBJ/school/School.obj', (Object) => {
      Object.position.set(10, -4.5, -150);
      Object.rotation.y = Math.PI;
      Object.scale.set(0, 0, 0);
      Object.castShadow = true;
      Object.children[0].material.map = schoolMap[0];
      Object.children[0].material.emissiveMap = schoolMap[1];
      gsap.to(Object.scale, { x: 0.07, z: 0.07, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
      gsap.to(Object.scale, { y: 0.07, delay: g2_delay }, '<');
      this.scene.add(Object);
    });


    // ==============================================
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
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, -50 + c_moveZ, lerpFactor);
      this.camera.lookAt(c_moveX, 10, c_moveZ);
    }

    this.sky.initAnimation();
    this.renderer.render(this.scene, this.camera);
    // this.pointLight.position.set(10 + c_moveX, 50, 10 + c_moveZ);
    this.orbit.target.set(c_moveX, 10, c_moveZ);
    this.orbit.update();
    this.windowResize();
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


const scene = new Scene();
scene.orbit.addEventListener('start', () => { scene.isCameraAuto = false; });
document.addEventListener('keydown', (e) => {
  let key = ['Enter', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (key.includes(e.code)) scene.isCameraAuto = true;
});