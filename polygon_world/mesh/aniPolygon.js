import * as THREE from 'three';
import Polygon from './polygon.js';
import gsap from 'gsap';

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
    x: 0.08,
    y: 0.08,
    z: 0.08,
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
    x: 0.08,
    y: 0.08,
    z: 0.08,
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

// 다음에 추가할거 정리
// 1. gsapAni에서 start버튼들 분리 시키기
// 2. aniPolygon 끝나고 onComplete으로 gsapAni 실행해서
//    -> 뒤로가기/컨트룰러/playPolygon 나오게 하기
// 