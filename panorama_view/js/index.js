import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import showUniverse from './Mesh/universeMesh.js';
import showShpearMesh from './Mesh/shpearMesh.js';
import showSquareMesh from './Mesh/squareMesh.js';
import { GLTFLoader } from 'GLTFLoader';
import { FBXLoader } from 'FBXLoader'


// 메서드 선언
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
const renderer = new THREE.WebGLRenderer({ alpha: 0x000000 });
const orbit = new OrbitControls(camera, renderer.domElement);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xff0000, 1);


const universeMesh = showUniverse();
const shpearMesh = showShpearMesh();
const squareMesh = showSquareMesh();
scene.add(universeMesh);
scene.add(shpearMesh);
scene.add(squareMesh);



// 실행
camera.position.set(100, 0, 20);
camera.lookAt(0, 0, 0);
scene.background = null;
orbit.enableDamping = true;
scene.add(new THREE.AxesHelper(10));
// scene.add(new THREE.GridHelper(10, 10));
scene.add(new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000));
scene.add(ambientLight);
scene.add(directionalLight);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
directionalLight.position.set(-1, 2, 4);
directionalLight.target.position.set(0, -1, 0);

const animate = () => {
  // 카메라 회전
  let speed = Date.now() * 0.0003;
  let ratateRadius = 80;
  camera.position.x = Math.cos(speed) * ratateRadius;
  camera.position.z = Math.sin(speed) * ratateRadius;
  renderer.render(scene, camera);
  
  orbit.update();
  requestAnimationFrame(animate);
};
animate();



window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})


// 버튼 클릭 이벤트
const buttons = new Buttons('#button_wrap button');
buttons.btn.forEach(btns => {
  btns.addEventListener('click', (event) => {
    buttons.clickEvent(event, 5);
    shpearMesh.material.map = new THREE.TextureLoader().load(`./images/sphere_img_0${buttons.imgNum}.jpg`);
  });
});