import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";
// 
import Polygon from './polygon.js';
// 

export function playPolygon(type) {
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

 renderer.setSize(window.innerWidth, window.innerHeight);
 document.querySelector('.aniBox').appendChild(renderer.domElement);

 camera.position.set(2, 2, 2);

 const light = new THREE.DirectionalLight(0xffffff, 4);
 light.position.set(2, 4, 3);
 scene.add(light);

 const ambient = new THREE.AmbientLight(0xffffff, 0.5);
 scene.add(ambient);

 const polygon = new Polygon(type);
 const mesh = polygon.getMesh();
 mesh.visible = true;
 scene.add(mesh);


 // 
 const controls = new OrbitControls(camera, renderer.domElement);
 function animate() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
 }
 animate();
}