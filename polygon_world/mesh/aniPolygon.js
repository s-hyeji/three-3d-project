import * as THREE from 'three';
import Polygon from './polygon.js';
import gsap from 'gsap';

// import { meshAni } from '../js/gsapAni.js';


export function aniPolygon(type) {
 const aniBox = document.querySelector('.aniBox');
 const { clientWidth, clientHeight } = aniBox;

 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

 renderer.setSize(clientWidth, clientHeight);
 aniBox.innerHTML = ""; // 기존 캔버스 제거
 aniBox.appendChild(renderer.domElement);

 camera.position.set(0, 0, 5); // 정면
 camera.lookAt(new THREE.Vector3(0, 0, 0));
 camera.aspect = clientWidth / clientHeight;
 camera.updateProjectionMatrix();

 const light = new THREE.DirectionalLight(0xffffff, 4);
 light.position.set(2, 4, 3);
 scene.add(light);

 const ambient = new THREE.AmbientLight(0xffffff, 0.5);
 scene.add(ambient);

 const polygon = new Polygon(type);
 const mesh = polygon.getMesh();
 mesh.position.set(0, 5, 0);
 mesh.visible = true;
 scene.add(mesh);

 gsap.to(mesh.position, {
  y: 0,
  duration: 0.6,
  ease: 'back.out(1.7)',
  onComplete: () => {
   scene.remove(mesh);

   const leftMesh = mesh.clone();
   const rightMesh = mesh.clone();

   leftMesh.position.set(0, 0, 0);
   rightMesh.position.set(0, 0, 0);
   scene.add(leftMesh, rightMesh);

   // 좌측 도형
   gsap.to(leftMesh.position, {
    x: -9,
    y: -8,
    duration: 0.8,
    ease: 'power2.in'
   });
   gsap.to(leftMesh.rotation, {
    z: -Math.PI * 2,
    duration: 0.8,
    ease: 'power2.in'
   });
   gsap.to(leftMesh.scale, {
    x: 0.2,
    y: 0.2,
    z: 0.2,
    duration: 0.8,
    ease: 'power2.in'
   });

   // 우측 도형
   gsap.to(rightMesh.position, {
    x: 9,
    y: -8,
    duration: 0.8,
    ease: 'power2.in'
   });
   gsap.to(rightMesh.rotation, {
    z: Math.PI * 2,
    duration: 0.8,
    ease: 'power2.in'
   });
   gsap.to(rightMesh.scale, {
    x: 0.2,
    y: 0.2,
    z: 0.2,
    duration: 0.8,
    ease: 'power2.in'
   });
  }
 });
 function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
 }
 animate();
}