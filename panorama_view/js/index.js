import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';
import showUniverse from './Mesh/universeMesh.js';
import showShpearMesh from './Mesh/shpearMesh.js';
import showSquareMesh from './Mesh/squareMesh.js';

class Scene_Event {
  constructor() {
    // 메쉬 선언
    this.container = document.querySelector('#wrap')
    this.width = 1280;
    this.height = 720;
    this.scene = new THREE.Scene();

    this.universeMesh = showUniverse();
    this.shpearMesh = showShpearMesh();
    this.squareMesh = showSquareMesh();

    this.init();
    this.initHelper();
    this.imagesPreLoad();
    this.requestAnimation();
    this.windowResize();
  }

  init() {
    // scene
    this.scene.background = null;
    this.scene.add(this.universeMesh);
    this.scene.add(this.shpearMesh);
    this.scene.add(this.squareMesh);

    // camera
    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 20, 70);
    this.camera.lookAt(0, 0, 0);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: 0xffffff });
    this.renderer.setSize(this.width, this.height);
    this.container.prepend(this.renderer.domElement);

    // OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.rotateSpeed = -0.5;

    this.isRotating = false;

    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(-20, 10, 100);
    this.scene.add(this.directionalLight);
    this.scene.add(this.ambientLight);
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(20));
    // this.scene.add(new THREE.GridHelper(50));
    this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  requestAnimation() {
    requestAnimationFrame(() => this.requestAnimation());
    this.renderer.render(this.scene, this.camera);
    this.orbit.update();

    if (!this.isRotating) {
      this.shpearMesh.rotation.y += 0.005;
      this.squareMesh.rotation.y += 0.005;
    }
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  imagesPreLoad() {
    const textureLoader = new THREE.TextureLoader();
    this.shpearMapSrc = {
      'basic': [
        textureLoader.load('./images/Sphere/exterior/sphere_img_01.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_02.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_03.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_04.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_05.jpg'),
      ],
      'normal': [
        textureLoader.load('./images/Sphere/exterior/sphere_img_01_normal.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_02_normal.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_03_normal.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_04.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_05_normal.jpg'),
      ],
      'roughness': [
        textureLoader.load('./images/Sphere/exterior/sphere_img_01_roughness.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_02_roughness.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_03_roughness.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_04.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_05_roughness.jpg'),
      ],
      'backSideMap': [
        textureLoader.load('./images/Sphere/interior/sphere_img_01.jpg'),
        textureLoader.load('./images/Sphere/interior/sphere_img_02.jpg'),
        textureLoader.load('./images/Sphere/interior/sphere_img_03.jpg'),
        textureLoader.load('./images/Sphere/interior/sphere_img_04.jpg'),
        textureLoader.load('./images/Sphere/interior/sphere_img_05.jpg'),
      ]
    }

    this.squareMapSrc = {
      'basic': [
        textureLoader.load('./images/Square/exterior/square_img_01.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_02.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_03.png'),
        textureLoader.load('./images/Square/exterior/square_img_04.png'),
        textureLoader.load('./images/Square/exterior/square_img_05.png'),
      ],

      'normal': [
        textureLoader.load('./images/Square/exterior/square_img_01_normal.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_02_normal.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_03_normal.png'),
        textureLoader.load('./images/Square/exterior/square_img_04_normal.png'),
        textureLoader.load('./images/Square/exterior/square_img_05_normal.png'),
      ],
      'roughness': [
        textureLoader.load('./images/Square/exterior/square_img_01_roughness.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_02_roughness.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_03_roughness.png'),
        textureLoader.load('./images/Square/exterior/square_img_04_roughness.png'),
        textureLoader.load('./images/Square/exterior/square_img_05_roughness.png'),
      ],
      'backSideMap': [
        [
          textureLoader.load('./images/Square/exterior/dice/dice-1.png'),
          textureLoader.load('./images/Square/exterior/dice/dice-2.jpg'),
          textureLoader.load('./images/Square/exterior/dice/dice-3.png'),
          textureLoader.load('./images/Square/exterior/dice/dice-4.png'),
          textureLoader.load('./images/Square/exterior/dice/dice-5.png'),
          textureLoader.load('./images/Square/exterior/dice/dice-6.png'),
        ],
        // [
        //   textureLoader.load('./images/Square/exterior/dice/dice-1.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-2.jpg'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-3.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-4.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-5.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-6.png'),
        // ],
        // [
        //   textureLoader.load('./images/Square/exterior/dice/dice-1.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-2.jpg'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-3.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-4.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-5.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-6.png'),
        // ],
        // [
        //   textureLoader.load('./images/Square/exterior/dice/dice-1.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-2.jpg'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-3.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-4.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-5.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-6.png'),
        // ],
        // [
        //   textureLoader.load('./images/Square/exterior/dice/dice-1.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-2.jpg'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-3.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-4.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-5.png'),
        //   textureLoader.load('./images/Square/exterior/dice/dice-6.png'),
        // ],
        [textureLoader.load('./images/Square/interior/square_img_01.jpg')],
        [textureLoader.load('./images/Square/interior/square_img_02.jpg')],
        [textureLoader.load('./images/Square/interior/square_img_03.jpg')],
        [textureLoader.load('./images/Square/interior/square_img_04.jpg')],
        [textureLoader.load('./images/Square/interior/square_img_05.jpg')],
      ],
    }

    this.diceMaterial = [
      new THREE.MeshStandardMaterial({side: THREE.BackSide, transparent:true, map: textureLoader.load('./images/Square/exterior/dice/dice-1.png') }),
      new THREE.MeshStandardMaterial({side: THREE.BackSide, transparent:true, map: textureLoader.load('./images/Square/exterior/dice/dice-2.png') }),
      new THREE.MeshStandardMaterial({side: THREE.BackSide, transparent:true, map: textureLoader.load('./images/Square/exterior/dice/dice-3.png') }),
      new THREE.MeshStandardMaterial({side: THREE.BackSide, transparent:true, map: textureLoader.load('./images/Square/exterior/dice/dice-4.png') }),
      new THREE.MeshStandardMaterial({side: THREE.BackSide, transparent:true, map: textureLoader.load('./images/Square/exterior/dice/dice-5.png') }),
      new THREE.MeshStandardMaterial({side: THREE.BackSide, transparent:true, map: textureLoader.load('./images/Square/exterior/dice/dice-6.png') }),
    ];

    this.shpearMesh.children[0].material.map = this.shpearMapSrc.basic[0];
    this.shpearMesh.children[0].material.normalMap = this.shpearMapSrc.normal[0];
    this.shpearMesh.children[0].material.roughnessMap = this.shpearMapSrc.roughness[0];
    this.shpearMesh.children[1].material.map = this.shpearMapSrc.backSideMap[0];

    console.log(this.squareMapSrc.backSideMap);
    
    this.squareMesh.children[0].material.map = this.squareMapSrc.basic[0];
    this.squareMesh.children[0].material.normalMap = this.squareMapSrc.normal[0];
    this.squareMesh.children[0].material.roughnessMap = this.squareMapSrc.roughness[0];
    this.squareMesh.children[1].material.map = this.squareMapSrc.backSideMap[0][0];

    // this.squareMesh.children[0]에 diceMaterial 적용
    // this.squareMesh.children[0].material = this.diceMaterial;
    // console.log(this.squareMesh.children[0].material);

    for (let i = 0; i < this.shpearMapSrc.basic.length; i++) {
      this.shpearMapSrc.basic[i].colorSpace = THREE.SRGBColorSpace;
      this.shpearMapSrc.backSideMap[i].colorSpace = THREE.SRGBColorSpace;
      this.squareMapSrc.basic[i].colorSpace = THREE.SRGBColorSpace;
      this.squareMapSrc.backSideMap[i].colorSpace = THREE.SRGBColorSpace;
    }
  }
}



class Mouse_Event {
  constructor(root, imgLength) {
    this.container = document.querySelector(root);

    this.startWrap = this.container.querySelector('#start_wrap');
    this.startWrap_btns = this.container.querySelectorAll('#start_wrap button');
    this.shpearBtn = this.startWrap.querySelector('#shpear');
    this.squareBtn = this.startWrap.querySelector('#square');

    this.objectWrap = this.container.querySelector('#object_wrap')
    this.buttons = this.container.querySelectorAll('button');

    this.imgLength = imgLength;
    this.shpearNum = 1;
    this.squareNum = 1;

    this.hoverCheck = false;
    this.leaveCheck = false;
    this.isDblclick = false;

    this.timeLine_H = gsap.timeline();
    this.timeLine_L = gsap.timeline();
    this.timeLine_C = gsap.timeline();

    this.clickEvent();
    this.startWrap_btns.forEach((buttons) => { buttons.addEventListener('mouseover', (event) => { this.hoverEvent(event); }); })
    this.startWrap.addEventListener('mouseleave', (event) => { this.LeaveEvent(event); });
  }

  hoverEvent(event) {
    this.hoverCheck = true;
    this.event = event;
    console.log(this.event, '# 마우스 HOVER!');

    if (!this.hoverCheck) return;
    this.event.target.classList.add('on');
    if (this.event.target.id === 'shpear') this.shpearHoverAct();
    if (this.event.target.id === 'square') this.squareHoverAct();
  }

  LeaveEvent(event) {
    this.leaveCheck = true;
    if (!this.leaveCheck) return;
    this.event = event;
    this.startWrap_btns.forEach((btns) => { btns.classList.remove('on'); });
    console.log(this.event, '# 마우스 LEAVE!');
    this.objectLeaveAct();
  }

  clickEvent() {
    this.buttons.forEach((event) => {
      event.addEventListener('click', (button) => {
        this.button = button;
        this.hoverCheck = false;
        console.log(this.button, '# 마우스 CLICK!');


        // 시작 버튼들
        if (this.button.target.parentNode.id === 'start_wrap') {
          this.startWrap.classList.add('displayN');
          setTimeout(() => { this.objectWrap.classList.add(`${this.button.target.id}`); }, 2000)

          if (this.button.target.id === 'shpear') this.shpearClickAct().restart();
          if (this.button.target.id === 'square') this.squareClickAct().restart();

          this.timeLine_C.eventCallback('onUpdate', () => { this.container.style.pointerEvents = 'none'; })
          this.timeLine_C.eventCallback('onComplete', () => {
            scene_E.isRotating = true;
            scene_E.ambientLight.intensity = 3;
            this.container.style.pointerEvents = 'auto';
          })
        }

        if (this.button.target.className === 'prev on') {
          switch (this.button.target.parentNode.id) {
            case 'shpear': this.shpearNum--; break;
            case 'square': this.squareNum--; break;
          }
          if (this.shpearNum === 0) this.shpearNum = this.imgLength;
          if (this.squareNum === 0) this.squareNum = this.imgLength;
          if (this.shpearNum === 4 || this.shpearNum === 4) scene_E.ambientLight.intensity = 5;
          else scene_E.ambientLight.intensity = 2;
        }

        if (this.button.target.className === 'next on') {
          switch (this.button.target.parentNode.id) {
            case 'shpear': this.shpearNum++; break;
            case 'square': this.squareNum++; break;
          }
          if (this.shpearNum === this.imgLength + 1) this.shpearNum = 1;
          if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
          if (this.shpearNum === 4 || this.shpearNum === 4) scene_E.ambientLight.intensity = 5;
          else scene_E.ambientLight.intensity = 2;
        }

        scene_E.shpearMesh.children[0].material.map = scene_E.shpearMapSrc.basic[this.shpearNum - 1];
        scene_E.shpearMesh.children[0].material.normalMap = scene_E.shpearMapSrc.normal[this.shpearNum - 1];
        scene_E.shpearMesh.children[0].material.roughnessMap = scene_E.shpearMapSrc.roughness[this.shpearNum - 1];

        scene_E.squareMesh.children[0].material.map = scene_E.squareMapSrc.basic[this.squareNum - 1];
        scene_E.squareMesh.children[0].material.normalMap = scene_E.squareMapSrc.normal[this.squareNum - 1];
        scene_E.squareMesh.children[0].material.roughnessMap = scene_E.squareMapSrc.roughness[this.squareNum - 1];




        // 오브젝트들 내 버튼들
        if (this.button.target.id === 'prev') {
          console.log('# Prev button!');
          switch (this.objectWrap.classList.value) {
            case 'shpear': this.shpearNum--; break;
            case 'square': this.squareNum--; break;
          }
          if (this.shpearNum === 0) this.shpearNum = this.imgLength;
          if (this.squareNum === 0) this.squareNum = this.imgLength;
        }


        if (this.button.target.id === 'next') {
          console.log('# Next button!');
          switch (this.objectWrap.classList.value) {
            case 'shpear': this.shpearNum++; break;
            case 'square': this.squareNum++; break;
          }
          if (this.shpearNum === this.imgLength + 1) this.shpearNum = 1;
          if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
        }

        scene_E.shpearMesh.backTexture = scene_E.shpearMapSrc.backSideMap[this.shpearNum - 1];
        scene_E.squareMesh.backTexture = scene_E.squareMapSrc.backSideMap[this.squareNum - 1];

        // let curCircleMesh = scene_E.shpearMesh.children;
        // let curBoxMesh = scene_E.squareMesh.children;
        scene_E.shpearMesh.children[1].material.map = scene_E.shpearMesh.backTexture;
        scene_E.squareMesh.children[1].material = scene_E.diceMaterial;

        // 돌아 가기
        if (this.button.target.id === 'return') {
          console.log('# Return button!');
          scene_E.isRotating = false;
          this.objectWrap.className = '';
          this.shpearNum, this.squareNum = 1;
          this.startWrap.classList.remove('displayN');

          if (this.objectWrap.classList.value === 'shpear') this.shpearClickAct().reverse();
          else this.squareClickAct().reverse();

          this.timeLine_C.eventCallback('onReverseComplete', () => {
            scene_E.ambientLight.intensity = 2;
            this.container.style.pointerEvents = 'auto';
            this.timeLine_C.clear();
          })
        }
      })
    });
  }

  shpearHoverAct() {
    this.timeLine_H
      .to(this.shpearBtn, { duration: 0.3, scale: 1.4, x: 180, width: 400, })
      .to(this.squareBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
      .to(scene_E.shpearMesh.position, { duration: 0.5, x: 0, y: 15, z: 50, ease: "power4.inOut", }, '<')
  }

  squareHoverAct() {
    this.timeLine_H
      .to(this.squareBtn, { duration: 0.3, scale: 1.4, x: -180, width: 400, })
      .to(this.shpearBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
      .to(scene_E.squareMesh.position, { duration: 0.5, x: 0, y: 15, z: 48, ease: "power4.inOut", }, '<')
  }

  objectLeaveAct() {
    this.timeLine_L
      .to(this.shpearBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0, width: 300 })
      .to(this.squareBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0, width: 300 }, '<')
      .to(scene_E.shpearMesh.position, { x: -20, y: 0, z: 0, ease: "power4.inOut", }, '<')
      .to(scene_E.squareMesh.position, { x: 20, y: 0, z: 0, ease: "power4.inOut", }, '<')
    // this.timeLine_L.eventCallback('onComplete', () => {
    //   scene_E.shpearMesh.position.set(-20, 0, 0);
    //   scene_E.squareMesh.position.set(20, 0, 0);
    // })
  }

  shpearClickAct() {
    this.timeLine_C
      .to(scene_E.shpearMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
      .to(scene_E.squareMesh.position, { duration: 0.7, x: 300, y: 20, z: 0 }, '<')
      .to(scene_E.camera.position, { duration: 1.2, x: 0, y: 0, z: 1, ease: "power2.inOut" }, '<')
    return this.timeLine_C;
  }

  squareClickAct() {
    this.timeLine_C
      .to(scene_E.squareMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
      .to(scene_E.shpearMesh.position, { duration: 0.7, x: -300, y: 20, z: 0 }, '<')
      .to(scene_E.camera.position, { duration: 1.2, x: 0, y: 0, z: 1, ease: "power2.inOut" }, '<')
    return this.timeLine_C;
  }
}


const scene_E = new Scene_Event();
const mouse_E = new Mouse_Event('#wrap', scene_E.shpearMapSrc.basic.length);
console.log('# Scene_Event', scene_E);
console.log('# Mouse_Event', mouse_E);




