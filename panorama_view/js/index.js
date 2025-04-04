import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import Buttons from './classes.js';
import { GLTFLoader } from 'GLTFLoader';
import { FBXLoader } from 'FBXLoader'

const PanoramaView = () => {

  // 메서드 선언
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  const renderer = new THREE.WebGLRenderer({ alpha: 0x000000 });
  const orbit = new OrbitControls(camera, renderer.domElement);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  const ambientLight = new THREE.AmbientLight(0xff0000, 1);

  // 3D오브젝트 생성 선언
  const geometry = new THREE.SphereGeometry(2000, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./images/sphere_img_01.jpg'),
    side: THREE.BackSide,
  });
  const sphere360 = new THREE.Mesh(geometry, material);

  // 실행
  camera.position.set(35, 0, 20);
  camera.lookAt(0, 0, 0);
  scene.background = null;
  orbit.enableDamping = true;
  scene.add(new THREE.AxesHelper(10));
  // scene.add(new THREE.GridHelper(10, 10));
  scene.add(new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000));
  scene.add(sphere360);
  scene.add(ambientLight);
  scene.add(directionalLight);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement)
  directionalLight.position.set(-1, 2, 4);
  directionalLight.target.position.set(0, -1, 0);

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    orbit.update();
    sphere360.rotation.y += 0.0003;
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })

  const buttons = new Buttons('#prew', '#next');
  buttons.next.addEventListener('click', () => {
    console.log(this);
    buttons.clickEvent();
  });
  buttons.prew.addEventListener('click', () => {
    buttons.clickEvent();
  });
}

PanoramaView();


export default PanoramaView;