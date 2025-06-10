import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import { GLTFLoader } from 'GLTFLoader';
import gsap from 'gsap';


export class GalleryApp {
  constructor(imageList) {
    this.container = document.querySelector('#wrap');
    this.imageList = imageList;
    this.zoom = document.querySelector(".zoomIcon");
    this.home = document.querySelector(".goHome");
    this.clientWidth = this.container.clientWidth;
    this.clientHeight = this.container.clientHeight;
    this.distance = 400;
    this.pageNum = 0;
    this.targetNum = 0;
    this.moveX = 0;

    this.isZoomeHover = true;
    this.isDragging = false;
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
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.clientWidth / this.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 170);
    // this.camera.position.set(0, 0, 300);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enableZoom = false;
  }


  initScene() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 0.2);
    hemi.position.set(0, 50, 50);
    this.scene.add(hemi);

    const wallTexture = new THREE.TextureLoader().load('mesh/Marble021_1K-PNG_Color.png');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(30, 4);
    wallTexture.colorSpace = THREE.SRGBColorSpace;

    const wallWidth = this.distance * this.imageList.length + this.distance;
    const wallGeometry = new THREE.BoxGeometry(wallWidth, 300, 2);
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

    // const wallLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const wallLight = new THREE.DirectionalLight(0xffffff, 1.4);
    wallLight.position.set(0, 60, 50);
    wallLight.castShadow = false;
    this.scene.add(wallLight);

    this.scene.add(this.galleryGroup);
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
        model.position.set(i * this.distance, -91, -18);
        model.rotation.x = Math.PI / 13.8
        model.scale.set(36.8, 41.5, 10);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.galleryGroup.add(model);
      });

      const light = new THREE.SpotLight(0xffffff, 400);
      light.position.set(i * this.distance, 220, 130);
      light.target = boxMesh;
      light.angle = Math.PI / 6;
      light.distance = 500;
      light.decay = 1;
      light.penumbra = 0.1;
      light.castShadow = true;

      this.galleryGroup.add(light);
      this.galleryGroup.add(light.target);
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
    this.zoom.style.display = 'none';
    this.btns.forEach(e => e.classList.add("off"));
    this.home.style.display = "flex"

    const intersects = this.getIntersectsFromEvent(e);
    if (intersects.length > 0) {
      const mesh = intersects[0].object;

      const targetPos = new THREE.Vector3();
      mesh.getWorldPosition(targetPos);

      const camTarget = targetPos.clone().add(new THREE.Vector3(0, 0, 100));

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
          this.controls.minDistance = 20;
          this.controls.maxDistance = 100;
          this.controls.enablePan = true;
          this.controls.target.copy(targetPos);
          this.controls.update();

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
      });
    }
  }
  homeClick(e) {
    this.isDragging = false;
    this.controls.dispose();
    this.controls = null;
    this.camera.position.x = this.camera.position.y = 0;
    this.controls?.target.set(0, 0, 0);
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 150,
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
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 150,
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
