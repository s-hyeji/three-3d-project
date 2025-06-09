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
    this.scene.background = new THREE.Color("#eeeeee");

    // camera 설정
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.y = 100;

    // clock 설정
    this.clock = new THREE.Clock();

    // raycaster 설정
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    // Fog 설정
    // let fogNear = 1;
    // let fogFar = 400;
    // this.scene.fog = new THREE.Fog("#ffffff", fogNear, fogFar);

    // renderer 설정
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    // this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // this.directionalLight.position.set(100, 100, -50);
    // this.directionalLight.castShadow = true;
    // this.directionalLight.shadow.mapSize.width = 1024;
    // this.directionalLight.shadow.mapSize.height = 1024;
    // this.scene.add(this.directionalLight);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = 0.5;
    this.orbit.minDistance = 10;
    this.orbit.maxDistance = 150;
    this.orbit.maxPolarAngle = Math.PI / 2;

    this.createObject();
    // this.initHelper();
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(100));
    // this.scene.add(new THREE.GridHelper(100, 20));
    this.scene.add(new THREE.PointLightHelper(this.pointLight));
    // this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  createObject() {
    this.scene.add(this.floor.obj);
    this.scene.add(this.floor.barrier);
    this.scene.add(this.floor.garden);
    this.scene.add(this.floor.bigTree);
    this.scene.add(this.floor.ambulance);
    this.scene.add(this.floor.flower_bed_1);
    this.scene.add(this.floor.flower_bed_2);
    this.scene.add(this.floor.flower_bed_3);
    this.scene.add(this.sky.obj);
    this.scene.add(this.sky.cloud);

    this.police = new THREE.Object3D();
    this.hoptial = new THREE.Object3D();
    this.bank = new THREE.Object3D();
    this.shcool = new THREE.Object3D();


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
      (object) => {
        this.player = new Player(object, player_url);
        this.scene.add(object);
        this.requestAnimation();
      },
    )

    let g1_duration = 0.7;
    let g1_delay = 2;
    let g2_delay = 0.3;

    // 경찰서
    fbxLoader.load(
      './images/FBX/police/Police_Station.fbx',
      (object) => {
        this.police = object;
        this.police.name = 'police';
        this.police.position.set(150, 1, -10);
        this.police.scale.set(0, 0, 0);
        this.police.rotation.y = -Math.PI / 2;
        this.police.castShadow = true;
        gsap.to(this.police.scale, { x: 0.3, z: 0.3, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
        gsap.to(this.police.scale, { y: 0.3, delay: g2_delay }, '<');
        this.police.traverse((child) => { if (child.isMesh && child.material) child.material.color.set(0xffffff); });
        this.scene.add(this.police);
      },
    )

    // 병원
    fbxLoader.load(
      './images/FBX/hospital/Hospital.fbx',
      (object) => {
        this.hoptial = object;
        this.hoptial.name = 'hospital';
        this.hoptial.position.set(-150, -1, 0);
        this.hoptial.scale.set(0, 0, 0);
        this.hoptial.castShadow = true;
        gsap.to(this.hoptial.scale, { x: 2.5, z: 2.5, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
        gsap.to(this.hoptial.scale, { y: 2.5, delay: g2_delay }, '<');
        this.scene.add(this.hoptial);
      },
    )

    // 은행
    mtlLoader.load('./images/OBJ/bank/bank.mtl', (mtl) => {
      objLoader.setMaterials(mtl);
      objLoader.load('./images/OBJ/bank/bank.obj', (object) => {
        this.bank = object;
        this.bank.name = 'bank';
        this.bank.position.set(0, 0, 150);
        this.bank.rotation.y = -Math.PI / 1;
        this.bank.scale.set(0, 0, 0);
        this.bank.castShadow = true;
        gsap.to(this.bank.scale, { x: 0.05, z: 0.05, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
        gsap.to(this.bank.scale, { y: 0.05, delay: g2_delay }, '<');
        this.scene.add(this.bank);
      });
    });

    // 학교
    const schoolMap = [
      textureLoader.load('./images/OBJ/school/textures/School-Albedo.png'),
      textureLoader.load('./images/OBJ/school/textures/School-Emissive.png')
    ]
    schoolMap.forEach((url) => { url.colorSpace = THREE.SRGBColorSpace; });
    objLoader.load('./images/OBJ/school/School.obj', (object) => {
      this.shcool = object;
      this.shcool.name = 'school';
      this.shcool.position.set(10, -4.5, -150);
      this.shcool.rotation.y = Math.PI;
      this.shcool.scale.set(0, 0, 0);
      this.shcool.castShadow = true;
      this.shcool.children[0].material.map = schoolMap[0];
      this.shcool.children[0].material.emissiveMap = schoolMap[1];
      gsap.to(this.shcool.scale, { x: 0.07, z: 0.07, duration: g1_duration, ease: 'power2.inOut' }, `+${g1_delay}`);
      gsap.to(this.shcool.scale, { y: 0.07, delay: g2_delay }, '<');
      this.scene.add(this.shcool);
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
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.renderer.render(this.scene, this.camera);
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

  onClickEvent(event) {
    if (!this.isClick) return;

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    this.objectList = [this.police, this.hoptial, this.bank, this.shcool];
    this.intersects = this.raycaster.intersectObjects(this.objectList);

    for (let i = 0; i < this.intersects.length; i++) {
      new popupQuiz(this.intersects[i].object.parent.name);
    }
  }
}

const scene = new Scene();
scene.orbit.addEventListener('start', () => { scene.isCameraAuto = false; });
document.addEventListener('keydown', (e) => {
  let key = ['Enter', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (key.includes(e.code)) scene.isCameraAuto = true;
});





// Quiz
const quizList = {
  'bank': {
    question: '[QUIZ] 은행에서 만들 수 없는 것은?',
    text: ['지갑', '카드', '통장'],
    answer: 1,
  },
  'hospital': {
    question: '[QUIZ] 병원에서 근로하지 않는 사람은?',
    text: ['의사', '간호사', '환자'],
    answer: 3,
  },
  'police': {
    question: '[QUIZ] 경찰서에서 할 수 없는 것은?',
    text: ['범죄 신고', '교통사고 신고', '병원 진료'],
    answer: 3,
  },
  'school': {
    question: '[QUIZ] 학교에서 배울 수 없는 것은?',
    text: ['수학', '운전', '과학'],
    answer: 2,
  },
}

// window.addEventListener('click', (e) => scene.onClickEvent(e));
window.addEventListener('mousedown', (e) => scene.onClickEvent(e));

class popupQuiz {
  constructor(name) {
    this.name = name;
    this.wrap = document.querySelector('#wrap');
    this.wrap.innerHTML = this.setNode();

    this.popup = this.wrap.querySelector('.popupContainer');
    this.quizBtn = this.popup.querySelectorAll('.quizList li');
    this.closeBtn = this.popup.querySelector('.close');
    this.audio = new Audio();

    scene.isClick = false;
    this.wrap.classList.add('pointerA');
    setTimeout(() => {
      this.popup.classList.add('on');
      this.curAnswer = this.quizBtn[quizList[this.name].answer - 1];
      this.curAnswer.setAttribute('data-answer', '');
      this.quizStart();
    }, 500);

    this.closeBtn.addEventListener('click', () => { this.closeEvent(); });
  }

  setNode() {
    let temp = `
      <div class="popupContainer">
        <h2>${quizList[this.name].question}</h2>
          <ul class="quizList">
            <li>${quizList[this.name].text[0]}</li>
            <li>${quizList[this.name].text[1]}</li>
            <li>${quizList[this.name].text[2]}</li>
          </ul>
        <button class="close"></button>
      </div>
      `;
    return temp;
  }

  quizStart() {
    this.quizBtn.forEach((BTNS) => {
      BTNS.addEventListener('click', (quizBtn) => {
        if (quizBtn.target.hasAttribute('data-answer')) this.correctEvent();
        else this.incorrectEvent();
        this.audio.play();
      });
    });
  }

  correctEvent() {
    this.popup.classList.add('complete');
    this.audio.src = './media/correct.mp3';
  }

  incorrectEvent() {
    this.audio.src = './media/incorrect.mp3';
  }

  closeEvent() {
    this.wrap.classList.remove('pointerA');
    this.popup.classList.remove('on');
    setTimeout(() => {
      scene.isClick = true;
      this.wrap.innerHTML = '';
    }, 1000);
  }
}