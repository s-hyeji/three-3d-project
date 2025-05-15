import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { gsap } from 'gsap';
import showUniverse from './Mesh/universeMesh.js';
import showSphereMesh from './Mesh/sphereMesh.js';
import showSquareMesh from './Mesh/squareMesh.js';

class Scene_Event {
  constructor() {
    // 메쉬 선언
    this.wrap = document.querySelector('#wrap');
    this.width = 1280;
    this.height = 720;
    this.scene = new THREE.Scene();

    this.universeMesh = showUniverse();
    this.sphereMesh = showSphereMesh();
    this.squareMesh = showSquareMesh();

    this.init();
    this.imagesPreLoad(5, 6);
    this.requestAnimation();
    this.windowResize();
    // this.initHelper();
  }

  init() {
    // scene
    this.scene.background = null;
    this.scene.add(this.universeMesh);
    this.scene.add(this.sphereMesh);
    this.scene.add(this.squareMesh);

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

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(-20, 10, 100);
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.directionalLight);
    this.scene.add(this.ambientLight);

    this.isRotating = false;
  }

  initHelper() {
    this.scene.add(new THREE.AxesHelper(20));
    this.scene.add(new THREE.GridHelper(50));
    this.scene.add(new THREE.DirectionalLightHelper(this.directionalLight));
  }

  requestAnimation() {
    requestAnimationFrame(() => this.requestAnimation());
    this.renderer.render(this.scene, this.camera);
    this.orbit.update();

    if (!this.isRotating) {
      this.sphereMesh.rotation.y -= 0.005;
      this.squareMesh.rotation.y -= 0.005;
    }
  }

  windowResize() {
    window.addEventListener('resize', () => {
      this.camera.updateProjectionMatrix();
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
    });
  }

  imagesPreLoad(basicLen, squareBackLen) {
    this.basicLen = basicLen;
    this.squareBackLen = squareBackLen;
    const textureLoader = new THREE.TextureLoader();
    
    this.sphereMapSrc = {
      'basic': [
        textureLoader.load('./images/Sphere/exterior/sphere_img_01.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_02.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_03.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_04.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_05.png'),
      ],
      'normal': [
        textureLoader.load('./images/Sphere/exterior/sphere_img_01_normal.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_02_normal.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_03_normal.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_01_normal.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_05_normal.png'),
      ],
      'roughness': [
        textureLoader.load('./images/Sphere/exterior/sphere_img_01_roughness.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_02_roughness.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_03_roughness.jpg'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_04_roughness.png'),
        textureLoader.load('./images/Sphere/exterior/sphere_img_05_roughness.png'),
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
        textureLoader.load('./images/Square/exterior/square_img_04.png'),
        textureLoader.load('./images/Square/exterior/square_img_03.png'),
        textureLoader.load('./images/Square/exterior/square_img_02.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_05.png'),
      ],
      'normal': [
        textureLoader.load('./images/Square/exterior/square_img_01_normal.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_04_normal.png'),
        textureLoader.load('./images/Square/exterior/square_img_03_normal.png'),
        textureLoader.load('./images/Square/exterior/square_img_02_normal.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_05_normal.jpg'),
      ],
      'roughness': [
        textureLoader.load('./images/Square/exterior/square_img_01_roughness.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_04_roughness.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_03_roughness.png'),
        textureLoader.load('./images/Square/exterior/square_img_02_roughness.jpg'),
        textureLoader.load('./images/Square/exterior/square_img_05_roughness.jpg'),
      ],

      'backSideMap': [
        [
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/box/square_img_01.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/box/square_img_01.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/box/square_img_01.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/box/square_img_01.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/box/square_img_01.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/box/square_img_01.jpg') }),
        ],
        [
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_white/dice-1.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_white/dice-6.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_white/dice-2.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_white/dice-5.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_white/dice-3.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_white/dice-4.png') }),
        ],
        [
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_red/dice-1.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_red/dice-6.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_red/dice-2.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_red/dice-5.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_red/dice-4.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/dice_red/dice-3.png') }),
        ],
        [
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/humble/humble_01.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/humble/humble_02.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/humble/humble_03.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/humble/humble_04.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/humble/humble_05.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/humble/humble_06.jpg') }),
        ],
        [
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/wire/square_img_05.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/wire/square_img_05.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/wire/square_img_05_floor.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/wire/square_img_05_floor.jpg') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/wire/square_img_05.png') }),
          new THREE.MeshStandardMaterial({ side: THREE.BackSide, transparent: true, map: textureLoader.load('./images/Square/interior/wire/square_img_05.png') }),
        ]
      ],
    }

    this.sphereMesh.children[0].material.map = this.sphereMapSrc.basic[0];
    this.sphereMesh.children[0].material.normalMap = this.sphereMapSrc.normal[0];
    this.sphereMesh.children[0].material.roughnessMap = this.sphereMapSrc.roughness[0];
    this.sphereMesh.children[1].material.map = this.sphereMapSrc.backSideMap[0];

    this.squareMesh.children[0].material.map = this.squareMapSrc.basic[0];
    this.squareMesh.children[0].material.normalMap = this.squareMapSrc.normal[0];
    this.squareMesh.children[0].material.roughnessMap = this.squareMapSrc.roughness[0];
    this.squareMesh.children[1].material = this.squareMapSrc.backSideMap[0];

    for (let i = 0; i < this.basicLen; i++) {
      this.sphereMapSrc.basic[i].colorSpace = THREE.SRGBColorSpace;
      this.sphereMapSrc.backSideMap[i].colorSpace = THREE.SRGBColorSpace;
      this.squareMapSrc.basic[i].colorSpace = THREE.SRGBColorSpace;
      this.squareMapSrc.backSideMap[i].colorSpace = THREE.SRGBColorSpace;

      for (let ii = 0; ii < this.squareBackLen; ii++) {
        this.squareMapSrc.backSideMap[i][ii].map.colorSpace = THREE.SRGBColorSpace;
      }
    }
  }
}



class Mouse_Event {
  constructor(root, imgLength) {
    this.container = document.querySelector(root);

    this.startWrap = this.container.querySelector('#start_wrap');
    this.startWrap_btns = this.container.querySelectorAll('#start_wrap button');
    this.sphereBtn = this.startWrap.querySelector('#sphere');
    this.squareBtn = this.startWrap.querySelector('#square');

    this.objectWrap = this.container.querySelector('#object_wrap');
    this.buttons = this.container.querySelectorAll('button');

    this.imgLength = imgLength;
    this.sphereNum = 1;
    this.squareNum = 1;

    this.hoverCheck = false;
    this.leaveCheck = false;
    this.isDblclick = false;

    this.timeLine_H = gsap.timeline();
    this.timeLine_L = gsap.timeline();
    this.timeLine_C = gsap.timeline();

    this.clickEvent();
    this.startWrap_btns.forEach((buttons) => { buttons.addEventListener('mouseover', (event) => { this.hoverEvent(event); }); });
    this.startWrap.addEventListener('mouseleave', (event) => { this.LeaveEvent(event); });
  }

  hoverEvent(event) {
    this.hoverCheck = true;
    if (!this.hoverCheck) return;
    this.event = event;
    console.log(this.event, '# 마우스 HOVER!');
    this.event.target.classList.add('on');
    this.mouseHoverAct();
  }

  LeaveEvent(event) {
    this.leaveCheck = true;
    if (!this.leaveCheck) return;
    this.event = event;
    console.log(this.event, '# 마우스 LEAVE!');
    this.startWrap_btns.forEach((btns) => { btns.classList.remove('on'); });
    this.mouseLeaveAct();
  }

  clickEvent() {
    this.buttons.forEach((event) => {
      event.addEventListener('click', (button) => {
        this.button = button;
        this.hoverCheck = false;
        console.log(this.button, '# 마우스 CLICK!');

        // 시작 버튼들
        if (this.button.target.parentNode.id === 'start_wrap') {
          scene_E.orbit.enableRotate = true;
          scene_E.orbit.enableZoom = true;
          this.startWrap.classList.add('displayN');
          setTimeout(() => { this.objectWrap.classList.add(`${this.button.target.id}`); }, 2000);

          this.mouseClickAct().restart();
          this.timeLine_C.eventCallback('onComplete', () => {
            scene_E.isRotating = true;
            scene_E.orbit.maxDistance = 7;
            scene_E.ambientLight.intensity = 3;
          })
        }

        if (this.button.target.parentNode.id === 'sphere' || this.button.target.parentNode.id === 'square') {

          if (this.button.target.className === 'prev on') {
            switch (this.button.target.parentNode.id) {
              case 'sphere': this.sphereNum--; break;
              case 'square': this.squareNum--; break;
            }
            if (this.sphereNum === 0) this.sphereNum = this.imgLength;
            if (this.squareNum === 0) this.squareNum = this.imgLength;

          }

          if (this.button.target.className === 'next on') {
            switch (this.button.target.parentNode.id) {
              case 'sphere': this.sphereNum++; break;
              case 'square': this.squareNum++; break;
            }
            if (this.sphereNum === this.imgLength + 1) this.sphereNum = 1;
            if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
          }

          scene_E.sphereMesh.children[0].material.map = scene_E.sphereMapSrc.basic[this.sphereNum - 1];
          scene_E.sphereMesh.children[0].material.normalMap = scene_E.sphereMapSrc.normal[this.sphereNum - 1];
          scene_E.sphereMesh.children[0].material.roughnessMap = scene_E.sphereMapSrc.roughness[this.sphereNum - 1];
          scene_E.sphereMesh.children[1].material.map = scene_E.sphereMapSrc.backSideMap[this.sphereNum - 1];

          scene_E.squareMesh.children[0].material.map = scene_E.squareMapSrc.basic[this.squareNum - 1];
          scene_E.squareMesh.children[0].material.normalMap = scene_E.squareMapSrc.normal[this.squareNum - 1];
          scene_E.squareMesh.children[0].material.roughnessMap = scene_E.squareMapSrc.roughness[this.squareNum - 1];
          scene_E.squareMesh.children[1].material = scene_E.squareMapSrc.backSideMap[this.squareNum - 1];
        }


        // 오브젝트들 내 버튼들
        if (this.button.target.parentNode.id === 'object_wrap') {
          if (this.button.target.id === 'prev') {
            console.log('# Prev button!');
            switch (this.objectWrap.classList.value) {
              case 'sphere': this.sphereNum--; break;
              case 'square': this.squareNum--; break;
            }
            if (this.sphereNum === 0) this.sphereNum = this.imgLength;
            if (this.squareNum === 0) this.squareNum = this.imgLength;
          }


          if (this.button.target.id === 'next') {
            console.log('# Next button!');
            switch (this.objectWrap.classList.value) {
              case 'sphere': this.sphereNum++; break;
              case 'square': this.squareNum++; break;
            }
            if (this.sphereNum === this.imgLength + 1) this.sphereNum = 1;
            if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
          }

          scene_E.sphereMesh.children[1].material.map = scene_E.sphereMapSrc.backSideMap[this.sphereNum - 1];
          scene_E.squareMesh.children[1].material = scene_E.squareMapSrc.backSideMap[this.squareNum - 1];


          if (this.button.target.id === 'return') {
            console.log('# Return button!');
            scene_E.isRotating = false;
            scene_E.orbit.enableZoom = false;
            scene_E.orbit.enableRotate = false;
            scene_E.orbit.maxDistance = 300;

            scene_E.sphereMesh.children[0].material.map = scene_E.sphereMapSrc.basic[this.sphereNum - 1];
            scene_E.sphereMesh.children[0].material.normalMap = scene_E.sphereMapSrc.normal[this.sphereNum - 1];
            scene_E.sphereMesh.children[0].material.roughnessMap = scene_E.sphereMapSrc.roughness[this.sphereNum - 1];

            scene_E.squareMesh.children[0].material.map = scene_E.squareMapSrc.basic[this.squareNum - 1];
            scene_E.squareMesh.children[0].material.normalMap = scene_E.squareMapSrc.normal[this.squareNum - 1];
            scene_E.squareMesh.children[0].material.roughnessMap = scene_E.squareMapSrc.roughness[this.squareNum - 1];

            this.objectWrap.className = '';
            this.mouseClickAct().reverse();
            this.timeLine_C.eventCallback('onReverseComplete', () => {
              scene_E.ambientLight.intensity = 2;
              this.startWrap.classList.remove('displayN');
              this.timeLine_C.clear();
            })
          }
        }
      })
    });
  }

  mouseHoverAct() {
    if (this.event.target.id === 'sphere') {
      this.timeLine_H
        .to(this.sphereBtn, { duration: 0.3, scale: 1.4, x: 180, width: 400, })
        .to(this.squareBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
        .to(scene_E.sphereMesh.position, { duration: 0.5, x: 0, y: 15, z: 50, ease: "power4.inOut", }, '<')
    }
    if (this.event.target.id === 'square') {
      this.timeLine_H
        .to(this.squareBtn, { duration: 0.3, scale: 1.4, x: -180, width: 400, })
        .to(this.sphereBtn, { duration: 0.3, opacity: 0, y: 200 }, '<')
        .to(scene_E.squareMesh.position, { duration: 0.5, x: 0, y: 15, z: 48, ease: "power4.inOut", }, '<')
    }
    return this.timeLine_H;
  }

  mouseLeaveAct() {
    this.timeLine_L
      .to(this.sphereBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0, width: 300 })
      .to(this.squareBtn, { duration: 0.3, scale: 1, opacity: 1, x: 0, y: 0, width: 300 }, '<')
      .to(scene_E.sphereMesh.position, { x: -20, y: 0, z: 0, ease: " ower4.inOut", }, '<')
      .to(scene_E.squareMesh.position, { x: 20, y: 0, z: 0, ease: "power4.inOut", }, '<')
    return this.timeLine_L;
  }

  mouseClickAct() {
    let _duration = 1.5;
    let _posX = 300;
    if (this.event.target.id === 'sphere') {
      this.timeLine_C
        .to(scene_E.sphereMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
        .to(scene_E.squareMesh.position, { duration: 0.7, x: _posX, y: 20, z: 0 }, '<')
        .to(scene_E.camera.position, { duration: _duration, x: 0, y: 0, z: 1, ease: "power2.inOut" }, '<')
    }
    if (this.event.target.id === 'square') {
      this.timeLine_C
        .to(scene_E.squareMesh.position, { duration: 0.3, x: 0, y: 0, z: 0 }, '0.5')
        .to(scene_E.sphereMesh.position, { duration: 0.7, x: -_posX, y: 20, z: 0 }, '<')
        .to(scene_E.camera.position, { duration: _duration, x: 0, y: 0, z: 1, ease: "power2.inOut" }, '<')
    }

    return this.timeLine_C;
  }
}

const scene_E = new Scene_Event();
const mouse_E = new Mouse_Event('#wrap', 5);
console.log('# Scene_Event', scene_E);
console.log('# Mouse_Event', mouse_E);