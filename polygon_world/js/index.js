
import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
import PolygonApp from './polygonApp.js';

document.addEventListener("DOMContentLoaded", () => {
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setClearColor(0x000000, 0);
 document.querySelector('.aniBox').appendChild(renderer.domElement);

 camera.position.z = 5;

 const controls = new OrbitControls(camera, renderer.domElement);

 const app = new PolygonApp(scene);

 function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
 }
 animate();
});