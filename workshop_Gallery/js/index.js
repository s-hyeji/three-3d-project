import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { GLTFLoader } from 'GLTFLoader';
import { FontLoader } from "FontLoader";
import { TextGeometry } from "TextGeometry";
import gsap from 'gsap';


export class GalleryApp {
  constructor(imageList) {
    this.container = document.querySelector('#wrap');
    this.imageList = imageList;
    this.zoom = document.querySelector(".zoomIcon");
    this.home = document.querySelector(".goHome");
    this.clientWidth = this.container.clientWidth;
    this.clientHeight = this.container.clientHeight;
    this.distance = 500;
    this.pageNum = 0;
    this.targetNum = 0;
    this.moveX = 0;

    this.isZoomeHover = true;
    this.isZoomed = false;
    this.isDragging = false;
    this.isRotate = false;
    this._dblclickAdded = false;
    this.startDrag = { x: 0, y: 0 };

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#000000");

    this.galleryGroup = new THREE.Group();
    this.clickableBoxes = [];
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.prevBtn = document.querySelector('.btn-prev');
    this.nextBtn = document.querySelector('.btn-next');
    this.btns = document.querySelectorAll('[class*="btn-"]');

    this.initRenderer();
    this.initCamera();
    this.initScene();
    this.addBoxes();
    this.addEvents();
    this.animate = this.animate.bind(this);
    this.animate();
    // this.initControls();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.clientWidth / this.clientHeight,
      0.1,
      5000
    );
    this.camera.position.set(0, 0, 200);
    // this.camera.position.set(0, 0, 300);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableRotate = false;
    // this.controls.enableZoom = false;
  }


  initScene() {
    // const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 0.2);
    // hemi.position.set(0, 50, 50);
    // this.scene.add(hemi);

    const wallTexture = new THREE.TextureLoader().load('mesh/Marble021_1K-PNG_Color.png');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(30, 20);
    wallTexture.colorSpace = THREE.SRGBColorSpace;

    const wallWidth = this.distance * this.imageList.length + this.distance;
    const wallGeometry = new THREE.BoxGeometry(wallWidth, 1500, 2);
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 0.7,
      clearcoatRoughness: 0.05
    });

    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.position.set(wallWidth / 2 - this.distance, 0, -1.5);
    wallMesh.receiveShadow = true;

    this.galleryGroup.add(wallMesh);

    const wallLight = new THREE.DirectionalLight(0xffffff, 0.3);
    // const wallLight = new THREE.DirectionalLight(0xffffff, 1.4);
    wallLight.position.set(0, 50, 50);
    wallLight.castShadow = false;
    this.scene.add(wallLight);

    this.scene.add(this.galleryGroup);

    // const axes = new THREE.AxesHelper(150);
    // this.scene.add(axes);

    // const gridHelper = new THREE.GridHelper(240, 20);
    // this.scene.add(gridHelper);
  }


  addBoxes() {
    const loader = new GLTFLoader();

    for (let i = 0; i < this.imageList.length; i++) {
      const texture = new THREE.TextureLoader().load(
        this.imageList[i].src,
        (loadedTexture) => {
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
        }
      );

      const baseWidth = 200;
      const baseHeight = baseWidth / (16 / 9);
      const geometry = new THREE.BoxGeometry(baseWidth, baseHeight, 2);
      const material = new THREE.MeshPhongMaterial({ map: texture });

      const boxMesh = new THREE.Mesh(geometry, material);
      boxMesh.position.set(i * this.distance, 0, 5);
      // boxMesh.castShadow = true;
      // boxMesh.receiveShadow = true;
      this.galleryGroup.add(boxMesh);
      this.clickableBoxes.push(boxMesh);

      loader.load('models/picture_frame.glb', (gltf) => {
        const model = gltf.scene.clone(true);
        model.position.set((i * this.distance) + 0.1, -84.3, -20.7);
        model.rotation.x = Math.PI / 12.2
        model.scale.set(35.7, 39.4, 11);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          if (child.material) {
            child.material.color?.set(0xffffff);
            child.material.emissive?.set(0x111111); // 살짝 빛나는 효과
          }
        });
        this.galleryGroup.add(model);
      });

      this.fontLoader = new FontLoader();
      this.fontLoader.load('js/SUITSemiBold_Regular.json', (font) => {
        for (let i = 0; i < this.imageList.length; i++) {
          const label = this.imageList[i].text;

          const textGeo = new TextGeometry(label, {
            font: font,
            size: 4,
            height: 1,
            curveSegments: 4,
          });
          textGeo.center();

          const textMat = new THREE.MeshBasicMaterial({
            color: 0xb38b3f, // 골드 느낌 텍스트
            metalness: 0.8,
            roughness: 0.3,
            emissive: new THREE.Color(0x6f4e1e),
            emissiveIntensity: 0.2,
          });
          const textMesh = new THREE.Mesh(textGeo, textMat);
          textMesh.position.z = 0.1;

          const bgWidth = label.length * 5;
          const bgHeight = 16;
          const bgGeo = new THREE.PlaneGeometry(bgWidth, bgHeight);

          const bgMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 1.0,
            roughness: 0.3,
            clearcoat: 0.6,
            clearcoatRoughness: 0.1,
          });
          const bgMesh = new THREE.Mesh(bgGeo, bgMat);

          const captionGroup = new THREE.Group();
          captionGroup.add(bgMesh);
          captionGroup.add(textMesh);

          const x = i * this.distance;
          const y = -105;
          const z = 1;
          captionGroup.position.set(x, y, z);

          this.galleryGroup.add(captionGroup);
        }
      });
      const light = new THREE.SpotLight(0xffffff, 400);
      light.position.set(i * this.distance, 230, 155);
      light.target = boxMesh;
      light.angle = Math.PI / 6;
      light.distance = 600;
      light.decay = 1;
      light.penumbra = 0.1;
      light.castShadow = true;

      // const lightHelper = new THREE.SpotLightHelper(light);
      // this.galleryGroup.add(lightHelper);

      this.galleryGroup.add(light);
      this.galleryGroup.add(light.target);


      if (!this.frontLight) {
        this.frontLight = new THREE.DirectionalLight(0xffffff, 0.36);
        this.frontLight.position.set(0, -8, 100);
        this.frontLight.target.position.set(0, 0, 0);
        this.scene.add(this.frontLight);
        this.scene.add(this.frontLight.target);
        this.frontLight.castShadow = false;

      }
    }
  }
  getIntersectsFromEvent(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(this.clickableBoxes);
  }
  worldToScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();
    obj.getWorldPosition(vector);
    vector.project(camera);

    const widthHalf = 0.5 * renderer.domElement.clientWidth;
    const heightHalf = 0.5 * renderer.domElement.clientHeight;

    return {
      x: (vector.x * widthHalf) + widthHalf,
      y: -(vector.y * heightHalf) + heightHalf
    };
  }
  addEvents() {
    if (!this._dblclickAdded) {
      this._dblclickAdded = true;

      this.renderer.domElement.addEventListener("dblclick", (e) => {
        if (!this.controls || !this.isZoomed || this.isAnimating) return;

        const intersects = this.getIntersectsFromEvent(e);
        if (intersects.length === 0) return;

        const mesh = intersects[0].object;
        const pos = new THREE.Vector3();
        mesh.getWorldPosition(pos);

        if (!this.isRotate) {
          this.isRotate = true;
          this.startRotation(pos);
        } else {
          this.endRotation();
        }
      });
    }

    this.zoom.addEventListener("click", this.zoomClick.bind(this));
    this.home.addEventListener("click", this.homeClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.handleHover.bind(this));

    this.btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn === this.prevBtn && this.pageNum > 0) this.pageNum--;
        else if (btn === this.nextBtn && this.pageNum < this.imageList.length - 1) this.pageNum++;

        this.targetNum = -(this.pageNum * this.distance);
        this.prevBtn.classList.toggle('off', this.pageNum <= 0);
        this.nextBtn.classList.toggle('off', this.pageNum >= this.imageList.length - 1);

        this.isZoomeHover = false;

        setTimeout(() => { this.isZoomeHover = true; }, 1850);
      });
    });
  }

  handleHover(e) {
    if (!this.isZoomeHover) return;

    const intersects = this.getIntersectsFromEvent(e);
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      mesh.geometry.computeBoundingBox();

      const bbox = mesh.geometry.boundingBox;
      const corner = new THREE.Vector3(bbox.max.x, bbox.min.y, 0);
      corner.applyMatrix4(mesh.matrixWorld);

      const screenCorner = corner.clone().project(this.camera);
      const halfW = 0.5 * this.renderer.domElement.clientWidth;
      const halfH = 0.5 * this.renderer.domElement.clientHeight;

      const screenX = (screenCorner.x * halfW) + halfW;
      const screenY = -(screenCorner.y * halfH) + halfH;

      this.zoom.style.left = `${screenX - 45}px`;
      this.zoom.style.top = `${screenY - 45}px`;
      this.zoom.style.opacity = '1';
    } else {
      this.zoom.style.opacity = '0';

    }
  }

  zoomClick(e) {
    this.isZoomeHover = false;
    this.isZoomed = true;
    this.zoom.style.display = 'none';
    this.btns.forEach(e => e.classList.add("off"));
    this.home.style.display = "flex"

    const intersects = this.getIntersectsFromEvent(e);
    if (intersects.length > 0) {
      const mesh = intersects[0].object;

      const targetPos = new THREE.Vector3();
      mesh.getWorldPosition(targetPos);

      const camTarget = targetPos.clone().add(new THREE.Vector3(0, 0, 110));

      gsap.to(this.camera.position, {
        x: camTarget.x,
        y: camTarget.y,
        z: camTarget.z,
        duration: 1.2,
        ease: 'power3.out',
        onUpdate: () => {
          this.camera.lookAt(targetPos);
        },
        onComplete: () => {
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          this.controls.enableRotate = false;
          // this.controls.enableRotate = true;
          this.controls.minDistance = 10;
          this.controls.maxDistance = 110;
          this.controls.enablePan = true;
          this.controls.target.copy(targetPos);
          this.controls.update();
        }
      });

      const dom = this.renderer.domElement;

      dom.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.startDrag.x = e.clientX;
        this.startDrag.y = e.clientY;
      });

      dom.addEventListener('mousemove', (e) => {
        if (!this.isDragging || !this.controls) return;

        const deltaX = e.clientX - this.startDrag.x;
        const deltaY = e.clientY - this.startDrag.y;

        const speed = 0.09;

        this.controls.target.x -= deltaX * speed;
        this.controls.target.y += deltaY * speed;

        this.camera.position.x -= deltaX * speed;
        this.camera.position.y += deltaY * speed;

        this.startDrag.x = e.clientX;
        this.startDrag.y = e.clientY;
      });

      dom.addEventListener('mouseup', () => {
        this.isDragging = false;
      });
      dom.addEventListener('mouseleave', () => {
        this.isDragging = false;
      });
    }
  }
  // 
  startRotation() {
    console.log("회전 시작");
    this.controls.enableRotate = true;
    this.home.style.display = "none";
  }


  endRotation() {
    this.isAnimating = true;
    this.controls.enableRotate = false;

    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 110,
      duration: 1.2,
      ease: 'power1.out'
    });

    gsap.to(this.controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.2,
      ease: 'power1.out',
      onUpdate: () => this.controls.update(),
      onComplete: () => {
        this.isRotate = false;
        this.isAnimating = false;
        this.home.style.display = "flex";
      }
    });
  }




  // 
  homeClick(e) {
    this.isRotate = false;
    this.isDragging = false;
    this.isZoomed = false;
    this.controls.dispose();
    this.controls = null;
    this.camera.position.x = this.camera.position.y = 0;
    this.controls?.target.set(0, 0, 0);
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 200,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        this.camera.lookAt(this.scene.position);
        this.home.style.display = "none"
      },
      onComplete: () => {
        this.btns.forEach(e => e.classList.remove("off"));
        this.prevBtn.classList.toggle('off', this.pageNum <= 0);
        this.nextBtn.classList.toggle('off', this.pageNum >= this.imageList.length - 1);

        this.isZoomeHover = true;
        this.zoom.style.display = 'block';
        this.zoom.style.opacity = '0';
      }
    });
  }

  animate() {
    this.moveX += (this.targetNum - this.moveX) * 0.05;
    this.galleryGroup.position.x = this.moveX;

    if (this.controls) {
      // this.moveCamera();
      this.camera.lookAt(this.controls.target);
    } else {
      this.camera.lookAt(this.scene.position);
    }

    // this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}

const imageList = Array.from(document.querySelectorAll('#image-list li')).map(el => ({
  src: el.dataset.src,
  text: el.dataset.text
}));
const app = new GalleryApp(imageList);
