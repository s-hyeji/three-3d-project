import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import Polygon from './polygon.js';
import gsap from 'gsap';

export function playPolygon(type, isTransparent) {
 const polygonBox = document.querySelector('.polygonBox');
 const { clientWidth, clientHeight } = polygonBox;

 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

 renderer.setSize(clientWidth, clientHeight);
 polygonBox.innerHTML = "";
 polygonBox.appendChild(renderer.domElement);

 const cameraPosition = new THREE.Vector3(1, 3, 5);
 const meshPositionY = 0;
 const meshRotationY = 0;

 camera.position.copy(cameraPosition);
 camera.lookAt(0, 0, 0);

 const light = new THREE.DirectionalLight(0xffffff, 4);
 light.position.set(2, 4, 3);
 scene.add(light);

 const ambient = new THREE.AmbientLight(0xffffff, 0.5);
 ambient.position.set(2, 4, 3);

 scene.add(ambient);

 const backLight = new THREE.DirectionalLight(0xffffff, 2);
 backLight.position.set(-2, -3, -4);
 scene.add(backLight);

 // 재질 제어
 function toggleLight(enabled) {
  light.visible = enabled;
  ambient.visible = enabled;

  polygon.setMaterial(enabled ? 'standard' : 'basic');
 }

 // 매시 생성 
 const polygon = new Polygon(type, 'basic');
 const mesh = polygon.getMesh();
 mesh.visible = true;
 mesh.position.y = meshPositionY;
 mesh.rotation.y = meshRotationY;
 scene.add(mesh);

 let edgeLines = null;
 const controls = new OrbitControls(camera, renderer.domElement);
 controls.enableDamping = true;
 controls.enabled = true;

 let clock = new THREE.Clock();
 let isUserInteracting = false;
 let pauseStartTime = 0;
 let timeOffset = 0;
 let animationEnabled = true;
 let rotationY = meshRotationY;
 let returnToRotationTween = null;

 // 투시 재질
 function applyTransparency(enabled) {
  if (enabled) {
   mesh.material.transparent = true;
   mesh.material.opacity = 0;
   if (!edgeLines) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    edgeLines = new THREE.LineSegments(
     edges,
     new THREE.LineBasicMaterial({ color: mesh.material.color })
    );
    scene.add(edgeLines);
   }
  } else {
   mesh.material.transparent = false;
   mesh.material.opacity = 1;
   if (edgeLines) {
    scene.remove(edgeLines);
    edgeLines.geometry.dispose();
    edgeLines.material.dispose();
    edgeLines = null;
   }
  }
 }

 applyTransparency(isTransparent);

 controls.addEventListener('start', () => {
  isUserInteracting = true;
  pauseStartTime = clock.getElapsedTime();
 });

 controls.addEventListener('end', () => {
  isUserInteracting = false;
  const pauseEndTime = clock.getElapsedTime();
  timeOffset += pauseEndTime - pauseStartTime;
 });

 function setControlsEnabled(enabled) {
  controls.enabled = enabled;
  animationEnabled = enabled;

  if (!enabled) {
   gsap.to(camera.position, {
    x: cameraPosition.x,
    y: cameraPosition.y,
    z: cameraPosition.z,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
     camera.lookAt(0, 0, 0);
    }
   });

   gsap.to(mesh.position, {
    y: meshPositionY,
    duration: 0.8,
    ease: 'power2.out'
   });

   const shortestAngle = ((meshRotationY - rotationY + Math.PI) % (2 * Math.PI)) - Math.PI;
   const targetRotationY = rotationY + shortestAngle;

   if (returnToRotationTween) returnToRotationTween.kill();
   returnToRotationTween = gsap.to(mesh.rotation, {
    y: targetRotationY,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
     rotationY = mesh.rotation.y;
    }
   });

   controls.reset();
   timeOffset = clock.getElapsedTime();
   isUserInteracting = false;
  }
 }

 function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime() - timeOffset;

  if (!isUserInteracting && animationEnabled) {
   mesh.position.y = 0.1 * Math.sin(elapsed * 2);
   rotationY += 0.003;
   mesh.rotation.y = rotationY;
  }

  controls.update();
  renderer.render(scene, camera);
 }

 animate();

 return {
  polygon,
  setControlsEnabled,
  applyTransparency,
  toggleLight
 };
}
