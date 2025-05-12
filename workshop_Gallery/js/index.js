import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";


const wrap = document.querySelector('#wrap');
const { clientWidth, clientHeight } = wrap;

const totalNum = 10; //전체 액자 갯수
const distance = 100;

let scene, camera, renderer, controls;
let galleryGroup = new THREE.Group();
let pageNum = 0;
let targetNum = 0;
let moveX = 0;

const init = () => {
 scene = new THREE.Scene();
 scene.background = new THREE.Color("#000000"); //배경 컬러
 camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
 camera.position.set(0, 0, 50);

 renderer = new THREE.WebGLRenderer({ antialias: true });
 renderer.setSize(clientWidth, clientHeight);
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFShadowMap; //PCFShadowMap
 //그림자 활성화

 document.body.appendChild(renderer.domElement);

 const axes = new THREE.AxesHelper(150);
 scene.add(axes);

 const gridHelper = new THREE.GridHelper(240, 20);
 scene.add(gridHelper);

 //조명 넣기
 var light = new THREE.HemisphereLight(0xffffff, 0x080820, 6);
 light.position.set(0, 50, 50);
 scene.add(light);

 controls = new OrbitControls(camera, renderer.domElement);

 {
  //가벽 만들기

  const wallWidth = distance * totalNum + distance;
  const geometry = new THREE.BoxGeometry(wallWidth, 100, 2);
  const material = new THREE.MeshPhongMaterial({
   // map: imageMap,
   color: 0x464946,
  });
  const wallMesh = new THREE.Mesh(geometry, material);

  wallMesh.position.set(wallWidth / 2 - distance, 0, -1.5);
  wallMesh.receiveShadow = true;
  // wallMesh.castShadow = true;
  galleryGroup.add(wallMesh);
  scene.add(galleryGroup);
 }

 for (let i = 0; i < totalNum; i++) {
  addBox(i);
 }
};

//액자 추가
const addBox = (i) => {
 const imageMap = new THREE.TextureLoader().load(
  // "https://source.unsplash.com/collection/" + i
 );

 const baseWidth = 50;
 const aspectRatio = 16 / 9;
 const baseHeight = baseWidth / aspectRatio;

 const geometry = new THREE.BoxGeometry(baseWidth, baseHeight, 1);
 const material = new THREE.MeshPhongMaterial({
  map: imageMap,
 });
 const boxMesh = new THREE.Mesh(geometry, material);
 boxMesh.castShadow = true;
 let x = i * distance;
 console.log(x);
 let y = 0; //Math.random() * 40 - 5;
 let z = 0;
 boxMesh.position.set(x, y, z);
 galleryGroup.add(boxMesh);

 //조명 넣기
 const spotLight = new THREE.SpotLight(0xffffff, 1.2);
 spotLight.position.set(x, 30, 30);
 spotLight.angle = Math.PI / 6;
 spotLight.penumbra = 0.1;
 spotLight.decay = 1;
 spotLight.distance = 70;
 spotLight.target = boxMesh;
 spotLight.castShadow = true;

 galleryGroup.add(spotLight);

 const spotLightHelper = new THREE.SpotLightHelper(spotLight);
 scene.add(spotLightHelper);
 // https://threejs.org/examples/#webgl_lights_spotlight
};

const animate = () => {
 // controls.update();

 moveX += (targetNum - moveX) * 0.05;
 galleryGroup.position.x = moveX;

 camera.lookAt(scene.position);
 camera.updateProjectionMatrix();
 renderer.render(scene, camera);
 requestAnimationFrame(animate);
};

const stageResize = () => {
 WIDTH = window.innerWidth;
 HEIGHT = window.innerHeight;

 camera.updateProjectionMatrix();
 renderer.setSize(clientWidth, clientHeight);
 camera.aspect = clientWidth / clientHeight;
};

const clickFunc = (event) => {
 // console.log(event.pageX);
 if (event.pageX < clientWidth / 2) {
  // console.log("좌");
  if (pageNum > 0) {
   pageNum -= 1;
  }
 } else {
  // console.log("우");
  if (pageNum < totalNum - 1) {
   pageNum += 1;
  }
 }
 // console.log("pageNum :" + pageNum);
 targetNum = -(pageNum * distance);
};


init();
animate();
window.addEventListener("resize", stageResize);
document.addEventListener("click", clickFunc);
