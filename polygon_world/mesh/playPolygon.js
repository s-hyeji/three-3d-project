import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import Polygon from './polygon.js';
import gsap from 'gsap';

export function playPolygon(type, isTransparent = false) {
 const polygonBox = document.querySelector('.polygonBox');
 const { clientWidth, clientHeight } = polygonBox;

 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

 renderer.setSize(clientWidth, clientHeight);
 polygonBox.innerHTML = "";
 polygonBox.appendChild(renderer.domElement);

 const initialCameraPosition = new THREE.Vector3(2, 2, 5);
 const initialMeshPositionY = 0;
 const initialMeshRotationY = 0;

 camera.position.copy(initialCameraPosition);
 camera.lookAt(0, 0, 0);

 const light = new THREE.DirectionalLight(0xffffff, 4);
 light.position.set(2, 4, 3);
 scene.add(light);

 const ambient = new THREE.AmbientLight(0xffffff, 0.5);
 scene.add(ambient);

 const polygon = new Polygon(type);
 const mesh = polygon.getMesh();
 mesh.visible = true;
 mesh.position.y = initialMeshPositionY;
 mesh.rotation.y = initialMeshRotationY;
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
 let rotationY = initialMeshRotationY;
 let returnToRotationTween = null;

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
    x: initialCameraPosition.x,
    y: initialCameraPosition.y,
    z: initialCameraPosition.z,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate: () => {
     camera.lookAt(0, 0, 0);
    }
   });

   gsap.to(mesh.position, {
    y: initialMeshPositionY,
    duration: 0.8,
    ease: 'power2.out'
   });

   const shortestAngle = ((initialMeshRotationY - rotationY + Math.PI) % (2 * Math.PI)) - Math.PI;
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
   mesh.position.y = 0.2 * Math.sin(elapsed * 2);
   rotationY += 0.005;
   mesh.rotation.y = rotationY;
  }

  controls.update();
  renderer.render(scene, camera);
 }

 animate();

 return {
  polygon,
  setControlsEnabled,
  applyTransparency
 };
}
